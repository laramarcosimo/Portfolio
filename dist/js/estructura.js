/* ========================================= 
   SECCIÓN DE ESCRITORIO Y LÓGICA COMPARTIDA 
   ========================================= */ 

const video = document.getElementById('loader-video'); 

// Forzar siempre el inicio en la parte superior al cargar o recargar 
if (history.scrollRestoration) { 
    history.scrollRestoration = 'manual'; 
} 
window.scrollTo(0, 0); 

// --- 1. CONTROL DE CARGA (PRELOADER) --- 
if (video) { 
    const urlParams = new URLSearchParams(window.location.search); 
    let skipIntro = urlParams.get('skipIntro') === 'true'; 

    const navEntry = performance.getEntriesByType("navigation")[0]; 
    if (navEntry) { 
        if (navEntry.type === 'reload') { 
            skipIntro = false; 
        } else if (navEntry.type === 'back_forward') { 
            skipIntro = true; 
        } 
    } 

    let pageLoaded = false; 
    const openCurtain = () => { 
        window.scrollTo(0, 0); 
        document.body.classList.add('loaded'); 
    }; 

    window.addEventListener('load', () => { 
        pageLoaded = true; 
        if (skipIntro) openCurtain(); 
    }); 
    if (document.readyState === 'complete') pageLoaded = true; 

    if (skipIntro) { 
        if (pageLoaded) { 
            openCurtain(); 
            video.pause(); 
        } else { 
            video.loop = true; 
            video.play().catch(() => {}); 
        } 
    } else { 
        video.addEventListener('ended', () => { 
            if (pageLoaded) { 
                openCurtain(); 
            } else { 
                video.currentTime = 0; 
                video.play(); 
            } 
        }); 
        video.play().catch(() => {}); 
    } 
} else { 
    document.body.classList.add('loaded'); 
} 

// --- 2. LÓGICA DEL CURSOR PERSONALIZADO --- 
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

// --- 3. EFECTO DE ESTELA DE TEXTO (TRAIL) --- 
const trailWords = [ 
    "IDENTIDAD", "ESTRATEGIA", "IMPACTO", "CONCEPTO", "TIPOGRAFÍA", 
    "RESULTADOS", "MOVIMIENTO", "VISIÓN", "LEAL", "SELECTIVA", 
    "SINCERA", "TRABAJADORA", "RISUEÑA", "PACIENTE", "EXTROVERTIDA", 
    "OPTIMISTA", "TRANQUILA", "HABLADORA", "CREATIVA", "ORGANIZADA", 
    "RESULTADOS", "MOVIMIENTO", "VISIÓN", "LEAL", "SELECTIVA", 
    "SINCERA", "TRABAJADORA", "RISUEÑA", "PACIENTE", "EXTROVERTIDA", 
    "OPTIMISTA", "TRANQUILA", "HABLADORA", "CREATIVA", "ORGANIZADA", 
    "APASIONADA", "ADAPTATIVA" 
]; 

const traitWordsList = [ 
    "LEAL", "SELECTIVA", "SINCERA", "TRABAJADORA", "RISUEÑA", 
    "PACIENTE", "EXTROVERTIDA", "OPTIMISTA", "TRANQUILA", 
    "HABLADORA", "CREATIVA", "ORGANIZADA", "APASIONADA", "ADAPTATIVA" 
]; 

let wordDeck = []; 
let lastUsedWord = null; 
let activeTrails = []; 

let lastX = null; 
let lastY = null; 
// Aparición basada ESTRICTAMENTE en distancia sin importar clics
const minDistance = 150; 
const collisionRadius =0; // Reducido para garantizar que las palabras no se bloqueen entre sí al mover el ratón

function getNextWord() { 
    if (wordDeck.length === 0) { 
        wordDeck = [...trailWords]; 
        for (let i = wordDeck.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [wordDeck[i], wordDeck[j]] = [wordDeck[j], wordDeck[i]]; 
        } 
    } 
    let word = wordDeck.pop(); 
    if (word === lastUsedWord && wordDeck.length > 0) { 
        wordDeck.unshift(word); 
        word = wordDeck.pop(); 
    } 
    lastUsedWord = word; 
    return word; 
} 

