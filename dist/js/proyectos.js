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
    
    // Interacción Premium: Expansión solo en la tarjeta activa (la que hace zoom)
    const isProjectCard = e.target.closest('.project-section.cf-active');
    if (isProjectCard) {
        cursorDot.classList.add('hover-project');
        cursorDot.textContent = 'Toca';
    } else {
        cursorDot.classList.remove('hover-project');
        cursorDot.textContent = '';
    }

    // Previene que el ratón adopte la transparencia del estado "active" al pasar sobre las imágenes
    if ((e.target.closest('p') || e.target.closest('a') || e.target.closest('button') || e.target.closest('.nav-link')) && !e.target.closest('.project-img-col')) {
        cursorDot.classList.add('active');
    } else {
        cursorDot.classList.remove('active');
    }
});

// [NUEVO] Adaptación dinámica y precisa del color del cursor en tiempo real (Hover y Scroll)
function updateCursorColor() {
    if (!cursorDot) return;
    
    const target = document.elementFromPoint(mouseX, mouseY);
    if (!target) return;

    let shouldBeWhite = false;

    // Comprobamos si estamos en la página del carrusel de proyectos
    const isCoverflow = document.querySelector('.projects-zigzag') !== null;
    const inactiveCarouselItem = isCoverflow ? target.closest('.project-section:not(.cf-active)') : null;

    // --- 1. Determine base color based on general dark containers/sections ---
    if (target.closest('.cv-header') ||
        target.closest('.cv-footer') ||
        (target.closest('.projects-main') && isCoverflow) || // Fondo azul oscuro SOLO en carrusel
        inactiveCarouselItem || // Las tarjetas laterales del carrusel están oscurecidas por CSS
        target.closest('.coverflow-nav-btn') || // El botón de flecha se vuelve azul oscuro al hacer hover
        target.closest('.project-section.dark-theme') || // For projects page sections
        target.closest('.typo-catalog-container') || // Dark background in marca-personal
        target.closest('.capa-color.medianoche') || // Dark background in marca-personal
        target.closest('.stationery-container') || // Dark background in marca-personal
        target.closest('.triptych-container') || // Dark background in marca-personal
        target.closest('.project-tools-footer') || // Dark footer in marca-personal
        target.closest('.explanation-box-jaime') ||  // Dark box in identidad-visual
        target.closest('.video-wrapper.black-bg') || // Identidad visual
        target.closest('.capa-color-cuadrada.negro') // Identidad visual
    ) {
        shouldBeWhite = true;
    }

    // --- 1.5. Check Header (cristal en coverflow = oscuro, blanco en individual = claro) ---
    if (target.closest('.site-header')) {
        if (isCoverflow) {
            shouldBeWhite = true;
        } else {
            shouldBeWhite = false;
        }
    }

    // --- 2. Override for light backgrounds within potentially dark contexts ---
    // (e.g., explanation box, lavanda, pastel which are light but might be inside a dark parent or zoomed-dark-theme body)
    if (target.closest('.explanation-box') || target.closest('.capa-color.lavanda') || target.closest('.capa-color.pastel') || target.closest('.capa-color-cuadrada.blanco') || target.closest('.capa-color-cuadrada.verde') || target.closest('.video-wrapper.white-bg')) {
        shouldBeWhite = false;
    }

    // --- 3. Override based on video content (high priority for media) ---
    const vidNode = target.closest('video');
    if (vidNode) {
        if (vidNode.src.includes('logo_blanco.mp4')) { // Dark video content
            shouldBeWhite = true;
        } else { // Light video content
            shouldBeWhite = false;
        }
    }

    // --- 4. Override based on image brightness (high priority for media) ---
    const imgTarget = target.closest('img');
    if (imgTarget && colorCache.has(imgTarget.src)) {
        const color = colorCache.get(imgTarget.src);
        if (getBrightness(color.r, color.g, color.b) < 128) { // Dark image
            shouldBeWhite = true;
        } else { // Light image
            shouldBeWhite = false;
        }
    }

    // --- 5. Special handling for 'is-parallel-zooming' mode (can modify previous decisions) ---
    if (document.body.classList.contains('is-parallel-zooming')) {
        if (document.body.classList.contains('zoomed-dark-theme')) {
            // If the overall zoomed theme is dark, cursor is white by default,
            // unless overridden by a specific light element (handled above).
            if (!target.closest('.explanation-box') && !target.closest('.capa-color.lavanda') && !target.closest('.capa-color.pastel') && !vidNode && !imgTarget) {
                 shouldBeWhite = true;
            }
        } else {
            // If the overall zoomed theme is light, cursor is dark by default,
            // unless overridden by a specific dark element (handled above).
            if (!target.closest('.typo-catalog-container') && !target.closest('.capa-color.medianoche') && !target.closest('.stationery-container') && !target.closest('.triptych-container') && !vidNode && !imgTarget) {
                shouldBeWhite = false;
            }
        }
    }

    // [NUEVO] Excepción dinámica para la flecha flotante de volver arriba
    const backToTop = target.closest('.back-to-top');
    if (backToTop) {
        if (backToTop.classList.contains('on-dark-bg')) {
            shouldBeWhite = true;
            cursorDot.classList.remove('force-blue');
        } else {
            shouldBeWhite = false;
            cursorDot.classList.add('force-blue');
        }
    } else {
        cursorDot.classList.remove('force-blue');
    }

    // --- Apply the determined color ---
    if (shouldBeWhite) {
        cursorDot.classList.add('on-dark');
    } else {
        cursorDot.classList.remove('on-dark');
    }
}

