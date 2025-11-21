// Scroll Animations with Intersection Observer
(function() {
    'use strict';

    // Observer options
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    // Create observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
                
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to observe
    const elementsToObserve = [
        // Problem Section
        '.section-header',
        '.risk-card',
        
        // Results Section
        '.results-section',
        '.results-header',
        '.protection-carousel',
        '.benefit-item',
        '.results-cta',
        
        // Process Section
        '.process-section',
        '.process-card',
        
        // FAQ Section
        '.faq-section',
        '.faq-item',
        
        // Carousel slides
        '.carousel-slide',

        // Summary Sections
        '.summary-section',
        '.summary-block',

        // Office Section
        '.office-section',
        '.office-image-wrapper',
        '.office-content',
        '.office-cta'
    ];

    // Observe all elements
    elementsToObserve.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            observer.observe(element);
        });
    });
})();

// Office image carousel
(function() {
    'use strict';

    function initOfficeCarousel() {
        const wrapper = document.querySelector('.office-image-wrapper');
        if (!wrapper) return;

        const slides = wrapper.querySelectorAll('.office-slide');
        const prevBtn = wrapper.querySelector('.office-prev');
        const nextBtn = wrapper.querySelector('.office-next');

        if (!slides.length || !prevBtn || !nextBtn) return;

        let current = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            current = index;
        }

        prevBtn.addEventListener('click', () => {
            const nextIndex = (current - 1 + slides.length) % slides.length;
            showSlide(nextIndex);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (current + 1) % slides.length;
            showSlide(nextIndex);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOfficeCarousel);
    } else {
        initOfficeCarousel();
    }
})();