function trySpawnWord(x, y) { 
    const edgeBuffer = 70; 
    if (x < edgeBuffer || x > window.innerWidth - edgeBuffer || 
        y < edgeBuffer || y > window.innerHeight - edgeBuffer) { 
        return; 
    } 

    // Validar solo la distancia de forma estricta y absoluta
    if (lastX !== null && lastY !== null) {
        if (Math.hypot(x - lastX, y - lastY) < minDistance) return; 
    }
    
    const now = Date.now(); 
    activeTrails = activeTrails.filter(w => now - w.time < 2000); 

    const title = document.querySelector('.hero-title'); 
    if (title) { 
        const rect = title.getBoundingClientRect(); 
        const titleBuffer = 110; 
        if (x > rect.left - titleBuffer && x < rect.right + titleBuffer && 
            y > rect.top - titleBuffer && y < rect.bottom + titleBuffer) { 
            return; 
        } 
    } 

    // Reemplazamos elementFromPoint (muy costoso) por lectura directa de la cabecera
    const header = document.querySelector('.site-header');
    if (header) {
        const headerRect = header.getBoundingClientRect();
        if (y >= headerRect.top && y <= headerRect.bottom && x >= headerRect.left && x <= headerRect.right) {
            return;
        }
    }

    const isOverlapping = activeTrails.some(w => { 
        const dx = x - w.x; 
        const dy = y - w.y; 
        return Math.hypot(dx, dy) < collisionRadius; 
    }); 
    if (isOverlapping) return; 

    // Regla 1: Actualizar las coordenadas de referencia solo cuando se dibuja la palabra
    lastX = x; 
    lastY = y; 
    createTrailWord(x, y); 
} 

window.addEventListener('mousemove', (e) => { 
    // El rastro de palabras funciona únicamente al mover el ratón, sin requerir clics.
    trySpawnWord(e.clientX, e.clientY);
}, { passive: true });

function createTrailWord(x, y, isMobile = false) { 
    if (window.scrollY > window.innerHeight * 0.5) return; 

    // Regla 3: Limpieza estricta de elementos antiguos para no saturar ni amontonar
    const existingWords = document.querySelectorAll('.trail-word');
    if (existingWords.length > 15) {
        existingWords[0].remove();
    }

    const wordElement = document.createElement('span'); 
    const text = getNextWord(); 
    wordElement.textContent = text; 
    wordElement.className = 'trail-word'; 
    if (traitWordsList.includes(text)) { 
        wordElement.style.fontWeight = '700'; 
    } else { 
        wordElement.style.fontWeight = '500'; 
    } 
    wordElement.style.left = `${x}px`; 
    wordElement.style.top = `${y}px`; 
    activeTrails.push({ x, y, time: Date.now() }); 
    let size; 
    if (isMobile) { 
        size = 0.9 + Math.random() * 0.4; 
    } else { 
        size = 1.1 + Math.random() * 0.7; 
    } 

    const startRotation = (Math.random() - 0.5) * 40; 
    wordElement.style.fontSize = `${size}rem`; 
    wordElement.style.transform = `translate(-50%, -50%) rotate(${startRotation}deg)`; 
    document.body.appendChild(wordElement); 

    // [CORRECCIÓN] Forzar un "reflow" para que el navegador procese el estado inicial (opacidad 1)
    // antes de aplicar la transición a 0. Sin esto, el navegador agrupa los cambios y la palabra nace invisible.
    void wordElement.offsetWidth;

    let duration; 
    if (isMobile) { 
        duration = 2.5 + Math.random() * 1.5; 
    } else { 
        duration = 1 + Math.random(); 
    } 
    const moveX = (Math.random() - 0.5) * 150; 
    const moveY = (Math.random() - 0.5) * 150 - 50; 
    wordElement.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`; 
    wordElement.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotate(${startRotation + 20}deg)`; 
    wordElement.style.opacity = '0'; 
    setTimeout(() => { 
        wordElement.remove(); 
    }, duration * 1000); 
} 

