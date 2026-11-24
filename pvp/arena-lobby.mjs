// Arcane Duel: isolated, unranked PvP lobby prototype. No duel simulation yet.
import http from 'node:http';
import {randomBytes} from 'node:crypto';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {resolve,sep,extname} from 'node:path';
import {stat,realpath} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {newDuel,apply,duelView} from './duel-engine.mjs';
import {createSocial} from './arena-social.mjs';
const MAX=1000, TTL=15*60*1000;
const token=()=>randomBytes(24).toString('hex');
const code=()=>randomBytes(6).toString('hex').toUpperCase();
export function createLobby({now=Date.now,socialStorage=null}={}){
 const rooms=new Map();
 function prune(){for(const [id,r] of rooms)if(now()-r.touched>TTL)rooms.delete(id)}
 function participant(r,t){return r?.players.find(p=>p.token===t)}
 function view(r,p){return {room:r.id,mode:r.mode,players:r.players.length,youReady:p.ready,opponentReady:r.players.some(q=>q!==p&&q.ready),status:r.duel?'duel':r.players.length===2?'paired':'waiting',...(r.duel?{duel:duelView(r.duel,r.players.indexOf(p))}:{})}}
 function add(r){const p={token:token(),ready:false};r.players.push(p);r.touched=now();return {...view(r,p),token:p.token}}
 function create(mode){if(rooms.size>=MAX)throw Error('Lobby ausgelastet');let id;do{id=code()}while(rooms.has(id));const r={id,mode,players:[],touched:now()};rooms.set(id,r);return add(r)}
 const social=createSocial({now,storage:socialStorage,pair:()=>{const first=create('friend');const second=add(rooms.get(first.room));return [first,second]}});
 return function action(b){
  prune();
  if(typeof b.action==='string'&&b.action.startsWith('social_'))return social(b);
  if(b.action==='create')return create('private');
  if(b.action==='match'){const r=[...rooms.values()].find(r=>r.mode==='match'&&!r.duel&&r.players.length===1);return r?add(r):create('match')}
  const r=rooms.get(String(b.room||'').toUpperCase());
  if(b.action==='join'){if(!r||r.mode!=='private'||r.duel||r.players.length!==1)throw Error('Raum nicht verfügbar');return add(r)}
  const p=participant(r,b.token);if(!p)throw Error('Raum oder Zugang abgelaufen');
  if(b.action==='leave'){if(r.duel){if(r.duel.winner===null)apply(r.duel,r.players.indexOf(p),{move:'surrender',rev:r.duel.rev});p.left=true;if(r.players.every(q=>q.left))rooms.delete(r.id);return {left:true}}r.players=r.players.filter(q=>q!==p);if(!r.players.length)rooms.delete(r.id);else{r.players[0].ready=false;r.touched=now()}return {left:true}}
  if(p.left)throw Error('Raum verlassen');
  if(b.action==='ready'){if(r.duel)throw Error('Duell läuft bereits');p.ready=b.ready===true;if(r.players.length===2&&r.players.every(q=>q.ready))r.duel=newDuel()}
  else if(b.action==='move'){if(!r.duel)throw Error('Kein Duell');apply(r.duel,r.players.indexOf(p),b)}
  else if(b.action!=='status')throw Error('Unbekannte Aktion');
  r.touched=now();return view(r,p)
 };
}
const root=fileURLToPath(new URL('../',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.ico':'image/x-icon','.mp3':'audio/mpeg','.wav':'audio/wav'};
export function createServer({origin=process.env.PVP_ORIGIN||'', lobby=createLobby({socialStorage:process.env.PVP_SOCIAL_FILE||resolve(root,'.arcane-social.json')})}={}){
 return http.createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
  const send=(status,data)=>{res.statusCode=status;res.end(JSON.stringify(data))};
  if(req.url!=='/arena/lobby'){
   if(!['GET','HEAD'].includes(req.method))return send(405,{error:'Nur GET'});
   try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname==='/')pathname='/index.html';
    if(pathname.split('/').some(p=>p.startsWith('.'))||pathname.startsWith('/pvp/')&&!['/pvp/arena-modes.js','/pvp/arena-board.js','/pvp/arena-friends.js','/pvp/arena-modes.css'].includes(pathname))return send(404,{error:'Nicht gefunden'});
    const file=await realpath(resolve(root,'.'+pathname));if(!file.startsWith(resolve(root)+sep)||!mime[extname(file)])return send(404,{error:'Nicht gefunden'});
    const info=await stat(file);if(!info.isFile())return send(404,{error:'Nicht gefunden'});res.setHeader('Content-Type',mime[extname(file)]);res.setHeader('Content-Length',info.size);if(req.method==='HEAD')return res.end();const stream=createReadStream(file);stream.on('error',()=>res.destroy());return stream.pipe(res)
   }catch{return send(404,{error:'Nicht gefunden'})}
  }
  if(req.headers.origin){const allowed=origin||'http://'+req.headers.host;if(req.headers.origin!==allowed)return send(403,{error:'Origin nicht erlaubt'});res.setHeader('Access-Control-Allow-Origin',allowed);res.setHeader('Vary','Origin')}
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.statusCode=204;return res.end()}
  if(req.method!=='POST')return send(405,{error:'Nur POST'});
  try{
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>4096){send(413,{error:'Anfrage zu groß'});return}}
   const body=JSON.parse(raw);if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Ungültige Anfrage');
   return send(200,lobby(body));
  }catch(e){return send(400,{error:e instanceof SyntaxError?'Ungültiges JSON':String(e.message||'Fehler')})}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){createServer().listen(Number(process.env.PORT||8787),process.env.HOST||'127.0.0.1',()=>console.log('Arcane PvP server ready'))}