window.addEventListener('mousemove', updateCursorColor, { passive: true });
window.addEventListener('scroll', updateCursorColor, { passive: true });

// [NUEVO] Visibilidad inteligente de la flecha Global (Web, iPad, Móvil)
let scrollTimeout;
const toggleBackToTop = () => {
    const backBtns = document.querySelectorAll('.back-to-top');
    if (backBtns.length === 0) return;

    backBtns.forEach(btn => {
        const container = btn.closest('.parallel-gallery');
        const scrollY = container ? container.scrollTop : window.scrollY;
        if (scrollY > 50) { // Aparece al hacer scroll o mover el ratón
            if (!btn.classList.contains('show')) btn.classList.add('show');
        } else {
            if (btn.classList.contains('show')) btn.classList.remove('show');
        }
    });

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        backBtns.forEach(btn => btn.classList.remove('show'));
    }, 1500); // Se esconde tras 1.5s
};
window.addEventListener('scroll', toggleBackToTop, { passive: true, capture: true });
window.addEventListener('touchstart', toggleBackToTop, { passive: true, capture: true });
window.addEventListener('mousemove', toggleBackToTop, { passive: true, capture: true });

// --- LÓGICA DE COLOR ADAPTATIVO (CHAMELEON BACKGROUND) ---
const projectSections = document.querySelectorAll('.project-section');

// Función auxiliar para determinar si un color es oscuro
function getBrightness(r, g, b) {
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Función para extraer el color promedio de una imagen usando Canvas
function getAverageColor(imgElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const defaultColor = { r: 244, g: 246, b: 248 }; // Color base gris/blanco sutil

    if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0) {
        return defaultColor;
    }

    const width = canvas.width = imgElement.naturalWidth;
    const height = canvas.height = imgElement.naturalHeight;

    try {
        context.drawImage(imgElement, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0, count = 0;

        // Saltamos píxeles para mejorar drásticamente el rendimiento
        for (let i = 0; i < data.length; i += 40) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }

        return { 
            r: Math.floor(r / count), 
            g: Math.floor(g / count), 
            b: Math.floor(b / count) 
        };
    } catch (e) {
        // En caso de error de CORS si usaras imágenes externas sin permisos
        return defaultColor;
    }
}

// Función auxiliar para convertir HEX a RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const colorCache = new Map();

// [NUEVO] Pre-cachear colores de imágenes independientemente de si la sección fuerza un color de fondo
document.querySelectorAll('.project-img-col img').forEach(img => {
    const cacheColor = () => {
        if (!colorCache.has(img.src)) {
            colorCache.set(img.src, getAverageColor(img));
        }
    };
    if (img.complete && img.naturalWidth > 0) {
        cacheColor();
    } else {
        img.addEventListener('load', cacheColor, { once: true });
    }
});

