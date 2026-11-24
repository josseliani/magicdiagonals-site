(() => {
  if (window.mdExtras) return;
  window.mdExtras = true;
  const track = (name, data = {}) => { try { window.mdTrack && window.mdTrack(name, data); } catch {} };
  const lang = (document.documentElement.lang || 'en').slice(0, 2);

  // ---- Extra statistics: video plays and reaching the pricing block ----
  document.addEventListener('click', (e) => {
    const b = e.target instanceof Element ? e.target.closest('[data-video]') : null;
    if (b) track('video_play', { video: (b.dataset.video || '').split('/').pop().replace('.mp4', '') });
  }, { passive: true });
  const pricing = document.getElementById('access');
  if (pricing && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((x) => x.isIntersecting)) { track('pricing_view'); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(pricing);
  }

  // ---- Telegram invitation before leaving for TradingView (once per visit) ----
  const T = {
    en: ['Before you go to TradingView', 'Join our Telegram channel: new indicators, weekly NASDAQ reviews and updates come there first.', 'Join Telegram', 'Continue to TradingView'],
    ru: ['Перед переходом на TradingView', 'Подпишитесь на наш Telegram-канал: новые индикаторы, еженедельные обзоры NASDAQ и обновления появляются там первыми.', 'Подписаться в Telegram', 'Продолжить на TradingView'],
    de: ['Bevor Sie zu TradingView gehen', 'Folgen Sie unserem Telegram-Kanal: neue Indikatoren, wöchentliche NASDAQ-Analysen und Updates erscheinen dort zuerst.', 'Telegram beitreten', 'Weiter zu TradingView'],
    es: ['Antes de ir a TradingView', 'Únete a nuestro canal de Telegram: nuevos indicadores, análisis semanales del NASDAQ y novedades llegan allí primero.', 'Unirse a Telegram', 'Continuar a TradingView'],
    ja: ['TradingViewへ移動する前に', 'Telegramチャンネルに参加しませんか。新しいインジケーター、毎週のNASDAQレビュー、最新情報をいち早くお届けします。', 'Telegramに参加', 'TradingViewへ進む'],
    zh: ['前往 TradingView 之前', '欢迎加入我们的 Telegram 频道：新指标、每周 NASDAQ 复盘和更新会第一时间发布。', '加入 Telegram', '继续前往 TradingView']
  };
  const text = T[lang] || T.en;
  const channel = lang === 'ru' ? 'https://t.me/indicatorlabJ' : 'https://t.me/magicdiagonals';
  const accent = lang === 'ru' ? '#a3c9ee' : '#d9bc78';
  const KEY = 'md_tg_prompt_shown';
  const wasShown = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return window.__mdTgShown === true; } };
  const markShown = () => { window.__mdTgShown = true; try { sessionStorage.setItem(KEY, '1'); } catch {} };

  let dialog = null;
  const build = () => {
    const style = document.createElement('style');
    style.textContent = `#md-tg{border:1px solid #3a463f;border-radius:18px;background:#121816;color:#f0f0e9;padding:26px 24px 22px;max-width:420px;width:calc(100% - 32px);font:16px/1.55 Arial,sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.55)}
#md-tg::backdrop{background:rgba(5,8,7,.72)}
#md-tg h3{margin:0 34px 10px 0;font-size:20px;line-height:1.3;color:${accent}}
#md-tg p{margin:0 0 20px;color:#c9d0cb;font-size:15px}
#md-tg .md-tg-actions{display:flex;flex-direction:column;gap:10px}
#md-tg a,#md-tg button.md-tg-go{display:flex;justify-content:center;align-items:center;padding:13px 18px;border-radius:999px;font-size:15px;text-decoration:none;cursor:pointer}
#md-tg a{background:${accent};color:#0c1110;font-weight:bold;border:0}
#md-tg button.md-tg-go{background:transparent;color:#e8ece9;border:1px solid #56625a;font:inherit;font-size:15px}
#md-tg .md-tg-x{position:absolute;top:12px;right:14px;background:none;border:0;color:#a5afa9;font-size:24px;line-height:1;cursor:pointer;padding:4px}`;
    document.head.append(style);
    dialog = document.createElement('dialog');
    dialog.id = 'md-tg';
    dialog.innerHTML = `<button class="md-tg-x" aria-label="Close">×</button><h3></h3><p></p><div class="md-tg-actions"><a target="_blank" rel="noopener"></a><button class="md-tg-go" type="button"></button></div>`;
    dialog.querySelector('h3').textContent = text[0];
    dialog.querySelector('p').textContent = text[1];
    const join = dialog.querySelector('a');
    join.textContent = '✈ ' + text[2];
    join.href = channel;
    join.addEventListener('click', () => { track('telegram_prompt_join', { channel: lang === 'ru' ? 'ru' : 'en' }); setTimeout(() => dialog.close(), 50); });
    dialog.querySelector('.md-tg-go').textContent = text[3] + ' ↗';
    dialog.querySelector('.md-tg-x').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    document.body.append(dialog);
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a) return;
    let url; try { url = new URL(a.href, location.href); } catch { return; }
    const host = url.hostname.toLowerCase();
    if (!(host === 'tradingview.com' || host.endsWith('.tradingview.com'))) return;
    if (wasShown() || typeof HTMLDialogElement !== 'function') return;
    e.preventDefault();
    markShown();
    if (!dialog) build();
    const go = dialog.querySelector('.md-tg-go');
    go.onclick = () => {
      track('telegram_prompt_skip');
      dialog.close();
      if (a.target === '_blank') window.open(url.href, '_blank', 'noopener'); else location.href = url.href;
    };
    track('telegram_prompt_shown');
    dialog.showModal();
  }, true);
})();
