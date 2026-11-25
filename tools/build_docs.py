#!/usr/bin/env python3
"""Builds /docs/ (EN) and /docs/ru/ (RU): the "Start here" page for Trading Lab subscribers."""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_reviews as br

ROOT = pathlib.Path(__file__).resolve().parent.parent
SPACE = 'https://www.tradingview.com/scripts/marketplace/josseliani/'

EXTRA_CSS = """
.steps{counter-reset:s;list-style:none;padding:0;margin:0 0 10px}
.steps li{counter-increment:s;position:relative;padding:14px 0 14px 54px;border-top:1px solid #2c3430;color:#dfe4e0}
.steps li:before{content:counter(s);position:absolute;left:0;top:12px;width:36px;height:36px;border-radius:50%;border:1px solid var(--accent);color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:bold}
.guides{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin:18px 0 10px}
.guide{border:1px solid #2f3b35;border-radius:16px;background:#121816;padding:18px;display:flex;gap:16px;align-items:flex-start}
.guide img{width:96px;border-radius:8px;border:1px solid #2c3430;flex:none}
.guide h3{color:#f0f0e9;margin:0 0 6px;font-size:18px}.guide p{font-size:14.5px;color:#a5afa9;margin:0 0 12px}
.guide .button,.guide .outline{padding:9px 15px;font-size:13.5px}
.soon{font-size:13px;color:#a5afa9}
.yt-player{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid #2f3b35;background:#000;cursor:pointer;margin:14px 0}
.yt-player img{width:100%;height:100%;object-fit:cover;display:block}.yt-player iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.yt-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:74px;height:52px;border-radius:14px;background:#ff0033;pointer-events:none}
.yt-play:after{content:"";position:absolute;left:30px;top:14px;border-left:19px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent}
.yt-dur{position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.8);color:#fff;font-size:13px;padding:2px 7px;border-radius:5px}
"""

T = {
 'en': dict(title='Start here: Trading Lab guides | Magic Diagonals', desc='How to start with RCC Pro and RSI Retest Scalper Pro in the Magic Diagonals Trading Lab on TradingView: access, quick start and full PDF guides.',
   eyebrow='Trading Lab · Start here', h1='Welcome to <em>Trading Lab</em>',
   intro='Thank you for subscribing. Your Paid Space includes two TradingView indicators: RCC Pro and RSI Retest Scalper Pro. Access opens automatically on your TradingView account.',
   h_start='Get started in 5 minutes',
   steps=['Open any chart on TradingView → Indicators → <strong>Invite-only scripts</strong>. Add RCC Pro or RSI Retest Scalper Pro. If you don\'t see them yet, refresh the page.',
          'In the indicator settings, the first line is <strong>Preset</strong>. Pick the preset for your instrument and set the chart to the exact symbol and timeframe in its name.',
          'Leave the other settings unchanged until you understand the statistics table. Judge a preset by the target row in its name (1R or 2R).',
          'Read the guide for your indicator below.',
          'Create alerts on the instruments and timeframes you trade. After changing a preset, symbol or timeframe, create the alert again.'],
   h_guides='Indicator guides',
   guides=[('RCC Pro — client guide','Presets, Custom mode, channel logic, trade management and statistics. 14 pages.','/docs/pdf/RCC_Pro_Guide_EN.pdf','/docs/pdf/RCC_Pro_Guide_EN-cover-01.jpg'),
           ('RSI Retest Scalper Pro — guide','Presets, Fast and Smart Entry, entry lines, RSI settings, time filters and alerts. 13 pages.','/docs/pdf/RSI_Retest_Pro_Guide_EN.pdf','/docs/pdf/RSI_Retest_Pro_Guide_EN-cover-01.jpg')],
   dl='Download PDF ↓', soon='Online versions of the guides, page by page, are coming soon.',
   h_video='Video walkthroughs', video='Watch indicator walkthroughs on our YouTube channel:', yt=('Magic Diagonals on YouTube ↗','https://www.youtube.com/@magicdiagonals'),
   h_help='Need help?', help='If the indicators don\'t appear or you have a question, write to us in Telegram and include your TradingView username exactly as in your profile.',
   tg=('Telegram ↗','https://t.me/magicdiagonals'), notsub='Not subscribed yet?', sub='Subscribe to Trading Lab — $29/month ↗',
   note='All statistics are historical results and do not guarantee future results. The decision to trade and position management stay with you.',
   other=('Русская версия →','/docs/ru/')),
 'ru': dict(title='С чего начать: инструкции Trading Lab | Magic Diagonals', desc='Как начать работу с RCC Pro и RSI Retest Scalper Pro в Trading Lab на TradingView: доступ, быстрый старт и PDF-инструкции.',
   eyebrow='Trading Lab · С чего начать', h1='Добро пожаловать в <em>Trading Lab</em>',
   intro='Спасибо за подписку. В ваш Space входят два индикатора TradingView: RCC Pro и RSI Retest Scalper Pro. Доступ открывается автоматически на вашем аккаунте TradingView.',
   h_start='Начать за 5 минут',
   steps=['Откройте любой график на TradingView → Индикаторы → <strong>Только по приглашению</strong>. Добавьте RCC Pro или RSI Retest Scalper Pro. Если их пока нет в списке, обновите страницу.',
          'В настройках индикатора первая строка — <strong>Preset</strong>. Выберите пресет для своего инструмента и поставьте на график ровно тот символ и таймфрейм, что в его названии.',
          'Остальные настройки не меняйте, пока не разберётесь в таблице статистики. Оценивайте пресет по строке цели из его названия (1R или 2R).',
          'Прочитайте инструкцию к своему индикатору ниже.',
          'Создайте уведомления (alerts) на нужных инструментах и таймфреймах. После смены пресета, инструмента или таймфрейма уведомление нужно создать заново.'],
   h_guides='Инструкции к индикаторам',
   guides=[('RCC Pro — руководство','Пресеты, режим Custom, логика канала, сопровождение сделки и статистика. 14 страниц.','/docs/pdf/RCC_Pro_Guide_RU.pdf','/docs/pdf/RCC_Pro_Guide_RU-cover-01.jpg'),
           ('RSI Retest Scalper Pro — руководство','Пресеты, Fast и Smart Entry, линии входа, настройки RSI, фильтры времени и уведомления. 13 страниц.','/docs/pdf/RSI_Retest_Pro_Guide_RU.pdf','/docs/pdf/RSI_Retest_Pro_Guide_RU-cover-01.jpg')],
   dl='Скачать PDF ↓', soon='Скоро здесь появятся онлайн-версии инструкций, по разделам.',
   h_video='Видеоинструкции', video='Полная видеоинструкция RSI Retest Pro (17 минут) и другие разборы — на нашем YouTube-канале:', yt=('IndicatorLab на YouTube ↗','https://www.youtube.com/watch?v=13NBN0E3_uE'),
   h_help='Нужна помощь?', help='Если индикаторы не появились или есть вопрос, напишите в Telegram и укажите ваш логин TradingView точно так, как он написан в профиле.',
   tg=('Telegram ↗','https://t.me/indicatorlabJ'), notsub='Ещё не подписаны?', sub='Подписаться на Trading Lab — $29 в месяц ↗',
   note='Вся статистика — результаты на истории, они не гарантируют будущих результатов. Решение о сделке и управление позицией остаются за вами.',
   other=('English version →','/docs/')),
}

