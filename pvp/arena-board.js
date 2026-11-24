// Separate UI for the unranked network test; no local rewards or deck changes.
window.arcanePvpBoard=(()=>{
 let last=-1,root=null,choice=null,send=null,leave=null,current=null,seen=-1;
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
 function button(text,fn,disabled=false){const b=el('button',text);b.type='button';b.disabled=disabled;b.addEventListener('click',fn);return b}
 function cardLabel(c){return !c?'Frei':c.name?c.name+(c.kind==='monster'?' · '+c.atk+'/'+c.def:''):'Verdeckt'}
 function act(move,extra={}){choice=null;return send(move,extra)}
 function selectCard(i){choice={type:'hand',i,position:'attack',tributes:[]};paint()}
 function paint(){
  const d=current;if(!d||!root)return;root.replaceChildren();
  const own=d.own,other=d.other,myTurn=d.turn===d.you,main=d.phase!=='battle',live=d.winner===null,can=live&&myTurn&&!d.pending;
  root.append(el('strong',live?(d.pending?'Fallenentscheidung':myTurn?'DU BIST AM ZUG':'GEGNER AM ZUG'):(d.winner==='draw'?'Unentschieden':d.winner===d.you?'SIEG':'NIEDERLAGE')));
  root.append(el('p','Münzwurf: '+(d.first===d.you?'Du beginnst':'Gegner beginnt')+' · Zug '+d.round+' · '+({main1:'Hauptphase 1',battle:'Kampfphase',main2:'Hauptphase 2'}[d.phase])));
  root.append(el('p','Gegner: '+Math.max(0,other.lp)+' LP · '+other.handCount+' Handkarten · Deck '+other.deck,'pvp-hud'));
  const grid=(arr,type,foe)=>{const row=el('div',null,'pvp-grid');arr.forEach((c,i)=>{
   let handler=()=>{};let enabled=false;
   if(foe&&type==='mon'&&can&&d.phase==='battle'&&choice?.type==='attack'&&c){handler=()=>act('attack',{from:choice.i,to:i});enabled=true}
   if(!foe&&type==='mon'&&can){
    if(choice?.type==='hand'&&own.hand[choice.i]?.kind==='monster'&&main){
     if(!c){handler=()=>act('summon',{hand:choice.i,zone:i,position:choice.position,tributes:choice.tributes});enabled=true}
     else{handler=()=>{const a=choice.tributes;a.includes(i)?a.splice(a.indexOf(i),1):a.push(i);paint()};enabled=true}
    }else if(c&&d.phase==='battle'&&!c.faceDown&&c.position==='attack'&&!c.attacked){handler=()=>{choice={type:'attack',i};paint()};enabled=true}
    else if(c&&main){handler=()=>{choice={type:'field',i};paint()};enabled=true}
   }
   if(!foe&&type==='spell'){
    if(d.pending&&d.pending.attacker!==d.you&&c?.kind==='trap'&&own.ownTurns>c.setTurn){handler=()=>act('trap',{zone:i});enabled=true}
    else if(can&&main&&choice?.type==='hand'&&!c&&own.hand[choice.i]?.kind!=='monster'){handler=()=>act('set',{hand:choice.i,zone:i});enabled=true}
    else if(can&&main&&c?.kind==='spell'){handler=()=>act('spell',{source:'field',index:i});enabled=true}
   }
   const b=button(cardLabel(c),handler,!enabled);b.className='pvp-slot'+(c?.faceDown?' pvp-hidden':'')+(!foe&&type==='mon'&&choice?.tributes?.includes(i)?' pvp-selected':'');
   if(c?.name)b.title=c.effectText||c.name;row.append(b)
  });root.append(row)};
  grid(other.spell,'spell',true);grid(other.mon,'mon',true);
  grid(own.mon,'mon',false);grid(own.spell,'spell',false);
  root.append(el('p','Du: '+Math.max(0,own.lp)+' LP · Deck '+own.deck+' · Friedhof '+own.grave.length,'pvp-hud'));
  const hand=el('div',null,'pvp-hand');own.hand.forEach((c,i)=>{const b=button(cardLabel(c),()=>selectCard(i),!can||!main);b.title=c.effectText||c.name;if(choice?.type==='hand'&&choice.i===i)b.className='pvp-selected';hand.append(b)});root.append(hand);
  if(choice?.type==='hand'&&own.hand[choice.i]){
   const c=own.hand[choice.i];root.append(el('p',c.name+' · '+(c.effectText||'Normalmonster')));
   if(c.kind==='monster'){root.append(el('p',c.level>=5?'Wähle '+(c.level>=7?2:1)+' Tribut(e), dann eine freie Monsterzone.':'Wähle die Position und eine freie Monsterzone.'));root.append(button(choice.position==='attack'?'Offener Angriff':'Verdeckte Verteidigung',()=>{choice.position=choice.position==='attack'?'defense':'attack';paint()}))}
   else if(c.kind==='spell')root.append(button('Zauber aktivieren',()=>act('spell',{source:'hand',index:choice.i})));
   else root.append(el('p','Wähle eine freie Zauber-/Fallenzone.'));
  }
  if(choice?.type==='field'){root.append(button('Position wechseln',()=>act('position',{zone:choice.i})),button('Monstereffekt aktivieren',()=>act('effect',{zone:choice.i})))}
  if(choice?.type==='attack'){root.append(el('p','Wähle ein gegnerisches Monster.'));if(!other.mon.some(Boolean))root.append(button('Direktangriff',()=>act('attack',{from:choice.i,to:-1})))}
  if(d.pending&&d.pending.attacker!==d.you)root.append(button('Angriff zulassen',()=>act('pass')),el('p','Oder tippe auf eine aktivierbare Falle.'));
  if(can){if(d.phase==='battle'||(d.phase==='main1'&&d.round>1))root.append(button('Phase wechseln',()=>act('phase')));root.append(button('Zug beenden',()=>act('end')))}
  if(live)root.append(button('Aufgeben',()=>{if(confirm('Duell wirklich aufgeben?'))act('surrender')}));
  const log=el('div',null,'pvp-events');for(const e of d.events.slice(-5).reverse())log.append(el('p',e.text));root.append(log);
  const recent=d.events.at(-1);if(recent&&recent.id>seen){seen=recent.id;if(recent.card?.kind==='trap'){const flip=el('div',recent.card.name+' · Falle aktiviert','pvp-trap-flip');root.prepend(flip)}}
  root.append(button(live?'Raum verlassen':'Zurück zur Arena',leave))
 }
 return {render(target,d,move,onLeave){if(root!==target){root=target;last=-1;seen=-1;choice=null}send=move;leave=onLeave;current=d;if(last===d.rev)return;last=d.rev;choice=null;paint()},reset(){last=-1;seen=-1;root=null;choice=null;current=null}}
})();
