import {randomInt} from 'node:crypto';
// Deliberately limited, server-authoritative test deck. No collection rewards.
const C=[
 ['Glutkoloss','monster',2300,1900,5,'ember-colossus'],
 ['Flammendrache','monster',1800,1200,4,'flame-dragon','+500 ATK einmal pro Zug'],
 ['Frostwächter','monster',1400,1900,4,'frost-guardian','+500 DEF einmal pro Zug'],
 ['Arkaner Magier','monster',1200,1500,3,'arkaner-magier','Bei offener Beschwörung +300 LP'],
 ['Aschenritter','monster',1400,1200,4,'aschenritter','Bei offener Beschwörung 300 Schaden'],
 ['Löwenrekrut','monster',1000,900,3,'leon-loewenrekrut','Bei offener Beschwörung 200 Schaden'],
 ['Flammenstoß','spell',0,0,0,'flame-burst','500 Schaden'],
 ['Heilende Quelle','spell',0,0,0,'heilende-quelle','+800 LP'],
 ['Arkaner Wissensstrom','spell',0,0,0,'arkaner-wissensstrom','Bis zu 2 Karten ziehen'],
 ['Arkaner Rückschlag','trap',0,0,0,'arkaner-rueckschlag','Stoppt einen Angriff; Angreifer dauerhaft −500 ATK']
].map(([name,kind,atk,def,level,artwork,effectText])=>({name,kind,atk,def,level,artwork,effectText}));
const fail=t=>{throw Error(t)};
function player(){const deck=C.flatMap(c=>Array.from({length:3},()=>({...c})));for(let i=deck.length-1;i>0;i--){const j=randomInt(i+1);[deck[i],deck[j]]=[deck[j],deck[i]]}return {lp:4000,deck,hand:deck.splice(0,5),mon:Array(4).fill(null),spell:Array(4).fill(null),grave:[],ownTurns:0,summoned:false}}
export function newDuel(first=randomInt(2)){const p=[player(),player()];p[first].ownTurns=1;return {p,first,turn:first,round:1,phase:'main1',rev:0,winner:null,pending:null,events:[{id:0,text:'Schicksalsmünze: Spieler '+(first+1)+' beginnt.'}]}}
function event(d,text,card){d.events.push({id:d.rev+1,text,...(card?{card:{...card}}:{})});if(d.events.length>20)d.events.shift()}
function draw(d,i,n=1){const p=d.p[i];for(let j=0;j<n&&p.deck.length;j++)p.hand.push(p.deck.shift())}
function grave(p,zone,i){const c=p[zone][i];p[zone][i]=null;if(c)p.grave.push({...c,faceDown:false})}
function check(d){if(d.p[0].lp<=0&&d.p[1].lp<=0)d.winner='draw';else if(d.p[0].lp<=0)d.winner=1;else if(d.p[1].lp<=0)d.winner=0}
const slot=i=>Number.isInteger(i)&&i>=0&&i<4;
function battle(d){const {from,to,attacker}=d.pending;d.pending=null;const p=d.p[attacker],q=d.p[1-attacker],a=p.mon[from],b=to===-1?null:q.mon[to];if(!a)return;
 if(!b){q.lp-=a.atk;event(d,'Direktangriff: '+a.atk+' Schaden');return}
 b.faceDown=false;const defense=b.position==='defense',diff=a.atk-(defense?b.def:b.atk);
 if(diff>0){grave(q,'mon',to);if(!defense)q.lp-=diff}
 else if(diff<0){p.lp+=diff;if(!defense)grave(p,'mon',from)}
 else if(!defense){grave(p,'mon',from);grave(q,'mon',to)}
 event(d,a.name+' greift '+b.name+' an',b);
}
export function apply(d,i,b){
 if(d.winner!==null)fail('Duell beendet');if(b.rev!==d.rev)fail('Spielstand geändert – erneut versuchen');
 const p=d.p[i],q=d.p[1-i],main=d.phase!=='battle';
 if(b.move==='surrender'){d.winner=1-i;event(d,'Spieler '+(i+1)+' gibt auf')}
 else if(d.pending){
  if(i===d.pending.attacker)fail('Warte auf Fallenentscheidung');
  if(b.move==='pass')battle(d);
  else if(b.move==='trap'){
   const c=slot(b.zone)&&p.spell[b.zone];if(!c||c.kind!=='trap'||p.ownTurns<=c.setTurn)fail('Falle noch nicht aktivierbar');
   const a=q.mon[d.pending.from];a.atk=Math.max(0,a.atk-500);a.baseAtk=Math.max(0,a.baseAtk-500);grave(p,'spell',b.zone);d.pending=null;event(d,c.name+' wird aufgedeckt – Angriff gestoppt',c)
  }else fail('Falle aktivieren oder passen');
 }else{
  if(i!==d.turn)fail('Gegner am Zug');
  switch(b.move){
   case 'summon':{
    const c=p.hand[b.hand];if(!main||p.summoned||!c||c.kind!=='monster'||!slot(b.zone)||p.mon[b.zone]||!['attack','defense'].includes(b.position))fail('Beschwörung nicht möglich');
    const t=Array.isArray(b.tributes)?b.tributes:[],need=c.level>=7?2:c.level>=5?1:0;if(t.length!==need||new Set(t).size!==need||t.some(x=>!slot(x)||!p.mon[x]))fail('Tribut erforderlich');
    for(const x of t)grave(p,'mon',x);p.hand.splice(b.hand,1);const faceDown=b.position==='defense';
    p.mon[b.zone]={...c,baseAtk:c.atk,baseDef:c.def,position:b.position,faceDown,attacked:false,effectUsed:false,placedTurn:p.ownTurns};p.summoned=true;
    if(!faceDown){if(c.name==='Arkaner Magier')p.lp+=300;if(c.name==='Aschenritter')q.lp-=300;if(c.name==='Löwenrekrut')q.lp-=200}
    event(d,faceDown?'Monster verdeckt gesetzt':c.name+' beschworen',faceDown?null:c);break}
   case 'set':{
    const c=p.hand[b.hand];if(!main||!c||c.kind==='monster'||!slot(b.zone)||p.spell[b.zone])fail('Setzen nicht möglich');
    p.hand.splice(b.hand,1);p.spell[b.zone]={...c,faceDown:true,setTurn:p.ownTurns};event(d,'Zauber/Falle verdeckt gesetzt');break}
   case 'spell':{
    const from=b.source==='field'?'spell':'hand';if(from==='spell'&&!slot(b.index))fail('Ungültiger Platz');const c=p[from][b.index];if(!main||!c||c.kind!=='spell')fail('Zauber nicht möglich');
    if(from==='spell')grave(p,'spell',b.index);else{p.hand.splice(b.index,1);p.grave.push(c)}
    if(c.name==='Flammenstoß')q.lp-=500;else if(c.name==='Heilende Quelle')p.lp+=800;else draw(d,i,2);event(d,c.name+' aktiviert',c);break}
   case 'effect':{
    const c=slot(b.zone)&&p.mon[b.zone];if(!main||!c||c.faceDown||c.effectUsed||!['Flammendrache','Frostwächter'].includes(c.name))fail('Effekt nicht möglich');
    c.effectUsed=true;if(c.name==='Flammendrache')c.atk+=500;else c.def+=500;event(d,c.name+' aktiviert Effekt',c);break}
   case 'position':{
    const c=slot(b.zone)&&p.mon[b.zone];if(!main||!c||c.placedTurn===p.ownTurns||c.attacked||c.changedTurn===p.ownTurns)fail('Positionswechsel nicht möglich');
    c.faceDown=false;c.position=c.position==='attack'?'defense':'attack';c.changedTurn=p.ownTurns;event(d,c.name+' wechselt Position',c);break}
   case 'phase':if(d.phase==='main1'&&d.round>1)d.phase='battle';else if(d.phase==='battle')d.phase='main2';else fail('Phasenwechsel nicht möglich');event(d,'Phase: '+d.phase);break;
   case 'attack':{
    const a=slot(b.from)&&p.mon[b.from];if(d.phase!=='battle'||!a||a.faceDown||a.position!=='attack'||a.attacked)fail('Angriff nicht möglich');
    if(b.to===-1?q.mon.some(Boolean):!slot(b.to)||!q.mon[b.to])fail('Ungültiges Angriffsziel');
    a.attacked=true;d.pending={attacker:i,from:b.from,to:b.to};event(d,a.name+' greift an',a);
    if(!q.spell.some(c=>c?.kind==='trap'&&q.ownTurns>c.setTurn))battle(d);break}
   case 'end':
    for(const c of p.mon)if(c){c.atk=c.baseAtk;c.def=c.baseDef}
    d.turn=1-i;d.round++;d.phase='main1';q.ownTurns++;q.summoned=false;for(const c of q.mon)if(c){c.attacked=false;c.effectUsed=false}
    if(!q.deck.length)d.winner=i;else draw(d,1-i);event(d,'Spieler '+(2-i)+' ist am Zug');break;
   default:fail('Unbekannte Aktion')
  }
 }
 check(d);d.rev++;return d
}
export function duelView(d,i){const p=d.p[i],q=d.p[1-i],visible=c=>c&&!c.faceDown?{...c}:c?{faceDown:true}:null;return {rev:d.rev,first:d.first,you:i,turn:d.turn,round:d.round,phase:d.phase,winner:d.winner,pending:d.pending?{...d.pending}:null,events:d.events.map(e=>({...e})),own:{lp:p.lp,hand:p.hand,mon:p.mon,spell:p.spell,deck:p.deck.length,grave:p.grave,ownTurns:p.ownTurns},other:{lp:q.lp,handCount:q.hand.length,deck:q.deck.length,mon:q.mon.map(visible),spell:q.spell.map(visible),grave:q.grave}}}
