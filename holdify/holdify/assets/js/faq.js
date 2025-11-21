// FAQ Accordion
(function() {
    'use strict';

    const faqItems = document.querySelectorAll('.faq-item');
    const faqAccordion = document.querySelector('.faq-accordion');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = null;
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                // Add margin-top to accordion when any item is open
                if (faqAccordion) {
                    faqAccordion.classList.add('has-open-item');
                }
            } else {
                // Remove margin-top when closing the last open item
                if (faqAccordion) {
                    faqAccordion.classList.remove('has-open-item');
                }
            }
        });
    });
})();

