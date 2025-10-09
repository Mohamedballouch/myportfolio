// Mohamed Ballouch Portfolio - Enhanced JavaScript

// Performance optimization - use requestAnimationFrame for smooth animations
let ticking = false;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initSmoothScrolling();
    initActiveNavigation();
    initMobileMenu();
    initAdvancedScrollAnimations();
    initTypingAnimation();
    initSkillsAnimation();
    initSkillBars();
    initContactForm();
    initThemeToggle();
    initLanguageToggle();
    initParallaxEffect();
    initMouseFollowEffect();
    initPreloader();
    initBackToTop();
    initScrollProgress();
    initParticles();
    initEnhancedAnimations();
    initProjectModals();
    initAccessibility();
    initBlogFeatures();
    
    // Add performance optimization
    optimizePerformance();
    
    // Add modern loading state
    handlePageLoad();
});

// Advanced smooth scrolling with easing
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Smooth scroll with custom easing
                smoothScrollTo(offsetPosition, 1000);
            }
        });
    });
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Enhanced active navigation with smooth transitions
function initActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveNav() {
        if (!ticking) {
            requestAnimationFrame(() => {
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

                // Enhanced navbar scroll effect
                const navbar = document.getElementById('navbar');
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Call once on load
}

// Enhanced mobile menu with animations
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            const isActive = navLinksContainer.classList.contains('active');
            
            if (isActive) {
                // Animate out
                navLinksContainer.style.animation = 'slideOutUp 0.3s ease forwards';
                setTimeout(() => {
                    navLinksContainer.classList.remove('active');
                    navLinksContainer.style.animation = '';
                }, 300);
            } else {
                // Animate in
                navLinksContainer.classList.add('active');
                navLinksContainer.style.animation = 'slideInDown 0.3s ease forwards';
            }
            
            // Toggle icon with animation
            const icon = mobileMenu.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                mobileMenu.style.transform = 'rotate(90deg)';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenu.style.transform = 'rotate(0deg)';
            }
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenu.style.transform = 'rotate(0deg)';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinksContainer.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenu.style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Advanced scroll animations with Intersection Observer
function initAdvancedScrollAnimations() {
    const observerOptions = {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visibility class with delay for staggered animations
                const element = entry.target;
                element.classList.add('visible');
                
                // Special handling for staggered animations
                if (element.classList.contains('stagger-animation')) {
                    const children = element.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }

                // Add glow effect to timeline dots when visible
                if (element.classList.contains('timeline-item')) {
                    const dot = element.querySelector('.timeline-dot');
                    if (dot) {
                        setTimeout(() => {
                            dot.style.animation = 'glow 2s ease-in-out infinite';
                        }, 500);
                    }
                }
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.timeline-item, .project-card, .skill-category, .education-card, .publication-item, .stat-box, .contact-item'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add stagger animation to grids
    const staggerElements = document.querySelectorAll('.skills-grid, .projects-grid, .education-grid');
    staggerElements.forEach(el => {
        el.classList.add('stagger-animation');
        observer.observe(el);
    });
}

// Enhanced typing animation with multiple effects
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1'; // Make visible for typing
    
    let i = 0;
    const typeSpeed = 80;
    const cursorChar = '|';
    
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent = text.slice(0, i + 1) + cursorChar;
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor and add glow effect
            heroTitle.textContent = text;
            heroTitle.style.textShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
            
            // Add pulsing effect
            setTimeout(() => {
                heroTitle.style.animation = 'pulse 3s ease-in-out infinite';
            }, 500);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 1500);
}

// Enhanced skills animation with progressive reveal
function initSkillsAnimation() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillTags = entry.target.querySelectorAll('.skill-tag');
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0) scale(1)';
                        tag.style.animation = 'pulse 0.6s ease';
                    }, index * 150);
                });
            }
        });
    }, { threshold: 0.3 });
    
    skillCategories.forEach(category => {
        const skillTags = category.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px) scale(0.9)';
            tag.style.transition = 'all 0.6s ease';
        });
        observer.observe(category);
    });
}

