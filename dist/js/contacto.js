/* =========================================
   SECCIÓN DE ESCRITORIO Y LÓGICA COMPARTIDA
   ========================================= */

// Desbloqueamos el scroll inmediatamente
document.body.classList.add('loaded');

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

document.addEventListener('mouseover', (e) => {
    if (!cursorDot) return;
    
    if (e.target.closest('p') || e.target.closest('a') || e.target.closest('button') || e.target.closest('.nav-link')) {
        cursorDot.classList.add('active');
    } else {
        cursorDot.classList.remove('active');
    }

    const backToTop = e.target.closest('.back-to-top');
    if (backToTop) {
        if (backToTop.classList.contains('on-dark-bg')) {
            cursorDot.classList.add('on-dark');
            cursorDot.classList.remove('force-blue');
        } else {
            cursorDot.classList.remove('on-dark');
            cursorDot.classList.add('force-blue');
        }
    } else {
        cursorDot.classList.remove('force-blue');
        if (e.target.closest('.cv-header') || e.target.closest('.cv-footer')) {
            cursorDot.classList.add('on-dark');
        } else {
            cursorDot.classList.remove('on-dark');
        }
    }
});

// --- FONDO TOPOGRÁFICO FOOTER (NUEVO) ---
window.addEventListener('load', () => {
    // Seleccionamos el contenedor específico del footer
    const footerBox = document.querySelector('.cv-footer .footer-box');
    if (!footerBox) return;

    // Crear canvas dinámicamente dentro del footer
    const canvas = document.createElement('canvas');
    canvas.id = 'cv-footer-canvas';
    footerBox.prepend(canvas); // Insertar al principio del footer-box

    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;
    
    // [NUEVO] Variables para rastrear el ratón
    let mx = -9999, my = -9999;
    
    footerBox.addEventListener('mousemove', (e) => {
        const rect = footerBox.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
    });
    
    footerBox.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

    // Usamos la misma configuración "Zen" del header
    const config = {
        color: 'rgba(255, 255, 255, 0.15)',
        lines: 10,           // Menos líneas para un espacio más pequeño
        noiseScale: 0.004,
        speed: 0.001,
        amp: 20,
        lineWidth: 1.5
    };

    // Ruido Simplex (Versión compacta)
    const noise = (function() {
        const p = new Uint8Array(256);
        for(let i=0; i<256; i++) p[i] = i;
        for(let i=255; i>0; i--){
            const r = Math.floor(Math.random()*(i+1));
            [p[i], p[r]] = [p[r], p[i]];
        }
        const perm = new Uint8Array(512);
        for(let i=0; i<512; i++) perm[i] = p[i & 255];
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

    function resize() {
        width = footerBox.offsetWidth;
        height = footerBox.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.lineWidth;
        for (let i = 0; i < config.lines; i++) {
            ctx.beginPath();
            let yBase = (height / config.lines) * i + (height / config.lines / 2);
            for (let x = 0; x <= width; x += 10) {
                let n = noise(x * config.noiseScale, i * 0.5 + time);
                
                // [NUEVO] Cálculo de interacción
                let dist = Math.hypot(x - mx, yBase - my);
                let interaction = Math.max(0, 1 - dist / 200);
                let wave = interaction * 25 * Math.sin(x * 0.02 + time * 8);
                
                let y = yBase + (n * config.amp) + wave;
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        time += config.speed;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
});

/* =========================================
   SECCIÓN DE MÓVIL (MENÚ Y EVENTOS)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera (NUEVO)
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });

        // [NUEVO] Cambio de imágenes (Logo/Menú) de 'blanco' a 'azul' en páginas claras
        if (document.body.classList.contains('light-page')) {
            // 1. Logo Principal
            const logo = document.querySelector('.site-logo');
            if (logo && logo.getAttribute('src') && logo.getAttribute('src').includes('blanco')) {
                const newSrc = logo.getAttribute('src').replace('blanco', 'azul');
                logo.setAttribute('src', newSrc);
            }

            // 2. Icono Menú Hamburguesa (Móvil)
            const menuImg = document.querySelector('.menu-toggle img');
            if (menuImg && menuImg.getAttribute('src') && menuImg.getAttribute('src').includes('blanco')) {
                const newSrc = menuImg.getAttribute('src').replace('blanco', 'azul');
                menuImg.setAttribute('src', newSrc);
            }
        }
    }
});
