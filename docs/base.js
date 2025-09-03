



(() => {
  'use strict';

  // === 1) スキップリンク（本文へスキップ） ===
  document.addEventListener('DOMContentLoaded', () => {
    const skip = document.querySelector('.t2-skip');
    const main = document.getElementById('main');
    if (!skip || !main) return;

    skip.addEventListener('click', () => {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
      main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
    });
  });

  // === 2) ページトップボタン表示制御 ===
  document.addEventListener('DOMContentLoaded', () => {
    const topBtn = document.querySelector('.t2-pagetop');
    const hero = document.querySelector('.t2-hero');
    const toggleTopBtn = (show) => topBtn && topBtn.classList.toggle('is-show', !!show);

    if (topBtn && hero && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        toggleTopBtn(!e.isIntersecting);
      }, { rootMargin: '-1px 0px 0px 0px', threshold: 0 });
      io.observe(hero);
    }
    const onScroll = () => toggleTopBtn(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  // === 3) ヘッダーナビ：現在ページ強調 + ScrollSpy + スムーススクロール ===
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.t2-nav');
    if (!nav) return;

    // A) 現在ページを自動で強調（外部URLは除外）
    const current = (location.pathname.split('/').pop() || 'index.html');
    nav.querySelectorAll('a[href]:not([href^="#"])').forEach(a => {
      const href = a.getAttribute('href');
      if (/^https?:/i.test(href)) return;
      const dest = href.split('/').pop();
      if (dest === current) a.setAttribute('aria-current', 'page');
    });

    // B) 同一ページ内アンカー（ボタン .btn-gold は除外）
    const header = document.querySelector('.t2-header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn-gold)')];
    const targets = links
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
    };

    // ScrollSpy：見えているセクションのリンクを金色＆ちょい持ち上げ
    if ('IntersectionObserver' in window && targets.length) {
      const io = new IntersectionObserver((entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive('#' + visible.target.id);
      }, {
        rootMargin: `-${Math.round(headerH + 8)}px 0px -70% 0px`,
        threshold: [0, 1]
      });
      targets.forEach(sec => io.observe(sec));
    }

    // クリック時：stickyヘッダー高さを引いてスムーススクロール
    nav.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - (headerH + 8);
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (!a.classList.contains('btn-gold')) setActive(a.getAttribute('href'));
    });
  });

})();



// === Viewport Debug (Alt+W で表示/非表示) ===
(() => {
  let box, on = false, rid;
  const ID = '__vwdbg__';
  const mq = () =>
    matchMedia('(max-width:767px)').matches ? 'SP≤767' :
    matchMedia('(width:1024px)').matches ? '1024pxピン' : 'MD/PC';
  const render = () => {
    if (!on) return;
    box.textContent =
      `${window.innerWidth}×${window.innerHeight}px  DPR:${window.devicePixelRatio}  ${mq()}`;
    rid = requestAnimationFrame(render);
  };
  const toggle = () => {
    on = !on;
    if (on) {
      if (!box) {
        box = document.createElement('div');
        box.id = ID;
        box.style.cssText =
          'position:fixed;right:8px;bottom:8px;z-index:99999;' +
          'font:12px/1.4 system-ui,Segoe UI,Arial;' +
          'background:rgba(15,30,47,.9);color:#fff;padding:6px 8px;' +
          'border-radius:8px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.2)';
        document.body.appendChild(box);
      }
      render();
    } else {
      cancelAnimationFrame(rid);
      box && (box.textContent = '');
      box && box.remove();
      box = null;
    }
  };
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'w' || e.key === 'W')) toggle();
  });
})();