// Enhanced contact form with validation and real-time feedback
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form?.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (!form) return;

    // Form validation rules
    const validators = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        subject: {
            required: true,
            minLength: 5
        },
        message: {
            required: true,
            minLength: 10
        }
    };

    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
        const field = form.querySelector(`#${fieldName}`);
        const errorElement = form.querySelector(`#${fieldName}Error`);

        if (field && errorElement) {
            field.addEventListener('blur', () => validateField(field, errorElement, validators[fieldName]));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field, errorElement, validators[fieldName]);
                }
            });
        }
    });

    // Validate individual field
    function validateField(field, errorElement, rules) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`;
        }
        // Pattern validation
        else if (value && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            if (field.type === 'email') {
                errorMessage = 'Please enter a valid email address';
            } else if (field.name === 'name') {
                errorMessage = 'Name should only contain letters and spaces';
            }
        }
        // Length validation
        else if (value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} must be at least ${rules.minLength} characters`;
        }

        // Update UI
        if (isValid) {
            field.classList.remove('error');
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        } else {
            field.classList.add('error');
            errorElement.classList.add('show');
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    // Validate entire form
    function validateForm() {
        let isFormValid = true;

        Object.keys(validators).forEach(fieldName => {
            const field = form.querySelector(`#${fieldName}`);
            const errorElement = form.querySelector(`#${fieldName}Error`);

            if (field && errorElement) {
                const isFieldValid = validateField(field, errorElement, validators[fieldName]);
                if (!isFieldValid) isFormValid = false;
            }
        });

        return isFormValid;
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';

        // Hide previous messages
        formSuccess.style.display = 'none';
        formError.style.display = 'none';
        form.style.display = 'block';

        try {
            // Simulate form submission (replace with actual EmailJS or backend integration)
            await simulateFormSubmission(new FormData(form));
            
            // Show success
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
                form.querySelectorAll('.error-message').forEach(error => error.classList.remove('show'));
                
                // Show form again after 5 seconds
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    form.style.display = 'block';
                }, 5000);
            }, 1000);

        } catch (error) {
            // Show error
            formError.style.display = 'block';
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline-flex';
            btnLoading.style.display = 'none';
        }
    });

    // Simulate form submission (replace with EmailJS or your backend)
    async function simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate for demo)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 2000);
        });
    }
}

// Enhanced theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const root = document.documentElement;

    if (!themeToggle || !themeIcon) return;

    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth switching
        document.body.classList.add('theme-transition');
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add rotation animation to icon
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.style.transform = 'rotate(0deg)';
            document.body.classList.remove('theme-transition');
        }, 300);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

// Project modal functionality
function initProjectModals() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const projectCards = document.querySelectorAll('.project-card');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    if (!modal) return;

    // Open modal function
    function openModal(projectData) {
        const modalTitle = document.getElementById('modalTitle');
        const modalImage = document.getElementById('modalImage');
        const modalDescription = document.getElementById('modalDescription');
        const modalTechStack = document.getElementById('modalTechStack');
        const modalFeatures = document.getElementById('modalFeatures');
        const modalGithub = document.getElementById('modalGithub');
        const modalDemo = document.getElementById('modalDemo');

        // Populate modal content
        if (modalTitle) modalTitle.textContent = projectData.title;
        if (modalDescription) modalDescription.textContent = projectData.description;
        
        if (modalImage) {
            modalImage.src = projectData.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGEwZjFiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzAwZDRmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';
            modalImage.alt = projectData.title;
        }

        // Populate tech stack
        if (modalTechStack && projectData.tech) {
            modalTechStack.innerHTML = '';
            projectData.tech.split(',').forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'modal-tech-tag';
                tag.textContent = tech.trim();
                modalTechStack.appendChild(tag);
            });
        }

        // Populate features
        if (modalFeatures && projectData.features) {
            modalFeatures.innerHTML = '';
            projectData.features.split(',').forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature.trim();
                modalFeatures.appendChild(li);
            });
        }

        // Update links
        if (modalGithub && projectData.github) {
            modalGithub.href = projectData.github;
            modalGithub.style.display = projectData.github ? 'inline-flex' : 'none';
        }
        
        if (modalDemo && projectData.demo) {
            modalDemo.href = projectData.demo;
            modalDemo.style.display = projectData.demo ? 'inline-flex' : 'none';
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for project cards
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking on a link or button
            if (e.target.tagName === 'A' || e.target.closest('a') || 
                e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            
            const projectData = {
                title: card.dataset.title,
                description: card.dataset.description,
                image: card.dataset.image,
                tech: card.dataset.tech,
                features: card.dataset.features,
                github: card.dataset.github,
                demo: card.dataset.demo
            };
            
            openModal(projectData);
        });

        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Event listeners for view details buttons
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.project-card');
            if (card) {
                const projectData = {
                    title: card.dataset.title,
                    description: card.dataset.description,
                    image: card.dataset.image,
                    tech: card.dataset.tech,
                    features: card.dataset.features,
                    github: card.dataset.github,
                    demo: card.dataset.demo
                };
                openModal(projectData);
            }
        });
    });

    // Close modal event listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard support for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Enhanced language toggle
