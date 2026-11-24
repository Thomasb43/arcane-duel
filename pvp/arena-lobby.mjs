// Arcane Duel: isolated, unranked PvP lobby prototype. No duel simulation yet.
import http from 'node:http';
import {randomBytes} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const MAX=1000, TTL=15*60*1000;
const token=()=>randomBytes(24).toString('hex');
const code=()=>randomBytes(6).toString('hex').toUpperCase();
export function createLobby({now=Date.now}={}){
 const rooms=new Map();
 function prune(){for(const [id,r] of rooms)if(now()-r.touched>TTL)rooms.delete(id)}
 function participant(r,t){return r?.players.find(p=>p.token===t)}
 function view(r,p){return {room:r.id,mode:r.mode,players:r.players.length,youReady:p.ready,opponentReady:r.players.some(q=>q!==p&&q.ready),status:r.players.length===2?'paired':'waiting'}}
 function add(r){const p={token:token(),ready:false};r.players.push(p);r.touched=now();return {...view(r,p),token:p.token}}
 function create(mode){if(rooms.size>=MAX)throw Error('Lobby ausgelastet');let id;do{id=code()}while(rooms.has(id));const r={id,mode,players:[],touched:now()};rooms.set(id,r);return add(r)}
 return function action(b){
  prune();
  if(b.action==='create')return create('private');
  if(b.action==='match'){const r=[...rooms.values()].find(r=>r.mode==='match'&&r.players.length===1);return r?add(r):create('match')}
  const r=rooms.get(String(b.room||'').toUpperCase());
  if(b.action==='join'){if(!r||r.mode!=='private'||r.players.length!==1)throw Error('Raum nicht verfügbar');return add(r)}
  const p=participant(r,b.token);if(!p)throw Error('Raum oder Zugang abgelaufen');
  if(b.action==='leave'){r.players=r.players.filter(q=>q!==p);if(!r.players.length)rooms.delete(r.id);else{r.players[0].ready=false;r.touched=now()}return {left:true}}
  if(b.action==='ready')p.ready=b.ready===true;
  else if(b.action!=='status')throw Error('Unbekannte Aktion');
  r.touched=now();return view(r,p)
 };
}
export function createServer({origin=process.env.PVP_ORIGIN||'', lobby=createLobby()}={}){
 return http.createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
  const send=(status,data)=>{res.statusCode=status;res.end(JSON.stringify(data))};
  if(req.headers.origin){if(req.headers.origin!==origin)return send(403,{error:'Origin nicht erlaubt'});res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}
  if(req.url!=='/arena/lobby')return send(404,{error:'Nicht gefunden'});
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.statusCode=204;return res.end()}
  if(req.method!=='POST')return send(405,{error:'Nur POST'});
  try{
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>4096){send(413,{error:'Anfrage zu groß'});return}}
   const body=JSON.parse(raw);if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Ungültige Anfrage');
   return send(200,lobby(body));
  }catch(e){return send(400,{error:e instanceof SyntaxError?'Ungültiges JSON':String(e.message||'Fehler')})}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){createServer().listen(Number(process.env.PORT||8787),'127.0.0.1',()=>console.log('Arcane PvP lobby listening on 127.0.0.1'))}
