// Mohamed Ballouch Portfolio - JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Active navigation highlighting
    initActiveNavigation();
    
    // Mobile menu functionality
    initMobileMenu();
    
    // Scroll animations
    initScrollAnimations();
    
    // Typing animation for hero title
    initTypingAnimation();
    
    // Skills progress animation
    initSkillsAnimation();
    
    // Form handling (if contact form is added)
    initContactForm();
    
    // Theme toggle (if implemented)
    initThemeToggle();
    
    // Language toggle
    initLanguageToggle();
    
});

// Smooth scrolling function
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Call once on load
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileMenu.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // For staggered animations
                if (entry.target.classList.contains('stagger')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .education-card, .publication-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
    
    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1'; // Make visible for typing
    
    let i = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
}

// Skills progress animation
function initSkillsAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('pulse');
            }
        });
    });
    
    skillTags.forEach(tag => {
        observer.observe(tag);
    });
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }
        
        .skill-tag.pulse {
            animation: pulse 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// Contact form handling (placeholder for future implementation)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            // For now, we'll just log it and show a success message
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Theme toggle functionality (for future dark/light mode)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check for saved theme preference
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.add(currentTheme + '-theme');
        
        themeToggle.addEventListener('click', function() {
            const body = document.body;
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}

// Language toggle functionality
function initLanguageToggle() {
    const languageToggle = document.querySelector('.language-toggle');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    if (languageToggle && langButtons.length > 0) {
        // Initialize toggle state
        updateLanguageToggleState();
        
        // Add click listeners to language buttons
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang && window.translationManager) {
                    window.translationManager.setLanguage(lang);
                    updateLanguageToggleState();
                }
            });
        });
    }
}

function updateLanguageToggleState() {
    const languageToggle = document.querySelector('.language-toggle');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    if (languageToggle && langButtons.length > 0 && window.translationManager) {
        const currentLang = window.translationManager.getCurrentLanguage();
        
        // Update toggle slider position
        if (currentLang === 'fr') {
            languageToggle.classList.add('fr');
        } else {
            languageToggle.classList.remove('fr');
        }
        
        // Update active button
        langButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Initialize translation manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.translationManager) {
        // Set initial language and update content
        window.translationManager.updateContent();
        updateLanguageToggleState();
    }
});

// Add parallax effect to hero section
function initParallaxEffect() {
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// Initialize parallax on load
window.addEventListener('load', initParallaxEffect);

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Console Easter Egg
console.log('%c👋 Hey there! Thanks for checking out my portfolio!', 'font-size: 20px; color: #00d4ff;');
console.log('%c🚀 Interested in working together? Let\'s connect!', 'font-size: 16px; color: #00ff88;');
console.log('%c📧 Email: ballouch.mo@gmail.com', 'font-size: 14px; color: #a8b2c7;');
console.log('%c💼 LinkedIn: https://linkedin.com/in/mohamed-ballouch', 'font-size: 14px; color: #a8b2c7;');
console.log('%c🐙 GitHub: https://github.com/Mohamedballouch', 'font-size: 14px; color: #a8b2c7;');