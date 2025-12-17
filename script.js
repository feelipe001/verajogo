const levels = [
 {pairs:2,time:0},
 {pairs:3,time:60},
 {pairs:6,time:90},
 {pairs:8,time:120},
 {pairs:10,time:100}
];

const images = [
 "princesa.png","guerreiro.png","principe.png",
 "rei.png","rainha.png","fada.png","navio.png","vilao.png"
];

let level = Number(localStorage.getItem("level")) || 0;
let score = 0, time, timer, first=null, lock=false;

document.getElementById("levelText").innerText =
 `Nível ${level+1} de ${levels.length}`;

function startGame(){
 show("game");
 score=0;
 time=levels[level].time;
 document.getElementById("score").innerText=0;
 document.getElementById("time").innerText=time;
 const board=document.getElementById("board");
 board.style.gridTemplateColumns =
 `repeat(${Math.min(4,levels[level].pairs)},1fr)`;
 board.innerHTML="";
 let pool=[...images].slice(0,levels[level].pairs);
 let cards=[...pool,...pool].sort(()=>Math.random()-0.5);
 cards.forEach(img=>{
  const c=document.createElement("div");
  c.className="card";
  c.innerHTML=`<img src="images/${img}">`;
  c.onclick=()=>flip(c,img);
  board.appendChild(c);
 });
 clearInterval(timer);
 if(time>0){
  timer=setInterval(()=>{
   time--; document.getElementById("time").innerText=time;
   if(time<=0) endGame();
  },1000);
 }
}

function flip(card,img){
 if(lock||card.classList.contains("open"))return;
 card.classList.add("open");
 if(!first){first={card,img};}
 else{
  if(first.img===img){
   score+=100;
   document.getElementById("score").innerText=score;
   first=null;
   if(document.querySelectorAll(".open").length===
      levels[level].pairs*2) endGame();
  }else{
   lock=true;
   setTimeout(()=>{
    card.classList.remove("open");
    first.card.classList.remove("open");
    first=null; lock=false;
   },800);
  }
 }
}

function endGame(){
 clearInterval(timer);
 show("result");
 document.getElementById("finalScore").innerText=score;
 document.getElementById("message").innerText=
 ["🌟 Incrível!","✨ Muito bem!","👑 Você é mágica!"][Math.floor(Math.random()*3)];
 document.getElementById("stars").innerText=
 score>800?"⭐⭐⭐":score>400?"⭐⭐":"⭐";
 confetti();
}

function nextLevel(){
 if(level<levels.length-1) level++;
 localStorage.setItem("level",level);
 location.reload();
}
function goHome(){show("home");}
function show(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById(id).classList.add("active");
}
function confetti(){
 for(let i=0;i<50;i++){
  const c=document.createElement("div");
  c.className="confetti";
  c.style.left=Math.random()*100+"vw";
  document.body.appendChild(c);
  setTimeout(()=>c.remove(),3000);
 }
}
