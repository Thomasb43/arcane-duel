/* v4.49 – Kaels erster Spielstart, echtes interaktives Übungsduell. */
(function(){
"use strict";
const SEEN="arcane-first-play-449",PAID="arcane-tutorial-reward-449";
const $=id=>document.getElementById(id);
const home=$("arcaneHome307"),title=$("arcaneTitleScreen447");
if(!home||!title)return;
let active=false,finished=false,step=0,dialogIndex=0,timer=null,snapshot=null;
const read=(key)=>{try{return localStorage.getItem(key)==="1"}catch(e){return !!window["firstPlayMemory"+key]}};
const store=(key)=>{window["firstPlayMemory"+key]=true;try{localStorage.setItem(key,"1")}catch(e){}};
const oldStoryResult=window.arcaneStoryResult357;
window.arcaneStoryResult357=function(win,draw){if(active)return true;return typeof oldStoryResult==="function"?oldStoryResult(win,draw):false};
const css=document.createElement("style");
css.textContent='#firstWelcome449,#firstResult449{position:fixed;inset:0;z-index:120000;padding:12px;display:grid;place-items:center;background:radial-gradient(circle at center,#493164ed,#060713f5);color:#fff4d6}#firstWelcome449[hidden],#firstResult449[hidden],#firstHint449[hidden]{display:none!important}.firstBox449{box-sizing:border-box;width:min(95vw,490px);max-height:96svh;overflow:auto;background:linear-gradient(145deg,#242444,#111528 75%,#35213b);border:2px solid #e9c879;border-radius:15px;padding:15px;box-shadow:0 9px 45px #000d}.firstBox449 h2{text-align:center;font:900 clamp(18px,4vw,26px) Georgia,serif;color:#ffe19a;margin:0 0 10px}.firstPerson449{display:flex;gap:12px;align-items:center}.firstPerson449 img{width:clamp(70px,19vw,115px);aspect-ratio:3/4;object-fit:cover;border:2px solid #cba76b;border-radius:9px}.firstPerson449 p{line-height:1.5;font-size:clamp(12px,2.5vw,16px)}.firstBtns449{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}.firstBtns449 button{min-height:38px;padding:8px 13px;border:1px solid #e9c879;border-radius:9px;background:linear-gradient(130deg,#745097,#39214d);color:#ffedc0;font-weight:900;cursor:pointer}.firstBtns449 button.secondary{background:#171a2c;color:#d5c8e9}#firstHint449{position:fixed;z-index:100000;top:49px;right:8px;max-width:min(245px,55vw);background:#11172cf0;border:1px solid #dfc17c;border-radius:10px;padding:8px 10px;color:#fff4da;box-shadow:0 0 17px #9f61e777;font-size:clamp(10px,2vw,12px);line-height:1.3}#firstHint449 strong{color:#ffe29e}#firstHint449 p{margin:5px 0}#firstHint449 button{font-size:11px;color:#e2c0ff;background:none;border:0;text-decoration:underline;cursor:pointer;padding:3px}.firstGlow449{outline:3px solid #ffdf84!important;outline-offset:2px;box-shadow:0 0 19px #f2bc51aa!important}@media(max-height:480px){.firstBox449{padding:9px}.firstBox449 h2{margin-bottom:4px}.firstPerson449 img{width:65px}.firstPerson449 p{line-height:1.25;font-size:12px}.firstBtns449{margin-top:6px}}';
document.head.append(css);
const welcome=document.createElement("div");
welcome.id="firstWelcome449";welcome.hidden=true;welcome.setAttribute("role","dialog");welcome.setAttribute("aria-modal","true");
welcome.innerHTML='<div class="firstBox449"><h2>✦ Die Chronik erwacht ✦</h2><div class="firstPerson449"><img src="artwork/story/kael.jpg" alt="Kael"><p id="firstSpeech449"></p></div><div class="firstBtns449"><button class="secondary" id="firstSkip449">Überspringen</button><button id="firstNext449">Weiter</button></div></div>';
document.body.append(welcome);
const hint=document.createElement("div");hint.id="firstHint449";hint.hidden=true;
hint.innerHTML='<strong id="firstHintTitle449"></strong><p id="firstHintBody449"></p><button id="firstRetry449">Übung neu beginnen</button> · <button id="firstQuit449">Verlassen</button>';
document.body.append(hint);
const result=document.createElement("div");result.id="firstResult449";result.hidden=true;
result.innerHTML='<div class="firstBox449"><h2 id="firstResultTitle449">✦ Dein erster Sieg ✦</h2><div class="firstPerson449"><img src="artwork/story/kael.jpg" alt="Kael"><p id="firstResultBody449"></p></div><div class="firstBtns449"><button id="firstReturn449">Zur Stadt der Chronik</button></div></div>';
document.body.append(result);
const lines=[
 "Ich bin Kael. Willkommen in der Chronik! Dunkle Kräfte erwachen, und wir brauchen jeden Duellanten.",
 "Dein erstes Starterdeck steht bereit. Bevor wir die Welt erkunden, zeige ich dir unsere drei wichtigsten Aktionen.",
 "Sieh dir eine Karte an, beschwöre sie mit einer Wischbewegung und greife an. Deinen ersten Sieg verdienst du dir selbst!"
];
function showDialog(){ $("firstSpeech449").textContent=lines[dialogIndex];$("firstNext449").textContent=dialogIndex===2?"Übungsduell starten":"Weiter" }
function showWelcome(){if(active)return;dialogIndex=0;showDialog();home.hidden=true;title.hidden=true;welcome.hidden=false;$("firstNext449").focus({preventScroll:true})}
function toCity(){welcome.hidden=true;result.hidden=true;hint.hidden=true;home.hidden=false;title.hidden=true;const m=$("arcaneReturnMenu307");if(m)m.hidden=true;home.querySelector('[data-arcane-mode="story"]')?.focus({preventScroll:true})}
function snapshotBoard(){return {drawPile,hand,aiDeck,aiHand,aiTurn,myMon,mySpell,oppMon,oppSpell,myGraveyard,oppGraveyard,myLP,oppLP,turn,phase,normalSummonUsed,selected,chosenMonster,chosenTarget,chosenSpell,pendingPlacement,pendingTribute,pendingSwipeSummon,crystalShield}}
function restoreBoard(){
 if(!snapshot)return;
 ({drawPile,hand,aiDeck,aiHand,aiTurn,myMon,mySpell,oppMon,oppSpell,myGraveyard,oppGraveyard,myLP,oppLP,turn,phase,normalSummonUsed,selected,chosenMonster,chosenTarget,chosenSpell,pendingPlacement,pendingTribute,pendingSwipeSummon,crystalShield}=snapshot);
 snapshot=null;$("duelOutcome306")?.remove();render();
}
function glow(selector){document.querySelectorAll(".firstGlow449").forEach(e=>e.classList.remove("firstGlow449"));document.querySelector(selector)?.classList.add("firstGlow449")}
function guide(n){
 step=n;
 $("firstHintTitle449").textContent=["1 / 3 · Karte prüfen","2 / 3 · Beschwören","3 / 3 · Angreifen"][n];
 $("firstHintBody449").textContent=[
  "Tippe die erste Handkarte, deinen Siegelritter, an. Schließe anschließend die große Kartenansicht.",
  "Ziehe den Siegelritter auf eine freie eigene Monsterzone. Wähle dort „Offen“.",
  "Wische deinen offenen Siegelritter auf den schwächeren gegnerischen Arkanen Lehrling. So machst du Kampfschaden."
 ][n];hint.hidden=false;glow(n===0?'#hand [data-card="0"]':n===1?"#myMon":'#myMon [data-index="0"]');
}
function card(name){const c=deck.find(x=>x.name===name);return c?{...c}:null}
function startDuel(){
 const knight=card("Siegelritter"),rival=card("Arkaner Lehrling");
 if(!knight||!rival){$("firstSpeech449").textContent="Die Tutorialkarten fehlen. Bitte aktualisiere die Test-App.";return}
 if(!active){snapshot=snapshotBoard();active=true}
 finished=false;welcome.hidden=true;result.hidden=true;home.hidden=true;title.hidden=true;
 const menu=$("arcaneReturnMenu307");if(menu)menu.hidden=false;
 drawPile=createDuelDeck();hand=["Siegelritter","Arkaner Lehrling","Lichtfalke","Runenwissen","Kristallschild"].map(card).filter(Boolean);
 aiDeck=[];aiHand=[];aiTurn=0;myMon=Array(4).fill(null);mySpell=Array(4).fill(null);oppMon=Array(4).fill(null);oppSpell=Array(4).fill(null);
 oppMon[0]={...rival,position:"attack",faceDown:false,summonedTurn:-1,attacksThisTurn:0};
 myGraveyard=[];oppGraveyard=[];myLP=4000;oppLP=500;turn=1;phase="main1";
 normalSummonUsed=false;crystalShield=false;selected=-1;chosenMonster=-1;chosenTarget=-1;chosenSpell=-1;pendingTribute=null;pendingPlacement=null;pendingSwipeSummon=null;
 try{closeHandPreview336();closeCardInfo()}catch(e){}
 render();guide(0);log("Kaels Tutorial: Tippe zuerst den Siegelritter an.");
 clearInterval(timer);timer=setInterval(watch,220);
}
function win(){
 if(finished)return;finished=true;hint.hidden=true;glow("#nothing");
 let reward=false;
 if(!read(PAID)){store(PAID);reward=true}
 if(reward&&window.arcaneTestCrystals320){let b=window.arcaneTestCrystals320;b.set(b.get()+100);b.refresh()}
 store(SEEN);
 $("firstResultTitle449").textContent="✦ Dein erster Sieg! ✦";
 $("firstResultBody449").textContent="Kael: Großartig! Du hast deine erste Karte geprüft, ein Monster beschworen und echten Kampfschaden verursacht. "+(reward?"Du erhältst einmalig 100 Arkankristalle! ":"Deine Tutorial-Belohnung ist bereits abgeholt. ")+"Jetzt beginnt deine Reise: Starte Story-Mission 1-1.";
 result.hidden=false;$("firstReturn449").focus({preventScroll:true});
}
function watch(){
 if(!active||finished)return;
 if(oppLP<=0){win();return}
 if(myLP<=0){finished=true;hint.hidden=true;$("firstResultTitle449").textContent="✦ Weiter üben ✦";$("firstResultBody449").textContent="Kael: Versuch es erneut. Deine bisherigen Spielstände bleiben erhalten.";result.hidden=false;return}
 if(step===0&&document.querySelector(".arcane-hand-preview-336"))guide(1);
 if(step<=1&&myMon.some(x=>x&&x.name==="Siegelritter"&&!x.faceDown&&x.position==="attack"))guide(2);
}
function stop(){
 clearInterval(timer);timer=null;active=false;finished=false;
 hint.hidden=true;welcome.hidden=true;result.hidden=true;glow("#nothing");restoreBoard();
}
document.addEventListener("click",e=>{
 const btn=e.target.closest?.("#arcaneIntroStart308");
 if(!btn||read(SEEN))return;
 e.preventDefault();e.stopImmediatePropagation();showWelcome();
},true);
$("firstNext449").addEventListener("click",()=>{if(dialogIndex<2){dialogIndex++;showDialog()}else startDuel()});
$("firstSkip449").addEventListener("click",()=>{store(SEEN);stop();toCity()});
$("firstQuit449").addEventListener("click",()=>{store(SEEN);stop();toCity()});
$("firstRetry449").addEventListener("click",startDuel);
$("firstReturn449").addEventListener("click",()=>{store(SEEN);stop();toCity()});
const repeat=document.createElement("button");repeat.id="firstRepeat449";repeat.textContent="✦ Tutorial";repeat.type="button";
repeat.style.cssText="position:absolute;z-index:4;right:10px;bottom:10px;border:1px solid #e5c47c;background:#29203de8;border-radius:9px;padding:8px;color:#ffe4ac;font-weight:800;cursor:pointer";
home.querySelector(".arcane-home-shell-307")?.append(repeat);
repeat.addEventListener("click",showWelcome);
window.arcaneFirstPlay449={open:showWelcome,completed:()=>read(SEEN)};
})();