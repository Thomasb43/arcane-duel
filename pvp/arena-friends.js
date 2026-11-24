// Friends area for local PvP test. Profile secret is never displayed or shared.
window.arcaneArenaFriends=(()=>{
 const KEY='arcane-pvp-profile-v1';let profile=null;try{profile=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){}
 let root=null,body=null,status=null,request=null,back=null,join=null,timer=null,epoch=0,busy=false,snapshot=null;
 const h=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
 const button=(text,fn)=>{const b=h('button',text);b.type='button';b.onclick=fn;return b};
 const field=(placeholder,max)=>{const e=h('input');e.placeholder=placeholder;e.setAttribute('aria-label',placeholder);e.maxLength=max;e.autocomplete='off';return e};
 const showId=id=>id.match(/.{1,4}/g).join('-');
 const note=t=>{if(status)status.textContent=t};
 const auth=()=>({playerId:profile.id,profileToken:profile.token});
 function stop(){epoch++;clearInterval(timer);timer=null;busy=false;root=null;body=null;status=null;snapshot=null}
 async function call(action,fields={},quiet=false){
  if(busy||!root)return;busy=true;const g=epoch;
  try{
   const data=await request(action,{...(profile?auth():{}),...fields});if(g!==epoch)return;
   if(action==='social_register'){profile={id:data.me.id,token:data.profileToken};try{localStorage.setItem(KEY,JSON.stringify(profile))}catch(_){note('Profil kann auf diesem Gerät nicht gespeichert werden.')};setup()}
   if(data.room){const next=join;stop();next(data.room);return}
   const previous=JSON.stringify(snapshot);snapshot=data;if(!quiet||previous!==JSON.stringify(data))paint();
   if(!quiet)note('');else if(status?.dataset.connectionError){delete status.dataset.connectionError;note('')}
  }catch(e){if(g!==epoch)return;note(e.message);if(quiet&&status)status.dataset.connectionError='1'}finally{if(g===epoch)busy=false}
 }
 function setup(){
  root.replaceChildren();
  root.append(button('‹ Zur Arena',()=>{const fn=back;stop();fn()}),h('h2','Freunde'));
  if(!profile){
   root.append(h('p','Erstelle dein Spielerprofil für Freundesduelle.'));
   const name=field('Dein Spielername',24);root.append(name,button('Spielerprofil erstellen',()=>call('social_register',{name:name.value})));
  }else{
   const card=h('div',null,'pvp-friends-profile');card.append(h('small','Deine Spieler-ID'),h('strong',showId(profile.id)),button('ID kopieren',async()=>{try{await navigator.clipboard.writeText(showId(profile.id));note('Spieler-ID kopiert.')}catch(_){note('Bitte die ID oben manuell kopieren.')}}));root.append(card);
   const input=field('Spieler-ID eines Freundes',14);root.append(input,button('Freundschaftsanfrage senden',()=>call('social_request',{target:input.value})));
  }
  body=h('div',null,'pvp-friends-list');status=h('p');status.setAttribute('role','status');root.append(body,status)
 }
 function row(person){const r=h('div',null,'pvp-friend-row');const label=h('div');label.append(h('strong',person.name),h('small',(person.online?'● Online in Freunde':'○ Offline')+' · '+showId(person.id),person.online?'pvp-friend-online':''));r.append(label);return r}
 function section(title,count){const s=h('section',null,'pvp-friend-group');s.append(h('h3',title+' ('+count+')'));body.append(s);return s}
 function paint(){
  if(!snapshot||!body)return;body.replaceChildren();
  if(profile){const own=h('div',null,'pvp-friend-row');own.append(h('strong',snapshot.me.name),button('Name ändern',()=>{const name=prompt('Neuer Spielername',snapshot.me.name);if(name!==null)call('social_rename',{name})}));body.append(own)}
  const invites=section('Duelleinladungen',snapshot.invites.length);
  for(const v of snapshot.invites){const incoming=v.to.id===profile.id;const r=row(incoming?v.from:v.to);
   if(v.status==='pending'&&incoming)r.append(button('Duell annehmen',()=>call('social_invite_accept',{inviteId:v.id})),button('Ablehnen',()=>call('social_invite_decline',{inviteId:v.id})));
   else if(v.status==='pending')r.append(h('small','Warte auf Antwort'),button('Abbrechen',()=>call('social_invite_cancel',{inviteId:v.id})));
   else if(v.status==='accepted'&&!v.claimed)r.append(button('Duell beitreten',()=>call('social_invite_claim',{inviteId:v.id})));
   else r.append(h('small',v.status==='declined'?'Abgelehnt':'Bereits beigetreten'));
   invites.append(r)
  }
  const friends=section('Freundesliste',snapshot.friends.length);
  for(const f of snapshot.friends){const r=row(f);r.append(button('⚔ Einladen',()=>call('social_invite',{target:f.id})),button('Entfernen',()=>{if(confirm(f.name+' entfernen?'))call('social_remove',{target:f.id})}));friends.append(r)}
  if(!snapshot.friends.length)friends.append(h('p','Noch keine Freunde. Füge jemanden über seine Spieler-ID hinzu.'));
  const incoming=section('Eingehende Anfragen',snapshot.incoming.length);
  for(const f of snapshot.incoming){const r=row(f);r.append(button('Annehmen',()=>call('social_accept',{target:f.id})),button('Ablehnen',()=>call('social_decline',{target:f.id})));incoming.append(r)}
  const outgoing=section('Gesendete Anfragen',snapshot.outgoing.length);
  for(const f of snapshot.outgoing){const r=row(f);r.append(button('Zurückziehen',()=>call('social_cancel',{target:f.id})));outgoing.append(r)}
 }
 function open(opts){stop();root=opts.root;request=opts.request;back=opts.back;join=opts.join;setup();if(profile)call('social_status');timer=setInterval(()=>{if(profile)call('social_status',{},true)},3500)}
 return {open,stop}
})();
