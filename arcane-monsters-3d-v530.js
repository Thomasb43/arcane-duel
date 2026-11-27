/* Arcane Duel 5.30 — original, procedural, articulated WebGL combat models.
   Self-contained; no CDN, external models, or copied game assets. */
(function(){
'use strict';
const PI=Math.PI,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t;
const V=(x=0,y=0,z=0)=>[x,y,z],sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const n=Math.hypot(...a)||1;return a.map(x=>x/n)};
const I=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function mul(a,b){const o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
function trs(p,r,s){const [x,y,z]=r,cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);return [(cy*cz)*s[0],(cx*sz+sx*sy*cz)*s[0],(sx*sz-cx*sy*cz)*s[0],0,-cy*sz*s[1],(cx*cz-sx*sy*sz)*s[1],(sx*cz+cx*sy*sz)*s[1],0,sy*s[2],-sx*cy*s[2],cx*cy*s[2],0,p[0],p[1],p[2],1]}
function persp(fov,a,n,f){const t=1/Math.tan(fov/2);return [t/a,0,0,0,0,t,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0]}
function look(eye,at){const z=norm(sub(eye,at)),x=norm(cross([0,1,0],z)),y=cross(z,x);return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]}
function transform(m,p){return [m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14],m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15]]}
function group(parent,p=V(),r=V(),s=V(1,1,1)){const n={p,r,s,children:[],mesh:null,m:null};if(parent)parent.children.push(n);return n}
const C={ivory:[.85,.88,.94],gold:[.92,.58,.14],bright:[1,.79,.32],blue:[.12,.53,.9],cyan:[.16,.83,1],navy:[.055,.13,.24],black:[.055,.045,.055],fur:[.75,.41,.13],mane:[.56,.23,.055],maneLight:[.93,.56,.14],red:[.46,.025,.04],steel:[.37,.42,.49],white:[1,.96,.78],teeth:[.95,.9,.74],eye:[.35,.9,1],ember:[1,.27,.055]};
function mat(color,metal=.12,emit=0){return {color,metal,emit}}
const M={ivory:mat(C.ivory,.35),gold:mat(C.gold,.82),bright:mat(C.bright,.72),blue:mat(C.blue,.45,.12),cyan:mat(C.cyan,.25,.58),navy:mat(C.navy,.42),black:mat(C.black,.16),fur:mat(C.fur,.04),mane:mat(C.mane,.07),maneLight:mat(C.maneLight,.12),red:mat(C.red,.13),steel:mat(C.steel,.76),white:mat(C.white,.3),teeth:mat(C.teeth,.04),eye:mat(C.eye,.1,.9),ember:mat(C.ember,.15,.75)};
function mesh(parent,geo,p,s,m,r=V()){const n=group(parent,p,r,s);n.mesh=geo;n.m=m;return n}
function sphere(g,p,s,m,r){return mesh(g,'sphere',p,s,m,r)}
function cone(g,p,s,m,r){return mesh(g,'cone',p,s,m,r)}
function box(g,p,s,m,r){return mesh(g,'box',p,s,m,r)}
function rod(g,a,b,width,m,taper=false){const d=sub(b,a),len=Math.hypot(...d)||.01,dir=norm(d),n=mesh(g,taper?'cone':'tube',a.map((x,i)=>(x+b[i])/2),V(width,len,width),m);const y=dir,ref=Math.abs(y[2])>.94?[1,0,0]:[0,0,1],x=norm(cross(y,ref)),z=cross(x,y);n.basis=[x[0]*width,x[1]*width,x[2]*width,0,y[0]*len,y[1]*len,y[2]*len,0,z[0]*width,z[1]*width,z[2]*width,0,n.p[0],n.p[1],n.p[2],1];return n}
function tri(g,a,b,c,m){const n=group(g);n.mesh={tri:[a,b,c]};n.m=m;return n}
function armor(g,p,s,r=V()){sphere(g,p,s,M.gold,r);sphere(g,[p[0],p[1]+s[1]*.08,p[2]+s[2]*.12],s.map((v,i)=>v*(i===0?.73:.83)),M.steel,r)}
function makeDragon(){
 const root=group(),body=group(root,[0,1.08,0]);
 sphere(body,[0,0,0],[.64,.52,1.05],M.ivory);sphere(body,[0,-.17,.43],[.47,.38,.76],M.gold);
 for(let i=0;i<6;i++)sphere(body,[0,-.12+i*.015,.34-i*.22],[.48-i*.025,.37-i*.014,.17],i%2?M.ivory:M.bright,[.1,0,0]);
 const chest=group(body,[0,.1,.65]);sphere(chest,[0,.08,0],[.53,.61,.52],M.ivory);
 sphere(chest,[0,.15,.43],[.26,.34,.12],M.gold);sphere(chest,[0,.17,.53],[.14,.20,.10],M.cyan);
 const neck=group(chest,[0,.38,.04]);sphere(neck,[0,.30,-.03],[.33,.49,.35],M.ivory,[-.3,0,0]);sphere(neck,[0,.67,.13],[.28,.45,.3],M.ivory,[-.48,0,0]);
 for(let i=0;i<4;i++)sphere(neck,[0,.12+i*.18,.28+i*.025],[.22,.13,.08],M.bright);
 const head=group(neck,[0,.90,.30]);sphere(head,[0,.06,0],[.32,.29,.43],M.ivory);sphere(head,[0,.02,.35],[.23,.17,.39],M.ivory);sphere(head,[0,.13,.34],[.24,.10,.29],M.gold);sphere(head,[0,.05,.62],[.16,.10,.12],M.ivory);
 const jaw=group(head,[0,-.13,.14]);sphere(jaw,[0,-.03,.22],[.21,.09,.35],M.ivory);sphere(jaw,[0,.045,.21],[.16,.025,.27],M.black);
 for(const side of [-1,1]){
  sphere(head,[side*.265,.12,.17],[.065,.055,.10],M.eye);sphere(head,[side*.30,.20,.14],[.065,.065,.17],M.bright);
  for(let i=0;i<4;i++){cone(jaw,[side*.13,.08,.15+i*.105],[.037,.10,.037],M.teeth);cone(head,[side*.14,-.095,.20+i*.1],[.034,.095,.034],M.teeth,[0,0,PI])}
  rod(head,[side*.22,.23,-.16],[side*.31,.53,-.42],.105,M.gold,true);
  rod(head,[side*.25,.23,-.06],[side*.51,.36,-.15],.083,M.bright,true);
  rod(head,[side*.25,-.02,-.16],[side*.54,-.01,-.41],.12,M.gold,true);
 }
 rod(head,[0,.27,-.23],[0,.49,-.50],.10,M.bright,true);
 const wings=[];
 for(const side of [-1,1]){
  const wing=group(body,[side*.43,.25,-.1]),tip=group(wing,[side*1.03,.97,-.11]);wings.push({wing,tip,side});
  const a=[0,0,0],b=[side*.50,.75,.03],c=[side*1.03,.97,-.11],d=[side*.65,.05,-.90],e=[side*.14,-.14,-.63];
  tri(wing,a,b,d,M.blue);tri(wing,b,c,d,M.blue);tri(wing,a,d,e,M.navy);
  rod(wing,a,b,.095,M.ivory);rod(wing,b,c,.076,M.gold);rod(wing,a,d,.037,M.bright);rod(wing,a,e,.035,M.gold);
  const pts=[[0,0,0],[side*.67,.13,-.25],[side*1.29,-.16,-.58],[side*.86,-.54,-1.02],[side*.26,-.67,-.85],[-side*.38,-.92,-.78]];
  for(let i=1;i<pts.length-1;i++){tri(tip,pts[0],pts[i],pts[i+1],i%2?M.blue:M.cyan);rod(tip,pts[0],pts[i],i===1?.061:.034,M.gold,true)}
  rod(tip,pts[0],pts[5],.043,M.ivory,true);
  for(let i=1;i<pts.length-1;i++)rod(tip,pts[i],pts[i+1],.018,M.bright);
 }
 const legs=[];
 for(const side of [-1,1])for(const front of [-1,1]){
  const hip=group(body,[side*.46,-.20,front*.62]),knee=group(hip,[side*.13,-.45,front*.08]);legs.push({hip,knee,side,front});
  sphere(hip,[side*.06,-.18,front*.05],[.21,.33,.23],M.ivory);sphere(hip,[side*.18,-.18,front*.05],[.10,.23,.16],M.gold);
  rod(knee,[0,0,0],[-side*.03,-.35,.12],.11,M.ivory);sphere(knee,[0,-.36,.18],[.16,.12,.24],M.gold);
  for(let i=-1;i<=1;i++)rod(knee,[i*.085,-.36,.28],[i*.12,-.40,.49],.045,M.bright,true);
 }
 let tail=group(body,[0,-.05,-.86]);const tails=[];
 for(let i=0;i<7;i++){const len=.35-i*.023;tails.push(tail);sphere(tail,[0,0,-len*.44],[.23-i*.023,.20-i*.020,len*.66],M.ivory);rod(tail,[0,.13-i*.012,-.11],[0,.32-i*.022,-.26],.075-i*.007,M.gold,true);tail=group(tail,[0,-.025,-len])}
 for(let i=0;i<6;i++)rod(body,[0,.44,-.68+i*.22],[0,.72,-.78+i*.22],.095,M.gold,true);
 const mouth=group(jaw,[0,.04,.48]);
 return {root,body,neck,head,jaw,wings,legs,tails,marker:mouth,kind:'dragon'};
}
function makeLion(){
 const root=group(),hips=group(root,[0,.99,0]),torso=group(hips,[0,.32,0]);
 sphere(hips,[0,0,0],[.43,.30,.29],M.black);
 sphere(hips,[0,.04,.14],[.44,.15,.22],M.gold);sphere(hips,[0,.03,.35],[.14,.14,.075],M.ember);
 for(const side of [-1,1]){box(hips,[side*.28,-.20,.12],[.19,.40,.16],M.gold,[0,0,side*.18]);box(hips,[side*.27,-.20,.22],[.12,.33,.055],M.red,[0,0,side*.18])}
 sphere(torso,[0,.27,0],[.55,.55,.31],M.black);sphere(torso,[0,.30,.11],[.50,.43,.29],M.gold);
 for(const side of [-1,1]){sphere(torso,[side*.23,.43,.26],[.28,.22,.115],M.steel,[0,side*.12,side*.15]);sphere(torso,[side*.25,.43,.34],[.25,.075,.05],M.bright,[0,side*.12,-side*.3])}
 for(let i=0;i<3;i++){sphere(torso,[0,.14-i*.13,.29],[.31-i*.036,.10,.08],M.steel);sphere(torso,[0,.12-i*.13,.34],[.29-i*.036,.023,.04],M.bright)}
 sphere(torso,[0,.33,.40],[.12,.14,.075],M.ember);sphere(torso,[0,.70,0],[.26,.20,.22],M.fur);
 // Cape with several three-dimensional folded panels.
 const cape=group(torso,[0,.64,-.25]);
 for(let i=0;i<7;i++){const x=-.49+i*.163;tri(cape,[x,.04,0],[x+.16,.04,-.04],[x+.12,-1.18,-.49-Math.abs(x)*.25],i%2?M.red:mat([.27,.018,.035],.1));tri(cape,[x,.04,0],[x+.12,-1.18,-.49-Math.abs(x)*.25],[x-.025,-1.09,-.45-Math.abs(x)*.25],M.red)}
 const head=group(torso,[0,.93,.025]);sphere(head,[0,0,-.03],[.48,.46,.39],M.mane);
 // Sculpted radial locks, overlapping gold and copper hair.
 for(let i=0;i<19;i++){const a=i*PI*2/19,x=Math.cos(a),y=Math.sin(a);const p=[x*.32,y*.33,-.03];sphere(head,[x*.37,y*.36,-.025],[.14,.26,.18],i%3?M.maneLight:M.mane,[.2,0,-a+PI/2]);rod(head,p,[x*.55,y*.54,-.16],.105,i%2?M.mane:M.maneLight,true)}
 sphere(head,[0,.02,.21],[.30,.31,.25],M.fur);sphere(head,[0,-.06,.39],[.24,.15,.20],M.maneLight);
 sphere(head,[0,.01,.52],[.095,.06,.065],M.black);sphere(head,[0,-.17,.39],[.18,.10,.16],M.fur);
 const jaw=group(head,[0,-.16,.29]);sphere(jaw,[0,-.025,.16],[.17,.075,.14],M.maneLight);sphere(jaw,[0,.025,.15],[.135,.035,.13],M.black);
 for(const side of [-1,1]){sphere(head,[side*.17,.095,.37],[.075,.045,.046],M.ember);sphere(head,[side*.17,.15,.37],[.105,.043,.045],M.mane,[0,0,-side*.18]);sphere(head,[side*.26,.25,.05],[.10,.13,.07],M.fur);cone(head,[side*.11,-.115,.49],[.038,.12,.038],M.teeth,[0,0,PI]);cone(jaw,[side*.10,.04,.23],[.026,.08,.026],M.teeth)}
 sphere(head,[0,.30,.23],[.30,.095,.15],M.gold);for(let i=-2;i<=2;i++){cone(head,[i*.11,.41-Math.abs(i)*.025,.21],[.075,.23-Math.abs(i)*.025,.075],M.bright,[0,0,-i*.17])}sphere(head,[0,.33,.36],[.07,.08,.035],M.ember);
 const arms=[];
 for(const side of [-1,1]){
  const shoulder=group(torso,[side*.54,.47,0]),elbow=group(shoulder,[side*.11,-.39,.015]),hand=group(elbow,[0,-.39,.02]);arms.push({side,shoulder,elbow,hand});
  sphere(shoulder,[side*.08,-.08,0],[.30,.24,.25],M.gold);sphere(shoulder,[side*.13,-.02,.08],[.23,.17,.20],M.steel);rod(shoulder,[side*.20,.09,0],[side*.42,.23,-.035],.13,M.bright,true);
  sphere(shoulder,[side*.10,-.25,0],[.15,.22,.16],M.black);sphere(elbow,[0,-.07,0],[.16,.12,.15],M.gold);sphere(elbow,[0,-.23,0],[.17,.22,.17],M.steel);sphere(elbow,[0,-.22,.13],[.12,.19,.055],M.gold);
  sphere(hand,[0,-.06,.02],[.13,.14,.12],M.fur);for(let i=-1;i<=1;i++)sphere(hand,[i*.07,-.12,.08],[.045,.07,.07],M.gold);
  if(side===1){const sword=group(hand,[0,-.05,.06],[0,0,-.13]);rod(sword,[0,-.16,0],[0,.20,0],.065,M.black);box(sword,[0,.21,0],[.25,.075,.10],M.gold);box(sword,[0,.77,0],[.11,1.03,.04],M.steel);box(sword,[0,.77,.024],[.032,1.03,.018],M.bright);cone(sword,[0,1.34,0],[.11,.22,.04],M.bright)}
 }
 const legs=[];
 for(const side of [-1,1]){const thigh=group(hips,[side*.23,-.14,0]),shin=group(thigh,[0,-.44,0]);legs.push({side,thigh,shin});sphere(thigh,[0,-.19,0],[.19,.28,.19],M.black);sphere(thigh,[0,-.17,.13],[.16,.22,.10],M.gold);sphere(shin,[0,0,.06],[.16,.14,.17],M.bright);sphere(shin,[0,-.23,0],[.15,.26,.16],M.steel);sphere(shin,[0,-.25,.12],[.10,.22,.06],M.gold);sphere(shin,[0,-.46,.13],[.18,.11,.26],M.gold)}
 return {root,hips,torso,head,jaw,cape,arms,legs,marker:group(arms[1].hand,[0,.85,.05]),kind:'lion'};
}
function pose(model,t,phase,dir=1){
 const idle=Math.sin(t*7),attack=phase==='attack'?clamp(t,0,1):0,wind=phase==='attack'?Math.sin(attack*PI):0;
 if(model.kind==='dragon'){
 const m=model;m.body.p[1]=1.05+idle*.035;m.body.r[0]=-.05-wind*.16;m.neck.r[0]=-.08+wind*.22;m.head.r[0]=.04-wind*.12;m.jaw.r[0]=.08+(phase==='attack'?.58*Math.sin(Math.min(1,attack*1.6)*PI*.85):.06);
 for(const w of m.wings){w.wing.r[2]=w.side*(.12+Math.sin(t*8)*.22-wind*.38);w.wing.r[1]=w.side*(.08+wind*.12);w.tip.r[2]=w.side*(Math.sin(t*8+.6)*.20+wind*.15)}
 for(const l of m.legs){l.hip.r[0]=l.front*.12+wind*.15;l.knee.r[0]=-.12+wind*.16}
 m.tails.forEach((g,i)=>{g.r[1]=Math.sin(t*5-i*.43)*.13;g.r[0]=-.04+Math.sin(t*4-i*.38)*.06});
 }else{
 const m=model;m.hips.p[1]=.99+idle*.023-wind*.07;m.torso.r[1]=-.10+wind*.76*dir;m.torso.r[0]=wind*.13;m.head.r[1]=-wind*.18*dir;m.jaw.r[0]=wind*.48;m.cape.r[0]=-.1-wind*.35;
 const a=m.arms[1],b=m.arms[0];a.shoulder.r[2]=.34+wind*1.15;a.shoulder.r[0]=-.25-attack*1.65;a.elbow.r[0]=-1.04+attack*1.26;a.hand.r[2]=-.2-wind*.38;b.shoulder.r[2]=-.34-wind*.35;b.shoulder.r[0]=-.24+wind*.20;b.elbow.r[0]=-.68;
 for(const l of m.legs){l.thigh.r[0]=l.side*wind*.19;l.shin.r[0]=wind*.12}
 }
}
function geometry(type){
 const vertices=[],push=(p,n)=>vertices.push(...p,...n);
 function triangle(a,b,c,na,nb,nc){const n=norm(cross(sub(b,a),sub(c,a)));push(a,na||n);push(b,nb||n);push(c,nc||n)}
 if(typeof type==='object'){const [a,b,c]=type.tri;triangle(a,b,c);triangle(c,b,a)}
 else if(type==='sphere'){const n=16,m=12,point=(i,j)=>{const a=i*PI*2/n,b=j*PI/m;return [Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)]};for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);triangle(a,b,c,a,b,c);triangle(a,c,d,a,c,d)}}
 else if(type==='box'){const a=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]];for(const [i,j,k,l] of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,1,5,4],[3,7,6,2]]){triangle(a[i],a[j],a[k]);triangle(a[i],a[k],a[l])}}
 else{const n=12,top=type==='cone'?.04:.82;for(let i=0;i<n;i++){const a=i*2*PI/n,b=(i+1)*2*PI/n,p=[Math.cos(a),-.5,Math.sin(a)],q=[Math.cos(b),-.5,Math.sin(b)],r=[top*Math.cos(b),.5,top*Math.sin(b)],s=[top*Math.cos(a),.5,top*Math.sin(a)];triangle(p,s,r);triangle(p,r,q);triangle([0,-.5,0],p,q);triangle([0,.5,0],r,s)}}
 return new Float32Array(vertices);
}
const vertex='attribute vec3 aPos,aNormal;uniform mat4 uModel,uVP;uniform mat3 uNormal;varying vec3 vN,vP;void main(){vec4 w=uModel*vec4(aPos,1.);vP=w.xyz;vN=normalize(uNormal*aNormal);gl_Position=uVP*w;}';
const fragment='precision mediump float;varying vec3 vN,vP;uniform vec3 uColor,uEye;uniform float uMetal,uEmit;void main(){vec3 n=normalize(vN),v=normalize(uEye-vP),l=normalize(vec3(-.5,.85,.7)),l2=normalize(vec3(.85,.28,-.45));float d=max(dot(n,l),0.),d2=max(dot(n,l2),0.),rim=pow(1.-max(dot(n,v),0.),2.5);float sp=pow(max(dot(n,normalize(l+v)),0.),mix(13.,45.,uMetal));vec3 col=uColor*(.29+.79*d+.28*d2)+vec3(1.,.88,.62)*sp*(.12+.72*uMetal)+vec3(.27,.53,.95)*rim*.30+uColor*uEmit*.65;gl_FragColor=vec4(clamp(col,0.,1.),1.);}';
function normalMatrix(m){const a=[m[0],m[1],m[2]],b=[m[4],m[5],m[6]],c=[m[8],m[9],m[10]],x=cross(b,c),y=cross(c,a),z=cross(a,b),d=dot(a,x)||1;return [...x,...y,...z].map(v=>v/d)}
function renderer(canvas){
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,depth:true,powerPreference:'low-power'});if(!gl)throw Error('WebGL unavailable');
 const compile=(kind,src)=>{const sh=gl.createShader(kind);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh};
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment),p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
 const pos=gl.getAttribLocation(p,'aPos'),nor=gl.getAttribLocation(p,'aNormal'),u={};for(const k of ['uModel','uVP','uNormal','uColor','uEye','uMetal','uEmit'])u[k]=gl.getUniformLocation(p,k);
 const cache=new Map();
 function get(g){if(cache.has(g))return cache.get(g);const data=geometry(g),buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const v={buf,count:data.length/6};cache.set(g,v);return v}
 let marker=null;
 function render(model,eye,at){
  if(gl.isContextLost())throw Error('WebGL context lost');
  gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(p);
  const vp=mul(persp(35*PI/180,canvas.width/canvas.height,.1,30),look(eye,at));gl.uniformMatrix4fv(u.uVP,false,vp);gl.uniform3fv(u.uEye,eye);
  gl.enableVertexAttribArray(pos);gl.enableVertexAttribArray(nor);
  function visit(n,parent){const m=mul(parent,n.basis||trs(n.p,n.r,n.s));if(n===model.marker){const q=transform(m,[0,0,0]);marker=transform(vp,q.slice(0,3))}
   if(n.mesh){const g=get(n.mesh);gl.bindBuffer(gl.ARRAY_BUFFER,g.buf);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(nor,3,gl.FLOAT,false,24,12);gl.uniformMatrix4fv(u.uModel,false,m);gl.uniformMatrix3fv(u.uNormal,false,normalMatrix(m));gl.uniform3fv(u.uColor,n.m.color);gl.uniform1f(u.uMetal,n.m.metal);gl.uniform1f(u.uEmit,n.m.emit);gl.drawArrays(gl.TRIANGLES,0,g.count)}
   for(const c of n.children)visit(c,m);
  }
  visit(model.root,I());return marker&&marker[3]>0?[marker[0]/marker[3]*.5+.5,.5-marker[1]/marker[3]*.5]:[.5,.4];
 }
 return {render,dispose(){for(const g of cache.values())gl.deleteBuffer(g.buf);gl.deleteProgram(p);gl.deleteShader(vs);gl.deleteShader(fs)}};
}
let active=false;
async function play(opts){
 if(active||!opts||!['dragon','lion'].includes(opts.kind))return false;
 const canvas=document.createElement('canvas');canvas.className='ad530-webgl';canvas.setAttribute('aria-hidden','true');
 const size=Math.round(Math.min(innerWidth*.88,innerHeight*.66,460)),scale=Math.min(devicePixelRatio||1,1.5);if(size<130)return false;
 canvas.width=Math.round(size*scale);canvas.height=Math.round(size*scale);canvas.style.width=size+'px';canvas.style.height=size+'px';
 const sx=opts.sx,sy=opts.sy,tx=opts.tx,ty=opts.ty,dx=tx-sx,dy=ty-sy;
 const cx=clamp(sx+dx*.22,size*.5,innerWidth-size*.5),cy=clamp(sy+dy*.22,size*.5,innerHeight-size*.5);
 canvas.style.left=(cx-size*.5)+'px';canvas.style.top=(cy-size*.5)+'px';
 let r=null,model=null,frame=0,stopped=false,marker=[.5,.4],attackFired=false,impactFired=false;
 active=true;
 try{
  r=renderer(canvas);model=opts.kind==='dragon'?makeDragon():makeLion();const dir=dx<0?-1:1;
  const eye=opts.kind==='dragon'?[4.4*dir,2.95,6.6]:[3.3*dir,2.25,5.9],at=opts.kind==='dragon'?[0,1.3,-.25]:[0,1.56,0];
  model.root.r[1]=dir*.16;pose(model,0,'idle',dir);marker=r.render(model,eye,at);
  document.body.append(canvas);opts.onAppear?.();
  const t0=performance.now(),duration=1050;
  await new Promise((resolve,reject)=>{
   const tick=now=>{if(stopped)return;try{
    const t=now-t0,p=clamp(t/280,0,1),q=clamp((t-280)/420,0,1),ret=clamp((t-800)/250,0,1);
    const appear=1-Math.pow(1-p,3),shrink=1-ret*.84,sc=(.18+.82*appear)*shrink;
    const jump=opts.kind==='lion'?Math.sin(q*PI)*Math.min(38,Math.hypot(dx,dy)*.14):Math.sin(q*PI)*-9;
    const dist=Math.hypot(dx,dy)||1,offX=(sx-cx)*(1-appear)+(sx-cx)*ret+dx/dist*jump,offY=(sy-cy)*(1-appear)+(sy-cy)*ret+dy/dist*jump;
    canvas.style.transform='translate('+offX+'px,'+offY+'px) scale('+sc+')';canvas.style.opacity=String(Math.min(1,p*4)*(1-ret));
    pose(model,t<280?t/1000:q,t>=280&&t<800?'attack':'idle',dir);
    model.root.r[1]=dir*(.16+.10*Math.sin(q*PI));marker=r.render(model,eye,at);
    if(!attackFired&&t>=365){attackFired=true;opts.onAttack?.(cx+offX+(marker[0]-.5)*size*sc,cy+offY+(marker[1]-.5)*size*sc)}
    if(!impactFired&&t>=685){impactFired=true;opts.onImpact?.()}
    if(t>=duration){resolve();return}frame=requestAnimationFrame(tick);
   }catch(e){reject(e)}};
   frame=requestAnimationFrame(tick);
  });
  return true;
 }catch(e){console.warn('Arcane 3D fallback:',e);return false}
 finally{stopped=true;if(frame)cancelAnimationFrame(frame);canvas.remove();if(r)r.dispose();active=false}
}
window.ARCANE_3D_530={play,inspect(){return {dragon:makeDragon(),lion:makeLion()}},_test:{geometry,pose,trs,mul,look,persp,renderer}};
})();