// Modern Interactions: Tilt, Decrypt
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // 1. 3D Tilt Effect
        initTilt();
        
        // 2. Data Decryption Text Effect
        // We use IntersectionObserver to trigger this when elements scroll into view
        initDecryption();
    }

    // ==========================================
    // 1. 3D Tilt Effect
    // ==========================================
    function initTilt() {
        const cards = document.querySelectorAll('.project-card, .about-card');

        cards.forEach(card => {
            // Add transition override class on hover
            card.addEventListener('mouseenter', () => {
                card.classList.add('tilt-active');
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate percentage from center (-1 to 1)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Max rotation degrees
                const maxRotateX = 5; 
                const maxRotateY = 5;

                // Invert Y axis for natural feel
                const rotateX = ((y - centerY) / centerY) * -maxRotateX;
                const rotateY = ((x - centerX) / centerX) * maxRotateY;

                // Apply transform
                // scale3d adds a slight pop
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                // Remove override class to let CSS transition take over for smooth reset
                card.classList.remove('tilt-active');
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // ==========================================
    // 2. Data Decryption Text Effect
    // ==========================================
    function initDecryption() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const elements = document.querySelectorAll('.section-title');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay to ensure fade-in has started
                    setTimeout(() => {
                        hackEffect(entry.target);
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        elements.forEach(el => {
            // Store original text
            el.dataset.value = el.innerText;
            observer.observe(el);
        });
    }

    function hackEffect(element) {
        let iterations = 0;
        const originalText = element.dataset.value;
        
        // Switch to monospace for "hacker" feel
        element.style.fontFamily = "'Courier New', monospace";
        
        const interval = setInterval(() => {
            element.innerText = originalText.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * 36)];
                })
                .join("");

            if (iterations >= originalText.length) {
                clearInterval(interval);
                // Revert font
                element.style.fontFamily = ""; 
            }

            iterations += 1 / 3; // Slower speed (was 1/2) for better visibility
        }, 50); // Slower interval (was 30)
    }

})();
