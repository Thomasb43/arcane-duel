/* Arcane Duel v4.32 – Gefallener Eldric, final boss of story chapter 1.
   50 collectible copies of 17 original designs; four valid 30-card tiers.
   Uses the existing duel engine and explicitly implements monster, AI spell,
   and AI reaction-trap effects. No external binary image upload required. */
(function installEldricFinalBoss432(){
 "use strict";
 const defs=[
  ["Siegelakolyth Theron","monster",2,800,1300,"draw1","Bei offener Beschwörung: Ziehe 1 Karte.","📜"],
  ["Verdorbener Runenwolf","monster",3,1400,1100,"weak300","Bei offener Beschwörung: Das stärkste offene gegnerische Monster verliert 300 ATK.","🐺"],
  ["Obsidian-Wächter","monster",4,1300,2000,"selfdef300","Bei offener Beschwörung: Diese Karte erhält 300 DEF.","🗿"],
  ["Arkaner Ketzer","monster",4,1700,1100,"selfatk200","Bei offener Beschwörung: Diese Karte erhält 200 ATK.","🧙"],
  ["Chronomant der Leere","monster",4,1500,1450,"draw1","Bei offener Beschwörung: Ziehe 1 Karte.","⌛"],
  ["Fluchritter Draven","monster",4,1800,1250,"weak400","Bei offener Beschwörung: Das stärkste offene gegnerische Monster verliert 400 ATK.","⚔️"],
  ["Seelensiegel-Hüterin","monster",4,1400,1700,"heal300","Bei offener Beschwörung: Erhalte 300 LP.","🕯️"],
  ["Abgrundsarchivar","monster",6,2300,1900,"allyatk300","Bei offener Beschwörung: Ein eigenes offenes Eldric-Monster erhält 300 ATK.","📖"],
  ["Eldric, Träger des letzten Siegels","monster",8,2950,2400,"boss","Benötigt 2 Tribute. Bei offener Beschwörung: Das stärkste offene gegnerische Monster verliert 500 ATK; der Gegner verliert 300 LP.","👑"],
  ["Verbotenes Ritual","spell",0,0,0,"draw2","Ziehe 2 Karten.","🔮"],
  ["Siegelbruch","spell",0,0,0,"weak500","Das stärkste offene gegnerische Monster verliert 500 ATK.","💥"],
  ["Dunkle Offenbarung","spell",0,0,0,"atk500","Ein eigenes offenes Monster erhält 500 ATK.","🌌"],
  ["Seelensteuer","spell",0,0,0,"burn300","Der Gegner verliert 300 LP.","🩸"],
  ["Fluch der Ewigkeit","spell",0,0,0,"heal600","Erhalte 600 LP.","🕯️"],
  ["Gebrochenes Schutzsiegel","trap",0,0,0,"stopweak400","Wenn der Gegner angreift (frühestens im nächsten eigenen Zug): Stoppe den Angriff; der Angreifer verliert 400 ATK.","🛡️"],
  ["Letzter Bannkreis","trap",0,0,0,"stopburn200","Wenn der Gegner angreift (frühestens im nächsten eigenen Zug): Stoppe den Angriff und füge ihm 200 LP Schaden zu.","⛓️"],
  ["Echo des gefallenen Direktors","trap",0,0,0,"stopheal300","Wenn der Gegner angreift (frühestens im nächsten eigenen Zug): Stoppe den Angriff; erhalte 300 LP.","⏳"]
 ];
 const names=defs.map(x=>x[0]);
 const quantities=names.map((name,i)=>[name,i===8?2:3]);
 const counts=new Map(quantities);
 const cards=defs.map(([name,kind,level,atk,def,fx,effectText,emoji])=>({
   name,kind,...(kind==="monster"?{level,atk,def,element:"Verbotene Siegelmagie",race:"Gefallene Siegelwesen"}:{}),
   emoji,skin:"shadow",eldricOriginal:true,eldricFx:fx,effectText,
   ...(kind!=="monster"?{desc:effectText}:{})
 }));
 if(quantities.reduce((s,[,n])=>s+n,0)!==50||cards.length!==17)throw Error("Eldric pool invalid");
 if(!Array.isArray(deck))throw Error("Arcane Duel base deck not found");
 for(const card of cards)if(!deck.some(c=>c.name===card.name))deck.push(card);
 const tiers=[
  {label:"Einsteiger",n:[0,1,2,3,4,5,9,12,14,15]},
  {label:"Fortgeschritten",n:[0,1,2,3,4,6,9,10,14,16]},
  {label:"Experte",n:[1,2,3,4,5,7,9,10,15,16]},
  {label:"Endgegner",n:[0,1,2,3,4,5,9,11,15],boss:[8,2],extra:[10,1]}
 ];
 function create(level=4){
  const selection=Math.max(1,Math.min(4,Math.trunc(Number(level)||4)));
  const tier=tiers[selection-1],chosen=new Map(tier.n.map(i=>[names[i],3]));
  if(tier.boss)chosen.set(names[tier.boss[0]],tier.boss[1]);
  if(tier.extra)chosen.set(names[tier.extra[0]],tier.extra[1]);
  const result=[];
  for(const [name,n] of chosen){
   if(!n||n>3||n>counts.get(name))throw Error("Eldric copy limit: "+name);
   const base=deck.find(c=>c.name===name&&c.eldricOriginal);
   if(!base)throw Error("Missing Eldric card: "+name);
   for(let k=0;k<n;k++)result.push({...base});
  }
  if(result.length!==30)throw Error("Eldric 30-card deck invalid: "+result.length);
  const mixed=shuffleCards(result);
  // On the final tier, ensure the iconic boss can appear after both tributes
  // are available instead of relying on a very unlikely random early draw.
  if(selection===4){
   const boss=mixed.findIndex(c=>c.eldricFx==="boss");
   if(boss>=0){const [key]=mixed.splice(boss,1);mixed.splice(6,0,key);}
  }
  return mixed;
 }
 window.arcaneEldricDeck432={
  pool:quantities.map(([name,count])=>({name,count})),
  tiers:tiers.map((tier,i)=>({level:i+1,label:tier.label})),create
 };
 const priorApply=window.arcaneApplyStoryOpponent362;
 if(typeof priorApply!=="function")throw Error("Arcane Duel story deck hook missing");
 window.arcaneApplyStoryOpponent362=function(index){
  if(index!==9)return priorApply(index);
  aiDeck=create(window.arcaneStoryDifficulty432||4);
  aiHand=aiDeck.splice(0,5);
  aiTurn=0;
  window.arcaneStoryOpponentInfo362={
    name:"Eldric",theme:"Verbotene Siegelmagie",deckSize:30,
    poolSize:50,difficulty:Math.max(1,Math.min(4,Number(window.arcaneStoryDifficulty432)||4)),difficultyReady:4
  };
  return true;
 };
 const previousMonster=triggerMonsterEvent;
 triggerMonsterEvent=function(card,event,owner="player",index=-1){
  previousMonster(card,event,owner,index);
  if(!card?.eldricOriginal||card.kind!=="monster"||event!=="summon"||card.faceDown)return;
  const allies=owner==="opponent"?oppMon:myMon,foes=owner==="opponent"?myMon:oppMon,fx=card.eldricFx;
  const strongest=foes.filter(m=>m&&!m.faceDown).sort((a,b)=>effectiveAtk(b)-effectiveAtk(a))[0];
  if(fx==="draw1"){const pile=owner==="opponent"?aiDeck:drawPile,to=owner==="opponent"?aiHand:hand,next=pile.shift();if(next)to.push(next);}
  else if(fx==="weak300"||fx==="weak400"){if(strongest)strongest.tempAtkBonus=(strongest.tempAtkBonus||0)-(fx==="weak300"?300:400);}
  else if(fx==="selfdef300")card.tempDefBonus=(card.tempDefBonus||0)+300;
  else if(fx==="selfatk200")card.tempAtkBonus=(card.tempAtkBonus||0)+200;
  else if(fx==="heal300"){if(owner==="opponent")oppLP+=300;else myLP+=300;}
  else if(fx==="allyatk300"){const ally=allies.find(c=>c&&c.eldricOriginal&&!c.faceDown&&c!==card)||card;ally.tempAtkBonus=(ally.tempAtkBonus||0)+300;}
  else if(fx==="boss"){
   if(strongest)strongest.tempAtkBonus=(strongest.tempAtkBonus||0)-500;
   if(owner==="opponent")myLP=Math.max(0,myLP-300);else oppLP=Math.max(0,oppLP-300);
  }
  log("🔮 "+card.name+" entfesselt verbotene Siegelmagie.");
 };
 const previousTrap=activateAstraTrap417;
 activateAstraTrap417=function(...args){
  if(window.arcaneStoryOpponentInfo362?.name==="Eldric"){
   const i=oppSpell.findIndex(c=>c&&c.eldricOriginal&&c.kind==="trap"&&aiTurn>c.setTurn);
   if(i>=0){
    const c=oppSpell[i];oppSpell[i]=null;sendToGraveyard(c,"opponent");
    if(c.eldricFx==="stopburn200")myLP=Math.max(0,myLP-200);
    else if(c.eldricFx==="stopheal300")oppLP+=300;
    else if(c.eldricFx==="stopweak400"){
     const attacking=myMon[chosenMonster];
     if(attacking)attacking.tempAtkBonus=(attacking.tempAtkBonus||0)-400;
    }
    log("⛓️ Eldric aktiviert "+c.name+" und stoppt den Angriff.");
    return true;
   }
  }
  return previousTrap(...args);
 };
 const previousTurn=opponentTurn;
 opponentTurn=async function(...args){
  if(window.arcaneStoryOpponentInfo362?.name==="Eldric"&&myLP>0&&oppLP>0){
   const spells=aiHand.map((c,i)=>({c,i})).filter(x=>x.c.eldricOriginal&&x.c.kind==="spell");
   const foe=myMon.filter(m=>m&&!m.faceDown).sort((a,b)=>effectiveAtk(b)-effectiveAtk(a))[0];
   const ally=oppMon.filter(m=>m&&!m.faceDown).sort((a,b)=>effectiveAtk(b)-effectiveAtk(a))[0];
   const selected=spells.find(x=>x.c.eldricFx==="weak500"&&foe)
    ||spells.find(x=>x.c.eldricFx==="atk500"&&ally)
    ||spells.find(x=>x.c.eldricFx==="draw2")
    ||spells.find(x=>x.c.eldricFx==="heal600"&&oppLP<=3400)
    ||spells.find(x=>x.c.eldricFx==="burn300");
   if(selected){
    const c=aiHand.splice(selected.i,1)[0],fx=c.eldricFx;
    if(fx==="weak500"&&foe)foe.tempAtkBonus=(foe.tempAtkBonus||0)-500;
    if(fx==="atk500"&&ally)ally.tempAtkBonus=(ally.tempAtkBonus||0)+500;
    if(fx==="draw2")for(let n=0;n<2;n++){const d=aiDeck.shift();if(d)aiHand.push(d);}
    if(fx==="heal600")oppLP+=600;
    if(fx==="burn300")myLP=Math.max(0,myLP-300);
    sendToGraveyard(c,"opponent");
    log("🔮 Eldric aktiviert "+c.name+".");
   }
  }
  return previousTurn.apply(this,args);
 };
 const priorArt=renderCardArt;
 renderCardArt=function(card){
  if(!card?.eldricOriginal)return priorArt(card);
  const i=names.indexOf(card.name),accent=["#c78fe8","#92a1f6","#edb88f","#af90f9","#9cc4ec","#ec97ad","#f4cf89","#c5a7fa","#ffe099","#d0afff","#ed98ba","#98bffd","#f49a9a","#a2f0df","#bfa6eb","#e6b779","#cbb0ff"][i]||"#c9a1f0";
  const symbol=["✦","◇","✣","❖","⌛","✧","✷","◈","♛","⟁","✴","✦","◉","✧","◇","❖","✣"][i]||"✧";
  const figure=card.kind==="monster"
   ?'<g fill="#0e1124" stroke="'+accent+'" stroke-width="3"><path d="M122 293Q88 255 80 202L110 179 107 120 133 101 150 116 172 100 193 120 190 179 220 202Q212 257 178 293Z"/><path d="M104 155Q100 95 150 80Q200 95 196 155L175 177 125 177Z" fill="#27203e"/><path d="M81 208L42 272 96 256 118 217M219 208L258 272 204 256 182 217" fill="#1d1630"/><path d="M137 146h10m6 0h10" stroke-width="5"/></g>'
   :'<g fill="none" stroke="'+accent+'" stroke-width="6"><circle cx="150" cy="190" r="75"/><circle cx="150" cy="190" r="48" stroke-dasharray="6 8"/><path d="M150 104v173M64 190h173M90 130l121 121M210 130L90 251"/></g><path d="M150 143l46 47-46 47-46-47Z" fill="#1f1a3b" stroke="'+accent+'" stroke-width="5"/>';
  const crown=i===8?'<path d="M112 112L86 52 128 80 150 40 171 80 214 52 187 112Z" fill="#b9954c" stroke="#ffe5b0" stroke-width="4"/>':'';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><radialGradient id="bg"><stop stop-color="#50306d"/><stop offset=".7" stop-color="#251631"/><stop offset="1" stop-color="#0c0c21"/></radialGradient></defs><rect width="300" height="400" fill="url(#bg)"/><path d="M25 400V123Q150-51 275 123V400M45 400V139Q150-3 255 139V400" fill="none" stroke="'+accent+'" stroke-opacity=".53" stroke-width="7"/><g fill="none" stroke="'+accent+'" opacity=".5"><circle cx="150" cy="190" r="116"/><circle cx="150" cy="190" r="104" stroke-dasharray="3 11"/><path d="M32 190H268M150 69V327"/></g>'+figure+crown+'<g fill="'+accent+'" opacity=".9"><text x="50" y="100" font-size="29">'+symbol+'</text><text x="231" y="316" font-size="29">'+symbol+'</text><circle cx="35" cy="270" r="3"/><circle cx="269" cy="90" r="3"/></g><path d="M17 381h266M17 18h266" stroke="'+accent+'" stroke-width="5" opacity=".8"/></svg>';
  return '<img src="data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)+'" alt="" loading="eager" style="width:100%;height:100%;display:block;object-fit:cover">';
 };
 window.arcaneEldricInstalled432=true;
})();