function initLanguageToggle() {
    const languageToggle = document.querySelector('.language-toggle');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    if (languageToggle && langButtons.length > 0) {
        updateLanguageToggleState();
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang && window.translationManager) {
                    // Add animation
                    languageToggle.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        window.translationManager.setLanguage(lang);
                        updateLanguageToggleState();
                        languageToggle.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        });
    }
}

// Advanced parallax effect with performance optimization
function initParallaxEffect() {
    const hero = document.getElementById('hero');
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (hero || parallaxElements.length > 0) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const viewportHeight = window.innerHeight;
            
            if (hero) {
                const parallaxSpeed = 0.5;
                hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
            
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
}

// Mouse follow effect for interactive elements
function initMouseFollowEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
    document.body.appendChild(cursor);
    
    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorOutline = cursor.querySelector('.cursor-outline');
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth outline follow
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-tag');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// Preloader with animation
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">MB</div>
            <div class="preloader-spinner"></div>
            <div class="preloader-text">Loading...</div>
        </div>
    `;
    document.body.prepend(preloader);
    
    // Function to hide preloader
    const hidePreloader = () => {
        if (preloader && preloader.parentNode) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.classList.add('loaded');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }
    };
    
    // Hide preloader when page is loaded
    window.addEventListener('load', hidePreloader);
    
    // Fallback: force hide after 3 seconds to prevent infinite loading
    setTimeout(hidePreloader, 3000);
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preconnect to external domains
    const preconnectDomains = ['fonts.googleapis.com', 'cdnjs.cloudflare.com'];
    preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `https://${domain}`;
        document.head.appendChild(link);
    });
}

// Enhanced page load handling
function handlePageLoad() {
    document.body.classList.add('page-loading');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
            
            // Trigger entrance animations
            const heroElements = document.querySelectorAll('.hero-subtitle, .hero-title, .hero-description, .hero-buttons, .social-links');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 300);
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            smoothScrollTo(0, 1000);
        });
    }
}

// Additional utility functions
function updateLanguageToggleState() {
    const languageToggle = document.querySelector('.language-toggle');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    if (languageToggle && langButtons.length > 0 && window.translationManager) {
        const currentLang = window.translationManager.getCurrentLanguage();
        
        if (currentLang === 'fr') {
            languageToggle.classList.add('fr');
        } else {
            languageToggle.classList.remove('fr');
        }
        
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

// Scroll progress indicator
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call
}

// Particle system for hero section
function initParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;

    const particleCount = 50;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        return particle;
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particlesContainer.appendChild(createParticle());
    }
}

// Enhanced scroll animations with intersection observer
function initEnhancedAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-animate');
        observer.observe(section);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    // Observe skill tags with stagger effect
    document.querySelectorAll('.skill-tag').forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        observer.observe(tag);
    });
}

