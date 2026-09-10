/* =========================================
   SECCIÓN DE ESCRITORIO Y LÓGICA COMPARTIDA
   ========================================= */

// Desbloqueamos el scroll inmediatamente (no hay video intro en páginas internas)
document.body.classList.add('loaded');

// [NUEVO] Inyección segura de la foto de perfil (Solución Bug Safari/iOS)
// Esto asegura que la imagen se cargue como recurso real y no desaparezca al cambiar de pestaña.
document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.querySelector('.profile-pic');
    // Si la imagen no tiene fuente o está vacía, se la asignamos
    if (profilePic && (!profilePic.getAttribute('src') || profilePic.getAttribute('src') === '')) {
        profilePic.src = 'assets/fotos/fotocv.jpeg';
    }

    // [NUEVO] Solución definitiva para el bug de la foto de perfil en Safari/iOS al cambiar de pestaña.
    // Fuerza un "repaint" de la imagen cuando la pestaña vuelve a ser visible.
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible') {
            const imageToRepaint = document.querySelector('.profile-pic');
            if (imageToRepaint) {
                // Truco para forzar el repaint: ocultar y mostrar rápidamente.
                imageToRepaint.style.display = 'none';
                // El timeout, aunque sea de 0ms, es crucial para que el navegador procese el cambio.
                setTimeout(() => {
                    // Al poner '', se revierte al valor definido en la hoja de estilos, que es lo correcto.
                    imageToRepaint.style.display = ''; 
                }, 10); // Un pequeño delay de 10ms puede ser más robusto que 0.
            }
        }
    });
});

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

    // Detectar fondos oscuros: Header, Footer o Tarjeta Girada (Parte trasera)
    const onHeader = e.target.closest('.cv-header');
    const onFooter = e.target.closest('.cv-footer');
    const onFlippedCard = e.target.closest('.flip-card-inner.is-flipped');
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
        if (onHeader || onFooter || onFlippedCard) {
            cursorDot.classList.add('on-dark');
        } else {
            cursorDot.classList.remove('on-dark');
        }
    }
});

// --- SCROLL SPY PARA SIDEBAR (CV) ---
// Esta parte es específica de la página de Currículum
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sections = document.querySelectorAll('.cv-container section');

// Añadimos un evento de clic para dar feedback inmediato al usuario
sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

if (sidebarLinks.length > 0 && sections.length > 0) {
    const observerOptions = {
        root: null,
        // Cambiamos el margen para que la detección ocurra en el centro de la pantalla.
        // Esto permite que la última sección (Intereses) se active sin necesitar espacio extra al final.
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Quitar clase active de todos
                sidebarLinks.forEach(link => link.classList.remove('active'));
                
                // 2. Añadir active al link correspondiente al ID de la sección
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.sidebar-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// --- ANIMACIÓN BARRAS DE PROGRESO ---
const skillBars = document.querySelectorAll('.progress-fill');

if (skillBars.length > 0) {
    const observerSkills = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                observerSkills.unobserve(bar); // Solo animar una vez
            }
        });
    }, { threshold: 0.5 }); // Se activa cuando el 50% de la barra es visible

    skillBars.forEach(bar => observerSkills.observe(bar));
}

// --- LÓGICA INTERACTIVA PARA FLIP CARDS ---
const flipCards = document.querySelectorAll('.flip-card');

// Función auxiliar para actualizar el color del cursor según el estado actual
function updateCursorState() {
    // Usamos las coordenadas globales del ratón para ver qué hay debajo
    const target = document.elementFromPoint(mouseX, mouseY);
    if (!target) return;

    const onHeader = target.closest('.cv-header');
    const onFooter = target.closest('.cv-footer');
    const onFlippedCard = target.closest('.flip-card-inner.is-flipped');
    const backToTop = target.closest('.back-to-top');

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
        if (onHeader || onFooter || onFlippedCard) {
            cursorDot.classList.add('on-dark');
        } else {
            cursorDot.classList.remove('on-dark');
        }
    }
}

flipCards.forEach(card => {
    let flipTimeout;
    const innerCard = card.querySelector('.flip-card-inner');

    // Lógica de HOVER (solo para versión web/escritorio)
    card.addEventListener('mouseenter', () => {
        // Se activa solo en pantallas anchas (no táctiles/móviles)
        if (window.matchMedia("(min-width: 769px)").matches) {
            if (innerCard.classList.contains('is-flipped')) {
                // Si ya está girada y volvemos a pasar: cerrar inmediatamente
                clearTimeout(flipTimeout);
                innerCard.classList.remove('is-flipped');
            } else {
                // Si está cerrada: girar y mantener 3 segundos
                innerCard.classList.add('is-flipped');
                flipTimeout = setTimeout(() => {
                    innerCard.classList.remove('is-flipped');
                    setTimeout(updateCursorState, 50);
                }, 3000);
            }
            setTimeout(updateCursorState, 50);
        }
    });

    card.addEventListener('mouseleave', () => {
        // En escritorio no hacemos nada al salir; respetamos el temporizador de 3s
    });

    // Lógica de CLICK (solo para versión móvil)
    card.addEventListener('click', () => {
        // Se activa solo en pantallas estrechas (táctiles/móviles)
        if (window.matchMedia("(max-width: 768px)").matches) {
            const isFlipped = innerCard.classList.contains('is-flipped');
            if (isFlipped) {
                innerCard.classList.remove('is-flipped');
                clearTimeout(flipTimeout);
            } else {
                innerCard.classList.add('is-flipped');
                flipTimeout = setTimeout(() => {
                    innerCard.classList.remove('is-flipped');
                    setTimeout(updateCursorState, 50);
                }, 3000);
            }
            setTimeout(updateCursorState, 50);
        }
    });
});

