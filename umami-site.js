(() => {
  if(window.mdTrack)return;
  // Preview visits must not inflate production statistics.
  const production=['magicdiagonals.com','www.magicdiagonals.com','magic-diagonals-studio.swoonybadge1025.chatgpt.site'].includes(location.hostname);
  const pending=[];
  const send=(name,data)=>{try{Promise.resolve(window.umami.track(name,data)).catch(()=>{});}catch{}};
  window.mdTrack=(name,data={})=>{if(!production)return;const payload={lang:document.documentElement.lang||'en',...data};if(typeof window.umami?.track==='function')send(name,payload);else if(pending.length<30)pending.push([name,payload]);};
  if(!production)return;
  // Anonymous, cookie-free traffic statistics for the public Magic Diagonals pages.
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.dataset.websiteId = '36049053-4ee8-4860-9221-6be012a205a5';
  script.addEventListener('load',()=>{pending.splice(0).forEach(([name,data])=>send(name,data));});
  document.head.append(script);

  document.addEventListener('click', (event) => {
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    let url;
    try { url = new URL(anchor.href, location.href); } catch { return; }
    const lang = document.documentElement.lang || 'en';
    const host = url.hostname.toLowerCase();
    let name, data;
    if (host === 'app.lava.top' && anchor.matches('.russian-payment-link')) {
      name = 'rf_payment_click';
      const products={
        '1032ae96-4247-4d83-9bd3-8f15d2c13e91':['RCC Pro','monthly'],
        '9b14ceca-94ec-48bd-a1ea-8dd6711696c0':['RCC Pro','lifetime'],
        '3513b2b7-3af8-4b93-8495-cf6b63380bd5':['RSI Retest Pro','one_time']
      };
      const product=Object.entries(products).find(([id])=>url.pathname.includes(id))?.[1];
      data = {lang,product:product?.[0]||'Product',plan:product?.[1]||'unknown',source:'pricing',payment_method:'ru_card_sbp'};
    } else if (host === 'whop.com' || host.endsWith('.whop.com')) {
      name = 'purchase_click';
      const plans={plan_AEwK72eCJAQSE:['RCC Pro','monthly'],plan_gdVZiiKHdRhiw:['RCC Pro','lifetime'],plan_r3r3Ka97S9LvQ:['RSI Retest Pro','one_time']};
      const plan=Object.entries(plans).find(([id])=>url.pathname.includes(id))?.[1];
      data = { lang, product:plan?.[0]||(/rsi/i.test(url.pathname)?'RSI Retest Pro':/rcc|reversal|cloud/i.test(url.pathname)?'RCC Pro':'Product'),plan:plan?.[1]||'product_page',source:location.pathname.startsWith('/risk-calculator')?'calculator':'site' };
    } else if (url.origin === location.origin && url.pathname.startsWith('/risk-calculator')) {
      name='calculator_click';data={lang,target_lang:url.searchParams.get('lang')||'en'};
    } else if (host === 'tradingview.com' || host.endsWith('.tradingview.com')) {
      name = 'tradingview_click';
      data = { lang };
    } else if (host === 't.me' || host === 'telegram.me' || host === 'instagram.com' || host.endsWith('.instagram.com')) {
      name = 'social_click';
      data = { lang, platform: /instagram/.test(host) ? 'instagram' : 'telegram' };
    } else if (url.origin === location.origin && /^(#access|#pricing|#products)$/.test(url.hash)) {
      name = 'access_click';
      data = { lang, section: url.hash.substring(1) };
    }
    if (name) window.mdTrack(name, data);
  }, { passive: true });
  const advanced=location.pathname.startsWith('/risk-calculator');
  const calculator=advanced?document.querySelector('#panel-calc'):document.querySelector('#calculator');
  if(!calculator)return;
  const kind=advanced?'advanced':'embedded';
  const seen=new Set();
  const once=(name,data={})=>{const key=name+JSON.stringify(data);if(seen.has(key))return;seen.add(key);window.mdTrack(name,{calculator:kind,...data});};
  if(advanced){
    once('calculator_open');
    if(navigator.standalone===true||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: window-controls-overlay)').matches)once('calculator_app_launch');
    document.querySelector('#open-guide')?.addEventListener('click',()=>once('calculator_install_guide'));
    document.querySelector('#tab-guide')?.addEventListener('click',()=>once('calculator_install_guide'));
    document.querySelector('#install-button')?.addEventListener('click',()=>window.mdTrack('calculator_install_click'));
    addEventListener('appinstalled',()=>once('calculator_installed'));
  }else if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){once('calculator_view');observer.disconnect();}},{threshold:.25});observer.observe(calculator);
  }
  let timer;
  const activity=()=>{
    once('calculator_use');clearTimeout(timer);
    timer=setTimeout(()=>{
      const lots=document.querySelector('#lots')?.textContent?.trim();
      if(!lots||lots==='—'||!(Number(lots.replace(',','.'))>0))return;
      const status=advanced?['good','caution','stop'].find(x=>document.querySelector('#result-card')?.classList.contains(x)):'valid';
      if(!status)return;
      const market=document.querySelector('[data-preset].active')?.dataset.preset||'custom';
      once('calculator_result',{status,market});
    },1200);
  };
  calculator.addEventListener('input',e=>{if(e.target.matches('input'))activity();});
  calculator.addEventListener('click',e=>{if(e.target.closest('[data-preset]'))activity();});
})();
