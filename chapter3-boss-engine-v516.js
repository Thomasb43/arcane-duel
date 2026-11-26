/* v5.16: chapter 3 boss decks, Story-only effects. */
let ch3AiExtra=[];
function ch3IsBoss(){return ['Arion','Pyrathos'].includes(window.arcaneStoryOpponentInfo362?.name)}
function ch3Top(list){return list.filter(m=>m&&!m.faceDown).sort((a,b)=>effectiveAtk(b)-effectiveAtk(a))[0]}
function ch3Draw(n=1){while(n--&&aiDeck.length)aiHand.push(aiDeck.shift());while(aiHand.length>7){const i=aiHand.findIndex(c=>c.kind==='spell');sendToGraveyard(aiHand.splice(i<0?0:i,1)[0],'opponent')}}
function ch3Boost(c,n){if(c)c.tempAtkBonus=(c.tempAtkBonus||0)+n}
function ch3TurnBoost(c,n){if(c){ch3Boost(c,n);c.ch3TurnAtk=(c.ch3TurnAtk||0)+n}}
function ch3EndTurn(){if(!ch3IsBoss())return;for(const m of [...myMon,...oppMon])if(m?.ch3TurnAtk){m.tempAtkBonus=(m.tempAtkBonus||0)-m.ch3TurnAtk;delete m.ch3TurnAtk}}
function ch3Def(c,n){if(c)c.tempDefBonus=(c.tempDefBonus||0)+n}
function ch3EnemyDestroy(list,setOnly=false){
 let i=list.findIndex(m=>m&&(!setOnly||m.faceDown));
 if(list===myMon){const m=ch3Top(list);if(m)i=list.indexOf(m)}
 if(i>=0){const c=list[i];sendToGraveyard(c,'player');list[i]=null;log(c.name+' wurde zerstört.');return true}
 return false
}
function ch3MonsterEvent(card,event,owner){
 if(!card?.ch3Hero||owner!=='opponent')return;
 const n=card.name,enemy=ch3Top(myMon);
 if(event==='flip'&&['Aschenbastions-Wächter','Obsidianpanzer-Drache'].includes(n))ch3Def(card,300);
 if(event==='grave'&&n==='Phönixküken Ignis'&&oppMon.includes(card))oppLP+=200;
 if(event!=='summon'||card.faceDown)return;
 if(n==='Glutklingen-Rekrut')ch3Boost(card,200);
 if(n==='Funkenresonator'&&oppMon.some(m=>m&&m!==card&&!m.faceDown&&m.ch3Hero==='arion'&&!m.resonator))ch3Draw();
 if(n==='Glutbanner-Ritterin')ch3Boost(ch3Top(oppMon.filter(m=>m!==card&&m?.element==='Feuer')),300);
 if(['Flammenchor-Resonator','Schlackenflügel'].includes(n))ch3TurnBoost(enemy,-200);
 if(card.ch3Tribute){
  if(n==='Drachenritter Solvar')ch3Draw();
  if(n==='Phönix der Aschengipfel')oppLP+=500;
  if(n==='Inferno-Wyvern')ch3TurnBoost(enemy,-400);
  if(n==='Vulkanherz-Drache')ch3EnemyDestroy(mySpell,true);
  if(n==='Pyrathos, Urdrache des Infernos')ch3EnemyDestroy(myMon);
 }
}
function ch3TributeBonus(materials,card){
 if(!card?.ch3Hero||!materials.length)return;
 card.ch3Tribute=true;
 for(const c of materials){
  if(c.name==='Lavakern-Wyrmling')oppLP+=200;
  if(card.race==='Drache'&&c.name==='Kraterkriecher')ch3Boost(card,200);
  if(card.race==='Drache'&&c.name==='Basaltkoloss')ch3Def(card,300);
 }
}
function ch3Revive(maxLevel){
 const z=oppMon.findIndex(m=>!m),i=oppGraveyard.findLastIndex(c=>c.kind==='monster'&&c.element==='Feuer'&&c.level<=maxLevel&&!c.resonance);
 if(z<0||i<0)return false;
 const c=oppGraveyard.splice(i,1)[0];
 oppMon[z]={...c,faceDown:false,position:'defense',tempAtkBonus:0,tempDefBonus:0,ch3TurnAtk:0,ch3Tribute:false,summonedTurn:aiTurn,attacksThisTurn:1};
 return true;
}
function ch3Search(test){
 if(aiHand.length>=7)return false;
 const i=aiDeck.findIndex(test);if(i<0)return false;
 aiHand.push(aiDeck.splice(i,1)[0]);shuffleCards(aiDeck);return true;
}
function ch3Spell(c){
 const own=ch3Top(oppMon),enemy=ch3Top(myMon);
 switch(c.name){
  case 'Eid der Drachenritter':case 'Atem des Feuerkönigs':if(!own)return false;ch3TurnBoost(own,400);return true;
  case 'Ruf der Glut':return ch3Search(m=>m.resonator&&m.ch3Hero==='arion');
  case 'Phönixschwinge':return ch3Revive(4);
  case 'Schmiedefeuer':if(!aiDeck.length)return false;ch3Draw();oppLP+=300;return true;
  case 'Resonanz der Flammen':if(!oppMon.some(m=>m?.resonance&&!m.faceDown)||aiDeck.length<2)return false;ch3Draw(2);return true;
  case 'Glutwirbel':case 'Lavastrom':if(!enemy)return false;ch3TurnBoost(enemy,c.name==='Glutwirbel'?-400:-500);return true;
  case 'Opfer der Urflamme':{
   const a=oppMon.map((m,i)=>({m,i})).filter(x=>x.m&&!x.m.resonance).sort((a,b)=>effectiveAtk(a.m)-effectiveAtk(b.m))[0];
   if(!a||aiDeck.length<2||oppMon.filter(Boolean).length<2)return false;
   sendToGraveyard(a.m,'opponent');oppMon[a.i]=null;ch3Draw(2);return true;
  }
  case 'Ruf aus dem Krater':return ch3Revive(3);
  case 'Drachenhort':return ch3Search(m=>m.race==='Drache'&&[5,6].includes(m.level));
  case 'Vulkanausbruch':if(!oppMon.some(m=>m?.ch3Tribute&&!m.faceDown&&m.race==='Drache'))return false;return ch3EnemyDestroy(mySpell);
 }
 return false;
}
async function ch3AiSpells(show,after){
 if(!ch3IsBoss())return;
 const early=['Ruf der Glut','Phönixschwinge','Schmiedefeuer','Ruf aus dem Krater','Drachenhort','Opfer der Urflamme'];
 const candidates=aiHand.filter(c=>c.ch3Hero&&c.kind==='spell'&&(after?!early.includes(c.name):early.includes(c.name)));
 for(const c of candidates){
  const i=aiHand.indexOf(c);if(i<0)continue;
  aiHand.splice(i,1);
  if(!ch3Spell(c)){aiHand.splice(i,0,c);continue}
  sendToGraveyard(c,'opponent');log('🔥 '+c.name+' aktiviert.');
  if(show)await arcaneAiPlay491(c,'Gegner aktiviert');
  break;
 }
}
function ch3MaterialIndices(extra){
 const a=oppMon.findIndex(m=>m&&!m.faceDown&&m.name===extra.materials[0]);
 const b=oppMon.findIndex((m,i)=>i!==a&&m&&!m.faceDown&&m.name===extra.materials[1]);
 return a>=0&&b>=0&&oppMon[a].level+oppMon[b].level===extra.level?[a,b]:null;
}
function ch3SummonPriority(c){
 if(c.ch3Hero!=='arion')return c.atk;
 const matching=ch3AiExtra.some(e=>e.materials.includes(c.name)&&oppMon.some(m=>m&&!m.faceDown&&m.name===e.materials.find(n=>n!==c.name)));
 if(matching)return 10000+c.atk;
 return c.atk;
}
async function ch3AiResonance(show){
 if(window.arcaneStoryOpponentInfo362?.name!=='Arion')return;
 const ready=ch3AiExtra.map((c,i)=>({c,i,materials:ch3MaterialIndices(c)})).filter(x=>x.materials).sort((a,b)=>b.c.atk-a.c.atk)[0];
 if(!ready)return;
 const [a,b]=ready.materials;
 for(const i of [a,b]){
  const m=oppMon[i];if(m.name==='Drachenpakt-Knappe')oppLP+=300;
  sendToGraveyard(m,'opponent');oppMon[i]=null;
 }
 const boss={...ch3AiExtra.splice(ready.i,1)[0],position:'attack',faceDown:false,summonedTurn:aiTurn,attacksThisTurn:0};
 oppMon[a]=boss;
 if(boss.name==='Glutdrache Aurelion')ch3Draw();
 if(boss.name==='Phönixwächter der Bastion')oppLP+=500;
 if(boss.name==='Arion, Phönixritter der Asche')ch3TurnBoost(ch3Top(myMon),-600);
 log('🔥 Resonanzbeschwörung: '+boss.name+'!');
 if(show)await arcaneOpeningCard489('Gegner beschwört '+boss.name,'oppMon',a,null);
 render();
}
function ch3DefenseTrap(){
 if(!ch3IsBoss())return false;
 const i=oppSpell.findIndex(c=>c?.ch3Hero&&c.kind==='trap'&&aiTurn>c.setTurn);
 if(i<0)return false;
 return arcaneResolveOpponentTrap492(i,c=>{
  if(c.name==='Phönixschild')oppLP+=200;
  if(['Gegenschlag der Bastion','Zorn der Urflamme'].includes(c.name))myLP=Math.max(0,myLP-300);
  log('🔥 '+c.name+' stoppt den Angriff.');return true;
 });
}