// --- 4. FONDO TOPOGRÁFICO INTERACTIVO --- 
window.addEventListener('load', () => { 
    const canvas = document.getElementById('topo-canvas'); 
    if (!canvas) return; 

    const ctx = canvas.getContext('2d'); 
    let width, height; 
    let time = 0; 
    const params = { 
        color: 'rgba(255, 255, 255, 0.08)', 
        lines: 35, 
        noiseScale: 0.002, 
        speed: 0.0008, 
        amp: 120 
    }; 

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

    let mx = -1000, my = -1000; 
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }); 

    function resize() { 
        width = window.innerWidth; 
        height = window.innerHeight; 
        canvas.width = width; 
        canvas.height = height; 
    } 

    function draw() { 
        ctx.clearRect(0, 0, width, height); 
        ctx.strokeStyle = params.color; 
        ctx.lineWidth = 2.0; 
        for (let i = 0; i < params.lines; i++) { 
            ctx.beginPath(); 
            let yBase = (height / params.lines) * i; 
            for (let x = 0; x <= width; x += 15) { 
                let n = noise(x * params.noiseScale, i * 0.5 + time); 
                let dx = x - mx; 
                let dy = yBase - my; 
                let dist = Math.sqrt(dx*dx + dy*dy); 
                let interaction = Math.max(0, 1 - dist / 300); 
                let y = yBase + (n * params.amp) + (interaction * 60 * Math.sin(x * 0.02 + time * 10)); 
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); 
            } 
            ctx.stroke(); 
        } 
        time += params.speed; 
        requestAnimationFrame(draw); 
    } 
    window.addEventListener('resize', resize); 
    resize(); 
    draw(); 
}); 

/* ========================================= 
   FUNCIONALIDAD GENERAL Y DOMCONTENTLOADED 
   ========================================= */ 

