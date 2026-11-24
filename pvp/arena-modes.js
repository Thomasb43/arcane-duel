// Arena mode selector + isolated lobby preview. Existing KI path stays unchanged.
window.arcaneArenaModes=(()=>{
 let dialog,active=null,timer=null,generation=0,busy=false;
 const endpoint=()=>String(window.ARCANE_PVP_ENDPOINT||(location.port==='8787'?location.origin+'/arena/lobby':'')).trim();
 const h=(tag,txt)=>{const e=document.createElement(tag);if(txt)e.textContent=txt;return e};
 const btn=(txt,fn)=>{const e=h('button',txt);e.type='button';e.addEventListener('click',fn);return e};
 let content,status;
 function stop(){clearInterval(timer);timer=null}
 async function request(action,fields={}){
  if(!endpoint())throw Error('Der Online-Spielserver ist noch nicht eingerichtet.');
  const res=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...fields}),cache:'no-store',signal:AbortSignal.timeout(8000)});
  const data=await res.json();if(!res.ok)throw Error(data.error||'Verbindungsfehler');return data;
 }
 function credentials(){return {room:active.room,token:active.token}}
 function note(t){status.textContent=t}
 function clear(){content.replaceChildren();note('')}
 function close(){window.arcaneArenaFriends?.stop();window.arcanePvpBoard?.reset();dialog?.classList.remove('pvp-duel-open');generation++;stop();busy=false;const old=active;active=null;if(old)request('leave',{room:old.room,token:old.token}).catch(()=>{});if(dialog.open)dialog.close()}
 function menu(startKi){
  clear();
  content.append(btn('⚔ KI-Duell',()=>{close();startKi()}));
  const title=h('p','Spieler gegen Spieler · Online');content.append(title);
  content.append(btn('♟ Freunde & Anfragen',()=>{clear();window.arcaneArenaFriends.open({root:content,request,back:()=>menu(startKi),join:data=>{active=data;showRoom();timer=setInterval(poll,1200)}})}));
  content.append(btn('Zufälligen Gegner suchen',()=>enter('match')),btn('Privaten Raum erstellen',()=>enter('create')));
  const code=h('input');code.placeholder='Raumcode';code.maxLength=12;code.autocomplete='off';code.setAttribute('aria-label','Raumcode');
  content.append(code,btn('Raum beitreten',()=>{const v=code.value.trim().toUpperCase();if(!/^[A-F0-9]{12}$/.test(v)){note('Bitte einen gültigen Raumcode eingeben.');return}enter('join',{room:v})}));
  if(!endpoint())note('Vorschau: Online-Server noch nicht verbunden. KI-Duelle sind spielbar.');
  else note('Online-Test: feste Testdecks, keine Rangliste.');
 }
 async function enter(action,fields={}){
  if(busy||active)return;
  const g=++generation;busy=true;note('Verbindung wird aufgebaut …');
  try{const data=await request(action,fields);if(g!==generation){request('leave',{room:data.room,token:data.token}).catch(()=>{});return}active=data;showRoom();timer=setInterval(poll,1200)}
  catch(e){if(g===generation)note(e.message)}finally{if(g===generation)busy=false}
 }
 function showRoom(){
  clear();const label=h('strong','Raum: '+active.room);content.append(label);
  content.append(h('p',active.mode==='friend'?'Freundesduell – beide Spieler müssen bereit sein.':active.mode==='private'?'Teile diesen Raumcode mit deinem Freund.':'Suche nach einem echten Mitspieler.'));
  const count=h('p');count.id='arcanePvpCount';content.append(count);
  const ready=btn('Bereit',async()=>{if(!active||busy)return;busy=true;const g=generation;try{const data=await request('ready',{...credentials(),ready:!active.youReady});if(g===generation){Object.assign(active,data);paint()}}catch(e){if(g===generation)note(e.message)}finally{if(g===generation)busy=false}});ready.id='arcanePvpReady';content.append(ready,btn('Raum verlassen',()=>close()));paint()
 }
 function paint(){if(!active)return;if(active.duel){dialog.classList.add('pvp-duel-open');note('Online-Testduell · feste Testdecks · keine Belohnungen');window.arcanePvpBoard.render(content,active.duel,move,close);return}const count=content.querySelector('#arcanePvpCount'),ready=content.querySelector('#arcanePvpReady');if(!count||!ready)return;count.textContent=active.players+'/2 Spieler · Gegner '+(active.opponentReady?'bereit':'nicht bereit');ready.textContent=active.youReady?'Nicht bereit':'Bereit';ready.disabled=active.players!==2;note(active.players===2?(active.youReady&&active.opponentReady?'Beide bereit. Duell startet.':'Gegner gefunden. Bestätige deine Bereitschaft.'):'Warte auf zweiten Spieler …')}
 async function move(move,extra={}){if(!active||busy)return;busy=true;const g=generation;try{const data=await request('move',{...credentials(),move,rev:active.duel.rev,...extra});if(g===generation&&active){Object.assign(active,data);paint()}}catch(e){if(g===generation)note(e.message)}finally{if(g===generation)busy=false}}
 async function poll(){if(!active||busy)return;busy=true;const g=generation;try{const data=await request('status',credentials());if(g===generation&&active){Object.assign(active,data);paint()}}catch(e){if(g===generation)note(e.message)}finally{if(g===generation)busy=false}}
 function open(startKi){
  if(!dialog){
   dialog=h('dialog');dialog.className='arcane-pvp-modes';dialog.setAttribute('aria-label','Arena Modus wählen');const head=h('header');head.append(h('h2','⚔ Arena'),btn('Schließen',close));dialog.append(head);content=h('section');status=h('p');status.setAttribute('role','status');dialog.append(content,status);document.body.append(dialog);
   dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
  }
  menu(startKi);if(!dialog.open)dialog.showModal()
 }
 return {open}
})();
