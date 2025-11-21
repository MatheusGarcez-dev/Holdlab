// Protection Carousel
(function() {
    'use strict';

    const carousel = {
        currentSlide: 0,
        previousSlide: -1,
        totalSlides: 3,
        slides: document.querySelectorAll('.carousel-slide'),
        videos: document.querySelectorAll('.slide-video'),
        indicators: document.querySelectorAll('.carousel-indicators .indicator'),
        prevBtn: document.querySelector('.carousel-nav.prev'),
        nextBtn: document.querySelector('.carousel-nav.next'),
        autoplayInterval: null,
        autoplayDelay: 12000,
        isTransitioning: false,

        init() {
            if (!this.slides.length) return;

            // Button events
            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());

            // Indicator events
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });

            // Touch events for mobile swipe
            this.setupTouchEvents();

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });

        // Wait for section animation before playing first video
        setTimeout(() => {
            this.playCurrentVideo();
        }, 1000);
    },

        setupTouchEvents() {
            const carouselContainer = document.querySelector('.protection-carousel');
            let touchStartX = 0;
            let touchEndX = 0;

            carouselContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carouselContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        },

        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        },

        goToSlide(index) {
            if (this.isTransitioning || index === this.currentSlide) return;

            this.isTransitioning = true;
            this.previousSlide = this.currentSlide;
            this.currentSlide = index;
            this.updateCarousel();

            setTimeout(() => {
                this.isTransitioning = false;
            }, 600);
        },

        next() {
            if (this.isTransitioning) return;
            const nextSlide = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(nextSlide);
        },

        prev() {
            if (this.isTransitioning) return;
            const prevSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevSlide);
        },

        updateCarousel() {
            // Update slides
            this.slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                
                if (index === this.currentSlide) {
                    slide.classList.add('active');
                } else if (index < this.currentSlide) {
                    slide.classList.add('prev');
                } else {
                    slide.classList.add('next');
                }
            });

            // Update indicators
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });

            // Control videos
            this.playCurrentVideo();
        },

    playCurrentVideo() {
        // Pause the previous video if it exists
        if (this.previousSlide !== -1 && this.videos[this.previousSlide]) {
            this.videos[this.previousSlide].pause();
            this.videos[this.previousSlide].currentTime = 0;
        }

        // Play only the NEW current slide's video (not if it's already the same)
        if (this.videos[this.currentSlide] && this.previousSlide !== this.currentSlide) {
            const currentVideo = this.videos[this.currentSlide];
            // Small delay to ensure smooth transition
            setTimeout(() => {
                currentVideo.currentTime = 0;
                currentVideo.play().catch(err => {
                    console.log('Video play prevented:', err);
                });
            }, 100);
        }
    }
    };

    // Initialize carousel when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => carousel.init());
    } else {
        carousel.init();
    }
})();

