// Stats Counter Animation & Carousel
(function() {
    'use strict';

    // Check if section is visible in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight * 0.75 &&
            rect.bottom >= 0
        );
    }

    // Animate counter
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Initialize stats animation
    function initStats() {
        const statsSection = document.querySelector('.stats-section');
        
        if (!statsSection) return;

        let animated = false;

        function checkAndAnimate() {
            if (!animated && isInViewport(statsSection)) {
                animated = true;
                
                statsSection.classList.add('visible');

                // Animate stat cards
                const statCards = document.querySelectorAll('.stat-card');
                statCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                });

                // Animate stat numbers
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach((statNumber, index) => {
                    const target = parseInt(statNumber.getAttribute('data-target'));
                    setTimeout(() => {
                        animateCounter(statNumber, target, 2000);
                    }, index * 200);
                });

            }
        }

        window.addEventListener('scroll', checkAndAnimate);
        setTimeout(checkAndAnimate, 100);
    }

    // Initialize Featured Carousel
    function initFeaturedCarousel() {
        const track = document.querySelector('.featured-track');
        const prevBtn = document.querySelector('.featured-prev');
        const nextBtn = document.querySelector('.featured-next');
        
        if (!track || !prevBtn || !nextBtn) return;

        const cards = Array.from(track.querySelectorAll('.featured-card'));
        const highlightCard = track.querySelector('.featured-card-highlight');
        let currentIndex = cards.indexOf(highlightCard);

        // Função para centralizar um card específico
        function centerCard(index, smooth = true) {
            const card = cards[index];
            if (!card) return;

            const trackRect = track.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const trackScrollLeft = track.scrollLeft;
            
            const cardCenter = cardRect.left - trackRect.left + trackScrollLeft + (cardRect.width / 2);
            const trackCenter = trackRect.width / 2;
            const scrollPosition = cardCenter - trackCenter;

            track.scrollTo({
                left: scrollPosition,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }

        // Centralizar o card destacado ao carregar
        setTimeout(() => centerCard(currentIndex, false), 100);
        setTimeout(() => centerCard(currentIndex, true), 300);

        // Recentralizar ao redimensionar
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => centerCard(currentIndex, false), 200);
        });

        // Navegação com botões
        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            centerCard(currentIndex, true);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(cards.length - 1, currentIndex + 1);
            centerCard(currentIndex, true);
        });

        // Função para encontrar o card mais próximo do centro
        function findClosestCard() {
            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;
            
            let closestCard = null;
            let minDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(trackCenter - cardCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = index;
                }
            });
            
            return closestCard;
        }

        // Snap ao card mais próximo após scroll
        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                if (!isDown) {
                    const closestIndex = findClosestCard();
                    if (closestIndex !== null && closestIndex !== currentIndex) {
                        currentIndex = closestIndex;
                        centerCard(currentIndex, true);
                    }
                }
            }, 150);
        });

        // Touch/drag scroll for mobile
        let isDown = false;
        let startX;
        let scrollLeft;
        let hasMoved = false;

        track.addEventListener('mousedown', (e) => {
            // Não iniciar drag se clicar no botão de play
            if (e.target.closest('.video-play-overlay')) return;
            
            isDown = true;
            hasMoved = false;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            track.style.cursor = 'grabbing';
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
            
            // Snap ao soltar
            if (hasMoved) {
                setTimeout(() => {
                    const closestIndex = findClosestCard();
                    if (closestIndex !== null) {
                        currentIndex = closestIndex;
                        centerCard(currentIndex, true);
                    }
                }, 50);
            }
        });

        track.addEventListener('mouseup', () => {
            const wasDragging = isDown && hasMoved;
            isDown = false;
            track.style.cursor = 'grab';
            
            // Snap ao soltar
            if (wasDragging) {
                setTimeout(() => {
                    const closestIndex = findClosestCard();
                    if (closestIndex !== null) {
                        currentIndex = closestIndex;
                        centerCard(currentIndex, true);
                    }
                }, 50);
            }
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            hasMoved = true;
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
    }

    // Initialize Video Players in Featured Cards
    function initFeaturedVideos() {
        const videoCards = document.querySelectorAll('.featured-card[data-video]');
        
        videoCards.forEach(card => {
            const video = card.querySelector('.featured-video');
            const playBtn = card.querySelector('.video-play-overlay');
            
            if (!video || !playBtn) return;

            // Click no botão de play
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playVideo(video, playBtn, card);
            });

            // Click no vídeo quando está pausado
            video.addEventListener('click', () => {
                if (video.paused) {
                    playVideo(video, playBtn, card);
                } else {
                    pauseVideo(video, playBtn, card);
                }
            });

            // Quando o vídeo termina
            video.addEventListener('ended', () => {
                pauseVideo(video, playBtn, card);
                video.currentTime = 0;
            });

            // Pausar quando sair da área visível (opcional)
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && !video.paused) {
                        pauseVideo(video, playBtn, card);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(card);
        });

        // Função para reproduzir vídeo
        function playVideo(video, playBtn, card) {
            // Pausar todos os outros vídeos
            pauseAllVideos();
            
            video.play();
            video.classList.add('playing');
            playBtn.classList.add('hidden');
            card.style.cursor = 'default';
        }

        // Função para pausar vídeo
        function pauseVideo(video, playBtn, card) {
            video.pause();
            video.classList.remove('playing');
            playBtn.classList.remove('hidden');
            card.style.cursor = 'pointer';
        }

        // Pausar todos os vídeos
        function pauseAllVideos() {
            document.querySelectorAll('.featured-video').forEach(v => {
                if (!v.paused) {
                    const card = v.closest('.featured-card');
                    const btn = card.querySelector('.video-play-overlay');
                    pauseVideo(v, btn, card);
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initStats();
            initFeaturedCarousel();
            initFeaturedVideos();
        });
    } else {
        initStats();
        initFeaturedCarousel();
        initFeaturedVideos();
    }
})();

