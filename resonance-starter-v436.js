/* Arcane Duel v4.36 – Chronoresonanz: Klang der Sphären
   30 thematic main-deck cards + 3 separately summoned Resonance bosses.
   This module registers data before the main duel loads. Call its install()
   function after the main application has initialized.
*/
(function(){
'use strict';
const specs=[
 ['Sternklang-Novizin','monster',2,700,1100,'draw1',true,'🎼','Resonator. Bei offener Beschwörung ziehe 1 Karte. Kann für Resonanzbeschwörungen verwendet werden.'],
 ['Echo-Dirigent','monster',3,1100,1200,'def200',true,'🎵','Resonator. Bei offener Beschwörung erhält ein eigenes offenes Chronoresonanzmonster 200 DEF.'],
 ['Sphärenritter','monster',4,1700,1200,'atk200',false,'⚔️','Bei offener Beschwörung erhält dieses Monster 200 ATK, falls du einen offenen Chronoresonanz-Resonator kontrollierst.'],
 ['Kristall-Echowächter','monster',4,1200,1900,'def300',false,'🔔','Bei offener Beschwörung erhält diese Karte 300 DEF.'],
 ['Wellenluchs','monster',3,1400,1100,'search',false,'🐈','Bei offener Beschwörung: Nimm 1 Chronoresonanz-Resonator von deinem Deck auf die Hand.'],
 ['Obertongeist','monster',2,900,1300,'heal200',false,'✨','Bei offener Beschwörung erhältst du 200 LP.'],
 ['Echomelodie','spell',0,0,0,'draw',false,'🎶','Ziehe 1 Karte. Kontrollierst du einen offenen Chronoresonanz-Resonator, ziehe 1 weitere Karte.'],
 ['Sphärenruf','spell',0,0,0,'search',false,'🎺','Nimm 1 Chronoresonanz-Resonator von deinem Deck auf die Hand.'],
 ['Resonanz-Reprise','spell',0,0,0,'revive',false,'🪄','Beschwöre 1 Chronoresonanzmonster der Stufe 4 oder niedriger aus deinem Friedhof in offener Verteidigungsposition. Es kann in diesem Zug nicht angreifen.'],
 ['Oberton-Segen','spell',0,0,0,'boost',false,'🌠','Ein eigenes offenes Resonanzmonster aus dem Extra-Deck erhält 400 ATK.'],
 ['Taktwende','trap',0,0,0,'guard',false,'🛡️','Ab dem nächsten eigenen Zug manuell aktivierbar: Ein eigener offener Chronoresonanz-Resonator erhält 400 DEF.'],
 ['Gegenhall','trap',0,0,0,'stop',false,'🔊','Ab dem nächsten eigenen Zug manuell aktivierbar: Der nächste gegnerische Angriff wird annulliert.'],
 ['Echostille','trap',0,0,0,'ward',false,'🔕','Ab dem nächsten eigenen Zug manuell aktivierbar: Alle eigenen offenen Resonanzmonster erhalten jeweils 300 ATK.']
];
const quantities=[3,3,3,3,3,3,2,2,2,1,2,2,1];
const cards=specs.map(([name,kind,level,atk,def,fx,resonator,emoji,effectText])=>({
 name,kind,...(kind==='monster'?{level,atk,def,resonator,element:'Klang',race:'Klangwesen'}:{}),
 resonanceShop:true,fx,emoji,skin:kind==='monster'?'ice':'spell',effectText
}));
const recipe=cards.map((c,i)=>[c.name,quantities[i]]);
const extra=[
 {name:'Resonanzhüter Auralis',level:5,atk:1950,def:2200,emoji:'🛡️',fx:'heal300',effectText:'Resonanzbeschwörung: Ein offener Chronoresonanz-Resonator plus ein weiteres offenes Chronoresonanzmonster, Levelsumme 5. Bei Beschwörung erhältst du 300 LP.'},
 {name:'Sphärendrache Cantaris',level:6,atk:2450,def:2000,emoji:'🐉',fx:'backrow',effectText:'Resonanzbeschwörung: Ein offener Chronoresonanz-Resonator plus ein weiteres offenes Chronoresonanzmonster, Levelsumme 6. Bei Beschwörung zerstöre 1 gegnerische gesetzte Zauber-/Fallenkarte.'},
 {name:'Harmoniekaiser Solarys',level:7,atk:2850,def:2400,emoji:'👑',fx:'weak500',effectText:'Resonanzbeschwörung: Ein offener Chronoresonanz-Resonator plus ein weiteres offenes Chronoresonanzmonster, Levelsumme 7. Bei Beschwörung verliert das stärkste offene gegnerische Monster 500 ATK.'}
].map(c=>({...c,kind:'monster',element:'Klang',race:'Resonanz',recipe:'chronoresonanz',resonance:true,resonanceShop:true,skin:'ice'}));
const sum=recipe.reduce((n,[,q])=>n+q,0);
if(sum!==30||new Set(cards.map(c=>c.name)).size!==cards.length||cards.length!==13||extra.length!==3||quantities.some(n=>n>3))throw Error('Chronoresonanz recipe invalid');
const ID='chronoresonanz-starter';
const getStored=()=>{try{return JSON.parse(localStorage.getItem('arcane-duel-managed-decks-v1')||'null')}catch(_){return null}};
const active=()=>getStored()?.active===ID;
window.ARCANE_CHRONORESONANZ_436={
 cards,recipe,extra,id:ID,name:'Chronoresonanz – Klang der Sphären',active,install
};
function install(){
 if(window.__chronoresonanz436Installed)return;
 window.__chronoresonanz436Installed=true;
 // Core engine functions are top-level bindings in the inline game script.
 const prevMaterials=availableResonanceMaterials;
 availableResonanceMaterials=function(card){
  if(card?.recipe!=='chronoresonanz')return prevMaterials(card);
  if(!isMainPhase())return null;
  for(let a=0;a<myMon.length;a++){
   const m=myMon[a];
   if(!m||m.faceDown||!m.resonanceShop||!m.resonator)continue;
   for(let b=0;b<myMon.length;b++){
    const other=myMon[b];
    if(a!==b&&other&&!other.faceDown&&other.resonanceShop&&!other.resonance&&m.level+other.level===card.level)return [a,b];
   }
  }
  return null;
 };
 const prevRequirement=resonanceRequirement;
 resonanceRequirement=function(card){
  return card?.recipe==='chronoresonanz'
   ?'Chronoresonanz-Resonator + offenes Chronoresonanzmonster, Levelsumme '+card.level
   :prevRequirement(card);
 };
 const prevSummon=summonResonanceTest;
 summonResonanceTest=function(index=0){
  const c=resonanceExtraDeck[index],materials=c?.resonanceShop?availableResonanceMaterials(c):null;
  const oldLP=myLP;
  prevSummon(index);
  if(!c?.resonanceShop||!materials||!myMon.some(m=>m&&m.name===c.name))return;
  if(c.fx==='heal300'){myLP+=300;log('🎼 '+c.name+': Du erhältst 300 LP.');}
  if(c.fx==='backrow'){
   const i=oppSpell.findIndex(m=>m&&m.faceDown);
   if(i>=0){sendToGraveyard(oppSpell[i],'opponent');oppSpell[i]=null;log('🎼 '+c.name+': Eine gesetzte gegnerische Karte wurde zerstört.');}
  }
  if(c.fx==='weak500'){
   const m=oppMon.filter(x=>x&&!x.faceDown).sort((a,b)=>effectiveAtk(b)-effectiveAtk(a))[0];
   if(m){m.tempAtkBonus=(m.tempAtkBonus||0)-500;log('🎼 '+c.name+': Das stärkste gegnerische Monster verliert 500 ATK.');}
  }
  render();
 };
 const prevMonster=triggerMonsterEvent;
 triggerMonsterEvent=function(card,event,owner='player',index=-1){
  prevMonster(card,event,owner,index);
  if(!card?.resonanceShop||card.resonance||card.kind!=='monster'||event!=='summon'||card.faceDown)return;
  const own=owner==='opponent'?oppMon:myMon;
  if(card.fx==='draw1'){
   const pile=owner==='opponent'?aiDeck:drawPile,to=owner==='opponent'?aiHand:hand,next=pile.shift();
   if(next)to.push(next);
  }else if(card.fx==='def200'){
   const ally=own.find(m=>m&&m.resonanceShop&&m!==card&&!m.faceDown)||card;
   ally.tempDefBonus=(ally.tempDefBonus||0)+200;
  }else if(card.fx==='atk200'){
   if(own.some(m=>m&&m!==card&&m.resonator&&m.resonanceShop&&!m.faceDown))card.tempAtkBonus=(card.tempAtkBonus||0)+200;
  }else if(card.fx==='def300')card.tempDefBonus=(card.tempDefBonus||0)+300;
  else if(card.fx==='search'){
   const pile=owner==='opponent'?aiDeck:drawPile,to=owner==='opponent'?aiHand:hand;
   const i=pile.findIndex(m=>m.resonanceShop&&m.resonator);
   if(i>=0){to.push(pile.splice(i,1)[0]);shuffleCards(pile);}
  }else if(card.fx==='heal200'){if(owner==='opponent')oppLP+=200;else myLP+=200;}
  log('🎼 '+card.name+' aktiviert seinen Resonanzeffekt.');
 };
 function playEffect(c,slot){
  const own=myMon.filter(m=>m&&!m.faceDown),tuners=own.filter(m=>m.resonanceShop&&m.resonator),bosses=own.filter(m=>m.resonanceShop&&m.resonance);
  const used=()=>{sendToGraveyard(c);mySpell[slot]=null;chosenSpell=-1;render()};
  if(c.kind==='trap'&&turn<=c.setTurn){log('Diese Falle kann erst ab deinem nächsten Zug manuell aktiviert werden.');return;}
  switch(c.fx){
   case 'draw':{
    const limit=tuners.length?2:1;let n=0;
    for(let i=0;i<limit;i++){const d=drawPile.shift();if(d){hand.push(d);newlyDrawnCard=d;n++;}}
    used();log('🎶 Echomelodie: '+n+' Karte(n) gezogen.');return;
   }
   case 'search':{
    const i=drawPile.findIndex(m=>m.resonanceShop&&m.resonator);
    if(i<0){log('Sphärenruf: Kein Resonator mehr im Deck.');return;}
    hand.push(drawPile.splice(i,1)[0]);shuffleCards(drawPile);used();log('🎺 Sphärenruf: Resonator auf die Hand genommen.');return;
   }
   case 'revive':{
    const zone=myMon.findIndex(x=>!x),i=myGraveyard.findLastIndex(m=>m.kind==='monster'&&m.resonanceShop&&!m.resonance&&m.level<=4);
    if(zone<0||i<0){log('Resonanz-Reprise benötigt eine freie Monsterzone und ein Chronoresonanzmonster im Friedhof.');return;}
    const m=myGraveyard.splice(i,1)[0];delete m.tempAtkBonus;delete m.tempDefBonus;m.position='defense';m.faceDown=false;m.summonedTurn=turn;m.attacksThisTurn=1;myMon[zone]=m;
    used();log('🪄 Resonanz-Reprise: '+m.name+' wurde als Resonanzmaterial zurückgeholt.');return;
   }
   case 'boost':{
    if(!bosses.length){log('Oberton-Segen benötigt ein offenes Resonanzmonster.');return;}
    const best=bosses.sort((a,b)=>effectiveAtk(b)-effectiveAtk(a))[0];best.tempAtkBonus=(best.tempAtkBonus||0)+400;
    used();log('🌠 Oberton-Segen: '+best.name+' erhält 400 ATK.');return;
   }
   case 'guard':{
    if(!tuners.length){log('Taktwende benötigt einen offenen Resonator.');return;}
    tuners[0].tempDefBonus=(tuners[0].tempDefBonus||0)+400;used();log('🛡️ Taktwende: Resonator erhält 400 DEF.');return;
   }
   case 'stop':{
    kaelNegateAttack367=true;used();log('🔊 Gegenhall: Nächster gegnerischer Angriff wird annulliert.');return;
   }
   case 'ward':{
    if(!bosses.length){log('Echostille benötigt ein offenes Resonanzmonster.');return;}
    bosses.forEach(m=>m.tempAtkBonus=(m.tempAtkBonus||0)+300);
    used();log('🔕 Echostille: Deine Resonanzmonster erhalten 300 ATK.');return;
   }
  }
 }
 const activateButton=document.getElementById('activate');
 const oldClick=activateButton.onclick;
 activateButton.onclick=function(...args){
  const card=chosenSpell>=0?mySpell[chosenSpell]:null;
  if(!card?.resonanceShop)return oldClick.apply(this,args);
  if(!isMainPhase()){log('Zauber und Fallen können nur in einer Hauptphase aktiviert werden.');return;}
  playEffect(card,chosenSpell);
 };
 const oldArt=renderCardArt;
 renderCardArt=function(c){
  if(!c?.resonanceShop)return oldArt(c);
  // v4.37: Use original cropped card illustrations. Existing vector art remains a fallback.
  const art437=window.ARCANE_CHRONORESONANZ_ART_437?.[c.name];
  if(art437){
   return '<span class="chronoresonanz-original-art-437" role="img" aria-label="'+String(c.name).replace(/"/g,'&quot;')+'" style="display:block;width:100%;height:100%;overflow:hidden;background:#131c3a">'
    +'<img src="'+art437+'" alt="" loading="eager" decoding="async" style="display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center center!important">'
    +'</span>';
  }
  const i=cards.findIndex(x=>x.name===c.name),j=extra.findIndex(x=>x.name===c.name),pos=i<0?13+j:i;
  const colors=['#c5edfc','#ded3ff','#f6e3ac','#a8e9ed','#adc8ff','#ecbeff'],color=colors[Math.max(0,pos)%colors.length];
  const glyph=c.resonance?'✦':c.kind==='monster'?(c.resonator?'♫':'◇'):c.kind==='trap'?'❖':'✧';
  const scene=c.kind==='monster'
   ?'<path d="M126 105l24-25 24 25 20 42-12 40 40 112-42-27-30 56-30-56-42 27 40-112-12-40Z" fill="#182643" stroke="'+color+'" stroke-width="4"/>'
   :'<circle cx="150" cy="194" r="63" fill="#132745" stroke="'+color+'" stroke-width="7"/><path d="M150 137l55 55-55 55-55-55Z" fill="none" stroke="'+color+'" stroke-width="5"/>';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><radialGradient id="bg"><stop stop-color="#445e93"/><stop offset=".72" stop-color="#182a52"/><stop offset="1" stop-color="#0f112a"/></radialGradient></defs><rect width="300" height="400" fill="url(#bg)"/><g fill="none" stroke="'+color+'"><circle cx="150" cy="193" r="118" stroke-width="4"/><circle cx="150" cy="193" r="105" stroke-dasharray="6 8"/><path d="M150 28v340M25 193h250M55 97l190 192M245 97L55 289" opacity=".48"/></g>'+scene+'<text x="150" y="217" text-anchor="middle" font-size="49" font-family="Georgia" fill="'+color+'">'+glyph+'</text><path d="M24 24h252M24 376h252" stroke="'+color+'" stroke-width="5"/></svg>';
  return '<img src="data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)+'" alt="" loading="eager" style="display:block;width:100%;height:100%;object-fit:cover">';
 };
 // The existing shop has a two-product list. Add one working product to it
 // without changing or breaking its original purchase handlers.
 const shop=document.getElementById('arcaneShop320');
 const productGrid=shop?.querySelector('#arcaneStarterProducts375');
 const details=shop?.querySelector('#arcaneStarterDetail375');
 if(productGrid&&details){
  const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
  function price(){
   try{return Number(localStorage.getItem('arcane-duel-starter-pack-purchases-v1')||'0')>0?600:300;}catch(e){return 300;}
  }
  function owned(name){
   return Math.min(3,Math.max(0,Number(window.arcaneBoosterInventory322?.owned(name)||0)));
  }
  const cover437=window.ARCANE_CHRONORESONANZ_ART_437?.['Sphärendrache Cantaris']||null;
  const packCover438=window.ARCANE_CHRONORESONANZ_PACK_438||null;
  function packVisual437(){
   if(packCover438){
    return '<div class="arcane-pack-image-375 ice" style="position:relative;overflow:hidden;border-color:#e2c082;background:#19173a">'
     +'<img src="'+packCover438+'" alt="Arcane Duel Starterdeck Chronoresonanz – Klang der Sphären, Beispiel 1" loading="eager" decoding="async" '
     +'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;border-radius:7px">'
     +'</div>';
   }
   return cover437
    ?'<div class="arcane-pack-image-375 ice" style="position:relative;display:block;overflow:hidden;border-color:#b4eaff;background:#192751">'
     +'<img src="'+cover437+'" alt="Sphärendrache Cantaris" loading="eager" decoding="async" style="display:block;width:100%;height:100%;object-fit:cover;object-position:50% 30%">'
     +'<div style="position:absolute;left:0;right:0;bottom:0;padding:12px 5px;color:#fff0cf;font-weight:900;font-size:12px;letter-spacing:1px;text-align:center;text-shadow:0 2px 6px #000;background:linear-gradient(transparent,#10162bec)">CHRONORESONANZ</div></div>'
    :'<div class="arcane-pack-image-375 ice" style="display:grid;place-items:center;background:#18234f"><span style="color:#bbf5ff;font-size:60px">◈</span></div>';
  }
  function renderProduct(){
   if(productGrid.querySelector('#arcaneResonanceShopProduct436'))return;
   const button=document.createElement('button');button.id='arcaneResonanceShopProduct436';
   button.type='button';button.className='arcane-starter-product-375 ice';
   button.innerHTML=packVisual437()+'<div class="arcane-starter-product-label-375"><strong>Chronoresonanz</strong><span>30 Karten + 3 Extra · <img class="arcane-currency-icon-502 arcane-currency-shop-502" src="artwork/currency/arkankristall-shop.avif" alt="Arkankristalle" decoding="async"> '+price()+'</span></div>';
   button.addEventListener('click',showDetail);
   productGrid.appendChild(button);
  }
  function showDetail(){
   const wallet=window.arcaneTestCrystals320;
   const inventory=window.arcaneBoosterInventory322;
   const enough=(wallet?.get()||0)>=price();
   const newCards=recipe.some(([name,n])=>owned(name)<n)||extra.some(c=>owned(c.name)===0);
   details.hidden=false;details.dataset.activeDeck='chronoresonanz';
   details.innerHTML='<button type="button" id="arcaneChronoBack436" class="arcane-starter-detail-back-375">← Alle Starterpacks</button>'
    +'<div class="arcane-starter-detail-top-375">'+packVisual437()+'<div><h4>Chronoresonanz</h4><p>Klang der Sphären</p><strong>30 Hauptdeck-Karten</strong><p>18 Monster · 7 Zauber · 5 Fallen</p><strong>3 Resonanzmonster im Extra-Deck</strong><p><img class="arcane-currency-icon-502 arcane-currency-shop-502" src="artwork/currency/arkankristall-shop.avif" alt="Arkankristalle" decoding="async"> '+price()+' Arkankristalle</p></div></div>'
    +'<h4>Alle Karten im Hauptdeck</h4><p class="arcane-starter-hint-501">Tippe auf eine Karte, um sie groß anzusehen und ihren Effekt zu lesen.</p><div class="arcane-starter-card-list-375 arcane-starter-gallery-501">'
    +(window.arcaneStarterGallery501?.(recipe,owned)||recipe.map(([name,n])=>'<div class="arcane-starter-card-row-375"><span>'+esc(name)+'</span><small>×'+n+' · Bestand '+owned(name)+'/3</small></div>').join(''))+'</div>'
    +'<h4>Extra-Deck · beim Kauf inklusive</h4><div class="arcane-starter-card-list-375 arcane-starter-gallery-501">'
    +(window.arcaneStarterGallery501?.(extra.map(c=>[c.name,1]),owned)||extra.map(c=>'<div class="arcane-starter-card-row-375"><span>'+esc(c.name)+'</span><small>Stufe '+c.level+' · '+c.atk+' ATK</small></div>').join(''))+'</div>'
    +'<p class="arcane-starter-warning-375">Maximal 3 Exemplare je Karte. Alle Karten sind auf Resonanzbeschwörungen abgestimmt; die Extra-Deck-Monster gehören nicht zu den 30 Hauptdeck-Karten.</p>'
    +'<button type="button" id="arcaneChronoBuy436" class="arcane-starter-buy-375" '+(newCards&&enough?'':'disabled')+'>'+(newCards?(enough?'Starterdeck kaufen · <img class="arcane-currency-icon-502 arcane-currency-shop-502" src="artwork/currency/arkankristall-shop.avif" alt="Arkankristalle" decoding="async"> '+price():'Nicht genügend Arkankristalle'):'Karten bereits vorhanden')+'</button>'
    +'<p id="arcaneChronoFeedback436" role="status" aria-live="polite"></p>'
    +(owned('Sternklang-Novizin')>0?'<button type="button" id="arcaneChronoActivate436" class="arcane-starter-buy-375">Als aktives Deck wählen</button>':'');
   details.querySelector('#arcaneChronoBack436').addEventListener('click',()=>{details.hidden=true;});
   details.querySelector('#arcaneChronoBuy436')?.addEventListener('click',buy);
   details.querySelector('#arcaneChronoActivate436')?.addEventListener('click',()=>{
    const state=getStored();if(!state){details.querySelector('#arcaneChronoFeedback436').textContent='Deckverwaltung noch nicht verfügbar.';return;}
    state.active=ID;
    try{localStorage.setItem('arcane-duel-managed-decks-v1',JSON.stringify(state));details.querySelector('#arcaneChronoFeedback436').textContent='Chronoresonanz ausgewählt. Bitte neues Duell nach dem Aktualisieren starten.';}catch(e){details.querySelector('#arcaneChronoFeedback436').textContent='Deckwahl konnte nicht gespeichert werden.'}
   });
  }
  function buy(){
   const inv=window.arcaneBoosterInventory322,wallet=window.arcaneTestCrystals320;
   const status=details.querySelector('#arcaneChronoFeedback436');
   const saved=inv?.read(),balance=wallet?.get(),cost=price();
   if(!saved||!Number.isSafeInteger(balance)||balance<cost){status.textContent='Nicht genügend Arkankristalle.';return;}
   if(saved.pendingPack){status.textContent='Öffne zuerst deinen ausstehenden Booster.';return;}
   const additions=recipe.map(([name,n])=>[name,Math.min(n,Math.max(0,3-owned(name)))]).filter(x=>x[1]>0);
   const bonuses=extra.filter(c=>owned(c.name)<1);
   if(!additions.length&&!bonuses.length){status.textContent='Alle Karten bereits im Bestand.';return;}
   const next={...saved,counts:{...saved.counts}};
   for(const [name,n] of additions)next.counts[name]=(next.counts[name]||0)+n;
   for(const card of bonuses)next.counts[card.name]=1;
   if(!inv.save(next)){status.textContent='Speichern fehlgeschlagen. Kein Kauf durchgeführt.';return;}
   // Always preserve existing decks, creating the resonance deck as a separate slot.
   const state=getStored()||{active:'kael',decks:[
    {id:'kael',title:'Kael – Wächter des ersten Siegels',cards:starterDeckList.map(x=>[...x])},
    {id:'leon',title:'Leon – König der Löwenarena',cards:leonDeckList363.map(x=>[...x])}
   ]};
   const exists=state.decks.find(d=>d.id===ID);
   if(!exists)state.decks.push({id:ID,title:'Chronoresonanz – Klang der Sphären',character:'kael',cards:recipe.map(x=>[...x])});
   state.active=ID;
   try{localStorage.setItem('arcane-duel-managed-decks-v1',JSON.stringify(state))}
   catch(e){status.textContent='Karten im Bestand, aber Deckwahl konnte nicht gespeichert werden.';return;}
   wallet.set(balance-cost);wallet.refresh();
   try{
    const key='arcane-duel-starter-pack-purchases-v1';
    localStorage.setItem(key,String((parseInt(localStorage.getItem(key)||'0',10)||0)+1));
   }catch(e){}
   showDetail();
   const message=details.querySelector('#arcaneChronoFeedback436');
   message.textContent='✓ Gekauft! '+additions.reduce((sum,x)=>sum+x[1],0)+' Hauptdeck-Karten und '+bonuses.length+' Resonanzbosse freigeschaltet. Chronoresonanz ist aktiv. Starte ein neues Duell nach Aktualisierung.';
  }
  const observer=new MutationObserver(renderProduct);
  observer.observe(productGrid,{childList:true});
  renderProduct();
 }
 window.arcaneChronoresonanzShop436={open:()=>document.getElementById('arcaneResonanceShopProduct436')?.click(),create:recipe,extra};
}
})();