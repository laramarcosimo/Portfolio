// Global function for identity section animation
function initIdentitySection(section) {
    const layers = section.querySelectorAll('.capa-color');

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
            
            const isMobile = window.innerWidth <= 768;
            const start = windowHeight * (isMobile ? 1.1 : 0.95);
            const end = windowHeight * (isMobile ? 0.55 : 0.40);
            
            let p = (start - rect.top) / (start - end);
            let target = Math.max(0, Math.min(1, p));
            
            const diff = target - layer._currentProgress;
            
            if (Math.abs(diff) > 0.0001) {
                const lerpSpeed = isMobile ? 0.3 : 0.04;
                layer._currentProgress += diff * lerpSpeed; 

                if (Math.abs(target - layer._currentProgress) < 0.002) {
                    layer._currentProgress = target;
                }
                
                layer.style.setProperty('--scroll-progress', layer._currentProgress);
            }

            if (target > 0.5 && diff > 0) {
                if (layer.dataset.typed !== "true") {
                    layer.dataset.typed = "true"; 
                    startTypewriter(layer);
                }
            } else if (rect.bottom < 0) {
                if (layer.dataset.typed !== "false") {
                    layer.dataset.typed = "false";
                    const lines = layer.querySelectorAll('.tw-line');
                    lines.forEach(line => line.innerHTML = '');
                    const logos = layer.querySelectorAll('.logo-fade');
                    logos.forEach(logo => logo.classList.remove('visible'));
                }
            }
        });

        if (isAnimating) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    
    function startTypewriter(layer) {
        const lines = layer.querySelectorAll('.tw-line');
        const logos = layer.querySelectorAll('.logo-fade');
        let delay = 0;

        lines.forEach((line) => {
            const fullText = line.getAttribute('data-text');
            line.innerHTML = '';
            
            setTimeout(() => {
                if (layer.dataset.typed !== "true") return; 

                let charIndex = 0;
                const cursor = document.createElement('span');
                cursor.className = 'tw-cursor';
                cursor.textContent = '|';
                line.appendChild(cursor);

                const typeInterval = setInterval(() => {
                    if (layer.dataset.typed !== "true") {
                        clearInterval(typeInterval);
                        return;
                    }
                    if (charIndex < fullText.length) {
                        cursor.insertAdjacentText('beforebegin', fullText.charAt(charIndex));
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        cursor.remove();
                    }
                }, 40);
            }, delay);
            
            delay += (fullText.length * 40) + 200;
        });

        setTimeout(() => {
            if (layer.dataset.typed !== "true") return;

            const lastLine = lines[lines.length - 1];
            if (lastLine) {
                const finalCursor = document.createElement('span');
                finalCursor.className = 'tw-cursor';
                finalCursor.textContent = '|';
                lastLine.appendChild(finalCursor);
            }
            logos.forEach(logo => logo.classList.add('visible'));
        }, delay + 100);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the identity section directly on this page
    const identitySection = document.querySelector('.seccion-identidad');
    if (identitySection) {
        initIdentitySection(identitySection);
    }

    // Initialize typo catalog if present
    const typoCatalog = document.querySelector('.typo-catalog-container');
    if (typoCatalog && typeof initTypoCatalog === 'function') {
        initTypoCatalog(typoCatalog);
    }

    // Initialize videos if present
    const independentVideos = document.querySelectorAll('video:not(.video-parallel-container video)');
    if (independentVideos.length > 0) {
        independentVideos.forEach(vid => {
            let playTimeout;
            const delayAttr = vid.getAttribute('data-delay');
            const delay = delayAttr !== null ? parseInt(delayAttr) : 3000;
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        clearTimeout(playTimeout);
                        playTimeout = setTimeout(() => {
                            try {
                                if (entry.target.readyState >= 1) {
                                    entry.target.currentTime = 0;
                                }
                            } catch (e) {}
                            entry.target.play().catch(() => {});
                        }, delay);
                    } else {
                        clearTimeout(playTimeout);
                        entry.target.pause();
                    }
                });
            }, {
                root: null,
                threshold: 0.1
            });
            videoObserver.observe(vid);
            vid.addEventListener('mouseenter', () => vid.play().catch(() => {}));
        });
    }

    // Initialize parallel videos if present
    const parallelContainers = document.querySelectorAll('.video-parallel-container');
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
            root: null,
            threshold: 0.1
        });
        containerObserver.observe(container);
        container.addEventListener('mouseenter', () => parallelVideos.forEach(v => v.play().catch(() => {})));
    });

    // Initialize triptych wave effect
    let isTriptychAnimating = true;
    const triptychs = document.querySelectorAll('.triptych-container');
    triptychs.forEach(t => {
        const items = t.querySelectorAll('img');
        items.forEach(img => img._waveProgress = 0);
    });

    const triptychLoop = () => {
        if (!document.body.contains(document.querySelector('.triptych-container'))) {
            isTriptychAnimating = false;
            return;
        }

        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;

        triptychs.forEach(triptych => {
            const items = triptych.querySelectorAll('img');
            
            if (isMobile) {
                items.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    const start = windowHeight * 0.95;
                    const end = windowHeight * 0.35;
                    let p = (start - rect.top) / (start - end);
                    let target = Math.max(0, Math.min(1, p));
                    
                    const diff = target - img._waveProgress;
                    if (Math.abs(diff) > 0.001) {
                        img._waveProgress += diff * 0.08;
                        img.style.setProperty('--wave-progress', img._waveProgress);
                    }
                });
            } else {
                const rect = triptych.getBoundingClientRect();
                const start = windowHeight * 0.95;
                const end = windowHeight * 0.15;
                let p = (start - rect.top) / (start - end);
                
                items.forEach((img, index) => {
                    const stagger = index * 0.12;
                    let target = Math.max(0, Math.min(1, (p - stagger) / 0.76));
                    
                    const diff = target - img._waveProgress;
                    if (Math.abs(diff) > 0.001) {
                        img._waveProgress += diff * 0.08;
                        img.style.setProperty('--wave-progress', img._waveProgress);
                    }
                });
            }
        });

        if (isTriptychAnimating) requestAnimationFrame(triptychLoop);
    };
    requestAnimationFrame(triptychLoop);

    // Animación de entrada secuencial para el grid de pegatinas
    const stickersContainer = document.querySelector('.stickers-container');
    if (stickersContainer) {
        const stickers = stickersContainer.querySelectorAll('img');
        stickers.forEach((sticker, index) => {
            sticker.style.opacity = '0';
            sticker.style.transform = 'translateY(30px)';
            sticker.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.15}s`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickers.forEach(sticker => {
                        sticker.style.opacity = '1';
                        sticker.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(stickersContainer);
    }

    // Initialize footer canvas if present
    const projectToolsFooter = document.querySelector('.project-tools-footer');
    if (projectToolsFooter && typeof initFooterCanvas === 'function') {
        initFooterCanvas(projectToolsFooter);
    }

    // Adapt back-to-top button color
    const backToTopBtn = document.querySelector('.back-to-top');
    const footer = document.querySelector('.cv-footer');
    if (backToTopBtn && footer) {
        window.addEventListener('scroll', () => {
            const btnRect = backToTopBtn.getBoundingClientRect();
            const footerRect = footer.getBoundingClientRect();
            
            if (btnRect.bottom > footerRect.top && btnRect.top < footerRect.bottom) {
                backToTopBtn.classList.add('on-dark-bg');
            } else {
                backToTopBtn.classList.remove('on-dark-bg');
            }
        }, { passive: true });
    }
});