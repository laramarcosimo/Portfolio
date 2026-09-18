(() => {
  "use strict";

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initYear = () => {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  };

  const initMenu = () => {
    const toggle = document.querySelector(".site-header__toggle");
    const menu = document.getElementById("menu");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      menu.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  };

  const initFilters = () => {
    const bar = document.querySelector(".filters");
    const items = [...document.querySelectorAll(".work-item")];
    const status = document.querySelector("[data-filter-status]");
    if (!bar || !items.length) return;

    const buttons = [...bar.querySelectorAll("button")];
    const matches = (item, key) => key === "todos" || item.dataset.category.split(" ").includes(key);

    buttons.forEach((btn) => {
      if (!items.some((item) => matches(item, btn.dataset.filter))) btn.hidden = true;
    });

    const apply = (key) => {
      let count = 0;
      items.forEach((item) => {
        const show = matches(item, key);
        item.hidden = !show;
        if (show) count += 1;
      });
      buttons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.filter === key)));
      if (status) status.textContent = `Mostrando ${count} ${count === 1 ? "proyecto" : "proyectos"}`;
    };

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (btn) apply(btn.dataset.filter);
    });

    bar.hidden = false;
  };

  const initForm = () => {
    const form = document.getElementById("contact-form");
    const note = document.querySelector("[data-form-status]");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value.trim();
      const subject = encodeURIComponent(`Contacto desde el portafolio — ${name || "Nuevo mensaje"}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      const link = document.createElement("a");
      link.href = `mailto:laramarcosimo@gmail.com?subject=${subject}&body=${body}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      if (note) note.textContent = "Se abrirá tu aplicación de correo con el mensaje preparado.";
    });
  };

  const initRibbon = () => {
    const NS = "http://www.w3.org/2000/svg";
    const host = document.querySelector(".ribbon");
    if (!host) return;

    const COLORS = { "-1": "#192A56", "0": "#96C9FF", "1": "#9690E4" };
    const STEP = 4;
    const EMIT = 3;
    const TAU = Math.PI * 2;

    let svg = null;
    let segments = [];
    let kk = [];
    let cum = [];
    let kTotal = 1;
    let docH = 1;
    let current = 0;
    let running = false;
    let first = true;

    const top = (el) => el.getBoundingClientRect().top + window.scrollY;
    const bottom = (el) => el.getBoundingClientRect().bottom + window.scrollY;
    const smooth = (t) => {
      const c = clamp(t, 0, 1);
      return c * c * (3 - 2 * c);
    };

    const measure = () => {
      const W = document.documentElement.clientWidth;
      const H = document.body.getBoundingClientRect().height;
      const container = document.querySelector(".about .container");
      const cs = getComputedStyle(container);
      const cl = container.getBoundingClientRect().left + parseFloat(cs.paddingLeft);

      const gap = W >= 1100 ? 3 : 2;
      const s = Math.round(clamp((cl / 2 - gap) / 1.5, 8, 24));
      const p = s + gap;
      const hw = p + s / 2;
      const xL = Math.min(cl / 2, cl - 2 - hw);
      const xR = W - xL;
      const r = clamp(p * 2.6, 30, 70);
      const amp = clamp(p * 0.9, 7, 24);
      const ampHero = clamp(p * 1.3, 10, 34);

      const hero = document.querySelector(".hero .container");
      const heroLast = hero.lastElementChild;
      const about = document.getElementById("sobre-mi");
      const photo = document.querySelector(".about__photo");
      const body = document.querySelector(".about__body");
      const projects = document.getElementById("proyectos");
      const services = document.getElementById("servicios");

      const hib = bottom(heroLast);
      const yAbout = top(about);
      const y0 = hib + hw + ampHero + 24;
      const yc1 = Math.max(yAbout - 10, y0 + 2 * (p + 16));

      const pr = photo.getBoundingClientRect();
      const stacked = body.getBoundingClientRect().top >= pr.bottom - 4;
      const HL = stacked ? xL : Math.max(xL, pr.left - hw - 18);
      const yE = pr.bottom + window.scrollY + hw + 16;
      const Mx = Math.max(pr.left + pr.width * 0.68, HL + 2 * r + 24);

      const yb1 = stacked ? bottom(about) : Math.max(bottom(about), yE + 2 * r + 12);
      const yb2 = bottom(projects);
      const yS = bottom(services);

      const rows = [...document.querySelectorAll(".work-item")]
        .filter((li) => !li.hidden)
        .map((li) => {
          const b = li.getBoundingClientRect();
          return { top: b.top + window.scrollY, bottom: b.bottom + window.scrollY };
        });
      const tops = [...new Set(rows.map((row) => Math.round(row.top)))].sort((a, b) => a - b);
      let ym = (yb1 + yb2) / 2;
      if (tops.length >= 2) {
        const firstBottom = Math.max(...rows.filter((row) => Math.round(row.top) === tops[0]).map((row) => row.bottom));
        ym = (firstBottom + tops[1]) / 2;
      } else if (rows.length) {
        ym = (rows[0].top + rows[0].bottom) / 2;
      }
      ym = clamp(ym, yb1 + 2 * r + 20, Math.max(yb1 + 2 * r + 20, yb2 - 2 * r - 20));

      const sTop = top(services);
      const y3 = clamp(sTop + (yS - sTop) * 0.72, yb2 + 2 * r + 20, Math.max(yb2 + 2 * r + 20, yS - 2 * r - 20));
      const yT = (bottom(document.querySelector(".footer-bar")) + H) / 2;

      return { W, H, s, p, hw, xL, xR, r, amp, ampHero, y0, yc1, stacked, HL, yE, Mx, yb1, yb2, yS, ym, y3, yT };
    };

    const buildCenterline = (g) => {
      const pts = [];
      let windowId = 0;
      const push = (x, y, th = 0, w = -1) => pts.push({ x, y, th, w });

      const line = (x0, y0, x1, y1) => {
        const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / STEP));
        for (let i = 1; i <= n; i++) push(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n);
      };
      const arc = (cx, cy, rad, a0, a1) => {
        const n = Math.max(2, Math.ceil((rad * Math.abs(a1 - a0) * Math.PI) / 180 / STEP));
        for (let i = 1; i <= n; i++) {
          const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
          push(cx + rad * Math.cos(a), cy + rad * Math.sin(a));
        }
      };
      const wave = (x0, x1, y, a, cycles, phase, twist) => {
        const len = Math.abs(x1 - x0);
        const n = Math.max(1, Math.ceil(len / STEP));
        const canTwist = twist && len >= 300;
        const wlen = canTwist ? Math.min(clamp(len * 0.42, 200, 520), len * 0.8) : 0;
        const u0 = (1 - wlen / len) / 2;
        const u1 = u0 + wlen / len;
        const id = canTwist ? windowId++ : -1;
        for (let i = 1; i <= n; i++) {
          const u = i / n;
          const env = Math.sin(Math.PI * u) ** 2;
          const y1 = y + a * env * Math.sin(TAU * cycles * u + phase);
          const th = canTwist ? TAU * smooth((u - u0) / (u1 - u0)) : 0;
          push(x0 + (x1 - x0) * u, y1, th, canTwist && u > u0 && u < u1 ? id : -1);
        }
      };

      const { W, xR, r, amp, ampHero, y0, yc1, HL, yE, Mx, yb1, yb2, yS, ym, y3, yT, stacked } = g;
      const L = g.xL;
      const R = xR;
      const rho = (yc1 - y0) / 2;

      push(-90, y0);
      wave(-90, R - rho, y0, ampHero, 1.25, 0.6, false);
      arc(R - rho, y0 + rho, rho, -90, 90);
      wave(R - rho, HL + r, yc1, amp, 1, 2.4, true);
      arc(HL + r, yc1 + r, r, -90, -180);

      if (stacked) {
        line(HL, yc1 + r, HL, yb1 - r);
        arc(HL + r, yb1 - r, r, 180, 90);
      } else {
        line(HL, yc1 + r, HL, yE - r);
        arc(HL + r, yE - r, r, 180, 90);
        line(HL + r, yE, Mx - r, yE);
        arc(Mx - r, yE + r, r, -90, 0);
        line(Mx, yE + r, Mx, yb1 - r);
        arc(Mx + r, yb1 - r, r, 180, 90);
      }

      const from = stacked ? HL + r : Mx + r;
      wave(from, R - r, yb1, amp, 0.8, 0.4, false);
      arc(R - r, yb1 + r, r, -90, 0);
      line(R, yb1 + r, R, ym - r);
      arc(R - r, ym - r, r, 0, 90);
      wave(R - r, L + r, ym, amp * 0.5, 1, 1.2, false);
      arc(L + r, ym + r, r, -90, -180);
      line(L, ym + r, L, yb2 - r);
      arc(L + r, yb2 - r, r, 180, 90);
      wave(L + r, R - r, yb2, amp, 1, 3.6, true);
      arc(R - r, yb2 + r, r, -90, 0);
      line(R, yb2 + r, R, y3 - r);
      arc(R - r, y3 - r, r, 0, 90);
      wave(R - r, L + r, y3, amp * 0.6, 1, 0.9, false);
      arc(L + r, y3 + r, r, -90, -180);
      line(L, y3 + r, L, yS - r);
      arc(L + r, yS - r, r, 180, 90);
      wave(L + r, R - r, yS, amp, 1, 5.1, true);
      arc(R - r, yS + r, r, -90, 0);
      line(R, yS + r, R, yT - r);
      arc(R - r, yT - r, r, 0, 90);
      wave(R - r, W * 0.42, yT, amp * 0.3, 0.6, 1.7, false);

      return pts;
    };

    const build = () => {
      const g = measure();
      docH = g.H;
      if (svg) svg.remove();
      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("width", String(g.W));
      svg.setAttribute("height", String(Math.ceil(g.H)));
      svg.setAttribute("viewBox", `0 0 ${g.W} ${Math.ceil(g.H)}`);
      svg.setAttribute("focusable", "false");
      host.appendChild(svg);

      const pts = buildCenterline(g);
      const N = pts.length;

      cum = new Array(N).fill(0);
      kk = new Array(N).fill(0);
      for (let i = 1; i < N; i++) {
        const dx = pts[i].x - pts[i - 1].x;
        const dy = pts[i].y - pts[i - 1].y;
        cum[i] = cum[i - 1] + Math.hypot(dx, dy);
        kk[i] = kk[i - 1] + Math.abs(dy) + 0.1 * Math.abs(dx);
      }
      kTotal = kk[N - 1];

      const normals = pts.map((_, i) => {
        const a = pts[Math.max(0, i - 2)];
        const b = pts[Math.min(N - 1, i + 2)];
        const tx = b.x - a.x;
        const ty = b.y - a.y;
        const len = Math.hypot(tx, ty) || 1;
        return { x: -ty / len, y: tx / len };
      });

      const bounds = [0];
      const byWindow = new Map();
      pts.forEach((pt, i) => {
        if (pt.w < 0) return;
        const win = byWindow.get(pt.w) || { half: -1, end: -1 };
        if (win.half < 0 && pt.th >= Math.PI) win.half = i;
        win.end = i;
        byWindow.set(pt.w, win);
      });
      [...byWindow.keys()].sort((a, b) => a - b).forEach((id) => {
        const win = byWindow.get(id);
        bounds.push(win.half, Math.min(N - 1, win.end + 1));
      });
      bounds.push(N - 1);

      segments = [];
      for (let j = 0; j < bounds.length - 1; j++) {
        const i0 = bounds[j];
        const i1 = j === bounds.length - 2 ? bounds[j + 1] : Math.min(N - 1, bounds[j + 1] + 3);
        if (i1 <= i0) continue;
        const order = j % 2 === 0 ? [-1, 0, 1] : [1, 0, -1];
        const els = order.map((k) => {
          const P = [];
          for (let i = i0; i <= i1; i += EMIT) P.push(i);
          if (P[P.length - 1] !== i1) P.push(i1);
          const off = P.map((i) => {
            const spread = k * g.p * Math.cos(pts[i].th);
            return { x: pts[i].x + normals[i].x * spread, y: pts[i].y + normals[i].y * spread };
          });
          const at = (n) => off[clamp(n, 0, off.length - 1)];
          let d = `M${off[0].x.toFixed(1)} ${off[0].y.toFixed(1)}`;
          for (let n = 0; n < off.length - 1; n++) {
            const a = at(n - 1);
            const b = at(n);
            const c = at(n + 1);
            const e = at(n + 2);
            d += `C${(b.x + (c.x - a.x) / 6).toFixed(1)} ${(b.y + (c.y - a.y) / 6).toFixed(1)} ${(c.x - (e.x - b.x) / 6).toFixed(1)} ${(c.y - (e.y - b.y) / 6).toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
          }
          const path = document.createElementNS(NS, "path");
          path.setAttribute("d", d);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", COLORS[k]);
          path.setAttribute("stroke-width", String(g.s));
          path.setAttribute("stroke-linecap", "butt");
          path.setAttribute("stroke-linejoin", "round");
          path.setAttribute("pathLength", "1");
          path.setAttribute("stroke-dasharray", "1 2");
          path.setAttribute("stroke-dashoffset", "1");
          path.dataset.band = String(k + 1);
          svg.appendChild(path);
          return path;
        });
        segments.push({ c0: cum[i0], c1: cum[i1], els });
      }
    };

    const lengthAt = (k) => {
      if (k <= 0) return 0;
      if (k >= kTotal) return cum[cum.length - 1];
      let lo = 0;
      let hi = kk.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (kk[mid] <= k) lo = mid;
        else hi = mid;
      }
      const span = kk[hi] - kk[lo] || 1;
      return cum[lo] + ((cum[hi] - cum[lo]) * (k - kk[lo])) / span;
    };

    const render = () => {
      const drawn = lengthAt(current);
      segments.forEach((seg) => {
        const f = clamp((drawn - seg.c0) / (seg.c1 - seg.c0), 0, 1);
        const value = (1 - f).toFixed(4);
        seg.els.forEach((el) => {
          if (el.getAttribute("stroke-dashoffset") !== value) el.setAttribute("stroke-dashoffset", value);
        });
      });
    };

    const target = () => {
      if (reduceMotion.matches) return kTotal;
      const vh = window.innerHeight;
      const p = (window.scrollY + vh * 0.95) / Math.max(1, docH - vh * 0.1);
      return clamp(p, 0, 1) * kTotal * 1.01;
    };

    const tick = () => {
      const goal = target();
      current += (goal - current) * 0.12;
      if (Math.abs(goal - current) < 0.5) {
        current = goal;
        running = false;
      }
      render();
      if (running) requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduceMotion.matches || document.hidden) {
        current = target();
        render();
        return;
      }
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    };

    const rebuild = () => {
      build();
      if (first) {
        first = false;
        current = reduceMotion.matches || document.hidden ? kTotal : 0;
      } else {
        current = target();
      }
      render();
      start();
    };

    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 60);
    };

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) start();
    });
    reduceMotion.addEventListener("change", schedule);
    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);

    rebuild();
  };

  initYear();
  initMenu();
  initFilters();
  initForm();
  initRibbon();
})();
