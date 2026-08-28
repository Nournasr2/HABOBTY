const $=s=>document.querySelector(s);
const intro=$("#intro"),game=$("#game"),transition=$("#transition"),final=$("#final");
const startBtn=$("#startBtn"),againBtn=$("#againBtn"),arena=$("#arena"),player=$("#player");
const progressText=$("#progressText"),progressBar=$("#progressBar"),typed=$("#typedMessage"),signature=$("#signature"),toast=$("#toast"),canvas=$("#bgCanvas"),ctx=canvas.getContext("2d");

const TOTAL=8;
let score=0,px=50,py=50,items=[],keys={},toastTimer;
const message="النهارده كان صعب من غيرك... وحاسس بجد إن في حاجة ناقصة فيه، عشان اتعودت على وجودك فيه. وريلي وحشتيني أوي... وأنا بحبك جدًا جدًا جدًا ❤️";

function screen(from,to){from.classList.remove("active");setTimeout(()=>to.classList.add("active"),250)}
startBtn.onclick=()=>{screen(intro,game);setTimeout(startGame,500)};
againBtn.onclick=()=>{signature.classList.remove("show");typed.innerHTML="";screen(final,game);setTimeout(startGame,500)};

function startGame(){
  score=0;px=50;py=50;items=[];
  arena.querySelectorAll(".heart").forEach(x=>x.remove());
  updateHUD();makeHearts();updatePlayer();
}
function makeHearts(){
  for(let i=0;i<TOTAL;i++){
    let p;
    do{p={x:7+Math.random()*86,y:9+Math.random()*82}}while(Math.hypot(p.x-50,p.y-50)<17);
    const e=document.createElement("div");e.className="heart";e.textContent="♥";e.style.left=p.x+"%";e.style.top=p.y+"%";e.style.animationDelay=(Math.random()*1.5)+"s";arena.appendChild(e);
    items.push({e,x:p.x,y:p.y,got:false});
  }
}
function updateHUD(){progressText.textContent=String(score).padStart(2,"0")+" / "+String(TOTAL).padStart(2,"0");progressBar.style.width=(score/TOTAL*100)+"%"}
function updatePlayer(){player.style.left=px+"%";player.style.top=py+"%"}

document.addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase()))e.preventDefault()});
document.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);

function loop(){
 if(game.classList.contains("active")){
   const s=.58;
   if(keys.w||keys.arrowup)py-=s;if(keys.s||keys.arrowdown)py+=s;if(keys.a||keys.arrowleft)px-=s;if(keys.d||keys.arrowright)px+=s;
   px=Math.max(2,Math.min(94,px));py=Math.max(5,Math.min(91,py));updatePlayer();collide();
 }
 requestAnimationFrame(loop)
}
loop();

function collide(){
 items.forEach(o=>{
   if(o.got)return;
   if(Math.hypot(px-o.x,py-o.y)<5.2){
     o.got=true;o.e.classList.add("collected");score++;updateHUD();
     setTimeout(()=>o.e.remove(),280);showToast(score<TOTAL?(score===TOTAL-1?"آخر واحدة... ❤️":"حلو... كملي ❤️"):"",score===TOTAL?1200:0);
     burst(o.x,o.y,5);
     if(score===TOTAL)setTimeout(win,650);
   }
 });
}
function showToast(text,delay=0){
 clearTimeout(toastTimer);
 if(!text)return;
 toast.textContent=text;toast.classList.add("show");toastTimer=setTimeout(()=>toast.classList.remove("show"),delay||1100);
}
function burst(x,y,n){
 for(let i=0;i<n;i++){
  const e=document.createElement("div");e.className="heart";e.textContent="✦";e.style.fontSize="12px";e.style.left=x+"%";e.style.top=y+"%";e.style.transition="1s";arena.appendChild(e);
  requestAnimationFrame(()=>{e.style.transform=`translate(${(Math.random()-.5)*70}px,${(Math.random()-.5)*70}px) scale(.2)`;e.style.opacity=0});
  setTimeout(()=>e.remove(),1000);
 }
}
function win(){
 screen(game,transition);
 setTimeout(()=>{screen(transition,final);setTimeout(typeMessage,800);celebrate()},2800);
}
function typeMessage(){
 const words=message.split(" ");
 typed.innerHTML="";
 words.forEach((w,i)=>{const s=document.createElement("span");s.textContent=w+" ";s.style.animationDelay=(i*.095)+"s";typed.appendChild(s)});
 setTimeout(()=>signature.classList.add("show"),words.length*95+700);
}
function celebrate(){
 const wrap=$("#confetti");
 for(let i=0;i<45;i++){
  const e=document.createElement("div");e.className="confetti-piece";e.textContent=Math.random()>.2?"♥":"✦";
  e.style.setProperty("--x",((Math.random()-.5)*850)+"px");e.style.setProperty("--r",((Math.random()-.5)*600)+"deg");
  e.style.animationDelay=(Math.random()*.8)+"s";e.style.fontSize=(9+Math.random()*17)+"px";wrap.appendChild(e);setTimeout(()=>e.remove(),4300);
 }
}

/* Ambient animated background */
let stars=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(130,Math.floor(innerWidth/8))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.3+Math.random()*1.1,a:.15+Math.random()*.5,v:.05+Math.random()*.15}))}
addEventListener("resize",resize);resize();
function bg(){
 ctx.clearRect(0,0,innerWidth,innerHeight);
 const g=ctx.createRadialGradient(innerWidth*.5,innerHeight*.35,0,innerWidth*.5,innerHeight*.35,innerWidth*.65);g.addColorStop(0,"rgba(255,55,110,.055)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight);
 stars.forEach(s=>{s.y-=s.v;if(s.y<0)s.y=innerHeight;ctx.globalAlpha=s.a;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1;requestAnimationFrame(bg)
}
bg();
