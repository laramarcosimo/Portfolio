// Proyecto-video.js

document.addEventListener('DOMContentLoaded', () => {
    // Desbloqueamos el scroll
    document.body.classList.add('loaded');

    // --- LÓGICA DEL MENÚ HAMBURGUESA ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        const toggleMenu = (e) => {
            if (e) e.preventDefault();
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        };

        menuToggle.addEventListener('touchstart', toggleMenu, { passive: false });
        menuToggle.addEventListener('click', (e) => {
            if (!('ontouchstart' in window || navigator.maxTouchPoints)) toggleMenu(e);
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }

    // [NUEVO] Cambio de imágenes (Logo/Menú) de 'blanco' a 'azul' en páginas claras
    if (document.body.classList.contains('light-page')) {
        const logo = document.querySelector('.site-logo');
        if (logo && logo.getAttribute('src') && logo.getAttribute('src').includes('blanco')) {
            logo.setAttribute('src', logo.getAttribute('src').replace('blanco', 'azul'));
        }
        const menuImg = document.querySelector('.menu-toggle img');
        if (menuImg && menuImg.getAttribute('src') && menuImg.getAttribute('src').includes('blanco')) {
            menuImg.setAttribute('src', menuImg.getAttribute('src').replace('blanco', 'azul'));
        }
    }

    // --- LÓGICA DEL CURSOR PERSONALIZADO ---
    const cursorDot = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dotSpeed = 1; 
        cursorX += (mouseX - cursorX) * dotSpeed;
        cursorY += (mouseY - cursorY) * dotSpeed;

        if (cursorDot) {
            cursorDot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    function updateCursorColor() {
        if (!cursorDot) return;
        const target = document.elementFromPoint(mouseX, mouseY);
        if (!target) return;
        
        let shouldBeWhite = false;

        // 1. Detectar si estamos sobre una zona oscura (Video, Botón Contacto o Footer)
        if (target.closest('#video-section') || target.closest('.btn-contact') || target.closest('.cv-footer')) {
            shouldBeWhite = true;
        }

        // 2. Aplicar el color correspondiente
        if (shouldBeWhite) {
            cursorDot.classList.add('on-dark');
            cursorDot.classList.remove('force-blue');
        } else {
            cursorDot.classList.remove('on-dark');
            // En la parte blanca (Welcome Screen o Header), forzamos el azul corporativo
            cursorDot.classList.add('force-blue');
        }
    }

    window.addEventListener('mousemove', updateCursorColor, { passive: true });
    window.addEventListener('scroll', updateCursorColor, { passive: true });

    document.addEventListener('mouseover', (e) => {
        if (!cursorDot) return;
        
        // Estado activo al pasar sobre el texto o la flecha
        if (e.target.closest('p') || e.target.closest('a') || e.target.closest('button') || e.target.closest('i')) {
            cursorDot.classList.add('active');
        } else {
            cursorDot.classList.remove('active');
        }
    });

    const arrow = document.getElementById('scroll-arrow');
    const videoSection = document.getElementById('video-section');
    const video = document.getElementById('main-video');

    let videoStarted = false;

    // Función para arrancar el video de forma limpia
    const startVideo = () => {
        if (!videoStarted && video) {
            videoStarted = true;
            // Asegura que no esté silenciado para que tenga sonido
            video.muted = false; 
            video.currentTime = 0;
            
            // Intenta reproducir automáticamente
            video.play().catch(error => {
                console.warn(
                    "El navegador bloqueó el audio automático. El usuario deberá interactuar con los controles de video para activar el volumen.", 
                    error
                );
            });
        }
    };

    // 1. Interacción al hacer Clic en la flecha inferior
    if (arrow && videoSection) {
        arrow.addEventListener('click', () => {
            videoSection.scrollIntoView({ behavior: 'smooth' });
            startVideo();
        });
    }

    // 2. Interacción alternativa si el usuario prefiere hacer Scroll manual hacia abajo
    window.addEventListener('scroll', () => {
        const welcomeHeight = window.innerHeight;
        // Si el usuario baja más de la mitad de la pantalla blanca, activa el video automáticamente
        if (window.scrollY > welcomeHeight / 2) {
            startVideo();
            // Desvanece la flecha para que no moleste en el fondo
            if (arrow) arrow.style.opacity = '0'; 
        } else {
            if (video) {
                video.pause();
                videoStarted = false; // Permite que startVideo() reinicie el video desde cero al volver a bajar
            }
            if (arrow) arrow.style.opacity = '1';
        }

        // Control de visibilidad y color del botón "Volver arriba"
        const backToTopBtn = document.querySelector('.back-to-top');
        const footer = document.querySelector('.cv-footer');
        
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }

            if (footer) {
                const btnRect = backToTopBtn.getBoundingClientRect();
                const footerRect = footer.getBoundingClientRect();
                if (btnRect.bottom > footerRect.top) {
                    backToTopBtn.classList.add('on-dark-bg');
                } else {
                    backToTopBtn.classList.remove('on-dark-bg');
                }
            }
        }
    });

    // --- FONDO TOPOGRÁFICO FOOTER ---
    function initFooterCanvas(footerBox) {
        if (!footerBox) return;
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0'; canvas.style.left = '0';
        canvas.style.width = '100%'; canvas.style.height = '100%';
        canvas.style.zIndex = '1'; canvas.style.pointerEvents = 'none';
        footerBox.prepend(canvas);
        const ctx = canvas.getContext('2d');
        let width, height, time = 0;
        let mx = -9999, my = -9999;
        footerBox.addEventListener('mousemove', (e) => {
            const rect = footerBox.getBoundingClientRect();
            mx = e.clientX - rect.left; my = e.clientY - rect.top;
        });
        const config = { color: 'rgba(255, 255, 255, 0.15)', lines: 10, noiseScale: 0.004, speed: 0.001, amp: 20, lineWidth: 1.5 };
        const noise = (function() {
            const p = new Uint8Array(256); for(let i=0; i<256; i++) p[i] = i;
            for(let i=255; i>0; i--){ const r = Math.floor(Math.random()*(i+1)); [p[i], p[r]] = [p[r], p[i]]; }
            const perm = new Uint8Array(512); for(let i=0; i<512; i++) perm[i] = p[i & 255];
            const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
            return function(x, y) {
                const F2 = 0.5*(Math.sqrt(3)-1), G2 = (3-Math.sqrt(3))/6;
                let n0, n1, n2, s = (x+y)*F2;
                let i = Math.floor(x+s), j = Math.floor(y+s);
                let t = (i+j)*G2, X0 = i-t, Y0 = j-t, x0 = x-X0, y0 = y-Y0;
                let i1 = x0>y0 ? 1 : 0, j1 = x0>y0 ? 0 : 1;
                let x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1.0 + 2.0*G2, y2 = y0 - 1.0 + 2.0*G2;
                let ii = i & 255, jj = j & 255;
                let gi0 = perm[ii+perm[jj]] % 12, gi1 = perm[ii+i1+perm[jj+j1]] % 12, gi2 = perm[ii+1+perm[jj+1]] % 12;
                let t0 = 0.5 - x0*x0 - y0*y0, t1 = 0.5 - x1*x1 - y1*y1, t2 = 0.5 - x2*x2 - y2*y2;
                n0 = t0<0 ? 0 : (t0*=t0, t0*t0*(grad3[gi0][0]*x0 + grad3[gi0][1]*y0));
                n1 = t1<0 ? 0 : (t1*=t1, t1*t1*(grad3[gi1][0]*x1 + grad3[gi1][1]*y1));
                n2 = t2<0 ? 0 : (t2*=t2, t2*t2*(grad3[gi2][0]*x2 + grad3[gi2][1]*y2));
                return 70.0 * (n0 + n1 + n2);
            };
        })();
        function resize() { width = footerBox.offsetWidth; height = footerBox.offsetHeight; canvas.width = width; canvas.height = height; }
        function draw() {
            ctx.clearRect(0, 0, width, height); ctx.strokeStyle = config.color; ctx.lineWidth = config.lineWidth;
            for (let i = 0; i < config.lines; i++) {
                ctx.beginPath(); let yBase = (height / config.lines) * i + (height / config.lines / 2);
                for (let x = 0; x <= width; x += 10) {
                    let n = noise(x * config.noiseScale, i * 0.5 + time);
                    let dist = Math.hypot(x - mx, yBase - my); let interaction = Math.max(0, 1 - dist / 200);
                    let wave = interaction * 25 * Math.sin(x * 0.02 + time * 8);
                    let y = yBase + (n * config.amp) + wave; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            time += config.speed; requestAnimationFrame(draw);
        }
        window.addEventListener('resize', resize); resize(); draw();
    }

    const footerBox = document.querySelector('.cv-footer .footer-box');
    if (footerBox) initFooterCanvas(footerBox);
});