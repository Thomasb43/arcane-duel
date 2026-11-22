/* Arcane Duel v4.49 – Kaels gefuehrter Einstieg auf dem echten Spielfeld. */
(function arcaneFirstRun449(){
 'use strict';
 const KEY='arcane-duel-first-run-v449',REWARD='arcane-duel-tutorial-reward-v449';
 const home=document.getElementById('arcaneHome307'),start=document.getElementById('arcaneIntroStart308'),arena=document.getElementById('arcaneStartDuel307');
 if(!home||!start||!arena||!document.getElementById('myMon'))return;
 const style=document.createElement('style');
 style.textContent='#arcaneWelcome449[hidden],#arcaneGuide449[hidden]{display:none!important}#arcaneWelcome449{position:fixed;inset:0;z-index:85000;display:grid;place-items:center;padding:12px;background:#0a0819df}.first-panel-449{max-height:94svh;overflow:auto;width:min(94vw,530px);padding:clamp(14px,3vw,25px);border:2px solid #e0ba7d;border-radius:17px;background:linear-gradient(145deg,#35214f,#13132a 75%);box-shadow:0 0 35px #a369d777;color:#fff1d6}.first-head-449{display:flex;align-items:center;gap:12px}.first-head-449 img{width:clamp(62px,13vw,90px);height:clamp(62px,13vw,90px);border-radius:50%;object-fit:cover;border:2px solid #efcc8b}.first-head-449 small{color:#cba2ff;font-size:10px;font-weight:900;letter-spacing:1.5px}.first-head-449 h2{font:700 clamp(21px,4vw,30px) Georgia,serif;margin:5px 0;color:#ffe1a0}.first-text-449{font-size:clamp(14px,2.6vw,17px);line-height:1.54;white-space:pre-line;min-height:70px}.first-note-449{color:#c7b2e2;font-size:11px}.first-actions-449{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:15px}.first-actions-449 button,.guide-buttons-449 button,.tutorial-replay-449{border:1px solid #e0bd7f;border-radius:9px;background:linear-gradient(120deg,#68439d,#30204b);padding:9px 12px;color:#fff0cc;font-weight:800;cursor:pointer}.first-actions-449 button.secondary-449,.guide-buttons-449 button.secondary-449{background:#211c34;border-color:#796b94}#arcaneGuide449{position:fixed;z-index:11000;top:48px;right:7px;width:min(330px,43vw);pointer-events:none}.guide-box-449{display:flex;align-items:flex-start;gap:8px;padding:9px;border:1px solid #e2c083;border-radius:10px;background:#13112ce9;box-shadow:0 3px 17px #000a;color:#fff0d7;pointer-events:auto;backdrop-filter:blur(5px)}.guide-box-449 img{width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid #e3b976}.guide-body-449{flex:1;min-width:0}.guide-body-449 strong{display:block;color:#ffdb92;font-size:12px}.guide-body-449 p{font-size:12px;line-height:1.35;margin:4px 0 7px}.guide-buttons-449{display:flex;gap:5px;flex-wrap:wrap}.guide-buttons-449 button{font-size:10px;padding:5px 7px}.target-449{outline:3px solid #ffe79a!important;outline-offset:2px;box-shadow:0 0 13px #cb80ff!important;animation:tutPulse449 1.8s ease-in-out infinite}@keyframes tutPulse449{50%{outline-color:#bb86ff;filter:brightness(1.14)}}.tutorial-replay-449{display:inline-flex;position:relative;z-index:7;justify-content:center;font-size:12px;margin:7px auto 0;padding:6px 10px}@media(max-width:700px){#arcaneGuide449{top:5px;right:5px;width:min(270px,43vw)}.guide-box-449{gap:5px;padding:6px}.guide-box-449 img{width:28px;height:28px}.guide-body-449 strong,.guide-body-449 p{font-size:10px}.guide-buttons-449 button{font-size:9px;padding:3px 5px}}@media(max-width:480px) and (orientation:portrait){#arcaneGuide449{top:50px;left:50%;right:auto;transform:translateX(-50%);width:min(92vw,350px)}}@media(prefers-reduced-motion:reduce){.target-449{animation:none}}';
 document.head.appendChild(style);
 const welcome=document.createElement('div');welcome.id='arcaneWelcome449';welcome.hidden=true;
 welcome.setAttribute('role','dialog');welcome.setAttribute('aria-modal','true');
 welcome.innerHTML='<div class="first-panel-449"><div class="first-head-449"><img src="artwork/story/kael.jpg" alt="Kael"><div><small>ARCANE DUEL · DIE CHRONIK ERWACHT</small><h2 id="firstTitle449"></h2></div></div><p class="first-text-449" id="firstText449"></p><p class="first-note-449" id="firstNote449"></p><div class="first-actions-449"><button class="secondary-449" id="firstSkip449" type="button">Überspringen</button><button id="firstNext449" type="button">Weiter</button></div></div>';
 document.body.appendChild(welcome);
 const guide=document.createElement('aside');guide.id='arcaneGuide449';guide.hidden=true;guide.setAttribute('role','status');
 guide.innerHTML='<div class="guide-box-449"><img src="artwork/story/kael.jpg" alt=""><div class="guide-body-449"><strong id="guideTitle449"></strong><p id="guideText449"></p><div class="guide-buttons-449"><button id="guideRetry449" type="button">Neu starten</button><button class="secondary-449" id="guideExit449" type="button">Beenden</button></div></div></div>';
 document.body.appendChild(guide);
 const replay=document.createElement('button');replay.type='button';replay.className='tutorial-replay-449';replay.textContent='✧ Tutorial wiederholen';
 (home.querySelector('.arcane-hub-title-314')||home).appendChild(replay);
 const stories=[
  ['Kael · Der Ruf der Chronik','„Die Chronik erwacht. Und mit ihr eine Macht, die unsere Welt zu verschlingen droht.\nIch bin Kael – Wächter des ersten Siegels.“'],
  ['Kael · Deine Karten','„Jede Karte kann ein Duell verändern. Ich begleite dich durch die ersten Schritte – aber du selbst führst jede Bewegung aus.“'],
  ['Kael · Deine erste Prüfung','„Lies eine Karte, beschwöre den Siegelritter in Angriffsposition und besiege den Schattenresonator.\nDanach wartet die Chronik auf dich.“']
 ];
 const steps=[
  ['1/4 · Karten verstehen','Tippe eine Handkarte an, lies ihre Werte und schließe anschließend die vergrößerte Karte.'],
  ['2/4 · Beschwören','Ziehe den Siegelritter aus deiner Hand auf eine freie Monsterzone.'],
  ['3/4 · Offen legen','Wähle auf dem Feld „Offen“, damit dein Siegelritter angreifen kann.'],
  ['4/4 · Angreifen','Wische deinen offenen Siegelritter auf den Schattenresonator des Gegners.']
 ];
 let page=0,step=0,active=false,done=false,trainingMatch=false,pendingFrame=false;
 const stored=k=>{try{return localStorage.getItem(k)==='1'}catch(_){return false}};
 const store=k=>{try{localStorage.setItem(k,'1')}catch(_){}};
 const $=id=>document.getElementById(id);
 function renderWelcome(){ $('firstTitle449').textContent=stories[page][0];$('firstText449').textContent=stories[page][1];$('firstNote449').textContent='Einführung '+(page+1)+'/3 · jederzeit überspringbar';$('firstNext449').textContent=page===2?'Übungsduell starten':'Weiter';$('firstSkip449').textContent='Überspringen';}
 function showIntro(){if(active)return;done=false;page=0;renderWelcome();welcome.hidden=false;$('firstNext449').focus({preventScroll:true});}
 function clearTarget(){document.querySelectorAll('.target-449').forEach(x=>x.classList.remove('target-449'));}
 function highlight(){
  clearTarget();
  const selector=step===0?'#hand [data-card]':step===1?'#myMon .zone':step===2?'#myMon [data-zone-choice="attack"]':step===3?'#myMon .zone.filled':null;
  if(selector)document.querySelectorAll(selector).forEach(x=>x.classList.add('target-449'));
 }
 function renderGuide(){if(!active)return;guide.hidden=false;$('guideTitle449').textContent='KAEL · '+steps[step][0];$('guideText449').textContent=steps[step][1];highlight();}
 function resetArena(){
  drawPile=createDuelDeck();hand=drawPile.splice(0,5);
  aiDeck=createDuelDeck();aiHand=aiDeck.splice(0,5);aiTurn=0;
  myMon=Array(4).fill(null);mySpell=Array(4).fill(null);oppMon=Array(4).fill(null);oppSpell=Array(4).fill(null);
  myGraveyard=[];oppGraveyard=[];myLP=4000;oppLP=4000;turn=1;phase='main1';normalSummonUsed=false;
  selected=-1;chosenMonster=-1;chosenTarget=-1;chosenSpell=-1;
  pendingTribute=null;pendingPlacement=null;pendingSwipeSummon=null;newlyDrawnCard=null;crystalShield=false;
  lastShownMyLP=4000;lastShownOppLP=4000;lpFeedbackInitialized=false;
  window.arcaneCurrentStoryOpponent397=null;window.arcaneStoryOpponentInfo362=null;
  try{sessionStorage.removeItem('arcane-story-active-duel-358')}catch(_){}
  $('duelOutcome306')?.remove();render();
 }
 function prepare(){
  resetArena();
  const find=name=>{const c=deck.find(x=>x.name===name);return c?{...c}:null};
  const cards=['Siegelritter','Arkaner Lehrling','Runenwissen','Kristallschild','Licht des Siegels'].map(find);
  const enemy=resonanceTestCards.find(x=>x.name==='Schattenresonator');
  if(!enemy||cards.some(x=>!x))return false;
  hand=cards;drawPile=createDuelDeck();
  oppMon=[{...enemy,position:'attack',faceDown:false,summonedTurn:0,attacksThisTurn:0},null,null,null];
  aiHand=[];aiDeck=createDuelDeck();render();
  log('Kaels Prüfung: Sieh dir eine Karte an. Danach beschwöre den Siegelritter.');
  return true;
 }
 function toCity(reset){
  const had=trainingMatch;active=false;guide.hidden=true;welcome.hidden=true;clearTarget();
  if(reset&&had){resetArena();trainingMatch=false}
  home.hidden=false;const menu=$('arcaneReturnMenu307');if(menu)menu.hidden=true;
  arena.focus({preventScroll:true});
 }
 function begin(){
  welcome.hidden=true;
  if(!active)arena.click();
  trainingMatch=true;active=true;done=false;step=0;
  try{if(!prepare())throw Error('Karten fehlen');renderGuide()}
  catch(err){console.error('Tutorial konnte nicht gestartet werden:',err);toCity(true);alert('Das Training ist gerade nicht verfügbar. Du kannst das normale Spiel weiterhin starten.')}
 }
 function rewardOnce(){
  if(stored(REWARD))return false;
  const bank=window.arcaneTestCrystals320;
  if(!bank||typeof bank.get!=='function'||typeof bank.set!=='function')return false;
  const before=Number(bank.get());if(!Number.isFinite(before))return false;
  bank.set(before+100);if(Number(bank.get())!==before+100)return false;
  store(REWARD);bank.refresh?.();return true;
 }
 function complete(){
  if(!active||done)return;
  done=true;active=false;guide.hidden=true;clearTarget();store(KEY);
  const earned=rewardOnce();
  welcome.hidden=false;$('firstTitle449').textContent='Training abgeschlossen!';
  $('firstText449').textContent='„Gut gemacht! Du hast eine Karte gelesen, einen Siegelritter beschworen und einen Angriff ausgeführt.\n\nJetzt beginnt deine eigene Geschichte.“'+(earned?'\n\n💎 +100 Arkankristalle erhalten!':'\n\nDie einmalige Belohnung wurde bereits abgeholt oder ist zurzeit nicht verfügbar.');
  $('firstNote449').textContent='Du kannst das Tutorial jederzeit in der Stadt wiederholen.';
  $('firstSkip449').textContent='Weiterkämpfen';$('firstNext449').textContent='Zur Stadt';
 }
 function inspect(){
  if(!active)return;
  const open=myMon.some(c=>c&&!c.faceDown&&c.position==='attack');
  if(step===1&&pendingSwipeSummon){step=2;renderGuide();return}
  if(step===1&&open){step=3;renderGuide();return}
  if(step===2&&!pendingSwipeSummon&&open){step=3;renderGuide();return}
  if(step===3&&(oppLP<4000||!oppMon[0]))complete();
 }
 function inspectQueued(){if(pendingFrame)return;pendingFrame=true;requestAnimationFrame(()=>{pendingFrame=false;inspect();if(active)highlight()})}
 const observer=new MutationObserver(inspectQueued);
 ['myMon','oppMon','oppLP'].forEach(id=>{if($(id))observer.observe($(id),{childList:true,subtree:true,characterData:true})});
 start.addEventListener('click',()=>{if(!stored(KEY))showIntro()});
 replay.addEventListener('click',showIntro);
 $('firstSkip449').addEventListener('click',()=>{if(done){done=false;welcome.hidden=true;return}store(KEY);welcome.hidden=true});
 $('firstNext449').addEventListener('click',()=>{if(done){done=false;toCity(true);return}if(page<stories.length-1){page++;renderWelcome()}else begin()});
 $('guideRetry449').addEventListener('click',()=>{step=0;try{prepare();renderGuide()}catch(e){console.error(e);toCity(true)}});
 $('guideExit449').addEventListener('click',()=>toCity(true));
 document.addEventListener('click',event=>{if(active&&step===0&&event.target.closest('#hand [data-card]')){step=1;renderGuide()}});
 arena.addEventListener('click',()=>{if(trainingMatch&&!active&&!done){resetArena();trainingMatch=false}});
 window.arcaneShowTutorial449=showIntro;
})();