document.addEventListener('DOMContentLoaded', () => {
    // Lógica específica para la página de Identidad Visual puede ir aquí en el futuro.
    
    // Por ahora, la mayoría de las funcionalidades (menú, cursor, flechas)
    // son heredadas del script global 'proyectos.js' que ya está enlazado en el HTML.

    console.log("Script de Identidad Visual cargado y listo.");

    // [NUEVO] Lógica para la sección de identidad de color
    const colorSection = document.querySelector('.color-identity-section');
    if (colorSection) {
        initColorSection(colorSection);
    }

    // [NUEVO] Inicializar catálogo tipográfico
    const typoCatalog = document.querySelector('.typo-catalog-container');
    if (typoCatalog) {
        const buttons = typoCatalog.querySelectorAll('.typo-weight-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const weight = btn.getAttribute('data-weight');
                const family = btn.getAttribute('data-family');
                typoCatalog.style.setProperty('--font-weight', weight);
                typoCatalog.style.fontFamily = `${family}, sans-serif`;
            });
        });
    }
});

function initColorSection(section) {
    const layers = section.querySelectorAll('.capa-color-cuadrada');
    let isAnimating = true;

    layers.forEach(layer => layer._currentProgress = 0);

    const tick = () => {
        if (!document.body.contains(section)) {
            isAnimating = false;
            return;
        }

        const windowHeight = window.innerHeight;

        layers.forEach(layer => {
            const rect = layer.getBoundingClientRect();
            
            const start = windowHeight * 0.9; // Empieza a animar cuando el 90% superior está en pantalla
            const end = windowHeight * 0.4;   // Termina la animación cuando llega al 40% de la pantalla
            
            let p = (start - rect.top) / (start - end);
            let target = Math.max(0, Math.min(1, p));
            
            const diff = target - layer._currentProgress;
            
            // Usamos un suavizado (lerp) para que el movimiento sea fluido
            if (Math.abs(diff) > 0.001) {
                layer._currentProgress += diff * 0.08; // Velocidad de suavizado
                layer.style.setProperty('--scroll-progress', layer._currentProgress);
            }

            // Activar máquina de escribir al pasar la mitad del recorrido
            if (target > 0.5 && diff > 0) {
                if (layer.dataset.typed !== "true") {
                    layer.dataset.typed = "true"; 
                    startTypewriter(layer);
                }
            } else if (rect.top > windowHeight || rect.bottom < 0) {
                // Resetear si sale de la pantalla
                if (layer.dataset.typed !== "false") {
                    layer.dataset.typed = "false";
                    const lines = layer.querySelectorAll('.tw-line');
                    lines.forEach(line => line.innerHTML = '');
                }
            }
        });

        if (isAnimating) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

function startTypewriter(layer) {
    const lines = layer.querySelectorAll('.tw-line');
    let delay = 0;

    lines.forEach((line) => {
        const fullText = line.getAttribute('data-text');
        line.innerHTML = ''; // Limpiar

        setTimeout(() => {
            if (layer.dataset.typed !== "true") return;

            let charIndex = 0;
            const cursor = document.createElement('span');
            cursor.className = 'tw-cursor';
            cursor.textContent = '|';
            line.appendChild(cursor);

            const typeInterval = setInterval(() => {
                if (layer.dataset.typed !== "true") { clearInterval(typeInterval); return; }
                if (charIndex < fullText.length) {
                    cursor.insertAdjacentText('beforebegin', fullText.charAt(charIndex));
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    if (line !== lines[lines.length - 1]) { cursor.remove(); }
                }
            }, 60);
        }, delay);

        delay += (fullText.length * 60) + 200;
    });
}