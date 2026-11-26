/* Chapter 4 water boss effects; reuse tested Chapter 3 turn and animation hooks. */
function ch4IsBoss(){return ['Sirene Melis','Leviathor'].includes(window.arcaneStoryOpponentInfo362?.name)}
const ch3IsBoss519=ch3IsBoss;
ch3IsBoss=function(){return ch3IsBoss519()||ch4IsBoss()};
function ch4Lock(c){if(c)c.varekLockedUntil=Math.max(c.varekLockedUntil||0,turn)}
function ch4Penalty(c,n){if(c){c.permanentAtkPenalty=(c.permanentAtkPenalty||0)+n;ch3Boost(c,-n)}}
const ch3MonsterEvent519=ch3MonsterEvent;
ch3MonsterEvent=function(card,event,owner){
 if(!card?.ch4Hero||owner!=='opponent')return ch3MonsterEvent519(card,event,owner);
 const fx=card.fx,enemy=ch3Top(myMon);
 if(event==='flip'&&fx==='flipdef')ch3Def(card,300);
 if(event==='grave'&&fx==='graveheal'&&oppMon.includes(card))oppLP+=200;
 if(event!=='summon'||card.faceDown)return;
 switch(fx){
  case 'draw':ch3Draw();break;
  case 'heal300':oppLP+=300;break;
  case 'weak200':ch3TurnBoost(enemy,-200);break;
  case 'ally300':ch3Boost(ch3Top(oppMon.filter(m=>m!==card&&m?.element==='Wasser')),300);break;
  case 'lock':ch4Lock(enemy);break;
  case 'tributeheal':if(card.ch3Tribute){oppLP+=500;ch3Draw()}break;
  case 'melisBoss':if(card.ch3Tribute){ch4Lock(enemy);ch4Penalty(enemy,600)}break;
  case 'tributeweak':if(card.ch3Tribute)ch3TurnBoost(enemy,-500);break;
  case 'destroySet':if(card.ch3Tribute)ch3EnemyDestroy(mySpell,true);break;
  case 'levBoss':if(card.ch3Tribute)ch3EnemyDestroy(myMon);break;
 }
};
const ch3TributeBonus519=ch3TributeBonus;
ch3TributeBonus=function(materials,card){
 if(!card?.ch4Hero)return ch3TributeBonus519(materials,card);
 if(!materials.length)return;
 card.ch3Tribute=true;
 for(const c of materials){
  if(c.fx==='tributeLP')oppLP+=200;
  if(c.fx==='tributeATK')ch3Boost(card,300);
  if(c.fx==='tributeDEF')ch3Def(card,300);
 }
};
function ch4Revive(){
 const z=oppMon.findIndex(m=>!m),i=oppGraveyard.findLastIndex(c=>c.kind==='monster'&&c.element==='Wasser'&&c.level<=4&&!c.resonance);
 if(z<0||i<0)return false;
 const c=oppGraveyard.splice(i,1)[0];
 oppMon[z]={...c,faceDown:false,position:'defense',tempAtkBonus:0,tempDefBonus:0,ch3TurnAtk:0,ch3Tribute:false,summonedTurn:aiTurn,attacksThisTurn:1};
 return true;
}
function ch4Spell(c){
 const own=ch3Top(oppMon.filter(m=>m?.element==='Wasser')),enemy=ch3Top(myMon);
 switch(c.fx){
  case 'weak400':case 'weak500':if(!enemy)return false;ch3TurnBoost(enemy,c.fx==='weak400'?-400:-500);return true;
  case 'revive4':return ch4Revive();
  case 'drawheal':if(!aiDeck.length)return false;ch3Draw();oppLP+=300;return true;
  case 'searchLow':return ch3Search(m=>m.kind==='monster'&&m.element==='Wasser'&&m.level<=4);
  case 'searchHigh':return ch3Search(m=>m.kind==='monster'&&m.element==='Wasser'&&m.level>=5);
  case 'boost400':case 'boost500':if(!own)return false;ch3TurnBoost(own,c.fx==='boost400'?400:500);return true;
  case 'allweak':if(!enemy)return false;myMon.filter(m=>m&&!m.faceDown).forEach(m=>ch3TurnBoost(m,-300));return true;
  case 'sacdraw':{
   const a=oppMon.map((m,i)=>({m,i})).filter(x=>x.m&&!x.m.resonance).sort((a,b)=>effectiveAtk(a.m)-effectiveAtk(b.m))[0];
   if(!a||aiDeck.length<2||oppMon.filter(Boolean).length<2)return false;
   sendToGraveyard(a.m,'opponent');oppMon[a.i]=null;ch3Draw(2);return true;
  }
  case 'destroySpell':return oppMon.some(m=>m?.ch3Tribute&&!m.faceDown&&m.element==='Wasser')&&ch3EnemyDestroy(mySpell);
 }
 return false;
}
const ch3AiSpells519=ch3AiSpells;
ch3AiSpells=async function(show,after){
 if(!ch4IsBoss())return ch3AiSpells519(show,after);
 const early=['revive4','drawheal','searchLow','searchHigh','sacdraw'];
 const candidates=aiHand.filter(c=>c.ch4Hero&&c.kind==='spell'&&(after?!early.includes(c.fx):early.includes(c.fx)));
 for(const c of candidates){
  const i=aiHand.indexOf(c);if(i<0)continue;
  aiHand.splice(i,1);
  if(!ch4Spell(c)){aiHand.splice(i,0,c);continue}
  sendToGraveyard(c,'opponent');log('🌊 '+c.name+' aktiviert.');
  if(show)await arcaneAiPlay491(c,'Gegner aktiviert');
  break;
 }
};
const ch3DefenseTrap519=ch3DefenseTrap;
ch3DefenseTrap=function(attacker){
 if(!ch4IsBoss())return ch3DefenseTrap519();
 const i=oppSpell.findIndex(c=>c?.ch4Hero&&c.kind==='trap'&&aiTurn>c.setTurn);
 if(i<0)return false;
 return arcaneResolveOpponentTrap492(i,c=>{
  if(c.fx==='trapheal')oppLP+=300;
  if(c.fx==='trapweak')ch4Penalty(attacker,400);
  if(c.fx==='trapburn')myLP=Math.max(0,myLP-300);
  log('🌊 '+c.name+' stoppt den Angriff.');return true;
 });
};
