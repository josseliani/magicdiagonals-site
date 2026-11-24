(() => {
  const mobile = window.matchMedia('(max-width: 760px)');
  const isRu = document.documentElement.lang.toLowerCase().startsWith('ru');
  document.querySelectorAll('.assembly-table-scroll, .tablewrap').forEach((scroller) => {
    const cue = document.createElement('button');
    cue.type = 'button';
    cue.className = 'md-table-scroll-cue';
    cue.textContent = isRu ? 'Листайте вправо →' : 'Swipe right to compare →';
    cue.setAttribute('aria-label', isRu ? 'Прокрутить сравнение вправо' : 'Scroll comparison right');
    scroller.parentNode.insertBefore(cue, scroller);
    const update = () => {
      const remaining = scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
      cue.hidden = !mobile.matches || remaining < 12;
      scroller.classList.toggle('md-table-has-more', !cue.hidden);
    };
    cue.addEventListener('click', () => scroller.scrollBy({ left: scroller.clientWidth * .7, behavior: 'smooth' }));
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
})();
