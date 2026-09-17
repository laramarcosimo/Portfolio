document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- wave motif: shared SVG clip-path defs ---------- */
  const svgNS = "http://www.w3.org/2000/svg";
  const defsSvg = document.createElementNS(svgNS, "svg");
  defsSvg.setAttribute("width", "0");
  defsSvg.setAttribute("height", "0");
  defsSvg.style.position = "absolute";
  defsSvg.innerHTML = `
    <defs>
      <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
        <path d="M0,0 H1 V0.86
          C0.92,0.94 0.86,0.78 0.78,0.86
          C0.7,0.94 0.64,0.78 0.56,0.86
          C0.48,0.94 0.42,0.78 0.34,0.86
          C0.26,0.94 0.2,0.78 0.12,0.86
          C0.06,0.92 0.02,0.9 0,0.88 Z" />
      </clipPath>
    </defs>`;
  body.prepend(defsSvg);

  /* ---------- wave dividers: draw-on-scroll ---------- */
  const waveDividers = document.querySelectorAll(".wave-divider");
  if (waveDividers.length && "IntersectionObserver" in window) {
    const waveIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-drawn");
            waveIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    waveDividers.forEach((el) => waveIo.observe(el));
  } else {
    waveDividers.forEach((el) => el.classList.add("is-drawn"));
  }

  const desktopInteraction = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");

  /* ---------- adaptive navbar logo: swap light/dark lockup per section ---------- */
  const themeSectionsList = Array.from(document.querySelectorAll("[data-theme]"));
  if (header && themeSectionsList.length && "IntersectionObserver" in window) {
    const themeState = new Map(themeSectionsList.map((el) => [el, false]));
    const applyTheme = () => {
      let current = null;
      themeSectionsList.forEach((el) => {
        if (themeState.get(el)) current = el;
      });
      if (current) header.classList.toggle("is-dark", current.dataset.theme === "dark");
    };
    const themeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => themeState.set(entry.target, entry.isIntersecting));
        applyTheme();
      },
      { rootMargin: "-64px 0px -40% 0px", threshold: 0 }
    );
    themeSectionsList.forEach((el) => themeIo.observe(el));
  }

  const onScroll = () => {
    if (window.scrollY > 40) header?.classList.add("scrolled");
    else header?.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    body.classList.toggle("nav-open");
  });

  document.querySelectorAll(".main-nav .nav-link, .main-nav .btn-contact").forEach((link) => {
    link.addEventListener("click", () => body.classList.remove("nav-open"));
  });

  /* ---------- heading split-word reveal ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    el.classList.add("split-words");
    let i = 0;
    text.split(" ").forEach((word, idx, arr) => {
      const wrap = document.createElement("span");
      wrap.className = "word";
      const inner = document.createElement("span");
      inner.textContent = word + (idx < arr.length - 1 ? " " : "");
      inner.style.setProperty("--i", i++);
      wrap.appendChild(inner);
      el.appendChild(wrap);
    });
  });

  /* ---------- reveal on scroll (clip-path wipe) ---------- */
  const revealEls = Array.from(document.querySelectorAll(".reveal, .split-words"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: [0, 0.15] }
    );
    revealEls.forEach((el) => io.observe(el));

    let pending = revealEls.slice();
    const pollFallback = () => {
      pending = pending.filter((el) => {
        const rect = el.getBoundingClientRect();
        const visible = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
        if (visible) el.classList.add("is-visible");
        return !visible;
      });
      if (pending.length) requestAnimationFrame(pollFallback);
    };
    requestAnimationFrame(pollFallback);
    window.addEventListener("scroll", () => requestAnimationFrame(pollFallback), { passive: true });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- skill bar fill ---------- */
  const bars = document.querySelectorAll(".progress-fill");
  if (bars.length && "IntersectionObserver" in window) {
    const barIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
            barIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((bar) => barIo.observe(bar));
  }

  /* ---------- swatch paint-in ---------- */
  const swatches = document.querySelectorAll(".swatch");
  if (swatches.length && "IntersectionObserver" in window) {
    const swatchIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("is-painted"), idx * 90);
            swatchIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    swatches.forEach((s) => swatchIo.observe(s));
  } else {
    swatches.forEach((s) => s.classList.add("is-painted"));
  }

  /* ---------- scroll-spy ---------- */
  const sideLinks = document.querySelectorAll(".cv-sidebar a, .projects-nav a");
  const targets = Array.from(sideLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (targets.length && "IntersectionObserver" in window) {
    const spyIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = "#" + entry.target.id;
          const link = document.querySelector(`.cv-sidebar a[href="${id}"], .projects-nav a[href="${id}"]`);
          if (entry.isIntersecting) {
            sideLinks.forEach((l) => l.classList.remove("active"));
            link?.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    targets.forEach((t) => spyIo.observe(t));
  }

  /* ---------- parallax ---------- */
  const parallaxEls = Array.from(document.querySelectorAll("[data-speed]"));
  if (parallaxEls.length && !reducedMotion) {
    let ticking = false;
    const applyParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.15;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - vh / 2;
        el.style.transform = `translateY(${(-center * speed).toFixed(2)}px)`;
      });
      ticking = false;
    };
    const onParallaxScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    };
    applyParallax();
    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    window.addEventListener("resize", onParallaxScroll);
  }

  /* ---------- magnetic hover ---------- */
  if (!reducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------- page transitions ---------- */
  const overlay = document.createElement("div");
  overlay.className = "page-transition";
  body.appendChild(overlay);

  if (!reducedMotion) {
    overlay.style.setProperty("--px", "50%");
    overlay.style.setProperty("--py", "50%");
    overlay.classList.add("is-revealing");
    requestAnimationFrame(() => {
      overlay.addEventListener("transitionend", () => overlay.classList.remove("is-revealing"), { once: true });
    });

    document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="http"])').forEach((link) => {
      link.addEventListener("click", (e) => {
        const dest = link.getAttribute("href");
        if (!dest || link.hasAttribute("data-no-transition")) return;
        e.preventDefault();
        overlay.style.setProperty("--px", `${(e.clientX / window.innerWidth) * 100}%`);
        overlay.style.setProperty("--py", `${(e.clientY / window.innerHeight) * 100}%`);
        overlay.classList.remove("is-revealing");
        overlay.classList.add("is-covering");
        overlay.addEventListener(
          "transitionend",
          () => {
            window.location.href = dest;
          },
          { once: true }
        );
      });
    });
  }
});
