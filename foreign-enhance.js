(() => {
  const lang=document.documentElement.lang;
  // Keep all other pages, including the existing translated review routes, unchanged.
  if(!new RegExp('^/(?:'+lang+')(?:\\.html)?/?$').test(location.pathname) || !['de','es','ja','zh'].includes(lang))return;
  const analytics=document.createElement('script');analytics.src='umami-site.js';analytics.defer=true;document.head.append(analytics);
  const t={
    zh:{"s": ["减少等待，", "让入场更有依据。"], "intro": "源于 14 年交易经验的指标。从免费版开始，了解 Pro 如何辅助你的交易。", "video": "观看演示 · 中文说明字幕", "free": "查看 TradingView 全部免费指标 ↗", "ig": "Instagram · 英语 ↗", "swipe": "向右滑动查看对比 →", "rcc": "RCC 免费版与 Pro 对比", "rsi": "RSI Retest 免费版与 Pro 对比", "head": ["功能", "免费版", "Pro"], "rccRows": [["动态通道", "有", "有"], ["入场信号", "基础", "两种可组合模式"], ["交易时段筛选", "—", "选择交易时段"], ["历史统计", "—", "按设置查看结果"], ["风险计算", "—", "计算仓位大小"]], "rsiRows": [["回踩信号", "有", "有"], ["入场模式", "基础", "Fast / Smart"], ["确认线", "基础", "进阶设置"], ["历史结果", "—", "目标达成统计"], ["提醒", "基础", "可配置"]]},
    de:{s:['Weniger Rätselraten.','Mehr Sicherheit beim Einstieg.'],intro:'Indikatoren aus 14 Jahren Trading-Erfahrung. Kostenlos starten und die Pro-Funktionen entdecken.',video:'Demo ansehen · Deutsche Hinweise',free:'Alle kostenlosen Indikatoren auf TradingView ↗',ig:'Instagram · Englisch ↗',swipe:'Zum Vergleichen nach rechts wischen →',rcc:'RCC Free und RCC Pro vergleichen',rsi:'RSI Retest Free und Pro vergleichen',head:['Funktion','Kostenlos','Pro'],rccRows:[['Dynamischer Kanal','Ja','Ja'],['Einstiegssignale','Basis','Zwei kombinierbare Modi'],['Sitzungsfilter','—','Handelszeiten wählen'],['Historische Statistik','—','Nach Einstellungen'],['Risikorechner','—','Positionsgröße berechnen']],rsiRows:[['Retest-Signale','Ja','Ja'],['Einstiegsmodi','Basis','Fast und Smart'],['Bestätigungslinie','Basis','Erweiterte Einstellungen'],['Historische Ergebnisse','—','Zielstatistik'],['Alarme','Basis','Konfigurierbar']]},
    es:{s:['Menos dudas.','Más confianza al entrar.'],intro:'Indicadores creados tras 14 años de experiencia en trading. Empieza gratis y descubre las funciones Pro.',video:'Ver demostración · Notas en español',free:'Todos los indicadores gratuitos en TradingView ↗',ig:'Instagram · Inglés ↗',swipe:'Desliza a la derecha para comparar →',rcc:'Comparar RCC Free y RCC Pro',rsi:'Comparar RSI Retest Free y Pro',head:['Función','Gratis','Pro'],rccRows:[['Canal dinámico','Sí','Sí'],['Señales de entrada','Básicas','Dos modos combinables'],['Filtro de sesiones','—','Filtrar horarios'],['Estadísticas históricas','—','Según configuración'],['Calculadora de riesgo','—','Tamaño de posición']],rsiRows:[['Señales de retest','Sí','Sí'],['Modos de entrada','Básico','Fast y Smart'],['Línea de confirmación','Básica','Ajustes avanzados'],['Resultados históricos','—','Estadísticas de objetivos'],['Alertas','Básicas','Configurables']]},
    ja:{s:['迷いを減らし、','より確信を持ってエントリー。'],intro:'14年の取引経験から生まれたインジケーター。無料版から試し、Proの機能をご覧ください。',video:'デモを見る・日本語の解説字幕',free:'TradingView の無料インジケーター一覧 ↗',ig:'Instagram・英語 ↗',swipe:'右へスワイプして比較 →',rcc:'RCC 無料版と Pro の比較',rsi:'RSI Retest 無料版と Pro の比較',head:['機能','無料','Pro'],rccRows:[['動的チャネル','あり','あり'],['エントリーシグナル','基本','組み合わせ可能な2モード'],['取引時間フィルター','—','時間帯を選択'],['過去の統計','—','設定ごとの結果'],['リスク計算機','—','ポジションサイズ']],rsiRows:[['リテストシグナル','あり','あり'],['エントリーモード','基本','Fast / Smart'],['確認ライン','基本','詳細設定'],['過去の結果','—','目標到達の統計'],['アラート','基本','カスタマイズ可能']]}
  }[lang];
  const accessText={zh:'获取访问权限 ↓',de:'Zugang erhalten ↓',es:'Obtener acceso ↓',ja:'アクセスを取得 ↓'}[lang];
  const checkoutUrls=['https://whop.com/checkout/plan_AEwK72eCJAQSE/','https://whop.com/checkout/plan_gdVZiiKHdRhiw/','https://whop.com/checkout/plan_r3r3Ka97S9LvQ/'];
  const checkoutLabel={zh:'前往结账 ↗',de:'Zur Kasse ↗',es:'Ir al pago ↗',ja:'お支払いへ ↗'}[lang];
  document.querySelectorAll('.compact #pricing .plan-grid .plan a.button').forEach((a,i)=>{if(checkoutUrls[i]){a.href=checkoutUrls[i];a.textContent=checkoutLabel}});
  const hero=document.querySelector('.compact .hero');
  if(hero){
    const h1=hero.querySelector('h1');
    if(h1){h1.textContent=t.s[0];h1.append(document.createElement('br'));const em=document.createElement('em');em.textContent=t.s[1];h1.append(em)}
    const p=hero.querySelector('.hero-bottom p');if(p)p.textContent=t.intro;
  }
  const cards=[...document.querySelectorAll('.compact #products > article.product')];
  cards.forEach((card,i)=>{
    const access=card.querySelector('.product-copy > a.button[href="#pricing"]');
    if(access)access.textContent=accessText;
    const visual=card.querySelector('.product-visual');const img=visual?.querySelector('img');
    if(img){const video=document.createElement('video');video.src=i===0?'assets/rcc-loop.mp4':'assets/rsi-loop.mp4';video.poster=i===0?'assets/rcc-loop.jpg':'assets/rsi-loop.jpg';video.autoplay=true;video.loop=true;video.muted=true;video.playsInline=true;video.preload='metadata';video.className='foreign-loop';video.setAttribute('aria-label',i===0?'RCC Pro chart animation':'RSI Retest chart animation');img.replaceWith(video)}
    const play=visual?.querySelector('[data-video]');if(play)play.textContent='▶ '+t.video;
  });
  function table(title,rows){
    const block=document.createElement('div');block.className='foreign-comparison';
    const heading=document.createElement('h3');heading.textContent=title;block.append(heading);
    const hint=document.createElement('p');hint.className='foreign-swipe';hint.textContent=t.swipe;block.append(hint);
    const wrap=document.createElement('div');wrap.className='foreign-table-scroll';
    const el=document.createElement('table');const head=document.createElement('thead');const hr=document.createElement('tr');
    t.head.forEach(s=>{const cell=document.createElement('th');cell.textContent=s;hr.append(cell)});head.append(hr);el.append(head);
    const body=document.createElement('tbody');rows.forEach(data=>{const row=document.createElement('tr');data.forEach((s,i)=>{const cell=document.createElement(i?'td':'th');cell.textContent=s;row.append(cell)});body.append(row)});
    el.append(body);wrap.append(el);block.append(wrap);return block;
  }
  if(cards.length===2){cards[0].after(table(t.rcc,t.rccRows));cards[1].after(table(t.rsi,t.rsiRows))}
  // The localized tool opens separately; no existing foreign-page content is removed.
  const toolLabel={zh:'高级风险计算器 ↗',de:'Erweiterter Risikorechner ↗',es:'Calculadora de riesgo avanzada ↗',ja:'高機能リスク計算ツール ↗'}[lang];
  const toolLink=document.createElement('a');toolLink.className='text-link foreign-risk-link';toolLink.href='risk-calculator/?lang='+lang;toolLink.target='_blank';toolLink.rel='noopener';toolLink.textContent=toolLabel;
  const products=document.querySelector('.compact #products');if(products)products.append(toolLink);
  const compare=document.querySelector('.compact #products .comparison');
  if(compare){const a=document.createElement('a');a.className='button foreign-free-button';a.href='https://www.tradingview.com/u/josseliani/';a.target='_blank';a.rel='noopener';a.textContent=t.free;compare.append(a)}
  const footer=document.querySelector('.compact footer');
  if(footer&&!footer.querySelector('a[href*="instagram.com"]')){const a=document.createElement('a');a.className='text-link';a.href='https://www.instagram.com/magicdiagonals/';a.target='_blank';a.rel='noopener';a.textContent=t.ig;footer.prepend(a)}
  const style=document.createElement('style');
  style.textContent='.foreign-loop{display:block;width:100%;height:auto;max-height:500px;object-fit:contain;background:#090c0b}.foreign-comparison{margin:-25px 0 60px;padding:28px 0 12px;border-top:1px solid #343e37}.foreign-comparison h3{font-size:clamp(23px,3vw,31px);font-weight:400;margin:0 0 15px}.foreign-swipe{color:var(--gold);text-align:right;font-size:13px;margin-bottom:10px}.foreign-table-scroll{overflow-x:auto;border:1px solid #405044;border-radius:12px;background:#141e19}.foreign-table-scroll table{min-width:620px;width:100%;table-layout:fixed}.foreign-table-scroll th,.foreign-table-scroll td{overflow-wrap:break-word;border-right:1px solid #314335;padding:14px 16px}.foreign-table-scroll th{color:#e6ecdf}.foreign-table-scroll thead th{color:var(--gold)}.foreign-table-scroll tr>*:last-child{border-right:0}.foreign-free-button{margin:26px 0 0;max-width:100%;white-space:normal;text-align:center}.foreign-risk-link{display:inline-block;margin:10px 0 48px;color:var(--gold)}.compact footer{flex-wrap:wrap;gap:16px}@media(min-width:900px){.foreign-swipe{display:none}}';
  document.head.append(style);
})();
