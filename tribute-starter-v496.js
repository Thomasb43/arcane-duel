/* Wurzelherz starter: chapter 2, tribute-focused, 30 cards. */
(function(){
'use strict';
const specs=[
 ['Wurzelkeim','monster',1,400,900,3,'tributeDraw','🌱','Wird diese Karte als Tribut für ein Wurzelherz-Monster verwendet: Ziehe 1 Karte.'],
 ['Moosgeist','monster',2,800,1400,3,'tributeHeal','🍃','Wird diese Karte als Tribut für ein Wurzelherz-Monster verwendet: Erhalte 400 LP.'],
 ['Nebelpfad-Späher','monster',3,1300,1000,3,'searchLow','🦊','Bei offener Normalbeschwörung: Nimm 1 anderes Wurzelherz-Monster der Stufe 4 oder niedriger vom Deck auf die Hand.'],
 ['Spiegelrinden-Wächter','monster',4,1200,1900,3,'tributeBoost','🌳','Wird diese Karte als Tribut für ein Wurzelherz-Monster verwendet: Das beschworene Monster erhält bis zum Ende des Zuges 400 ATK.'],
 ['Dornenhirsch','monster',5,2100,1600,2,'tributeBurn','🦌','Bei offener Tributbeschwörung: Füge deinem Gegner 400 LP Schaden zu.'],
 ['Uralter Eichenkoloss','monster',6,2400,2300,2,'tributeHealBoss','🪵','Bei offener Tributbeschwörung: Erhalte 600 LP.'],
 ['Dornenfürst des Wildsiegels','monster',7,2700,2100,1,'tributeDestroy','👑','Bei offener Tributbeschwörung: Zerstöre das offene gegnerische Monster mit der höchsten ATK.'],
 ['Wurzelherzdrache Sylvaron','monster',8,3000,2500,1,'tributeDragon','🐉','Bei offener Tributbeschwörung: Zerstöre die erste gegnerische gesetzte Zauber-/Fallenkarte und ziehe 1 Karte.'],
 ['Ruf der Waldkeime','spell',0,0,0,2,'searchLowSpell','🌱','Nimm 1 Wurzelherz-Monster der Stufe 4 oder niedriger vom Deck auf die Hand.'],
 ['Kreislauf der Natur','spell',0,0,0,2,'revive','🌿','Beschwöre das zuletzt auf deinen Friedhof gelegte Wurzelherz-Monster der Stufe 4 oder niedriger in offener Verteidigung. Es kann in diesem Zug nicht angreifen und darf als Tribut dienen.'],
 ['Ruf des Wildsiegels','spell',0,0,0,2,'searchBoss','🔮','Nimm 1 Wurzelherz-Monster der Stufe 5 oder höher vom Deck auf die Hand.'],
 ['Kraft des Wurzelherzens','spell',0,0,0,1,'boost','💚','Dein stärkstes offenes Wurzelherz-Monster, das als Tribut beschworen wurde, erhält bis zum Ende des Zuges 700 ATK.'],
 ['Wiederkehr der Wurzeln','trap',0,0,0,2,'revive','🌾','Ab dem nächsten eigenen Zug manuell aktivierbar: Beschwöre das zuletzt auf deinen Friedhof gelegte kleine Wurzelherz-Monster in offener Verteidigung. Es kann in diesem Zug nicht angreifen und darf als Tribut dienen.'],
 ['Dornenwall','trap',0,0,0,2,'stop','🛡️','Ab dem nächsten eigenen Zug manuell aktivierbar, wenn du ein tributbeschworenes Wurzelherz-Monster kontrollierst: Annulliere den nächsten gegnerischen Angriff.'],
 ['Segen des zweiten Siegels','trap',0,0,0,1,'ward','✨','Ab dem nächsten eigenen Zug manuell aktivierbar: Alle eigenen offenen tributbeschworenen Wurzelherz-Monster erhalten dauerhaft 500 DEF.']
];
const cards=specs.map(([name,kind,level,atk,def,q,forestFx,emoji,effectText])=>({name,kind,forestTribute:true,forestFx,emoji,effectText,skin:kind==='monster'?'ice':'spell',...(kind==='monster'?{level,atk,def,element:'Natur',race:'Waldwesen'}:{})}));
const recipe=specs.map(s=>[s[0],s[5]]);
const ID='wurzelherz-starter',title='Das Erwachen des Wurzelherzens';
if(recipe.reduce((n,x)=>n+x[1],0)!==30||new Set(cards.map(c=>c.name)).size!==15||recipe.some(x=>x[1]>3))throw Error('Ungültiges Wurzelherz-Deck');
function low(c){return c?.forestTribute&&c.kind==='monster'&&c.level<=4}
function boss(c){return c?.forestTribute&&c.kind==='monster'&&c.level>=5}
function tributeBonus(materials,summoned,ctx){
 if(!boss(summoned))return;
 for(const m of materials){
  if(m?.forestFx==='tributeDraw')ctx.draw();
  if(m?.forestFx==='tributeHeal')ctx.heal(400);
  if(m?.forestFx==='tributeBoost')summoned.tempAtkBonus=(summoned.tempAtkBonus||0)+400;
 }
}
function summonEffect(c,ctx){
 if(!c?.forestTribute||c.faceDown)return;
 if(c.forestFx==='searchLow')ctx.search(m=>low(m)&&m.name!==c.name);
 if(!c.tributeSummonedForest)return;
 if(c.forestFx==='tributeBurn')ctx.damage(400);
 if(c.forestFx==='tributeHealBoss')ctx.heal(600);
 if(c.forestFx==='tributeDestroy')ctx.destroyStrongest();
 if(c.forestFx==='tributeDragon'){ctx.destroySet();ctx.draw()}
}
function spellEffect(c,ctx){
 const targets=ctx.own.filter(m=>boss(m)&&!m.faceDown&&m.tributeSummonedForest);
 switch(c.forestFx){
  case 'searchLowSpell':return ctx.search(low);
  case 'searchBoss':return ctx.search(boss);
  case 'revive':return ctx.revive(low);
  case 'boost':if(!targets.length)return false;targets.sort((a,b)=>ctx.atk(b)-ctx.atk(a))[0].tempAtkBonus=(targets[0].tempAtkBonus||0)+700;return true;
  case 'stop':if(!targets.length)return false;ctx.stop();return true;
  case 'ward':if(!targets.length)return false;for(const m of targets)m.def+=500;return true;
  default:return false
 }
}
window.ARCANE_WURZELHERZ_496={cards,recipe,id:ID,title,tributeBonus,summonEffect,spellEffect,low,boss};
})();
