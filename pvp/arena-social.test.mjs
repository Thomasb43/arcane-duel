import test from 'node:test';
import assert from 'node:assert/strict';
import {createLobby} from './arena-lobby.mjs';
function setup(){let clock=1000;const l=createLobby({now:()=>clock});const reg=name=>l({action:'social_register',name});const a=reg('Kael'),b=reg('Leon'),c=reg('Astra');const as=(p,action,extra={})=>l({action,playerId:p.me.id,profileToken:p.profileToken,...extra});const request=(p,q)=>as(p,'social_request',{target:q.me.id});return {l,a,b,c,as,request,tick:n=>clock+=n}}
test('friend requests are private, reciprocal only after recipient accepts',()=>{
 const {a,b,c,as,request}=setup();request(a,b);assert.equal(as(a,'social_status').friends.length,0);
 assert.equal(as(b,'social_status').incoming[0].id,a.me.id);assert.equal(as(c,'social_status').incoming.length,0);
 assert.throws(()=>as(a,'social_accept',{target:b.me.id}));assert.throws(()=>as(c,'social_status',{playerId:a.me.id}));
 as(b,'social_accept',{target:a.me.id});assert.equal(as(a,'social_status').friends[0].id,b.me.id);
 as(a,'social_remove',{target:b.me.id});assert.equal(as(b,'social_status').friends.length,0)
});
test('reject and cancel requests, online status expires',()=>{
 const {a,b,as,request,tick}=setup();request(a,b);as(b,'social_decline',{target:a.me.id});assert.equal(as(a,'social_status').outgoing.length,0);
 request(a,b);as(a,'social_cancel',{target:b.me.id});assert.equal(as(b,'social_status').incoming.length,0);
 request(a,b);as(b,'social_accept',{target:a.me.id});tick(16000);assert.equal(as(a,'social_status').friends[0].online,false)
});
test('accepted friend invite pairs players without room code; outsiders denied',()=>{
 const {l,a,b,c,as,request}=setup();assert.throws(()=>as(a,'social_invite',{target:b.me.id}));request(a,b);as(b,'social_accept',{target:a.me.id});
 const invite=as(a,'social_invite',{target:b.me.id}).invites[0];assert.equal(as(c,'social_status').invites.length,0);
 assert.throws(()=>as(c,'social_invite_accept',{inviteId:invite.id}));assert.throws(()=>as(a,'social_invite_accept',{inviteId:invite.id}));assert.throws(()=>as(a,'social_invite_claim',{inviteId:invite.id}));
 as(b,'social_invite_accept',{inviteId:invite.id});const x=as(a,'social_invite_claim',{inviteId:invite.id}).room,y=as(b,'social_invite_claim',{inviteId:invite.id}).room;
 assert.equal(x.room,y.room);assert.notEqual(x.token,y.token);assert.throws(()=>l({action:'join',room:x.room}));
 l({action:'ready',room:x.room,token:x.token,ready:true});const state=l({action:'ready',room:y.room,token:y.token,ready:true});assert.equal(state.status,'duel');assert.equal(state.duel.own.lp,4000)
});
test('invite expires and can be declined',()=>{
 const {a,b,as,request,tick}=setup();request(a,b);as(b,'social_accept',{target:a.me.id});
 const v=as(a,'social_invite',{target:b.me.id}).invites[0];as(b,'social_invite_decline',{inviteId:v.id});assert.throws(()=>as(b,'social_invite_claim',{inviteId:v.id}));
 const x=as(a,'social_invite',{target:b.me.id}).invites.find(i=>i.status==='pending');tick(120001);assert.throws(()=>as(b,'social_invite_accept',{inviteId:x.id}))
});