const updateSectionColor = (section) => {
    const img = section.querySelector('img');
    if (!img) return;

    const applyColor = (color) => {
        // [MODIFICADO] Aplicamos el color predominante sólido
        section.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        
        // Evaluar brillo para cambiar texto a blanco si es muy oscuro
        if (getBrightness(color.r, color.g, color.b) < 128) {
            section.classList.add('dark-theme');
        } else {
            section.classList.remove('dark-theme');
        }
    };

    // [NUEVO] Si la sección tiene un color forzado en HTML, usarlo
    if (section.dataset.bgColor) {
        const rgbColor = hexToRgb(section.dataset.bgColor);
        if (rgbColor) {
            applyColor(rgbColor);
            return;
        }
    }

    if (colorCache.has(img.src)) {
        applyColor(colorCache.get(img.src));
        return;
    }

    if (img.complete) {
        const color = getAverageColor(img);
        colorCache.set(img.src, color);
        applyColor(color);
    } else {
        img.addEventListener('load', () => {
            const color = getAverageColor(img);
            colorCache.set(img.src, color);
            applyColor(color);
        }, { once: true });
    }
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible');
        }
    });
}, {
    root: null,
    rootMargin: '-30% 0px -30% 0px', // Se activa en el centro focal de la pantalla
    threshold: 0
});

projectSections.forEach(section => {
    sectionObserver.observe(section);
    
    // Cambiar el color del fondo SOLO al pasar el ratón por la imagen
    const imgCol = section.querySelector('.project-img-col');
    if (imgCol) {
        imgCol.addEventListener('mouseenter', () => {
            const img = section.querySelector('img');
            // Caso especial para la imagen del logo de Jaime
            if (img && img.src.includes('Potada_logo_jaime.png')) {
                section.style.backgroundColor = '#000000'; // Fondo negro
                section.classList.add('dark-theme'); // El CSS se encarga de poner el texto blanco
            } else if (img && img.src.includes('Portada_video.jpg')) {
                section.style.backgroundColor = '#0f172a'; // Fondo azul oscuro video
                section.classList.add('dark-theme');
            } else {
                updateSectionColor(section); // Comportamiento normal para el resto
            }
        });
        
        // Revertir a transparente al quitar el ratón de la imagen para revelar el canvas topográfico
        imgCol.addEventListener('mouseleave', () => {
            section.style.backgroundColor = 'transparent';
            section.classList.remove('dark-theme');
        });
    }
});

// =========================================
// LÓGICA COVERFLOW 3D PROYECTOS
// =========================================
const cfContainer = document.querySelector('.projects-zigzag');
const cfSections = document.querySelectorAll('.project-section');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

if (cfContainer && cfSections.length > 0) {
    let activeIndex = 0; // Inicia en el primer proyecto
    const totalSections = cfSections.length;

    const updateCoverflow = () => {
        cfSections.forEach((sec, i) => {
            // Limpiar estados previos
            sec.classList.remove('cf-active', 'cf-prev-1', 'cf-prev-2', 'cf-next-1', 'cf-next-2');
            
            // Cálculo de distancia circular envolvente (Efecto infinito)
            let diff = i - activeIndex;
            
            if (diff < -Math.floor(totalSections / 2)) {
                diff += totalSections;
            } else if (diff > Math.floor(totalSections / 2)) {
                diff -= totalSections;
            }

            // Asignar nuevos estados
            if (diff === 0) {
                sec.classList.add('cf-active');
            } else if (diff === -1) {
                sec.classList.add('cf-prev-1');
            } else if (diff === 1) {
                sec.classList.add('cf-next-1');
            } else if (diff <= -2) {
                sec.classList.add('cf-prev-2');
            } else if (diff >= 2) {
                sec.classList.add('cf-next-2');
            }
        });

        // [NUEVO] Actualizar el color del cursor continuamente durante la transición de 1.2s
        // para evitar que se pierda sobre las imágenes en movimiento si el usuario no mueve el ratón
        if (typeof updateCursorColor === 'function') {
            let elapsed = 0;
            const colorUpdateInterval = setInterval(() => {
                updateCursorColor();
                elapsed += 50;
                if (elapsed >= 1200) clearInterval(colorUpdateInterval);
            }, 50);
        }
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            activeIndex = (activeIndex === 0) ? totalSections - 1 : activeIndex - 1;
            updateCoverflow();
        });
        nextBtn.addEventListener('click', () => {
            activeIndex = (activeIndex === totalSections - 1) ? 0 : activeIndex + 1;
            updateCoverflow();
        });
    }

    // Navegación fluida al hacer clic en las tarjetas laterales
    cfSections.forEach((sec, i) => {
        sec.addEventListener('click', (e) => {
            if (i !== activeIndex) {
                e.preventDefault();
                e.stopPropagation();
                activeIndex = i;
                updateCoverflow();
            }
        }, true);
    });

    updateCoverflow();
}

