import {randomBytes,createHash} from 'node:crypto';
import {readFileSync,writeFileSync,renameSync} from 'node:fs';
const id=()=>randomBytes(6).toString('hex').toUpperCase();
const secret=()=>randomBytes(32).toString('hex');
const hash=s=>createHash('sha256').update(String(s)).digest('hex');
const fail=s=>{throw Error(s)};
const key=(a,b)=>[a,b].sort().join(':');
export function createSocial({now=Date.now,storage=null,pair=()=>fail('Duellserver fehlt')}={}){
 let db={profiles:{},friends:{},requests:{}};
 if(storage){try{db=JSON.parse(readFileSync(storage,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}}
 const invites=new Map(),seen=new Map();
 const save=()=>{if(storage){writeFileSync(storage+'.tmp',JSON.stringify(db),{mode:0o600});renameSync(storage+'.tmp',storage)}};
 const exists=x=>Object.hasOwn(db.profiles,x);
 const display=x=>({id:x,name:db.profiles[x].name,online:seen.has(x)&&now()-seen.get(x)<15000});
 const cleanId=x=>String(x||'').trim().replaceAll('-','').toUpperCase();
 const cleanName=x=>{if(typeof x!=='string')fail('Spielername fehlt');const n=x.trim();if(n.length<2||n.length>24||/[\x00-\x1f\x7f]/.test(n))fail('Spielername: 2–24 Zeichen');return n};
 const prune=()=>{for(const [k,v] of invites)if(now()-v.time>120000)invites.delete(k)};
 function view(me){
  prune();
  return {me:display(me),friends:Object.values(db.friends).filter(v=>v.includes(me)).map(v=>display(v.find(x=>x!==me))),
   incoming:Object.values(db.requests).filter(v=>v.to===me).map(v=>display(v.from)),
   outgoing:Object.values(db.requests).filter(v=>v.from===me).map(v=>display(v.to)),
   invites:[...invites.values()].filter(v=>v.from===me||v.to===me).map(v=>({id:v.id,from:display(v.from),to:display(v.to),status:v.status,claimed:!!v.claimed?.[me]}))};
 }
 return function social(b){
  prune();
  if(b.action==='social_register'){
   if(Object.keys(db.profiles).length>=1000)fail('Testserver ausgelastet');
   const name=cleanName(b.name);let me;do{me=id()}while(exists(me));const t=secret();
   db.profiles[me]={name,secretHash:hash(t)};seen.set(me,now());save();return {...view(me),profileToken:t}
  }
  const me=cleanId(b.playerId);
  if(!exists(me)||typeof b.profileToken!=='string'||db.profiles[me].secretHash!==hash(b.profileToken))fail('Spielerprofil nicht gefunden oder Zugang ungültig');
  seen.set(me,now());
  if(b.action==='social_status')return view(me);
  if(b.action==='social_rename'){db.profiles[me].name=cleanName(b.name);save();return view(me)}
  if(['social_invite_accept','social_invite_decline','social_invite_cancel','social_invite_claim'].includes(b.action)){
   const v=invites.get(b.inviteId);if(!v||![v.from,v.to].includes(me))fail('Einladung nicht verfügbar');
   if(b.action==='social_invite_accept'){
    if(v.to!==me||v.status!=='pending'||!db.friends[key(v.from,v.to)])fail('Einladung nicht verfügbar');
    v.rooms=pair();v.status='accepted';v.claimed={};v.time=now();
   }else if(b.action==='social_invite_decline'){
    if(v.to!==me||v.status!=='pending')fail('Einladung nicht verfügbar');v.status='declined';v.time=now()
   }else if(b.action==='social_invite_cancel'){
    if(v.from!==me||v.status!=='pending')fail('Einladung nicht verfügbar');invites.delete(v.id)
   }else{
    if(v.status!=='accepted')fail('Einladung noch nicht angenommen');v.claimed[me]=true;
    return {...view(me),room:v.rooms[v.from===me?0:1]}
   }
   return view(me)
  }
  const other=cleanId(b.target);if(other===me||!exists(other))fail('Spieler-ID nicht gefunden');
  const k=key(me,other),pending=db.requests[k],friend=db.friends[k];
  if(b.action==='social_request'){
   if(friend||pending)fail('Bereits befreundet oder Anfrage vorhanden');
   if(Object.values(db.requests).filter(v=>v.from===me).length>=30)fail('Zu viele offene Anfragen');
   db.requests[k]={from:me,to:other};save()
  }else if(b.action==='social_accept'||b.action==='social_decline'){
   if(!pending||pending.to!==me)fail('Keine eingehende Anfrage');
   if(b.action==='social_accept')db.friends[k]=[me,other];delete db.requests[k];save()
  }else if(b.action==='social_cancel'){
   if(!pending||pending.from!==me)fail('Keine ausgehende Anfrage');delete db.requests[k];save()
  }else if(b.action==='social_remove'){
   if(!friend)fail('Kein Freund');delete db.friends[k];for(const [id,v] of invites)if(key(v.from,v.to)===k&&v.status==='pending')invites.delete(id);save()
  }else if(b.action==='social_invite'){
   if(!friend)fail('Nur bestätigte Freunde können eingeladen werden');
   if([...invites.values()].some(v=>['pending','accepted'].includes(v.status)&&(!v.claimed?.[v.from]||!v.claimed?.[v.to])&&[v.from,v.to].some(x=>x===me||x===other)))fail('Es gibt bereits eine aktive Einladung');
   const inviteId=id();invites.set(inviteId,{id:inviteId,from:me,to:other,status:'pending',time:now()})
  }else fail('Unbekannte Freunde-Aktion');
  return view(me)
 }
}
