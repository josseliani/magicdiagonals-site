const ru=document.documentElement.lang==='ru';
document.querySelectorAll('.ring').forEach(el=>el.remove());
// Keep the settings demonstration clean: no artificial highlight boxes.
document.querySelectorAll('.media video').forEach(v=>{
  if(v.getAttribute('aria-label')==='RCC Pro'){
    v.poster='assets/rcc-loop-v2.jpg';
    const source=v.querySelector('source');
    if(source){source.src='assets/rcc-loop-v2.mp4';v.load();}
  }
});
const texts=ru?[
  'Сочетайте Mode 1 и Mode 2. В Confirm Mode выбирайте, какой режим подтверждает сигнал.',
  'Задайте торговые часы в настройках сессии. Результаты будут оцениваться для выбранного периода.',
  'Пример исторической статистики XAUUSD: 25 сделок, Win Rate 56%, Profit Factor 3,18. На другом инструменте и с другими настройками результаты будут отличаться.'
]:[
  'Combine Mode 1 and Mode 2. Use Confirm Mode to choose which mode confirms the signal.',
  'Choose your trading hours in the session settings. Review the historical results for that window.',
  'Historical XAUUSD example: 25 trades, a 56% win rate and Profit Factor of 3.18. Results vary by market and settings.'
];
const focus=document.querySelector('.focus'),copy=document.querySelector('#step-copy');
const stats=document.createElement('div');
stats.className='stats-window';
stats.hidden=true;
stats.setAttribute('aria-label',ru?'Пример исторической статистики RCC Pro':'Historical RCC Pro statistics example');
const rows=[
  [ru?'Сделки':'Trades','25',''],
  [ru?'Прибыльные':'Wins','14','positive'],
  [ru?'Убыточные':'Losses','11','negative'],
  ['Win Rate','56%',''],
  ['Net (R)','+24','positive'],
  ['Profit Factor','3.18',''],
  [ru?'Среднее на сделку':'Avg / trade','0.96R',''],
  [ru?'Открытые':'Open','0','']
];
const header=document.createElement('header');
header.innerHTML='<span>RCC Pro · XAUUSD</span><span>R:R 2.5</span>';
stats.append(header);
rows.forEach(([label,value,type])=>{
  const row=document.createElement('div');
  row.className='stats-row'+(type?' '+type:'');
  const l=document.createElement('span'),v=document.createElement('strong');
  l.textContent=label;v.textContent=value;
  row.append(l,v);stats.append(row);
});
const footer=document.createElement('div');
footer.className='stats-footer';
footer.innerHTML='<span>16:30–21:00</span><span>OUT</span>';
stats.append(footer);
focus.append(stats);
copy.textContent=texts[0];
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{
  const n=Number(b.dataset.step);
  document.querySelectorAll('[data-step]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  focus.className='focus '+['','session','signal'][n];
  const img=focus.querySelector('img');
  img.src='assets/settings-'+[6905,6904,6907][n]+'.jpg';
  stats.hidden=n!==2;
  copy.textContent=texts[n];
}));
const inputs=Object.fromEntries(['balance','risk','entry','stop','contract','step'].map(k=>[k,document.getElementById(k)]));
function calculate(){const v=Object.fromEntries(Object.entries(inputs).map(([k,e])=>[k,Number(e.value)]));const delta=Math.abs(v.entry-v.stop);let valid=Object.values(v).every(Number.isFinite)&&Object.values(inputs).every(e=>e.value.trim()!=='')&&v.balance>0&&v.risk>0&&v.risk<=100&&v.entry>0&&v.stop>0&&v.contract>0&&v.step>0&&delta>0;
const raw=valid?(v.balance*v.risk/100)/(delta*v.contract):0;const lots=valid?Math.floor((raw+1e-10)/v.step)*v.step:0;const digits=Math.min(8,Math.max(2,(String(v.step).split('.')[1]||'').length));document.getElementById('lots').textContent=valid?lots.toFixed(digits):'—';document.getElementById('cash').textContent=valid?'$'+(lots*delta*v.contract).toFixed(2):'—';document.getElementById('calc-note').textContent=!valid?(ru?'Введите положительные значения. Цены входа и стопа должны различаться.':'Enter positive values. Entry and stop must differ.'):(lots===0?(ru?'Рассчитанный объём меньше одного шага лота.':'Calculated size is below one lot step.'):(ru?'Объём округлён вниз до шага лота.':'Position size is rounded down to the lot step.'));}
Object.values(inputs).forEach(e=>e.addEventListener('input',calculate));
const presets={eur:[1.08,1.075,100000,.01],gold:[2700,2690,100,.01],nas:[20000,19950,1,.01]};
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{['entry','stop','contract','step'].forEach((k,i)=>inputs[k].value=presets[b.dataset.preset][i]);document.querySelectorAll('[data-preset]').forEach(x=>x.classList.toggle('active',x===b));calculate()}));calculate();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;document.querySelectorAll('.media').forEach(m=>{const v=m.querySelector('video'),b=m.querySelector('button');if(reduced){v.autoplay=false;v.pause();b.textContent=ru?'Смотреть':'Play'}b.addEventListener('click',()=>{if(v.paused){v.play().catch(()=>{});b.textContent=ru?'Пауза':'Pause'}else{v.pause();b.textContent=ru?'Смотреть':'Play'}})});
const d=document.querySelector('dialog'),v=d.querySelector('video');document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>{v.src=b.dataset.video;d.showModal();v.play().catch(()=>{})}));d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close()});d.addEventListener('close',()=>{v.pause();v.removeAttribute('src');v.load()});