// --- FONDO TOPOGRÁFICO HEADER CV (NUEVO) ---
window.addEventListener('load', () => {
    const header = document.querySelector('.cv-header');
    if (!header) return;

    // Crear canvas dinámicamente dentro del header
    const canvas = document.createElement('canvas');
    canvas.id = 'cv-header-canvas';
    header.prepend(canvas); // Insertar al principio

    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;
    
    // [NUEVO] Variables para rastrear el ratón dentro del header
    let mx = -9999, my = -9999;
    
    header.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
    });
    
    header.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

    // Configuración "Zen" (Más finas y estáticas)
    const config = {
        color: 'rgba(255, 255, 255, 0.15)', // Blanco sutil sobre azul
        lines: 12,           // Menos líneas para no saturar el espacio pequeño
        noiseScale: 0.003,   // Escala de ruido
        speed: 0.001,        // Movimiento suave
        amp: 25,             // Amplitud baja (ondas suaves)
        lineWidth: 1.5       // Líneas más visibles para contrastar mejor
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
        width = header.offsetWidth;
        height = header.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.lineWidth;

        for (let i = 0; i < config.lines; i++) {
            ctx.beginPath();
            // Distribución vertical centrada
            let yBase = (height / config.lines) * i + (height / config.lines / 2);
            
            for (let x = 0; x <= width; x += 10) {
                let n = noise(x * config.noiseScale, i * 0.5 + time);
                
                // [NUEVO] Cálculo de interacción con el ratón
                let dist = Math.hypot(x - mx, yBase - my);
                let interaction = Math.max(0, 1 - dist / 200); // Radio de efecto de 200px
                let wave = interaction * 25 * Math.sin(x * 0.02 + time * 8); // Onda visible al pasar
                
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
    
    // [NUEVO] Variables para rastrear el ratón dentro del footer
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
        lineWidth: 1.5       // Líneas más visibles para contrastar mejor
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
                
                // [NUEVO] Cálculo de interacción con el ratón
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
        const toggleMenu = (e) => {
            e.preventDefault(); // Prevenir el comportamiento predeterminado del clic en touchstart
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        };

        // Usar touchstart para móviles y click como fallback para escritorio
        menuToggle.addEventListener('touchstart', toggleMenu, { passive: false });
        menuToggle.addEventListener('click', () => {
            if (!('ontouchstart' in window || navigator.maxTouchPoints)) toggleMenu(event); // Solo ejecutar si no es un dispositivo táctil
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

        // --- ADAPTACIÓN DE LA FLECHA FLOTANTE AL FOOTER ---
        const backToTop = document.querySelector('.back-to-top');
        const footer = document.querySelector('.cv-footer');
        if (backToTop && footer) {
            window.addEventListener('scroll', () => {
                const btnRect = backToTop.getBoundingClientRect();
                const footerRect = footer.getBoundingClientRect();
                
                // Si el botón flotante entra en el área del footer oscuro
                if (btnRect.bottom > footerRect.top && btnRect.top < footerRect.bottom) {
                    backToTop.classList.add('on-dark-bg');
                } else {
                    backToTop.classList.remove('on-dark-bg');
                }
            }, { passive: true });
        }

        // [NUEVO] Visibilidad inteligente de la flecha Global (Web, iPad, Móvil)
        let scrollTimeout;
        const toggleBackToTop = () => {
            const backBtns = document.querySelectorAll('.back-to-top');
            if (backBtns.length === 0) return;

            backBtns.forEach(btn => {
                const container = btn.closest('.parallel-gallery');
                const scrollY = container ? container.scrollTop : window.scrollY;
                if (scrollY > 50) {
                    if (!btn.classList.contains('show')) btn.classList.add('show');
                } else {
                    if (btn.classList.contains('show')) btn.classList.remove('show');
                }
            });

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                backBtns.forEach(btn => btn.classList.remove('show'));
            }, 1500); // Desaparece tras 1.5 segundos de inactividad
        };

        window.addEventListener('scroll', toggleBackToTop, { passive: true, capture: true });
        window.addEventListener('touchstart', toggleBackToTop, { passive: true, capture: true });
        window.addEventListener('mousemove', toggleBackToTop, { passive: true, capture: true });
    }
});