// Enhanced performance optimization with monitoring
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    
    const debouncedScroll = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Scroll-dependent functions can be called here
        }, 16); // ~60fps
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });

    // Optimize animations for mobile
    if (window.innerWidth < 768) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }

    // Performance monitoring
    if ('PerformanceObserver' in window) {
        try {
            // Monitor largest contentful paint
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Monitor cumulative layout shift
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (e) {
            console.log('Performance monitoring not available');
        }
    }

    // Lazy loading implementation
    initLazyLoading();
    
    // Resource preloading
    preloadCriticalResources();
}

// Lazy loading for images and content
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('.lazy, [data-src], [loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Handle images
                    if (element.tagName === 'IMG') {
                        if (element.dataset.src) {
                            element.src = element.dataset.src;
                            element.removeAttribute('data-src');
                        }
                        element.classList.add('loaded');
                    }
                    
                    // Handle background images
                    if (element.dataset.bgSrc) {
                        element.style.backgroundImage = `url(${element.dataset.bgSrc})`;
                        element.removeAttribute('data-bg-src');
                        element.classList.add('loaded');
                    }
                    
                    // Handle other lazy content
                    if (element.classList.contains('lazy')) {
                        element.classList.remove('lazy');
                        element.classList.add('loaded');
                    }
                    
                    lazyObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        lazyElements.forEach(element => {
            if (element.tagName === 'IMG' && element.dataset.src) {
                element.src = element.dataset.src;
                element.removeAttribute('data-src');
            }
            if (element.dataset.bgSrc) {
                element.style.backgroundImage = `url(${element.dataset.bgSrc})`;
                element.removeAttribute('data-bg-src');
            }
            element.classList.remove('lazy');
            element.classList.add('loaded');
        });
    }
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload critical images
    const criticalImages = [
        'assets/images/my_img.jpeg',
        'assets/images/logo-blackstone.png',
        'assets/images/logo-dxc-tech.png',
        'assets/images/LogoExakisNelite.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Prefetch next section content
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Prefetch non-critical resources during idle time
            const nextSectionImages = document.querySelectorAll('img[data-src]');
            nextSectionImages.forEach(img => {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = img.dataset.src;
                document.head.appendChild(prefetchLink);
            });
        });
    }
}

// Handle page load
function handlePageLoad() {
    window.addEventListener('load', () => {
        // Add loaded class for any load-specific animations
        document.body.classList.add('loaded');
        
        // Initialize any load-dependent features
        setTimeout(() => {
            document.body.classList.add('ready');
        }, 100);
    });
}

// Enhanced accessibility features
function initAccessibility() {
    // Enhanced keyboard navigation
    initKeyboardNavigation();
    
    // Focus management for modals
    initFocusManagement();
    
    // ARIA live regions for dynamic content
    initAriaLiveRegions();
    
    // Enhanced mobile menu accessibility
    initMobileMenuAccessibility();
}

// Keyboard navigation enhancements
function initKeyboardNavigation() {
    // Add keyboard support for custom elements
    const interactiveElements = document.querySelectorAll('[role="button"], .project-card, .skill-tag');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Enhanced tab navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main');
    
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Focus management for modals and dynamic content
function initFocusManagement() {
    let lastFocusedElement = null;
    
    // Store focus when modal opens
    document.addEventListener('modalOpen', (e) => {
        lastFocusedElement = document.activeElement;
        const modal = e.detail.modal;
        
        // Focus first interactive element in modal
        setTimeout(() => {
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
        
        // Trap focus within modal
        modal.addEventListener('keydown', trapFocus);
    });
    
    // Restore focus when modal closes
    document.addEventListener('modalClose', () => {
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    });
    
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        
        const modal = e.currentTarget;
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
}

// ARIA live regions for dynamic content updates
function initAriaLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);
    
    // Function to announce messages
    window.announceToScreenReader = function(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    };
    
    // Announce form submissions
    document.addEventListener('formSubmitted', (e) => {
        if (e.detail.success) {
            announceToScreenReader('Message sent successfully');
        } else {
            announceToScreenReader('Error sending message, please try again');
        }
    });
    
    // Announce theme changes
    document.addEventListener('themeChanged', (e) => {
        announceToScreenReader(`Switched to ${e.detail.theme} theme`);
    });
}

// Enhanced mobile menu accessibility
function initMobileMenuAccessibility() {
    const mobileMenuBtn = document.querySelector('.mobile-menu button');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Focus first menu item when opening
                setTimeout(() => {
                    const firstLink = navLinks.querySelector('a');
                    if (firstLink) firstLink.focus();
                }, 100);
            }
        });
        
        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        });
    }
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach((bar) => {
            const progress = bar.getAttribute('data-progress');
            const rect = bar.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if skill bar is in view
            if (rect.top < windowHeight - 100 && rect.bottom > 0) {
                // Animate to the target width
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, Math.random() * 500); // Stagger animation
            }
        });
    };
    
    // Animate on scroll
    window.addEventListener('scroll', animateSkillBars);
    // Animate on load
    animateSkillBars();
}