// =========================================
// EFECTO "UNIVERSO PARALELO" (Zoom Inmersivo)
// =========================================
const images = document.querySelectorAll('.project-img-col img');
const openLinks = document.querySelectorAll('.open-link');
const returnBtn = document.getElementById('return-btn');

let activeClone = null;
let activeOriginalImg = null;
let activeGallery = null;

const triggerParallelUniverse = (img) => {
    if (document.body.classList.contains('is-parallel-zooming')) return;
    
    // [MODIFICADO] Capturar las coordenadas EXACTAS antes de modificar el scroll del body.
    // Esto evita el movimiento lateral provocado por la desaparición instantánea de la barra de scroll.
    const rect = img.getBoundingClientRect();

    document.body.classList.add('is-parallel-zooming'); // Bloquea el scroll general

    // Extiende el color camaleón al body entero para el fondo del universo
    const section = img.closest('.project-section');
    if (section) {
        let bgColor = section.style.backgroundColor;
        if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') bgColor = '';
        document.body.style.backgroundColor = bgColor || '#192A56';
        
        // Evalúa si es oscuro para modificar globalmente el cursor y el texto del botón volver
        if (section.classList.contains('dark-theme') || !bgColor) {
            document.body.classList.add('zoomed-dark-theme');
            cursorDot.classList.add('on-dark'); // Cursor blanco
        } else {
            document.body.classList.remove('zoomed-dark-theme');
            cursorDot.classList.remove('on-dark'); // Cursor azul
        }
    }

    // 1. Clonación exacta de la imagen seleccionada
    const clone = img.cloneNode(true);
    clone.classList.add('parallel-clone');
    
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.transform = 'scale(1)'; // Aseguramos el inicio limpio
    
    document.body.appendChild(clone);
    img.style.opacity = '0'; // Esconde la original para evitar duplicados visuales

    // 2. Cálculos matemáticos del Túnel
    void clone.offsetWidth; // Forzar reflow para asegurar animación limpia
    
    // [MODIFICADO] Animamos las dimensiones reales para que el object-fit recalcule el recorte
    // dinámicamente durante el viaje. Esto elimina el 100% de los saltos laterales.
    clone.style.top = '0px';
    clone.style.left = '0px';
    clone.style.width = '100vw';
    clone.style.height = '100vh';
    clone.style.transform = 'scale(1.1)'; // Igualamos la escala final de la galería

    // 3. Alejar y desvanecer el resto del sitio
    document.querySelectorAll('.projects-main, .site-header, .cv-footer').forEach(el => {
        el.classList.add('parallel-fade');
    });

    activeClone = clone;
    activeOriginalImg = img;

    // [NUEVO] Crear contenedor de galería para permitir scroll a la explicación
    const gallery = document.createElement('div');
    gallery.classList.add('parallel-gallery');

    // [MODIFICADO] Seleccionamos todos los elementos hijos (textos o imágenes)
    const allElements = section.querySelectorAll('.project-img-col > *');

    allElements.forEach((sourceEl) => {
        const galleryEl = sourceEl.cloneNode(true);
        galleryEl.removeAttribute('style'); // [FIX] Forma segura de limpiar atributos ocultos
        if (galleryEl.tagName.toLowerCase() === 'video') {
            galleryEl.style.display = 'block'; // Aseguramos que el clon sea visible sí o sí
        }

        // La imagen seleccionada se queda como la portada principal
        if (sourceEl === img) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('gallery-cover-wrapper');
            galleryEl.classList.add('gallery-cover');
            wrapper.appendChild(galleryEl);
            
            // [MODIFICADO] Mover el botón a la portada para que sea fijo y haga scroll con ella
            returnBtn.style.position = 'absolute';
            wrapper.appendChild(returnBtn);
            
            gallery.appendChild(wrapper);
        } else {
            galleryEl.classList.add('gallery-content');
            gallery.appendChild(galleryEl);
        }
    });

    // [NUEVO] Añadir Footer Completo y Condicional a la Galería
    const galleryFooter = document.createElement('footer');
    galleryFooter.className = 'cv-footer';
    galleryFooter.style.width = '100vw';
    galleryFooter.style.marginTop = 'auto'; // Asegura que se empuje al fondo

    const projectName = section.querySelector('.project-name').textContent.trim();

    if (projectName === 'MARCA PERSONAL') {
        galleryFooter.innerHTML = `
            <div class="footer-box project-tools-footer">
                <span>Hecho con:</span>
                <div class="tools-icons">
                    <img src="../../assets/fotos/logos_adobe/illustrator.png" alt="Illustrator">
                    <img src="../../assets/fotos/logos_adobe/photoshop.png" alt="Photoshop">
                    <img src="../../assets/fotos/logos_adobe/after.png" alt="After Effects">
                </div>
            </div>
        `;
    } else {
        galleryFooter.innerHTML = `
            <div class="footer-box">
                <div class="footer-contact-summary">
                    <p>
                        <a href="mailto:laramarcosimo@gmail.com" class="footer-contact-link">laramarcosimo@gmail.com</a> | 
                        <a href="https://wa.me/34608350840" target="_blank" class="footer-contact-link">608 350 840</a> | 
                        Santa Cruz de Tenerife 
                    </p>
                    <div class="footer-links">
                        <a href="https://www.linkedin.com/in/lara-marco-simó-7317372aa" target="_blank">LinkedIn</a>
                        <span class="sep">|</span>
                        <a href="https://www.instagram.com/larams05_/" target="_blank">Instagram</a>
                    </div>
                </div>
                <hr class="footer-line">
                <p class="copyright">&copy; 2026 Lara Marco Simó. Todos los derechos reservados.</p>
            </div>
        `;
    }

    gallery.appendChild(galleryFooter);

    // [NUEVO] Botón flotante para volver arriba dentro de la galería del proyecto
    const galleryBackBtn = document.createElement('a');
    galleryBackBtn.href = '#';
    galleryBackBtn.className = 'back-to-top';
    galleryBackBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    galleryBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gallery.scrollTo({ top: 0, behavior: 'smooth' });
    });
    gallery.appendChild(galleryBackBtn);

    // [MODIFICADO] El canvas topográfico ahora se inicia en TODOS los footers de la galería
    if (typeof initFooterCanvas === 'function') {
        initFooterCanvas(galleryFooter.querySelector('.footer-box'));
    }

    document.body.appendChild(gallery);
    activeGallery = gallery;

    // [MODIFICADO] Lógica simplificada: el botón ahora vive en la portada, definimos el color una sola vez
    const imgColor = colorCache.get(img.src) || {r: 255, g: 255, b: 255};
    const imgIsDark = getBrightness(imgColor.r, imgColor.g, imgColor.b) < 128;

    if (imgIsDark) {
        returnBtn.style.setProperty('color', '#ffffff', 'important');
        returnBtn.style.setProperty('text-shadow', '0 2px 10px rgba(0,0,0,0.5)', 'important');
    } else {
        returnBtn.style.setProperty('color', '#192A56', 'important');
        returnBtn.style.setProperty('text-shadow', '0 2px 10px rgba(255,255,255,0.6)', 'important');
    }

    gallery.addEventListener('scroll', () => {
        updateCursorColor(); // Actualizar también el cursor al hacer scroll en la galería
        toggleBackToTop(); // Sincronizar flecha inteligentemente dentro del universo paralelo

        // Detectar si la flecha pisa el footer oscuro de la galería para volverse blanca
        const btnRect = galleryBackBtn.getBoundingClientRect();
        const footerRect = galleryFooter.getBoundingClientRect();
        
        if (btnRect.bottom > footerRect.top && btnRect.top < footerRect.bottom) {
            galleryBackBtn.classList.add('on-dark-bg');
        } else {
            galleryBackBtn.classList.remove('on-dark-bg');
        }
    }, { passive: true });
    
    // [NUEVO] Motor Lerp para efecto de Ondas vinculadas al scroll en el Tríptico
    let isTriptychAnimating = true;
    const triptychs = gallery.querySelectorAll('.triptych-container');
    triptychs.forEach(t => {
        const items = t.querySelectorAll('img');
        items.forEach(img => img._waveProgress = 0);
    });

    const triptychLoop = () => {
        if (!document.body.contains(gallery)) {
            isTriptychAnimating = false;
            return;
        }

        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;

        triptychs.forEach(triptych => {
            const items = triptych.querySelectorAll('img');
            
            if (isMobile) {
                // En móvil evaluamos foto a foto
                items.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    const start = windowHeight * 0.95;
                    const end = windowHeight * 0.35;
                    let p = (start - rect.top) / (start - end);
                    let target = Math.max(0, Math.min(1, p));
                    
                    const diff = target - img._waveProgress;
                    if (Math.abs(diff) > 0.001) {
                        img._waveProgress += diff * 0.08; // Suavizado Lerp
                        img.style.setProperty('--wave-progress', img._waveProgress);
                    }
                });
            } else {
                // En escritorio las evaluamos en bloque
                const rect = triptych.getBoundingClientRect();
                const start = windowHeight * 0.95;
                const end = windowHeight * 0.15;
                let p = (start - rect.top) / (start - end);
                
                items.forEach((img, index) => {
                    const stagger = index * 0.12; // Pequeño retraso para que no suban exactamente a la vez
                    let target = Math.max(0, Math.min(1, (p - stagger) / 0.76));
                    
                    const diff = target - img._waveProgress;
                    if (Math.abs(diff) > 0.001) {
                        img._waveProgress += diff * 0.08; // Suavizado Lerp
                        img.style.setProperty('--wave-progress', img._waveProgress);
                    }
                });
            }
        });

        if (isTriptychAnimating) requestAnimationFrame(triptychLoop);
    };
    requestAnimationFrame(triptychLoop);

    // [NUEVO] Configurar videos de la galería para que se reproduzcan solos al hacer scroll o pasar el ratón
    const independentVideos = gallery.querySelectorAll('video:not(.video-parallel-container video)');
    if (independentVideos.length > 0) {
        independentVideos.forEach(vid => {
            let playTimeout;
            const delayAttr = vid.getAttribute('data-delay');
            const delay = delayAttr !== null ? parseInt(delayAttr) : 3000; // Evita el bug donde 0 se convertía en 3000
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        clearTimeout(playTimeout); // Previene múltiples temporizadores si se hace scroll rápido
                        // Reproducir automáticamente después del tiempo asignado
                        playTimeout = setTimeout(() => {
                            // Evitamos el error que detiene la ejecución si el video aún no ha cargado
                            try {
                                if (entry.target.readyState >= 1) {
                                    entry.target.currentTime = 0; 
                                }
                            } catch (e) {}
                            
                            entry.target.play().catch(() => {}); // Iniciamos reproducción segura
                        }, delay);
                    } else {
                        clearTimeout(playTimeout); // Cancelar la cuenta atrás si pasamos de largo
                        entry.target.pause();
                    }
                });
            }, {
                root: gallery,
                threshold: 0.1 // Bajamos el umbral al 10% para asegurar que los paralelos arranquen unidos
            });
            
            videoObserver.observe(vid);
            vid.addEventListener('mouseenter', () => vid.play().catch(() => {}));
        });
    }

    // [NUEVO] Sincronización estricta para videos paralelos
    const parallelContainers = gallery.querySelectorAll('.video-parallel-container');
    parallelContainers.forEach(container => {
        const parallelVideos = container.querySelectorAll('video');
        let playTimeout;
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    clearTimeout(playTimeout);
                    playTimeout = setTimeout(() => {
                        parallelVideos.forEach(v => {
                            try { if (v.readyState >= 1) v.currentTime = 0; } catch (e) {}
                            v.play().catch(() => {});
                        });
                    }, 0);
                } else {
                    clearTimeout(playTimeout);
                    parallelVideos.forEach(v => v.pause());
                }
            });
        }, {
            root: gallery,
            threshold: 0.1 // Arranca cuando el contenedor asoma un 10%
        });
        
        containerObserver.observe(container);
        container.addEventListener('mouseenter', () => parallelVideos.forEach(v => v.play().catch(() => {})));
    });

    // Cambiar a la galería interactiva al terminar el zoom sin que el usuario lo note
    setTimeout(() => {
        if (activeGallery && document.body.classList.contains('is-parallel-zooming')) {
            activeGallery.classList.add('active');
            
            // [NUEVO] Activar observador de ondas para las fotos del tríptico
            const triptychImages = activeGallery.querySelectorAll('.triptych-container img');
            const waveObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const index = Array.from(img.parentNode.children).indexOf(img);
                        setTimeout(() => {
                            img.classList.add('wave-loaded');
                        }, index * 200); // 200ms de retraso entre la 1º, 2º y 3º
                        waveObserver.unobserve(img);
                    }
                });
            }, { threshold: 0.1 });
            triptychImages.forEach(img => waveObserver.observe(img));

            setTimeout(() => {
                if (activeClone && document.body.classList.contains('is-parallel-zooming')) {
                    activeClone.style.opacity = '0';
                }
            }, 400); // Dar margen al fade-in de la galería
        }
    }, 1200);
};

