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

    // 4. Fetch and Render Properties
    const propertiesGrid = document.getElementById('all-properties-grid');
    if (propertiesGrid) {
        // Show loading state
        propertiesGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><i class="fas fa-spinner fa-spin fa-3x" style="color: var(--accent-green);"></i></div>';

        fetch('data/properties.json')
            .then(response => response.json())
            .then(data => {
                propertiesGrid.innerHTML = '';
                if (data.properties && data.properties.length > 0) {
                    data.properties.forEach((property, index) => {
                        const delay = (index % 3) * 0.1; // Staggered animation
                        const featuresList = (property.features || []).slice(0, 3).join(' • '); // Show top 3 features

                        const propertyHTML = `
                            <div class="property-card" style="animation: fadeUp 0.6s ease-out ${delay}s both;">
                                <img src="${property.image}" alt="${property.title}" class="property-img" onerror="this.src='https://placehold.co/600x400?text=Property'">
                                <div class="property-info">
                                    <div class="property-price">${property.price}</div>
                                    <h3>${property.title}</h3>
                                    <p style="margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt" style="color:var(--accent-green)"></i> ${property.location}</p>
                                    <p style="font-size: 0.9rem; color: #64748b;"><i class="fas fa-info-circle"></i> ${featuresList}</p>
                                </div>
                            </div>
                        `;
                        propertiesGrid.innerHTML += propertyHTML;
                    });
                } else {
                    propertiesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem;">No properties available at the moment.</p>';
                }
            })
            .catch(error => {
                console.error("Error fetching properties:", error);
                propertiesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load properties. Please try again later.</p>';
            });
    }
});