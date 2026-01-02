// Portfolio JavaScript
// With fallback support for GitHub Pages

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Check if GSAP is available
        var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

        if (hasGSAP) {
            gsap.registerPlugin(ScrollTrigger);
            initGSAPAnimations();
        } else {
            // Fallback to CSS animations with Intersection Observer
            initFallbackAnimations();
        }

        // Initialize common features
        initTypingAnimation();
        initNavigation();
    }

    // ==========================================
    // Typing Animation
    // ==========================================
    function initTypingAnimation() {
        var roles = [
            'Data Scientist',
            'ML Engineer',
            'Deep Learning',
            'Forecasting',
            'RAG Systems'
        ];

        var typingText = document.querySelector('.typing-text');
        if (!typingText) return;

        var roleIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typingSpeed = 100;

        function typeRole() {
            var currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500;
            }

            setTimeout(typeRole, typingSpeed);
        }

        // Start typing after initial animation
        setTimeout(typeRole, 1500);
    }

    // ==========================================
    // GSAP Animations (if available)
    // ==========================================
    function initGSAPAnimations() {
        // Hero animations
        var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
            .to('.hero-title .line', {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2
            })
            .to('.hero-desc', {
                opacity: 1,
                duration: 0.8
            }, '-=0.5')
            .to('.hero-cta', {
                opacity: 1,
                duration: 0.8
            }, '-=0.4')
            .to('.scroll-hint', {
                opacity: 1,
                duration: 0.8
            }, '-=0.4');

        // Section titles
        gsap.utils.toArray('.section-title').forEach(function(title) {
            gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%'
                }
            });
        });

        // About section
        gsap.to('.about-lead', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.about-lead',
                start: 'top 85%'
            }
        });

        gsap.utils.toArray('.about-card').forEach(function(card, i) {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            });
        });

        gsap.to('.skills', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 85%'
            }
        });

        // Timeline items
        gsap.utils.toArray('.timeline-item').forEach(function(item, i) {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                }
            });
        });

        // Project cards
        gsap.utils.toArray('.project-card').forEach(function(card, i) {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            });
        });

        // Contact section
        gsap.utils.toArray('.contact-text, .contact-email, .contact-links').forEach(function(el, i) {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%'
                }
            });
        });
    }

    // ==========================================
    // Fallback Animations (CSS + Intersection Observer)
    // ==========================================
    function initFallbackAnimations() {
        // Hero animations - trigger immediately with delays
        setTimeout(function() {
            var lines = document.querySelectorAll('.hero-title .line');
            lines.forEach(function(line) {
                line.classList.add('animated');
            });
        }, 100);

        setTimeout(function() {
            var heroDesc = document.querySelector('.hero-desc');
            if (heroDesc) heroDesc.classList.add('animated');
        }, 500);

        setTimeout(function() {
            var heroCta = document.querySelector('.hero-cta');
            if (heroCta) heroCta.classList.add('animated');
        }, 700);

        setTimeout(function() {
            var scrollHint = document.querySelector('.scroll-hint');
            if (scrollHint) scrollHint.classList.add('animated');
        }, 900);

        // Use Intersection Observer for scroll animations
        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        var animatableElements = document.querySelectorAll(
            '.section-title, .about-lead, .about-card, .skills, .timeline-item, .project-card, .contact-text, .contact-email, .contact-links'
        );

        animatableElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ==========================================
    // Navigation
    // ==========================================
    function initNavigation() {
        var nav = document.querySelector('.nav');
        if (!nav) return;

        var lastScroll = 0;

        window.addEventListener('scroll', function() {
            var currentScroll = window.pageYOffset;

            // Add background on scroll
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Hide/show on scroll direction
            if (currentScroll > lastScroll && currentScroll > 200) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }

            lastScroll = currentScroll;
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                var targetId = this.getAttribute('href');
                var target = document.querySelector(targetId);
                if (target) {
                    var offset = 0;
                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

})();