images.forEach(img => {
    img.addEventListener('click', () => {
        if (img.closest('#proyecto-video')) return; // Permitir navegación normal para el video
        triggerParallelUniverse(img);
    });
});

openLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const section = link.closest('.project-section');
        if (section && section.id === 'proyecto-video') return; // Navegación normal para el video

        e.preventDefault();
        const img = section.querySelector('.project-img-col img');
        if (img) triggerParallelUniverse(img);
    });
});

// 4. Función de Retorno "VOLVER"
if (returnBtn) {
    returnBtn.addEventListener('click', () => {
        if (!activeClone) return;

        // [MODIFICADO] Restaurar el botón al body para que ejecute la animación de salida correcta
        returnBtn.style.position = 'fixed';
        document.body.appendChild(returnBtn);

        // Ocultar la galería interactiva instantáneamente al salir
        if (activeGallery) {
            activeGallery.style.opacity = '0';
            activeGallery.style.pointerEvents = 'none';
        }

        // [MODIFICADO] Enviar clon de vuelta animando sus dimensiones reales
        const originalRect = activeOriginalImg.getBoundingClientRect();
        activeClone.style.top = `${originalRect.top}px`;
        activeClone.style.left = `${originalRect.left}px`;
        activeClone.style.width = `${originalRect.width}px`;
        activeClone.style.height = `${originalRect.height}px`;
        activeClone.style.transform = `scale(1)`;

        // Restaurar elementos difuminados
        document.querySelectorAll('.projects-main, .site-header, .cv-footer').forEach(el => {
            el.classList.remove('parallel-fade');
        });

        document.body.classList.remove('is-parallel-zooming');

        // Esperar a que acabe la transición (1.2s) para limpiar el DOM
        setTimeout(() => {
            if (activeClone) {
                activeClone.remove();
                activeClone = null;
            }

            if (activeGallery) {
                activeGallery.remove();
                activeGallery = null;
            }
            if (activeOriginalImg) {
                activeOriginalImg.style.opacity = '1';
                activeOriginalImg = null;
            }
            
            document.body.style.backgroundColor = '';
            document.body.classList.remove('zoomed-dark-theme');
            
            // Actualizar estado del cursor a default después de limpiar
            cursorDot.classList.remove('on-dark');
            
            // [NUEVO] Limpiar estilos en línea de la flecha para el próximo proyecto
            returnBtn.style.removeProperty('color');
            returnBtn.style.removeProperty('text-shadow');
            returnBtn.style.removeProperty('position'); // Limpiamos para el próximo
        }, 1200); 
    });
}