document.addEventListener('DOMContentLoaded', () => { 
    const aboutSection = document.querySelector('.about-section');
    const menuToggle = document.querySelector('.menu-toggle'); 
    const mainNav = document.querySelector('.main-nav'); 

    // --- MANEJO DE MENÚ MÓVIL ---
    if (menuToggle && mainNav) { 
        menuToggle.addEventListener('click', () => { 
            menuToggle.classList.toggle('active'); 
            mainNav.classList.toggle('active'); 
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

        if (document.body.classList.contains('light-page')) { 
            const logo = document.querySelector('.site-logo'); 
            if (logo && logo.getAttribute('src')?.includes('blanco')) { 
                logo.setAttribute('src', logo.getAttribute('src').replace('blanco', 'azul')); 
            } 
            const menuImg = document.querySelector('.menu-toggle img'); 
            if (menuImg && menuImg.getAttribute('src')?.includes('blanco')) { 
                menuImg.setAttribute('src', menuImg.getAttribute('src').replace('blanco', 'azul')); 
            } 
        } 
    } 

    // --- LÓGICA DE TRANSICIÓN DE PÁGINA (CORTINA / ZOOM) --- 
    const playCurtainTransition = sessionStorage.getItem('playCurtainTransition') === 'true'; 
    const transitionImageSrc = sessionStorage.getItem('pageTransitionImage'); 

    if (playCurtainTransition && window.location.pathname.includes('marca-personal.html')) { 
        sessionStorage.removeItem('playCurtainTransition'); 
        document.body.style.visibility = 'hidden'; 

        const curtain = document.createElement('div'); 
        curtain.className = 'page-transition-curtain'; 

        for (let i = 0; i < 6; i++) { 
            const column = document.createElement('div'); 
            column.className = 'curtain-column'; 
            column.style.transitionDelay = `${(5 - i) * 40}ms`; 
            curtain.appendChild(column); 
        } 
        document.body.appendChild(curtain); 

        window.addEventListener('load', () => { 
            document.body.style.visibility = 'visible'; 
            void curtain.offsetWidth; 
            curtain.classList.add('is-leaving'); 
            const lastColumn = curtain.querySelector('.curtain-column'); 
            lastColumn.addEventListener('transitionend', () => { 
                curtain.remove(); 
            }, { once: true }); 
        }); 

    } else if (transitionImageSrc && window.location.pathname.includes('marca-personal.html')) { 
        sessionStorage.removeItem('pageTransitionImage'); 
        document.body.classList.add('is-zooming-in'); 

        const entryOverlay = document.createElement('img'); 
        entryOverlay.src = transitionImageSrc; 
        entryOverlay.className = 'entry-zoom-overlay'; 
        entryOverlay.style.cssText = 'top:0; left:0; width:100vw; height:100vh; position:fixed; z-index:9999;'; 

        document.body.appendChild(entryOverlay); 

        window.addEventListener('load', () => { 
            const destinationImage = document.querySelector('.project-cover-image'); 
            if (!destinationImage) { 
                entryOverlay.style.opacity = '0'; 
                document.body.classList.remove('is-zooming-in'); 
                setTimeout(() => entryOverlay.remove(), 1200); 
                return; 
            } 
            destinationImage.src = transitionImageSrc; 
            destinationImage.style.opacity = '0'; 

            const runAnimation = () => { 
                const destRect = destinationImage.getBoundingClientRect(); 
                entryOverlay.style.top = `${destRect.top}px`; 
                entryOverlay.style.left = `${destRect.left}px`; 
                entryOverlay.style.width = `${destRect.width}px`; 
                entryOverlay.style.height = `${destRect.height}px`; 
                document.body.classList.remove('is-zooming-in'); 
                setTimeout(() => { 
                    destinationImage.style.opacity = '1'; 
                    entryOverlay.remove(); 
                }, 1200); 
            }; 

            if (destinationImage.complete) runAnimation(); 
            else destinationImage.addEventListener('load', runAnimation, { once: true }); 
        }); 
    } 

    // --- EFECTO ZOOM IN AL HACER SCROLL (HERO) --- 
    const heroSection = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title'); 
    const topoCanvas = document.getElementById('topo-canvas'); 
    const siteHeader = document.querySelector('.site-header'); 

    if (heroSection && heroTitle && topoCanvas && siteHeader) { 
        let currentProgress = 0, targetProgress = 0; 

        const updateTarget = () => { 
            const rect = heroSection.getBoundingClientRect(); 
            const scrollAvailable = heroSection.offsetHeight - window.innerHeight; 
            if (scrollAvailable > 0) { 
                targetProgress = Math.max(0, -rect.top / scrollAvailable); 
            } 
        }; 

        window.addEventListener('scroll', updateTarget, { passive: true }); 
        window.addEventListener('resize', updateTarget, { passive: true }); 
        updateTarget(); 

        const loop = () => { 
            if (!document.body.classList.contains('loaded')) { 
                requestAnimationFrame(loop); return; 
            } 
            const smoothing = 0.07; 
            const diff = targetProgress - currentProgress; 
            if (Math.abs(diff) > 0.0001) { 
                currentProgress += diff * smoothing; 
                const progress = currentProgress; 

                if (progress < 0.7) { 
                    const phasePct = Math.max(0, progress / 0.7); 
                    const scale = 1 + phasePct * 8; 
                    const opacity = Math.max(0, 1 - Math.pow(phasePct, 2)); 

                    // Aplicar escala y opacidad directamente a cada palabra (span)
                    heroTitle.querySelectorAll('span').forEach(span => {
                        // Aseguramos que no haya animaciones CSS activas que puedan interferir
                        span.style.animation = 'none';
                        span.style.transform = `scale(${scale})`;
                        span.style.opacity = opacity;
                    });

                    // Ocultar la transformación del contenedor padre para evitar conflictos
                    heroTitle.style.transform = 'none';
                    heroTitle.style.opacity = 1; // Dejar que los hijos controlen la opacidad

                    topoCanvas.style.transform = `scale(${scale})`; 
                    topoCanvas.style.opacity = opacity; 
                } else { 
                    // Cuando el progreso es mayor, ocultar las palabras y restablecer estilos
                    heroTitle.querySelectorAll('span').forEach(span => {
                        span.style.opacity = 0;
                        span.style.transform = 'scale(1)'; // Restablecer escala
                        span.style.animation = 'none'; // Asegurar que no haya animación activa
                    });
                    heroTitle.style.opacity = 0; // Ocultar el contenedor padre
                    heroTitle.style.transform = 'none'; // Restablecer transformación del padre
                    const reEntryPct = progress > 0.9 ? Math.min(1, (progress - 0.9) / 0.1) : 0; 
                    topoCanvas.style.transform = 'scale(1)'; 
                    topoCanvas.style.opacity = reEntryPct; 
                } 
            } 
            requestAnimationFrame(loop); 
        }; 
        loop(); 
    } 

    // --- LÓGICA DE DISPERSIÓN Y MAGNETIZACIÓN (ABOUT SECTION) ---
    if (aboutSection) {
        const title = aboutSection.querySelector('.creative-title');
        const images = aboutSection.querySelectorAll('.chaos-img');
        const creativeText = aboutSection.querySelector('.creative-text');

        if (title) {
            const textContent = title.textContent.trim();
            title.innerHTML = '';
            textContent.split('').forEach(char => {
                const span = document.createElement('span');
                if (char === ' ') {
                    // Create a non-animating span for spaces to maintain word separation
                    span.innerHTML = '&nbsp;';
                    span.style.display = 'inline-block'; // Keep it in the layout flow
                } else {
                    // This is a letter, make it animatable
                    span.textContent = char;
                    span.classList.add('magnet-char'); // Add class for targeting
                    const randX = (Math.random() - 0.5) * 1000;
                    const randY = (Math.random() - 0.5) * 1000;
                    const randRot = (Math.random() - 0.5) * 720; // Increased rotation for more chaos
                    span.dataset.x = randX;
                    span.dataset.y = randY;
                    span.dataset.r = randRot;
                    // Apply initial transform and styles
                    span.style.cssText = `display:inline-block; transform: translate3d(${randX}px, ${randY}px, 0) rotate(${randRot}deg); opacity:0; filter:blur(20px);`;
                }
                title.appendChild(span);
            });
        }

        const getCorners = () => {
            const w = window.innerWidth;
            if (w < 768) {
                // Configuración Móvil Vertical (x en vw, y en vh)
                return [
                    { x: -20, y: -30 }, // Superior-Izquierda
                    { x: 20, y: -30 },  // Superior-Derecha
                    { x: -20, y: 25 }, // Inferior-Izquierda
                    { x: 15, y: 20 }   // Inferior-Derecha
                ];
            }
            if (w <= 1180) {
                // [NUEVO] Configuración iPad Horizontal / Tablet (Cuadrícula Simétrica)
                // [AJUSTE] Se aumenta más la separación vertical (Y: 42) para bajar el texto
                return [
                    { x: -35, y: -18 }, // Arriba Izquierda (sobre título)
                    { x: 35, y: -18 },  // Arriba Derecha (sobre título)
                    { x: -28, y: 18 },  // Abajo Izquierda (bajo párrafo)
                    { x: 28, y: 18 }   // Abajo Derecha (bajo párrafo)
                ];
            }
            // Configuración Desktop Lateral
            return [
                { x: -38, y: -15 }, // Superior-Izquierda
                { x: 35, y: -15 },  // Superior-Derecha
                { x: -25, y: 20 },  // Inferior-Izquierda
                { x: 20, y: 18 }   // Inferior-Derecha
            ];
        };

        const updateImageDestinations = () => {
            const corners = getCorners();
            images.forEach((img, i) => {
                img.dataset.tx = corners[i % 4].x;
                img.dataset.ty = corners[i % 4].y;
                img.dataset.speed = 1 + (i * 0.1); 
            });
        };
        updateImageDestinations();
        window.addEventListener('resize', updateImageDestinations);

        const updateMagnetization = () => {
            const rect = aboutSection.getBoundingClientRect();
            let progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            const ease = 1 - Math.pow(1 - progress, 3);

            images.forEach(img => {
                const moveX = parseFloat(img.dataset.tx) * ease * parseFloat(img.dataset.speed);
                const moveY = parseFloat(img.dataset.ty) * ease * parseFloat(img.dataset.speed);
                img.style.transform = `translate3d(calc(-50% + ${moveX}vw), calc(-50% + ${moveY}vh), 0)`;
                img.style.opacity = Math.min(1, progress * 1.5);
            });

            title.querySelectorAll('.magnet-char').forEach(span => {
                const inv = 1 - ease;
                const curX = parseFloat(span.dataset.x) * inv;
                const curY = parseFloat(span.dataset.y) * inv;
                const curR = parseFloat(span.dataset.r) * inv;
                span.style.transform = `translate3d(${curX}px, ${curY}px, 0) rotate(${curR}deg)`;
                span.style.opacity = ease;
                span.style.filter = `blur(${20 * inv}px)`;
            });

            if (progress > 0.9) {
                creativeText.style.opacity = '1';
                creativeText.style.transform = 'translateY(0)';
            } else {
                creativeText.style.opacity = '0';
                creativeText.style.transform = 'translateY(20px)';
            }
        };
        window.addEventListener('scroll', () => requestAnimationFrame(updateMagnetization), { passive: true });
    }

    // --- UTILIDADES FINALES ---
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible') {
            document.querySelectorAll('.chaos-img').forEach(img => {
                img.style.display = 'none';
                setTimeout(() => { img.style.display = ''; }, 10);
            });
        }
    });

    let scrollTimeout;
    const toggleMobileBackToTop = () => {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.back-to-top').forEach(btn => {
                const container = btn.closest('.parallel-gallery');
                const scrollY = container ? container.scrollTop : window.scrollY;
                btn.classList.toggle('show-mobile', scrollY > 50);
            });
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.querySelectorAll('.back-to-top').forEach(btn => btn.classList.remove('show-mobile'));
            }, 1500);
        }
    };
    window.addEventListener('scroll', toggleMobileBackToTop, { passive: true, capture: true });
});
