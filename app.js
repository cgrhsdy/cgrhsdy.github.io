/* ============================================================
   2603130114 · 个人主页交互
   三段式流程：入口页 → 加载页 → 主页面
   零依赖，纯原生 JS。所有副作用都做了降级处理。
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var entry = $('#entry');
  var loader = $('#loader');
  var site = $('#site');
  var enterBtn = $('#enterBtn');

  /* ------------------------------------------------------------
     ① 进入主流程：入口页 → 加载页 → 主页面
     ------------------------------------------------------------ */
  var started = false;

  function begin() {
    if (started) return;          // 防止重复触发
    started = true;

    // 入口页淡出
    entry.classList.add('hide');

    // 加载页出现（签名描边 2.5 秒）
    loader.classList.add('show');

    document.body.classList.add('locked');

    setTimeout(function () {
      loader.classList.add('hide');
      site.classList.add('show');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
      // 主页面登场后启动滚动观察
      initReveal();
      // 顶部统计数字有数据后再跑
      runCounters();
      // 移除加载页，避免它继续占据层级
      setTimeout(function () { loader.style.display = 'none'; }, 600);
    }, 2500);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', begin);
  }

  // 可用性：入口页支持键盘操作（Enter / 空格 / 任意键）
  document.addEventListener('keydown', function (e) {
    if (started) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      begin();
    }
  });

  // 加载过程中点击可跳过（可用性兜底）
  if (loader) {
    loader.addEventListener('click', function () {
      if (started) {
        loader.classList.add('hide');
        site.classList.add('show');
        document.body.classList.remove('locked');
        initReveal();
        runCounters();
        setTimeout(function () { loader.style.display = 'none'; }, 400);
      }
    });
  }

  /* ------------------------------------------------------------
     ② 滚动揭示 + 技能条动画
     ------------------------------------------------------------ */
  var revealInit = false;

  function initReveal() {
    if (revealInit) return;
    revealInit = true;

    var items = $$('.reveal, .skill');

    if (!('IntersectionObserver' in window)) {
      // 降级：不支持就直接全部显示
      items.forEach(function (el) {
        el.classList.add('in');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------
     ③ Hero 数字滚动
     ------------------------------------------------------------ */
  var countersDone = false;

  function runCounters() {
    if (countersDone) return;
    countersDone = true;

    // 用户偏好减少动效时，直接保留 HTML 中的最终数值，不做滚动动画
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    $$('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var dur = 1100;
      var t0 = null;

      // 数值只在这里归零：即使脚本中途失败，页面上也仍是 HTML 里写好的真实数字
      el.textContent = '0';

      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        // easeOutCubic
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }

  /* ------------------------------------------------------------
     ④ 导航栏滚动状态 + 阅读进度条 + 回到顶部
     ------------------------------------------------------------ */
  var nav = $('#nav');
  var toTop = $('#toTop');
  var progress = $('#progress');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (nav) nav.classList.toggle('solid', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = Math.max(0, Math.min(100, pct)) + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------
     ⑤ 复制按钮
     ------------------------------------------------------------ */
  $$('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      var done = function () {
        var old = btn.textContent;
        btn.textContent = '已复制';
        btn.classList.add('ok');
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove('ok');
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }

      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          done();
        } catch (e) {
          // 复制失败时不阻断，用户仍可手动选中
        }
      }
    });
  });

  /* ------------------------------------------------------------
     ⑥ 年份 & 首屏初始化
     ------------------------------------------------------------ */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (nav) nav.classList.toggle('solid', false);
  onScroll();

  // 无 JS 环境下 .site 会因为 opacity:0 而不可见；
  // 这里给 <html> 打个标记，配合 CSS 里的 noscript 兜底一起工作。
  document.documentElement.classList.add('js-ready');
})();