// --- [NUEVO] EFECTO DE TRANSICIÓN DE CORTINA (STAGGERED FALL) ---
const marcaPersonalProject = document.getElementById('proyecto-marca-personal');

if (marcaPersonalProject) {
    const projectLinks = marcaPersonalProject.querySelectorAll('a');

    projectLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            if (document.body.classList.contains('is-transitioning')) return;
            document.body.classList.add('is-transitioning');

            const url = e.currentTarget.href;
            if (!url) return;

            // 1. Guardar la intención de transición para la página de destino
            sessionStorage.setItem('playCurtainTransition', 'true');

            // 2. Crear la cortina dinámicamente
            const curtain = document.createElement('div');
            curtain.className = 'page-transition-curtain';

            for (let i = 0; i < 6; i++) {
                const column = document.createElement('div');
                column.className = 'curtain-column';
                column.style.transitionDelay = `${i * 40}ms`; // Retraso escalonado
                curtain.appendChild(column);
            }
            document.body.appendChild(curtain);

            // 3. Activar la animación de caída y navegar al finalizar
            void curtain.offsetWidth; // Forzar reflow
            curtain.classList.add('is-active');

            setTimeout(() => {
                window.location.href = url;
            }, 1000); // Duración total de la transición (200ms de stagger + 800ms de anim)
        }, true);
    });
}