// Blog/Articles Functionality
function initBlogFeatures() {
    const searchInput = document.getElementById('blog-search');
    const filterTags = document.querySelectorAll('.filter-tag');
    const articles = document.querySelectorAll('.article-card');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    let currentFilter = 'all';
    let searchTerm = '';
    let visibleCount = 6; // Initially show 6 articles
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            filterArticles();
        });
    }
    
    // Filter functionality
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Update active state
            filterTags.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            tag.classList.add('active');
            tag.setAttribute('aria-pressed', 'true');
            
            currentFilter = tag.getAttribute('data-category');
            filterArticles();
        });
    });
    
    // Filter articles based on search and category
    function filterArticles() {
        let visibleArticles = 0;
        
        articles.forEach((article, index) => {
            const categories = article.getAttribute('data-category');
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);
            const matchesSearch = searchTerm === '' || 
                title.includes(searchTerm) || 
                excerpt.includes(searchTerm) || 
                tags.includes(searchTerm);
            
            const shouldShow = matchesCategory && matchesSearch && visibleArticles < visibleCount;
            
            if (shouldShow) {
                article.style.display = 'block';
                article.style.animation = `fadeInUp 0.6s ease ${visibleArticles * 0.1}s forwards`;
                visibleArticles++;
            } else if (matchesCategory && matchesSearch) {
                // Article matches but exceeds visible count
                article.style.display = 'none';
            } else {
                article.style.display = 'none';
            }
        });
        
        // Update load more button visibility
        const totalMatchingArticles = Array.from(articles).filter(article => {
            const categories = article.getAttribute('data-category');
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);
            const matchesSearch = searchTerm === '' || 
                title.includes(searchTerm) || 
                excerpt.includes(searchTerm) || 
                tags.includes(searchTerm);
            
            return matchesCategory && matchesSearch;
        }).length;
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = totalMatchingArticles > visibleCount ? 'inline-flex' : 'none';
        }
    }
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 3; // Load 3 more articles
            filterArticles();
        });
    }
    
    // Initial filter
    filterArticles();
}

// Console Easter Egg with enhanced styling
console.log('%c👋 Hey there! Thanks for checking out my portfolio!', 'font-size: 24px; color: #00d4ff; font-weight: bold;');
console.log('%c🚀 Interested in working together? Let\'s connect!', 'font-size: 18px; color: #00ff88; font-weight: bold;');
console.log('%c📧 Email: ballouch.mo@gmail.com', 'font-size: 16px; color: #a8b2c7;');
console.log('%c💼 LinkedIn: https://linkedin.com/in/mohamed-ballouch', 'font-size: 16px; color: #a8b2c7;');
console.log('%c🐙 GitHub: https://github.com/Mohamedballouch', 'font-size: 16px; color: #a8b2c7;');
console.log('%c✨ Portfolio built with modern web technologies and love for clean code!', 'font-size: 14px; color: #ff6b6b; font-style: italic;');