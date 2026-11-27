/* Arcane Duel 5.30 — sculpted procedural dragon revision, articulated WebGL combat models.
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
// Continuous swept meshes, curved horns and sculpted wing membranes.
function surface(g,rows,cols,fn,m,wrap=false){
 const data=[],grid=[];
 for(let i=0;i<=rows;i++){const row=[];for(let j=0;j<=cols;j++)row.push(fn(i/rows,j/cols));grid.push(row)}
 const normals=grid.map((row,i)=>row.map((p,j)=>{
  const du=sub(grid[Math.min(rows,i+1)][j],grid[Math.max(0,i-1)][j]);
  const a=wrap?(j===0||j===cols?cols-1:j-1):Math.max(0,j-1),b=wrap?(j===0||j===cols?1:j+1):Math.min(cols,j+1);
  return norm(cross(du,sub(row[b],row[a])));
 }));
 function vert(i,j){data.push(...grid[i][j],...normals[i][j])}
 for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){vert(i,j);vert(i+1,j);vert(i+1,j+1);vert(i,j);vert(i+1,j+1);vert(i,j+1)}
 const n=group(g);n.mesh={data:new Float32Array(data)};n.m=m;return n;
}
function spline(points,t){
 const x=clamp(t,0,1)*(points.length-1),i=Math.min(points.length-2,Math.floor(x)),f=x-i;
 const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];
 return b.map((v,k)=>.5*((2*v)+(-a[k]+c[k])*f+(2*a[k]-5*v+4*c[k]-d[k])*f*f+(-a[k]+3*v-3*c[k]+d[k])*f*f*f));
}
function sculpt(g,profile,m,segments=22,sides=20){
 return surface(g,segments,sides,(t,v)=>{
  const p=spline(profile,t),a=spline(profile,Math.max(0,t-.003)),b=spline(profile,Math.min(1,t+.003)),dir=norm(sub(b.slice(0,3),a.slice(0,3)));
  const ref=Math.abs(dir[0])>.92?[0,1,0]:[1,0,0],x=norm(sub(ref,dir.map(k=>k*dot(ref,dir)))),y=norm(cross(dir,x)),ang=v*PI*2;
  const rx=Math.max(.002,p[3]),ry=Math.max(.002,p[4]??p[3]);
  return p.slice(0,3).map((q,i)=>q+x[i]*Math.cos(ang)*rx+y[i]*Math.sin(ang)*ry);
 },m,true);
}
function curve(g,pts,m,segments=14,sides=12){return sculpt(g,pts.map(p=>[p[0],p[1],p[2],p[3],p[3]]),m,segments,sides)}
function makeDragon(){
 const root=group(),body=group(root,[0,1.08,0]);
 const skin={color:[.69,.75,.83],metal:.34,emit:0,detail:1};
 const pearl={color:[.86,.89,.93],metal:.44,emit:0,detail:1};
 const dark={color:[.15,.22,.33],metal:.38,emit:0,detail:1};
 const gold={color:[.68,.42,.15],metal:.9,emit:0,detail:3};
 const pale={color:[.94,.76,.38],metal:.82,emit:0,detail:3};
 const sail={color:[.11,.29,.49],metal:.16,emit:.025,detail:2};
 const sailLight={color:[.18,.39,.60],metal:.19,emit:.025,detail:2};
 const glow={color:[.18,.75,1],metal:.18,emit:.65,detail:3};
 const tooth={color:[.92,.88,.76],metal:.12,emit:0,detail:3};
 sculpt(body,[[0,-.04,-1.03,.035,.035],[0,0,-.73,.43,.38],[0,.01,-.19,.55,.49],[0,.05,.38,.55,.57],[0,.13,.77,.40,.48],[0,.15,.96,.04,.05]],skin,32,28);
 // Overlapping sternum plates, separated by dark joints.
 sculpt(body,[[0,-.29,-.65,.025,.02],[0,-.36,-.28,.34,.15],[0,-.34,.27,.39,.21],[0,-.19,.67,.32,.27],[0,-.04,.89,.07,.07]],dark);
 for(let i=0;i<8;i++){const z=-.49+i*.16,w=.26+.10*Math.sin(i/7*PI);sphere(body,[0,-.40+i*.016,z],[w,.105,.115],i%3===0?gold:pearl,[-.10,0,0])}
 const chest=group(body,[0,.12,.65]);
 sculpt(chest,[[0,-.26,-.24,.15,.12],[0,-.04,-.05,.44,.34],[0,.24,.02,.43,.37],[0,.49,.06,.23,.23],[0,.57,.07,.03,.03]],pearl);
 for(const side of [-1,1]){
  curve(chest,[[side*.37,.38,.05,.055],[side*.34,.16,.28,.075],[side*.22,-.06,.40,.065],[side*.07,-.24,.36,.008]],gold);
  for(let i=0;i<3;i++)sculpt(body,[[side*.35,.27,.46-i*.39,.04,.025],[side*.51,.20,.34-i*.39,.16,.085],[side*.50,.06,.13-i*.39,.12,.06],[side*.40,-.01,-.02-i*.39,.005,.005]],i===0?gold:pearl,12,12);
 }
 sculpt(chest,[[0,-.17,.39,.015,.015],[0,.05,.45,.16,.065],[0,.26,.38,.12,.055],[0,.32,.33,.005,.005]],gold);
 sculpt(chest,[[0,-.07,.46,.005,.005],[0,.07,.49,.078,.04],[0,.23,.42,.005,.005]],glow,10,12);
 const neck=group(chest,[0,.39,.03]);
 sculpt(neck,[[0,-.14,-.02,.25,.25],[0,.14,-.08,.32,.29],[0,.43,-.04,.28,.25],[0,.68,.11,.235,.22],[0,.9,.30,.21,.19],[0,1.03,.38,.12,.12]],skin,30,26);
 for(let i=0;i<6;i++){const t=i/5;sphere(neck,[0,.04+t*.73,.20+t*.16],[.235-t*.065,.075,.09],i%2?pearl:gold,[-.30,0,0])}
 const head=group(neck,[0,.90,.30]);
 // Wedge-shaped skull and elongated muzzle, not separate balls.
 sculpt(head,[[0,.11,-.39,.015,.015],[0,.13,-.25,.25,.24],[0,.12,-.06,.32,.26],[0,.08,.19,.25,.19],[0,.025,.43,.18,.11],[0,.035,.64,.135,.077],[0,.04,.73,.02,.025]],pearl,32,28);
 sculpt(head,[[0,-.04,.16,.14,.035],[0,-.055,.42,.17,.04],[0,-.027,.69,.10,.03],[0,-.01,.73,.02,.01]],dark,16,16);
 const jaw=group(head,[0,-.12,.08]);
 sculpt(jaw,[[0,-.025,-.03,.19,.07],[0,-.055,.17,.21,.095],[0,-.05,.37,.16,.072],[0,-.015,.58,.11,.045],[0,0,.64,.014,.014]],skin,20,20);
 for(const side of [-1,1]){
  // Recessed eyes, narrow brow and swept cheek ridges.
  sphere(head,[side*.267,.15,.12],[.065,.070,.126],dark,[0,side*.18,0]);
  sphere(head,[side*.309,.15,.145],[.027,.035,.075],glow,[0,side*.18,0]);
  sphere(head,[side*.323,.151,.16],[.011,.029,.014],M.black);
  sculpt(head,[[side*.13,.26,.36,.013,.012],[side*.235,.255,.17,.085,.055],[side*.32,.24,-.035,.10,.064],[side*.33,.19,-.22,.014,.012]],gold,18,16);
  sculpt(head,[[side*.12,-.01,.49,.018,.02],[side*.24,.01,.16,.075,.065],[side*.32,.03,-.12,.12,.085],[side*.41,.12,-.42,.006,.007]],skin,20,16);
  sphere(head,[side*.14,.072,.63],[.04,.024,.044],dark,[0,side*.25,0]);
  curve(head,[[side*.20,.28,-.19,.105],[side*.29,.44,-.31,.088],[side*.39,.57,-.52,.052],[side*.43,.71,-.68,.022],[side*.38,.86,-.76,.003]],gold,26,16);
  curve(head,[[side*.25,.15,-.20,.085],[side*.43,.19,-.33,.056],[side*.56,.29,-.46,.025],[side*.60,.40,-.62,.003]],pale);
  curve(head,[[side*.25,-.035,-.15,.09],[side*.41,-.09,-.30,.055],[side*.48,-.04,-.49,.004]],gold);
  for(let i=0;i<5;i++){const z=.14+i*.083;curve(head,[[side*(.18-i*.013),-.06,z,.028],[side*(.17-i*.012),-.13-(i===1?.03:0),z+.025,.003]],tooth,5,8);curve(jaw,[[side*(.16-i*.012),.005,z,.021],[side*(.15-i*.012),.055,z+.02,.003]],tooth,5,8)}
 }
 curve(head,[[0,.29,-.17,.083],[0,.41,-.29,.061],[0,.54,-.48,.004]],pale);
 // Curved wing membranes: each bay has a scalloped edge and raised ribs.
 const wings=[];
 function membrane(g,a,b,c,material){
  surface(g,9,12,(u,v)=>{
   const edge=a.map((p,i)=>mix(b[i],c[i],v));
   const scallop=.21*Math.sin(v*PI);
   const p=a.map((q,i)=>mix(q,edge[i],u*(1-scallop)));
   p[1]+=.14*Math.sin(u*PI)*Math.sin(v*PI);return p;
  },material);
 }
 for(const side of [-1,1]){
  const wing=group(body,[side*.43,.25,-.10]),tip=group(wing,[side*1.03,.97,-.11]);wings.push({wing,tip,side});
  const shoulder=[0,0,0],elbow=[side*.50,.75,.03],joint=[side*1.03,.97,-.11],inner=[side*.14,-.24,-.81],mid=[side*.69,.03,-1.0];
  membrane(wing,shoulder,elbow,mid,sail);membrane(wing,elbow,joint,mid,sailLight);membrane(wing,shoulder,mid,inner,sail);
  curve(wing,[[...shoulder,.14],[side*.23,.43,.07,.105],[...elbow,.083],[...joint,.065]],skin,20,16);
  curve(wing,[[...shoulder,.048],[side*.29,.10,-.44,.038],[...mid,.005]],gold);
  curve(wing,[[...shoulder,.040],[side*.14,-.10,-.38,.023],[...inner,.003]],gold);
  const pts=[[side*.45,.45,-.08],[side*1.12,.30,-.34],[side*1.53,-.01,-.72],[side*1.10,-.41,-1.18],[side*.48,-.62,-1.08],[-side*.34,-.94,-.87]];
  const o=[0,0,0];
  for(let i=0;i<pts.length-1;i++)membrane(tip,o,pts[i],pts[i+1],i%2?sailLight:sail);
  for(let i=0;i<pts.length;i++){const p=pts[i];curve(tip,[[0,0,0,i===0?.066:.045],[p[0]*.45,p[1]*.6+.06,p[2]*.42,.035],[p[0]*.77,p[1]*.88+.04,p[2]*.76,.018],[...p,.003]],i<2?pale:gold,16,10)}
  curve(tip,[[0,0,0,.075],[side*.11,.14,.05,.055],[side*.23,.31,.06,.003]],pale,10,12);
 }
 const legs=[];
 for(const side of [-1,1])for(const front of [-1,1]){
  const hip=group(body,[side*.42,-.19,front*.62]),knee=group(hip,[side*.15,-.45,front*.08]);legs.push({hip,knee,side,front});
  sculpt(hip,[[0,.08,0,.13,.15],[side*.05,-.10,-front*.04,.23,.22],[side*.14,-.31,front*.03,.15,.14],[side*.15,-.47,front*.08,.11,.11]],skin,18,20);
  sculpt(hip,[[side*.12,-.04,.03,.02,.02],[side*.23,-.16,.06,.12,.065],[side*.21,-.31,.09,.07,.035],[side*.14,-.39,.10,.006,.006]],gold,14,14);
  sculpt(knee,[[0,.06,0,.11,.11],[0,-.11,-.045,.13,.12],[-side*.035,-.28,.055,.09,.09],[0,-.39,.15,.12,.10]],pearl,18,18);
  sculpt(knee,[[0,-.36,.06,.09,.065],[0,-.40,.22,.16,.095],[0,-.40,.34,.12,.06]],skin,12,16);
  for(let i=-1;i<=1;i++){curve(knee,[[i*.084,-.40,.23,.063],[i*.12,-.405,.34,.052],[i*.13,-.42,.46,.034]],skin,10,12);curve(knee,[[i*.13,-.41,.42,.046],[i*.14,-.43,.52,.025],[i*.14,-.47,.58,.003]],pale,10,10)}
 }
 let tail=group(body,[0,-.03,-.85]);const tails=[];
 for(let i=0;i<7;i++){const len=.35-i*.021,r=.21-i*.024,next=Math.max(.016,r-.024);tails.push(tail);
  sculpt(tail,[[0,0,.045,r*1.03,r*.85],[0,-.01,-len*.44,(r+next)*.5,r*.80],[0,-.025,-len-.035,next,next*.85]],skin,10,16);
  curve(tail,[[0,r*.65,-.08,r*.44],[0,r*1.36,-len*.55,r*.29],[0,r*1.70,-len*.94,.003]],gold,10,10);
  tail=group(tail,[0,-.025,-len]);
 }
 for(let i=0;i<6;i++){const z=-.69+i*.23;curve(body,[[0,.36,z,.10],[0,.57,z-.09,.073],[0,.78,z-.22,.004]],i%2?gold:pale,14,12)}
 for(let i=0;i<3;i++){curve(neck,[[0,.18+i*.23,-.23+i*.02,.062],[0,.28+i*.23,-.36+i*.04,.042],[0,.44+i*.23,-.45+i*.08,.003]],gold)}
 const mouth=group(jaw,[0,.04,.56]);
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
 for(const w of m.wings){w.wing.r[2]=w.side*(.12+Math.sin(t*5)*.11-wind*.38);w.wing.r[1]=w.side*(.08+wind*.12);w.tip.r[2]=w.side*(Math.sin(t*5+.6)*.10+wind*.15)}
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
 if(typeof type==='object'&&type.data)return type.data;
 if(typeof type==='object'){const [a,b,c]=type.tri;triangle(a,b,c);triangle(c,b,a)}
 else if(type==='sphere'){const n=16,m=12,point=(i,j)=>{const a=i*PI*2/n,b=j*PI/m;return [Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)]};for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);triangle(a,b,c,a,b,c);triangle(a,c,d,a,c,d)}}
 else if(type==='box'){const a=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]];for(const [i,j,k,l] of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,1,5,4],[3,7,6,2]]){triangle(a[i],a[j],a[k]);triangle(a[i],a[k],a[l])}}
 else{const n=12,top=type==='cone'?.04:.82;for(let i=0;i<n;i++){const a=i*2*PI/n,b=(i+1)*2*PI/n,p=[Math.cos(a),-.5,Math.sin(a)],q=[Math.cos(b),-.5,Math.sin(b)],r=[top*Math.cos(b),.5,top*Math.sin(b)],s=[top*Math.cos(a),.5,top*Math.sin(a)];triangle(p,s,r);triangle(p,r,q);triangle([0,-.5,0],p,q);triangle([0,.5,0],r,s)}}
 return new Float32Array(vertices);
}
const vertex='attribute vec3 aPos,aNormal;uniform mat4 uModel,uVP;uniform mat3 uNormal;varying vec3 vN,vP,vLocal;void main(){vLocal=aPos;vec4 w=uModel*vec4(aPos,1.);vP=w.xyz;vN=normalize(uNormal*aNormal);gl_Position=uVP*w;}';
const fragment='precision mediump float;varying vec3 vN,vP,vLocal;uniform vec3 uColor,uEye;uniform float uMetal,uEmit,uDetail;void main(){vec3 n=normalize(vN),v=normalize(uEye-vP),l=normalize(vec3(-.5,.85,.7)),l2=normalize(vec3(.85,.28,-.45));float d=max(dot(n,l),0.),d2=max(dot(n,l2),0.),rim=pow(1.-max(dot(n,v),0.),2.5);float sp=pow(max(dot(n,normalize(l+v)),0.),mix(13.,45.,uMetal));vec3 col=uColor*(.29+.79*d+.28*d2)+vec3(1.,.88,.62)*sp*(.12+.72*uMetal)+vec3(.27,.53,.95)*rim*.30+uColor*uEmit*.65;if(uDetail>.5){if(dot(n,v)<0.)n=-n;vec3 p=vLocal;vec3 w=pow(abs(n),vec3(4.));w/=max(.001,w.x+w.y+w.z);vec2 a=p.yz*18.,b=p.xz*18.,c=p.xy*18.;a.x+=floor(a.y)*.5;b.x+=floor(b.y)*.5;c.x+=floor(c.y)*.5;float scales=dot(w,vec3(length((fract(a)-.5)*vec2(1.,.79)),length((fract(b)-.5)*vec2(1.,.79)),length((fract(c)-.5)*vec2(1.,.79))));float pattern=1.;if(uDetail<1.5)pattern=.80+.20*(1.-smoothstep(.35,.52,scales));else if(uDetail<2.5)pattern=.85+.15*sin(p.x*19.+sin(p.z*8.)*2.);vec3 key=normalize(vec3(-.45,.78,.62)),fill=normalize(vec3(.70,.40,-.60)),halfv=normalize(key+v);float k=max(dot(n,key),0.),f=max(dot(n,fill),0.),nv=max(dot(n,v),0.),h=max(dot(n,halfv),0.);float shine=pow(h,mix(18.,76.,uMetal));float broad=pow(h,8.);vec3 fres=mix(vec3(.045),uColor,uMetal);fres+=(1.-fres)*pow(1.-nv,5.);vec3 ambient=mix(vec3(.10,.12,.17),vec3(.27,.31,.38),n.y*.5+.5);vec3 base=uColor*pattern;col=base*(ambient+k*vec3(.85,.79,.70)+f*vec3(.18,.34,.50))*(1.-uMetal*.35)+fres*(shine*1.8+broad*.25)+vec3(.19,.39,.66)*pow(1.-nv,3.)*.26+base*uEmit;col=col/(col+vec3(.65));col=pow(max(col,vec3(0.)),vec3(.78));}gl_FragColor=vec4(clamp(col,0.,1.),1.);}';
function normalMatrix(m){const a=[m[0],m[1],m[2]],b=[m[4],m[5],m[6]],c=[m[8],m[9],m[10]],x=cross(b,c),y=cross(c,a),z=cross(a,b),d=dot(a,x)||1;return [...x,...y,...z].map(v=>v/d)}
function renderer(canvas){
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,depth:true,powerPreference:'low-power'});if(!gl)throw Error('WebGL unavailable');
 const compile=(kind,src)=>{const sh=gl.createShader(kind);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh};
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment),p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
 const pos=gl.getAttribLocation(p,'aPos'),nor=gl.getAttribLocation(p,'aNormal'),u={};for(const k of ['uModel','uVP','uNormal','uColor','uEye','uMetal','uEmit','uDetail'])u[k]=gl.getUniformLocation(p,k);
 const cache=new Map();
 function get(g){if(cache.has(g))return cache.get(g);const data=geometry(g),buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const v={buf,count:data.length/6};cache.set(g,v);return v}
 let marker=null;
 function render(model,eye,at){
  if(gl.isContextLost())throw Error('WebGL context lost');
  gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(p);
  const vp=mul(persp(35*PI/180,canvas.width/canvas.height,.1,30),look(eye,at));gl.uniformMatrix4fv(u.uVP,false,vp);gl.uniform3fv(u.uEye,eye);
  gl.enableVertexAttribArray(pos);gl.enableVertexAttribArray(nor);
  function visit(n,parent){const m=mul(parent,n.basis||trs(n.p,n.r,n.s));if(n===model.marker){const q=transform(m,[0,0,0]);marker=transform(vp,q.slice(0,3))}
   if(n.mesh){const g=get(n.mesh);gl.bindBuffer(gl.ARRAY_BUFFER,g.buf);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(nor,3,gl.FLOAT,false,24,12);gl.uniformMatrix4fv(u.uModel,false,m);gl.uniformMatrix3fv(u.uNormal,false,normalMatrix(m));gl.uniform3fv(u.uColor,n.m.color);gl.uniform1f(u.uMetal,n.m.metal);gl.uniform1f(u.uEmit,n.m.emit);gl.uniform1f(u.uDetail,n.m.detail||0);gl.drawArrays(gl.TRIANGLES,0,g.count)}
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
 const size=Math.round(Math.min(innerWidth*.88,innerHeight*.66,460)),scale=Math.min(devicePixelRatio||1,opts.kind==='dragon'?2:1.5);if(size<130)return false;
 canvas.width=Math.round(size*scale);canvas.height=Math.round(size*scale);canvas.style.width=size+'px';canvas.style.height=size+'px';
 const sx=opts.sx,sy=opts.sy,tx=opts.tx,ty=opts.ty,dx=tx-sx,dy=ty-sy;
 const cx=clamp(sx+dx*.22,size*.5,innerWidth-size*.5),cy=clamp(sy+dy*.22,size*.5,innerHeight-size*.5);
 canvas.style.left=(cx-size*.5)+'px';canvas.style.top=(cy-size*.5)+'px';
 let r=null,model=null,frame=0,stopped=false,marker=[.5,.4],attackFired=false,impactFired=false;
 active=true;
 try{
  r=renderer(canvas);model=opts.kind==='dragon'?makeDragon():makeLion();const dir=dx<0?-1:1;
  const eye=opts.kind==='dragon'?[4.5*dir,3.10,7.9]:[3.3*dir,2.25,5.9],at=opts.kind==='dragon'?[0,1.40,-.32]:[0,1.56,0];
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