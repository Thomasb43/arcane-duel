/* Arcane Duel v4.35 – Vier Story-Schwierigkeitsstufen */
(function(){
'use strict';
const LABELS=['Einsteiger','Fortgeschritten','Experte','Meister'];
const DETAILS=['Einfachere Karten und Kombinationen.','Ausgewogene Monster und Unterstützungen.','Gefährliche Zauber und stärkere Monster.','Die stärksten Decks mit Bossmonstern.'];
const PROPS=['arcaneStoryDifficulty435','arcaneStoryDifficulty400','arcaneStoryDifficulty405','arcaneStoryDifficulty406','arcaneStoryDifficulty408','arcaneStoryDifficulty411','arcaneStoryDifficulty415','arcaneStoryDifficulty417','arcaneStoryDifficulty429','arcaneStoryDifficulty432'];
const WIN_KEY='arcane-story-tier-wins-435',TIER_KEY='arcane-story-current-tier-435',MISSION_KEY='arcane-story-current-mission-435';
const clamp=n=>Math.max(1,Math.min(4,Math.trunc(Number(n)||1)));
const leonTiers=[
 [['Arenenlöwe Leonis',3],['Aschenritter',3],['Donnerfalke',3],['Flammendrache',1],['Löwenrekrut',2],['Sonnenmähnen-Krieger',2],['Flammenbanner-Löwe',2],['Arena-Paladin',2],['Mut der Löwen',2],['Flammenstoß',2],['Arkaner Segen',2],['Funkenregen',2],['Löwenmut-Schild',2],['Heldenbrüllen',2]],
 [['Arenenlöwe Leonis',3],['Aschenritter',3],['Flammendrache',3],['Sonnenmähnen-Krieger',2],['Flammenbanner-Löwe',2],['Arena-Paladin',2],['Donnerfalke',3],['Mut der Löwen',3],['Flammenstoß',2],['Funkenregen',2],['Löwenruf',1],['Löwenmut-Schild',2],['Glutwall',2]],
 [['Arenenlöwe Leonis',3],['Flammendrache',3],['Glutkoloss',3],['Donnerfalke',3],['Sonnenmähnen-Krieger',2],['Arena-Paladin',2],['Flammenbanner-Löwe',2],['Mut der Löwen',3],['Flammenstoß',2],['Drachenatem',2],['Goldene Arena',1],['Arkaner Rückschlag',2],['Kampf der Arena',2]],
 [['König der Löwenarena',1],['Arenenlöwe Leonis',3],['Flammendrache',3],['Glutkoloss',3],['Donnerfalke',3],['Sonnenmähnen-Krieger',2],['Arena-Paladin',2],['Aschenritter',1],['Mut der Löwen',3],['Flammenstoß',3],['Löwenruf',1],['Goldene Arena',1],['Arkaner Rückschlag',3],['Kampf der Arena',1]]
];
function createLeonTier(level){
 const list=leonTiers[clamp(level)-1],inventory=new Map(leonDeckList363),seen=new Set(),out=[];
 for(const [name,qty] of list){
  if(seen.has(name)||!Number.isInteger(qty)||qty<1||qty>3||qty>(inventory.get(name)||0))throw Error('Leon Kopienlimit: '+name);
  const card=deck.find(c=>c.name===name);if(!card)throw Error('Leon Karte fehlt: '+name);
  seen.add(name);
  for(let i=0;i<qty;i++)out.push({...card});
 }
 if(out.length!==30)throw Error('Leon Deckgröße: '+out.length);
 return shuffleCards(out);
}
window.arcaneLeonStoryTiers435={create:createLeonTier,tiers:LABELS.slice()};
const baseCreate=createStoryOpponentDeck362;
createStoryOpponentDeck362=function(index){
 return index===0?createLeonTier(window.arcaneStoryDifficulty435||1):baseCreate(index);
};
function readWins(){
 try{
  const data=JSON.parse(localStorage.getItem(WIN_KEY)||'[]');
  if(Array.isArray(data))return Array.from({length:10},(_,i)=>Math.max(0,Math.min(15,Math.trunc(Number(data[i])||0))));
 }catch(e){}
 return Array(10).fill(0);
}
function recordWin(index,tier){
 const current=readWins();current[index]|=(1<<(clamp(tier)-1));
 try{localStorage.setItem(WIN_KEY,JSON.stringify(current))}catch(e){console.warn('Story-Stufe nicht gespeichert:',e)}
}
function choose(index,tier){
 tier=clamp(tier);
 window[PROPS[index]]=tier;
 window.arcaneStorySelectedDifficulty435={mission:index+1,tier,label:LABELS[tier-1]};
 try{sessionStorage.setItem(TIER_KEY,String(tier));sessionStorage.setItem(MISSION_KEY,String(index))}catch(e){}
}
const oldApply=window.arcaneApplyStoryOpponent362;
window.arcaneApplyStoryOpponent362=function(index){
 const ok=oldApply(index);
 if(ok&&window.arcaneStoryOpponentInfo362){
  let active=-1,tier=1;
  try{active=Number(sessionStorage.getItem(MISSION_KEY));tier=active===index?clamp(sessionStorage.getItem(TIER_KEY)):1}catch(e){}
  const info=window.arcaneStoryOpponentInfo362;
  info.difficulty=tier;info.difficultyName=LABELS[tier-1];info.difficultyReady=4;info.deckSize=30;
 }
 return ok;
};
const oldResult=window.arcaneStoryResult357;
if(typeof oldResult==='function'){
 window.arcaneStoryResult357=function(won,draw){
  if(won&&!draw){
   try{
    const pending=sessionStorage.getItem('arcane-story-active-duel-358');
    const index=Number(pending),selected=Number(sessionStorage.getItem(MISSION_KEY));
    if(pending!==null&&Number.isInteger(index)&&index>=0&&index<10){
     recordWin(index,selected===index?sessionStorage.getItem(TIER_KEY):1);
    }
   }catch(e){console.warn('Schwierigkeitssieg konnte nicht gespeichert werden:',e)}
  }
  return oldResult.apply(this,arguments);
 };
}
const style=document.createElement('style');
style.id='arcane-difficulty-styles-435';
style.textContent=[
 '.arcane-difficulty-overlay-435{position:fixed;inset:0;z-index:110090;display:grid;place-items:center;background:#08091cef;padding:14px;overflow:auto}',
 '.arcane-difficulty-panel-435{width:min(100%,530px);max-height:94dvh;overflow-y:auto;padding:18px;border-radius:18px;border:1px solid #dfbe78;background:radial-gradient(ellipse at top,#35325e,#16182f 78%);box-shadow:0 18px 55px #0009;color:#fff3df;font:14px system-ui}',
 '.arcane-difficulty-title-435{font:700 25px Georgia,serif;color:#ffe2a3;margin:6px 0}',
 '.arcane-difficulty-intro-435{font-size:13px;line-height:1.5;color:#cdd4ea;margin:4px 0 14px}',
 '.arcane-difficulty-grid-435{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
 '.arcane-difficulty-option-435{min-height:137px;min-width:0;padding:12px;display:flex;flex-direction:column;gap:7px;text-align:left;border:1px solid #8b87b4;border-radius:12px;color:#f6efe4;background:linear-gradient(155deg,#373257,#202442);cursor:pointer}',
 '.arcane-difficulty-option-435 strong{font:700 18px Georgia,serif;color:#ffdfa2}',
 '.arcane-difficulty-option-435 small{font-size:12px;line-height:1.4;color:#d0d1e6}',
 '.arcane-difficulty-option-435 .tier-number{font-size:10px;font-weight:900;letter-spacing:1.4px;color:#c5c8f1}',
 '.arcane-difficulty-option-435 .tier-state{margin-top:auto;font-size:11px;color:#c7e7da;font-weight:900}',
 '.arcane-difficulty-option-435.is-cleared{border-color:#7fdfb9;background:linear-gradient(155deg,#245547,#28314b)}',
 '.arcane-difficulty-option-435.is-master{border-color:#dbb575;background:linear-gradient(155deg,#593b5b,#292244)}',
 '.arcane-difficulty-option-435:focus-visible{outline:3px solid #ffe2a3;outline-offset:2px}',
 '.arcane-difficulty-cancel-435{width:100%;padding:11px;margin-top:11px;background:#282b4b;color:#fff1d1;border:1px solid #9fa2c1;border-radius:9px;font-weight:800}',
 '@media(max-width:340px){.arcane-difficulty-panel-435{padding:11px}.arcane-difficulty-grid-435{gap:6px}.arcane-difficulty-option-435{padding:8px;min-height:155px}.arcane-difficulty-option-435 strong{font-size:16px}}'
].join('\n');
document.head.appendChild(style);
let ignoreButton=null,opened=false;
function missionIndex(){
 const title=document.getElementById('arcaneStoryHeading357')?.textContent||'';
 const match=title.match(/^1-(\d+)\s/);
 if(!match)return -1;
 const index=Number(match[1])-1;
 return Number.isInteger(index)&&index>=0&&index<10?index:-1;
}
function showChoice(index,continueButton){
 if(opened)return;
 opened=true;
 const marks=readWins()[index];
 const modal=document.createElement('div');
 modal.id='arcaneStoryDifficulty435';modal.className='arcane-difficulty-overlay-435';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Schwierigkeit wählen');
 const panel=document.createElement('div');panel.className='arcane-difficulty-panel-435';
 const heading=document.createElement('h2');heading.className='arcane-difficulty-title-435';heading.textContent='Schwierigkeit wählen';
 const intro=document.createElement('p');intro.className='arcane-difficulty-intro-435';intro.textContent='Mission 1-'+(index+1)+' · Wähle eine der vier Deckstufen. Jede Stufe hat einen eigenen Siegstatus.';
 const grid=document.createElement('div');grid.className='arcane-difficulty-grid-435';
 for(let tier=1;tier<=4;tier++){
  const won=!!(marks&(1<<(tier-1))),button=document.createElement('button');
  button.type='button';button.className='arcane-difficulty-option-435'+(won?' is-cleared':'')+(tier===4?' is-master':'');
  const number=document.createElement('span');number.className='tier-number';number.textContent='STUFE '+tier;
  const name=document.createElement('strong');name.textContent=(tier===4?'♛ ':'')+LABELS[tier-1];
  const description=document.createElement('small');description.textContent=DETAILS[tier-1];
  const state=document.createElement('span');state.className='tier-state';state.textContent=won?'✓ Bereits besiegt':'⚔ Duell starten';
  button.append(number,name,description,state);
  button.addEventListener('click',()=>{
   choose(index,tier);
   modal.remove();opened=false;
   ignoreButton=continueButton;
   continueButton.click();
  });
  grid.appendChild(button);
 }
 const cancel=document.createElement('button');cancel.type='button';cancel.className='arcane-difficulty-cancel-435';cancel.textContent='Zurück';
 cancel.addEventListener('click',()=>{modal.remove();opened=false});
 panel.append(heading,intro,grid,cancel);modal.appendChild(panel);document.body.appendChild(modal);
 grid.querySelector('button')?.focus();
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('button');
 if(ignoreButton&&button===ignoreButton){ignoreButton=null;return;}
 if(ignoreButton)ignoreButton=null;
 if(!button)return;
 const start=button.id==='arcaneStoryAdvance357'&&button.textContent.includes('Duell starten');
 const skip=button.id==='arcaneStorySkip357'
  &&(document.querySelector('#arcaneStoryContent357 .arcane-story-copy-357')?.textContent||'').includes('Vor dem Duell');
 if(!start&&!skip)return;
 const index=missionIndex();if(index<0)return;
 event.preventDefault();event.stopImmediatePropagation();showChoice(index,button);
},true);
const container=document.getElementById('arcaneStoryContent357');
if(container){
 const decorate=()=>{
  const saved=readWins();
  container.querySelectorAll('[data-mission]').forEach(button=>{
   const index=Number(button.dataset.mission),count=[1,2,4,8].filter(bit=>!!((saved[index]||0)&bit)).length;
   const small=button.querySelector('small');
   if(!small||!count||small.querySelector('.arcane-tier-badge-435'))return;
   const label=document.createElement('span');label.className='arcane-tier-badge-435';label.textContent=' ★ '+count+'/4';
   label.style.cssText='color:#a9f1d4;font-weight:900;margin-left:4px';small.appendChild(label);
  });
 };
 new MutationObserver(decorate).observe(container,{childList:true});
 decorate();
}
window.arcaneStoryDifficulty435={tiers:LABELS.slice(),wins:readWins,select:choose};
})();
