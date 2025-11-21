// Hero Video Control
(function() {
    'use strict';

    const heroVideo = document.querySelector('.main-image video');
    if (!heroVideo) return;

    let videoStarted = false;
    const isMobile = window.innerWidth <= 768;
    const videoDuration = 1.68; // 3 seconds

    // Autoplay strategy
    if (!isMobile) {
        // Desktop: autoplay immediately
        heroVideo.play().catch(err => {
            console.log('Autoplay prevented:', err);
        });
    } else {
        // Mobile: start video on first scroll
        const startVideoOnScroll = () => {
            if (!videoStarted && window.scrollY > 10) {
                heroVideo.play().catch(err => {
                    console.log('Video play prevented:', err);
                });
                videoStarted = true;
                window.removeEventListener('scroll', startVideoOnScroll);
            }
        };
        window.addEventListener('scroll', startVideoOnScroll);
    }

    // Stop video after 3 seconds
    heroVideo.addEventListener('timeupdate', function() {
        const mainImage = this.closest('.main-image');
        
        // Stop video after 3 seconds
        if (this.currentTime >= videoDuration) {
            this.pause();
            mainImage.classList.add('show-fade');
        }
        
        // Fade effect when approaching end
        const timeRemaining = this.duration - this.currentTime;
        if (timeRemaining <= 1) {
            mainImage.classList.add('show-fade');
        }
    });
})();