// --- FONDO TOPOGRÁFICO FOOTER (REUTILIZABLE) ---
function initFooterCanvas(footerBox) {
    if (!footerBox) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
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
}

window.addEventListener('load', () => {
    const footerBox = document.querySelector('.cv-footer .footer-box');
    if (footerBox) initFooterCanvas(footerBox);
});

/* =========================================
   [NUEVO] LÓGICA CATÁLOGO TIPOGRÁFICO
   ========================================= */
function initTypoCatalog(container) {
    if (container.classList.contains('initialized')) return;

    const weightButtons = container.querySelectorAll('.typo-weight-btn');
    const elementsToChange = container.querySelectorAll('.typo-title, .typo-char-grid, .typo-display');

    const applyFontStyles = (activeButton) => {
        if (!activeButton) return;

        const weight = activeButton.dataset.weight;
        const family = activeButton.dataset.family;
        const style = activeButton.dataset.style;
        const stretch = activeButton.dataset.stretch;

        // Aplicar peso de fuente a través de la variable CSS
        container.style.setProperty('--font-weight', weight);

        // Aplicar familia de fuente y estilo directamente a los elementos
        // Esto es necesario porque algunas fuentes son familias distintas (Hum vs Geo)
        if (family) {
            elementsToChange.forEach(el => {
                el.style.fontFamily = family;
                el.style.fontStyle = style || 'normal';
                el.style.fontStretch = stretch || 'normal';
            });
        }
    };
    
    weightButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Quitar clase activa de todos los botones
            weightButtons.forEach(btn => btn.classList.remove('active'));
            // 2. Añadir clase activa al botón clicado
            button.classList.add('active');
            // 3. Aplicar los estilos de fuente correspondientes
            applyFontStyles(button);
        });
    });

    // Aplicar estilos iniciales basados en el botón activo por defecto
    applyFontStyles(container.querySelector('.typo-weight-btn.active'));

    container.classList.add('initialized');
}

