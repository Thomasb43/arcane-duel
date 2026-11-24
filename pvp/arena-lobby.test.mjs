import test from 'node:test';
import assert from 'node:assert/strict';
import {createLobby} from './arena-lobby.mjs';
test('private rooms, isolated tokens and ready states',()=>{
 const a=createLobby();const p=a({action:'create'});const q=a({action:'join',room:p.room});
 assert.equal(q.status,'paired');assert.notEqual(p.token,q.token);
 assert.throws(()=>a({action:'join',room:p.room}));
 assert.throws(()=>a({action:'status',room:p.room,token:'wrong'}));
 a({action:'ready',room:p.room,token:q.token,ready:true});
 assert.equal(a({action:'status',room:p.room,token:p.token}).opponentReady,true);
 a({action:'leave',room:p.room,token:q.token});
 assert.equal(a({action:'status',room:p.room,token:p.token}).players,1);
});
test('matchmaking pairs only public queue; rooms expire',()=>{
 let clock=0;const a=createLobby({now:()=>clock});
 const p=a({action:'create'});const x=a({action:'match'});const y=a({action:'match'});
 assert.equal(x.room,y.room);assert.notEqual(x.room,p.room);
 clock+=16*60*1000;assert.throws(()=>a({action:'status',room:x.room,token:x.token}));
});