VID = '13NBN0E3_uE'
def video_block(lang, t):
    if lang == 'ru':
        return (f'<h2>Видеоинструкция RSI Retest Scalper Pro</h2><p>Главная инструкция по RSI Retest Pro — 17 минут: 9 пресетов, Smart и Fast Entry, как читать статистику 1R–5R.</p>'
                f'<div class="yt-player" data-yt="{VID}" role="button" tabindex="0" aria-label="Смотреть видеоинструкцию RSI Retest Scalper Pro"><img src="https://i.ytimg.com/vi/{VID}/maxresdefault.jpg" alt="RSI Retest Scalper Pro — полная инструкция" loading="lazy"><span class="yt-play"></span><span class="yt-dur">17:00</span></div>'
                f'<p><a class="outline" data-track="youtube_subscribe_click" href="https://www.youtube.com/@indicatorlabjosseliani?sub_confirmation=1" target="_blank" rel="noopener">Подписаться на YouTube-канал ↗</a></p>')
    return f"<h2>{t['h_video']}</h2><p>{t['video']} <a href=\"{t['yt'][1]}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent)\">{t['yt'][0]}</a></p>"

def page(lang):
    t = T[lang]
    url = 'https://magicdiagonals.com' + ('/docs/ru/' if lang == 'ru' else '/docs/')
    br.CSS += '' if EXTRA_CSS in br.CSS else EXTRA_CSS
    steps = ''.join(f'<li>{s}</li>' for s in t['steps'])
    guides = ''.join(f'<div class="guide"><a href="{pdf}" target="_blank" rel="noopener"><img src="{img}" alt="{title}"></a><div><h3>{title}</h3><p>{d}</p><a class="button" data-track="guide_pdf_download" href="{pdf}" target="_blank" rel="noopener">{t["dl"]}</a></div></div>' for title, d, pdf, img in t['guides'])
    html = br.head(lang, t['title'], t['desc'], url, 'https://magicdiagonals.com' + t['guides'][0][3]) + f"""
<main><p class="eyebrow">{t['eyebrow']}</p><h1>{t['h1']}</h1><p>{t['intro']}</p>
<p class="note"><a href="{t['other'][1]}" style="color:var(--accent)">{t['other'][0]}</a></p>
<h2>{t['h_start']}</h2><ol class="steps">{steps}</ol>
<h2>{t['h_guides']}</h2><div class="guides">{guides}</div><p class="soon">{t['soon']}</p>
{video_block(lang, t)}
<h2>{t['h_help']}</h2><p>{t['help']}</p><p><a class="outline" href="{t['tg'][1]}">{t['tg'][0]}</a></p>
<div class="cta"><p class="eyebrow">{t['notsub']}</p><a class="button" data-track="space_subscribe_click" href="{SPACE}" target="_blank" rel="noopener">{t['sub']}</a></div>
<p class="note">{t['note']}</p></main>""" + br.foot(lang)
    out = ROOT / ('docs/ru/index.html' if lang == 'ru' else 'docs/index.html')
    out.write_text(html, encoding='utf-8')

for lang in ('en', 'ru'):
    page(lang)
# add docs to sitemap
sm = (ROOT / 'sitemap.xml').read_text()
for u in ('https://magicdiagonals.com/docs/', 'https://magicdiagonals.com/docs/ru/'):
    if u not in sm:
        sm = sm.replace('</urlset>', f'  <url><loc>{u}</loc></url>\n</urlset>')
(ROOT / 'sitemap.xml').write_text(sm)
print('docs built')