// Observador para inicializar la lógica cuando el componente se añade al DOM
const typoObserver = new MutationObserver(() => {
    document.querySelectorAll('.typo-font-panel:not(.initialized)').forEach(initTypoCatalog);
});
typoObserver.observe(document.body, { childList: true, subtree: true });

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
    }

    // [NUEVO] Cambio inteligente de imágenes (Logo/Menú) de 'blanco' a 'azul'
    // Si la página es clara y NO estamos en la página del carrusel (que tiene fondo azul)
    const isCoverflow = document.querySelector('.projects-zigzag') !== null;
    if (document.body.classList.contains('light-page') && !isCoverflow) {
        // 1. Logo Principal
        const logo = document.querySelector('.site-logo');
        if (logo && logo.getAttribute('src') && logo.getAttribute('src').includes('blanco')) {
            logo.setAttribute('src', logo.getAttribute('src').replace('blanco', 'azul'));
        }

        // 2. Icono Menú Hamburguesa (Móvil)
        const menuImg = document.querySelector('.menu-toggle img');
        if (menuImg && menuImg.getAttribute('src') && menuImg.getAttribute('src').includes('blanco')) {
            menuImg.setAttribute('src', menuImg.getAttribute('src').replace('blanco', 'azul'));
        }
    }

    // --- ADAPTACIÓN DE LA FLECHA FLOTANTE AL FOOTER ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        // Selectors for all known dark sections across the site
        const darkSelectors = [
            '.cv-footer',
            '.project-tools-footer',
            '.explanation-box-jaime',
            '.video-wrapper.black-bg',
            '.capa-color-cuadrada.negro',
            '.typo-catalog-container'
        ];
        const darkElements = document.querySelectorAll(darkSelectors.join(', '));

        const checkButtonBackground = () => {
            const btnRect = backToTopBtn.getBoundingClientRect();
            let isOverDark = false;
            for (const darkEl of darkElements) {
                const darkRect = darkEl.getBoundingClientRect();
                if (btnRect.bottom > darkRect.top && btnRect.top < darkRect.bottom) {
                    isOverDark = true;
                    break;
                }
            }
            if (isOverDark) {
                backToTopBtn.classList.add('on-dark-bg');
            } else {
                backToTopBtn.classList.remove('on-dark-bg');
            }
        };
        window.addEventListener('scroll', checkButtonBackground, { passive: true });
        checkButtonBackground(); // Check on load
    }

    // --- ANIMACIÓN DE APARICIÓN PARA LOGOS (.logo-fade) ---
    // Asegura que los logos añadidos (Identidad Visual, Marca Personal) aparezcan fluidamente al hacer scroll
    const logoFadeElements = document.querySelectorAll('.logo-fade');
    if (logoFadeElements.length > 0) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 400); // Retraso sutil para que los textos carguen antes
                    logoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        logoFadeElements.forEach(logo => logoObserver.observe(logo));
    }
});
