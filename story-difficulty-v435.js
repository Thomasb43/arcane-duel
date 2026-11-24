/* Arcane Duel v4.69 – 70 Story-Missionen, vier Schwierigkeitsgrade und sichere Testvorschau */
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
 let saved=Array(70).fill(0);
 try{
  const data=JSON.parse(localStorage.getItem(WIN_KEY)||'[]');
  if(Array.isArray(data))saved=saved.map((_,i)=>Math.max(0,Math.min(15,Math.trunc(Number(data[i])||0))));
 }catch(e){}
 // Bestehende Story-Spielstände aus älteren Versionen zählen als Einsteiger-Siege.
 // Der Speicherwert ist die nächste freigeschaltete Mission (1 bis 11).
 // Nur tatsächlich abgeschlossene Missionen übernehmen; keine höheren Stufen fälschen.
 const oldKeys=[
  'arcane-duel-story-chapter1-357',
  'arcane-duel-story-chapter2-v444',
  'arcane-duel-story-chapter3-v445'
 ];
 let changed=false;
 oldKeys.forEach((key,chapter)=>{
  let progress=1;
  try{progress=Math.max(1,Math.min(11,Math.trunc(Number(localStorage.getItem(key))||1)))}catch(_){}
  for(let mission=0;mission<progress-1;mission++){
   const index=chapter*10+mission;
   if(!(saved[index]&1)){saved[index]|=1;changed=true}
  }
 });
 if(changed){
  try{localStorage.setItem(WIN_KEY,JSON.stringify(saved))}catch(e){console.warn('Frühere Story-Siege konnten nicht übernommen werden:',e)}
 }
 return saved;
}
function highestUnlocked(index,wins){
 if(window.arcaneStoryReview469)return 4;
 const marks=(wins||readWins())[index]||0;
 let tier=1;
 // Jede Mission erfordert Siege in lückenloser Reihenfolge.
 while(tier<4&&(marks&(1<<(tier-1))))tier++;
 return tier;
}
function isUnlocked(index,tier,wins){
 return clamp(tier)<=highestUnlocked(index,wins);
}
function recordWin(index,tier){
 if(!Number.isInteger(index)||index<0||index>=70||window.arcaneStoryReview469)return false;
 tier=clamp(tier);
 const current=readWins();
 if(!isUnlocked(index,tier,current))return false;
 current[index]|=(1<<(tier-1));
 try{localStorage.setItem(WIN_KEY,JSON.stringify(current))}catch(e){console.warn('Story-Stufe nicht gespeichert:',e)}
 return true;
}
function choose(index,tier){
 // Auch direkte Aufrufe der Auswahl dürfen gesperrte Stufen nicht umgehen.
 tier=Math.min(clamp(tier),highestUnlocked(index));
 if(index>=30)window.arcaneStoryDifficultyExpanded469=tier;
 else if(index>=20)window.arcaneStoryDifficultyChapter3445=tier;
 else if(index>=10)window.arcaneStoryDifficultyChapter2444=tier;
 else window[PROPS[index]]=tier;
 window.arcaneStorySelectedDifficulty435={mission:index+1,chapter:Math.floor(index/10)+1,missionNumber:index%10+1,tier,label:LABELS[tier-1]};
 try{sessionStorage.setItem(TIER_KEY,String(tier));sessionStorage.setItem(MISSION_KEY,String(index))}catch(e){}
}
const oldApply=window.arcaneApplyStoryOpponent362;
window.arcaneApplyStoryOpponent362=function(index){
 let active=-1,tier=1;
 try{active=Number(sessionStorage.getItem(MISSION_KEY));tier=active===index?clamp(sessionStorage.getItem(TIER_KEY)):1}catch(e){}
 tier=active===index?Math.min(tier,highestUnlocked(index)):1;
 if(index>=30)window.arcaneStoryDifficultyExpanded469=tier;
 else if(index>=20)window.arcaneStoryDifficultyChapter3445=tier;
 else if(index>=10)window.arcaneStoryDifficultyChapter2444=tier;
 else if(PROPS[index])window[PROPS[index]]=tier;
 const ok=oldApply(index);
 if(ok&&window.arcaneStoryOpponentInfo362){
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
    if(pending!==null&&Number.isInteger(index)&&index>=0&&index<70){
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
 '.arcane-difficulty-option-435.is-locked{opacity:.57;filter:grayscale(.7);cursor:not-allowed;border-color:#66677d;background:linear-gradient(155deg,#29283c,#191b2e)}',
 '.arcane-difficulty-option-435.is-locked strong{color:#bab8ca}',
 '.arcane-difficulty-option-435:focus-visible{outline:3px solid #ffe2a3;outline-offset:2px}',
 '.arcane-difficulty-cancel-435{width:100%;padding:11px;margin-top:11px;background:#282b4b;color:#fff1d1;border:1px solid #9fa2c1;border-radius:9px;font-weight:800}',
 '@media(max-width:340px){.arcane-difficulty-panel-435{padding:11px}.arcane-difficulty-grid-435{gap:6px}.arcane-difficulty-option-435{padding:8px;min-height:155px}.arcane-difficulty-option-435 strong{font-size:16px}}'
].join('\n');
document.head.appendChild(style);
let ignoreButton=null,opened=false;
function missionIndex(){
 const title=document.getElementById('arcaneStoryHeading357')?.textContent||'';
 const match=title.match(/^([1-7])-(\d+)\s/);
 if(!match)return -1;
 const index=(Number(match[1])-1)*10+Number(match[2])-1;
 return Number.isInteger(index)&&index>=0&&index<70?index:-1;
}
function showChoice(index,continueButton){
 if(opened||index<0||index>=70)return;
 opened=true;
 const chapter=Math.floor(index/10)+1;
 const label=chapter+'-'+(index%10+1);
 const wins=readWins(),marks=wins[index];
 const maxTier=highestUnlocked(index,wins);
 // Nach einem Erfolg die nächste spielbare Stufe bevorzugen.
 let picked=window.arcaneStoryReview469?1:maxTier;
 try{
  if(Number(sessionStorage.getItem(MISSION_KEY))===index){
   const previous=clamp(sessionStorage.getItem(TIER_KEY));
   if(!(marks&(1<<(previous-1))))picked=Math.min(previous,maxTier);
  }
 }catch(_){}
 const story=document.getElementById('arcaneStoryContent357');
 const pageTitle=document.getElementById('arcaneStoryHeading357')?.textContent?.trim()||('Mission '+label);
 const speaker=story?.querySelector('.arcane-story-speaker-357')?.textContent?.trim()||'Erzähler';
 const storyLine=story?.querySelector('.arcane-story-line-357')?.textContent?.trim()||'Bereite dich auf dein nächstes Duell vor.';
 const image=story?.querySelector('.arcane-story-portrait-360.is-speaking-360 img:not([hidden])');
 const art=image?.getAttribute('src')||null;
 const chapterNames=['','Die Akademie von Arkanis','Der verlorene Wald','Die Aschengipfel','Die versunkene Stadt Nymaris','Das Königreich über den Wolken','Der zerbrochene Zeitpalast','Der Thron der Finsternis'];
 const modal=document.createElement('div');
 modal.id='arcaneStoryDifficulty435';
 modal.className='arcane-difficulty-overlay-435 arcane-briefing-overlay-465 is-chapter-'+chapter+'-465';
 modal.setAttribute('role','dialog');
 modal.setAttribute('aria-modal','true');
 modal.setAttribute('aria-labelledby','arcaneBriefTitle465');
 const panel=document.createElement('div');
 panel.className='arcane-briefing-panel-465';
 const top=document.createElement('div');
 top.className='arcane-briefing-heading-465';
 top.innerHTML='<div><p>✦ ARCANE DUEL · KAPITEL '+chapter+'</p><h2 id="arcaneBriefTitle465"></h2><div class="arcane-briefing-chapter-465"></div></div><button type="button" class="arcane-briefing-back-465">← Zurück</button>';
 top.querySelector('h2').textContent=pageTitle;
 top.querySelector('.arcane-briefing-chapter-465').textContent=chapterNames[chapter];
 const scene=document.createElement('div');
 scene.className='arcane-briefing-scene-465';
 scene.innerHTML='<div class="arcane-briefing-person-465"></div><div class="arcane-briefing-dialog-465"><strong class="arcane-briefing-speaker-465"></strong><blockquote></blockquote></div>';
 const portrait=scene.querySelector('.arcane-briefing-person-465');
 const fallback=()=>{
  portrait.replaceChildren();
  const avatar=document.createElement('span');
  avatar.className='arcane-briefing-avatar-465';
  avatar.textContent=speaker.slice(0,1)||'?';
  portrait.appendChild(avatar);
 };
 if(art){
  const img=document.createElement('img');
  img.alt=speaker;
  img.src=art;
  img.onerror=fallback;
  portrait.appendChild(img);
 }else fallback();
 scene.querySelector('.arcane-briefing-speaker-465').textContent=speaker;
 scene.querySelector('blockquote').textContent=storyLine;
 const heading=document.createElement('h3');
 heading.className='arcane-briefing-title-465';
 heading.textContent='✦ Schwierigkeitsgrad wählen ✦';
 const help=document.createElement('p');
 help.className='arcane-briefing-help-465';
 help.textContent=window.arcaneStoryReview469?'TESTMODUS: Alle vier Schwierigkeitsgrade können ausprobiert werden.':'Gewinne jede Stufe, um die nächste freizuschalten: Einsteiger → Fortgeschritten → Experte → Meister.';
 const grid=document.createElement('div');
 grid.className='arcane-difficulty-grid-435';
 const tierGlyphs=['⚔','⚔⚔','⚔⚔⚔','♛'];
 const buttons=[];
 for(let tier=1;tier<=4;tier++){
  const won=!!(marks&(1<<(tier-1))),unlocked=tier<=maxTier,button=document.createElement('button');
  button.type='button';
  button.dataset.tier=String(tier);
  button.className='arcane-difficulty-option-435 arcane-briefing-option-465'+(won?' is-cleared':'')+(tier===4?' is-master':'')+(!unlocked?' is-locked':'');
  button.disabled=!unlocked;
  button.setAttribute('aria-disabled',String(!unlocked));
  button.setAttribute('aria-pressed',String(tier===picked));
  const number=document.createElement('span');number.className='tier-number';number.textContent='STUFE '+tier+' · '+tierGlyphs[tier-1];
  const name=document.createElement('strong');name.textContent=LABELS[tier-1];
  const description=document.createElement('small');description.textContent=DETAILS[tier-1];
  const state=document.createElement('span');state.className='tier-state';
  state.textContent=window.arcaneStoryReview469?'🔎 Zum Testen verfügbar':!unlocked?'🔒 Erst '+LABELS[tier-2]+' besiegen':won?'✓ Auf dieser Stufe besiegt':'◇ Sieg noch offen';
  if(!unlocked)button.title='Besiege zuerst '+LABELS[tier-2]+' in dieser Mission.';
  button.append(number,name,description,state);
  button.addEventListener('click',()=>{
   if(!isUnlocked(index,tier))return;
   picked=tier;
   updatePicked();
  });
  buttons.push(button);grid.appendChild(button);
 }
 function updatePicked(){
  buttons.forEach((b,i)=>{
   const yes=i+1===picked;
   b.classList.toggle('is-picked-465',yes);
   b.setAttribute('aria-pressed',String(yes));
  });
 }
 const rewards=document.createElement('div');
 rewards.className='arcane-briefing-rewards-465';
 rewards.innerHTML=window.arcaneStoryReview469?'<strong>🔎 Testmodus</strong><span>Keine Belohnungen</span>':'<strong>🎁 Belohnungen</strong><span>✨ 100 EP</span><span><img class="arcane-currency-icon-502 arcane-currency-reward-502" src="artwork/currency/arkankristall-reward.avif" alt="Arkankristalle" decoding="async"> 50 Arkankristalle</span>';
 const note=document.createElement('p');
 note.className='arcane-briefing-note-465';
 note.textContent=window.arcaneStoryReview469?'Die Vorschau verändert weder deinen Story-Fortschritt noch deine Kristalle.':'Diese Belohnungen gibt es einmalig für den ersten Missionssieg. Jede der 4 Stufen hat einen eigenen Siegstatus.';
 const actions=document.createElement('div');
 actions.className='arcane-briefing-actions-465';
 actions.innerHTML='<button type="button" class="cancel">← Zurück</button><button type="button" class="start">⚔ Mission starten</button>';
 let active=true;
 function close(){
  if(!active)return;
  active=false;opened=false;
  modal.remove();
  document.removeEventListener('keydown',onKey);
  try{continueButton.focus({preventScroll:true})}catch(_){}
 }
 function onKey(event){if(event.key==='Escape'){event.preventDefault();close()}}
 function launch(){
  if(!active||!isUnlocked(index,picked))return;
  // The existing 4-tier deck selection and the original duel controls stay authoritative.
  choose(index,picked);
  close();
  ignoreButton=continueButton;
  continueButton.click();
 }
 top.querySelector('.arcane-briefing-back-465').addEventListener('click',close);
 actions.querySelector('.cancel').addEventListener('click',close);
 actions.querySelector('.start').addEventListener('click',launch);
 panel.append(top,scene,heading,help,grid,rewards,note,actions);
 modal.appendChild(panel);document.body.appendChild(modal);
 document.addEventListener('keydown',onKey);
 updatePicked();
 buttons[picked-1]?.focus({preventScroll:true});
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
window.arcaneStoryDifficultyUI435={tiers:LABELS.slice(),wins:readWins,unlocked:highestUnlocked,select:choose,missions:70};
})();
