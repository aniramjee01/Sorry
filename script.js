const scenes=[...document.querySelectorAll('.scene')];
const progress=document.getElementById('progressFill');
const petals=document.getElementById('petals');
const sparkleLayer=document.getElementById('sparkles');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scene=0, toastTimer, audioContext, audioTimer, playing=false;
const flowerSet=['🌸','🌺','🌷','🌼','💮','🌹','💗','💐'];
function showScene(n){scene=Math.max(0,Math.min(scenes.length-1,n));scenes.forEach((el,i)=>el.classList.toggle('active',i===scene));progress.style.width=`${(scene+1)/scenes.length*100}%`;window.scrollTo({top:0,behavior:reduceMotion?'instant':'smooth'});if(scene===scenes.length-1)flowerBurst(65)}
document.querySelectorAll('.next').forEach(btn=>btn.addEventListener('click',()=>{flowerBurst(14);showScene(scene+1)}));
function makePetal(){if(reduceMotion||document.hidden)return;const el=document.createElement('span');el.className='petal';el.textContent=flowerSet[Math.floor(Math.random()*flowerSet.length)];el.style.left=`${Math.random()*100}%`;el.style.fontSize=`${13+Math.random()*19}px`;el.style.animationDuration=`${6+Math.random()*7}s`;el.style.setProperty('--drift',`${-150+Math.random()*300}px`);el.style.setProperty('--spin',`${-250+Math.random()*500}deg`);petals.appendChild(el);setTimeout(()=>el.remove(),14000)}
if(!reduceMotion){for(let i=0;i<22;i++)setTimeout(makePetal,i*190);setInterval(makePetal,410)}
function flowerBurst(count){if(reduceMotion)return;const rect={x:window.innerWidth/2,y:window.innerHeight*.5};for(let i=0;i<count;i++){const el=document.createElement('span');el.className='burst';el.textContent=flowerSet[Math.floor(Math.random()*flowerSet.length)];el.style.left=`${rect.x}px`;el.style.top=`${rect.y}px`;el.style.fontSize=`${17+Math.random()*26}px`;el.style.setProperty('--x',`${(Math.random()-.5)*window.innerWidth*.95}px`);el.style.setProperty('--y',`${(Math.random()-.5)*window.innerHeight*.85}px`);sparkleLayer.appendChild(el);setTimeout(()=>el.remove(),1600)}}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000)}
const gifts=['🧸','💐','🐻🍬','🍫'];
document.querySelectorAll('.gift').forEach((g,i)=>g.addEventListener('click',()=>{g.classList.add('opened');g.querySelector('span').textContent=gifts[i];g.querySelector('small').textContent='unwrapped ♡';document.getElementById('giftMessage').textContent=g.dataset.message;flowerBurst(12)}));
document.querySelectorAll('.coupon').forEach(c=>c.addEventListener('click',()=>{c.classList.toggle('redeemed');const used=c.classList.contains('redeemed');c.querySelector('.stamp').textContent=used?'CLAIMED ✓':'REDEEM';toast(used?'Coupon claimed! Screenshot it and send it to me 💌':'Coupon ready whenever you are 💗');if(used)flowerBurst(9)}));
document.getElementById('moreFlowers').addEventListener('click',()=>flowerBurst(100));
document.getElementById('restart').addEventListener('click',()=>showScene(0));
// Tiny self-contained gentle melody: no audio files or libraries required. Starts only after user clicks.
const notes=[392,440,523.25,440,392,329.63,349.23,392,440,523.25,587.33,523.25,440,392,349.23,329.63];
let noteIndex=0;
function playNote(){if(!audioContext)return;const now=audioContext.currentTime;const osc=audioContext.createOscillator();const gain=audioContext.createGain();osc.type='sine';osc.frequency.value=notes[noteIndex++%notes.length];gain.gain.setValueAtTime(0.0001,now);gain.gain.exponentialRampToValueAtTime(0.045,now+.03);gain.gain.exponentialRampToValueAtTime(0.0001,now+.35);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+.37)}
document.getElementById('soundBtn').addEventListener('click',async()=>{const b=document.getElementById('soundBtn');if(playing){clearInterval(audioTimer);playing=false;b.textContent='♫ Turn on cute music';b.setAttribute('aria-pressed','false');return}try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();await audioContext.resume();playing=true;playNote();audioTimer=setInterval(playNote,430);b.textContent='♫ Pause music';b.setAttribute('aria-pressed','true')}catch{toast('Music is unavailable in this browser 💗')}});
