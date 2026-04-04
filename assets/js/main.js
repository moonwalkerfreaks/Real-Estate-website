document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Intersection Observer for Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Seamless Page Transitions
    const links = document.querySelectorAll('a');
    const fadeWrapper = document.querySelector('.fade-wrapper');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's an internal HTML link and not a # anchor
            if (href && href.endsWith('.html') && fadeWrapper) {
                e.preventDefault();
                
                // Trigger CSS fade out
                fadeWrapper.classList.add('fade-out');
                
                // Wait for the animation to complete before redirecting
                setTimeout(() => {
                    window.location.href = href;
                }, 400); // 400ms matches the CSS transition time
            }
        });
    });
});