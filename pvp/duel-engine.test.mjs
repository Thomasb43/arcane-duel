import test from 'node:test';
import assert from 'node:assert/strict';
import {newDuel,apply,duelView} from './duel-engine.mjs';
import {createLobby} from './arena-lobby.mjs';
const monster={name:'Glutkoloss',kind:'monster',atk:2300,def:1900,level:5};
const recruit={name:'Löwenrekrut',kind:'monster',atk:1000,def:900,level:3};
const trap={name:'Arkaner Rückschlag',kind:'trap'};
test('both ready creates a single duel; only the current player can act',()=>{
 const l=createLobby();const a=l({action:'create'}),b=l({action:'join',room:a.room});
 const req=(p,action,extra={})=>l({action,room:p.room,token:p.token,...extra});
 assert.equal(req(a,'ready',{ready:true}).duel,undefined);
 const v=req(b,'ready',{ready:true}).duel;assert.equal(v.own.lp,4000);
 const w=req(a,'status').duel;assert.equal(v.first,w.first);assert.notEqual(v.you,w.you);assert.equal(v.other.hand,undefined);
 const active=v.you===v.turn?b:a, waiting=active===a?b:a;
 assert.throws(()=>req(waiting,'move',{move:'end',rev:0}));
 assert.equal(req(active,'move',{move:'end',rev:0}).duel.rev,1);
 assert.throws(()=>req(active,'move',{move:'end',rev:0}));
});
test('tribute, hidden cards, and manual trap activation',()=>{
 const d=newDuel(0),p=d.p[0],q=d.p[1];const m=(i,b)=>apply(d,i,{...b,rev:d.rev});
 p.hand=[recruit];m(0,{move:'summon',hand:0,zone:0,position:'defense',tributes:[]});
 assert.deepEqual(duelView(d,1).other.mon[0],{faceDown:true});assert.throws(()=>m(0,{move:'phase'}));
 m(0,{move:'end'});q.hand=[trap];m(1,{move:'set',hand:0,zone:0});assert.deepEqual(duelView(d,0).other.spell[0],{faceDown:true});
 m(1,{move:'end'});p.hand=[monster];m(0,{move:'summon',hand:0,zone:1,position:'attack',tributes:[0]});
 m(0,{move:'end'});m(1,{move:'end'});m(0,{move:'phase'});m(0,{move:'attack',from:1,to:-1});
 assert.equal(d.pending.attacker,0);assert.equal(q.lp,4000);assert.throws(()=>m(0,{move:'pass'}));m(1,{move:'trap',zone:0});
 assert.equal(q.lp,4000);assert.equal(p.mon[1].baseAtk,1800);assert.equal(q.spell[0],null);assert.equal(d.pending,null);
});
test('stronger defending attack-position monster damages attacking player',()=>{
 const d=newDuel(0);d.round=3;d.phase='battle';d.p[0].mon[0]={...recruit,position:'attack'};d.p[1].mon[0]={...monster,position:'attack'};
 apply(d,0,{move:'attack',from:0,to:0,rev:0});assert.equal(d.p[0].lp,2700);assert.equal(d.p[0].mon[0],null);
});
