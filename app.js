// Bobby Seelam Portfolio - Interactive Features (Fixed Version)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initThemeToggle();
    initSmoothScrolling();
    initNavbarScroll();
    initAnimationObserver();
    initTypingAnimation();
    initProjectFiltering();
});

// Theme Toggle Functionality (Fixed)
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    let currentTheme = savedTheme;
    
    // Apply initial theme
    updateTheme(currentTheme);
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        updateTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
    
    function updateTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        
        // Force a repaint to ensure the theme change is visible
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }
}

// Smooth Scrolling Navigation (Fixed)
function initSmoothScrolling() {
    // Handle all anchor links that start with #
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    });
}

// Navbar Scroll Effects (Enhanced)
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (only on mobile)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        updateActiveNavLink();
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Animation Observer for scroll-triggered animations
function initAnimationObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animations
                if (entry.target.classList.contains('highlight-item')) {
                    const numberEl = entry.target.querySelector('.highlight-number');
                    if (numberEl && !numberEl.classList.contains('animated')) {
                        animateCounter(numberEl);
                        numberEl.classList.add('animated');
                    }
                }
                
                // Trigger timeline animations
                if (entry.target.classList.contains('timeline-item')) {
                    const index = Array.from(document.querySelectorAll('.timeline-item')).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('reveal');
                    }, index * 200);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .about-content,
        .timeline-item,
        .skill-category,
        .project-card,
        .education-item,
        .interest-item,
        .highlight-item
    `);
    
    animateElements.forEach(el => {
        observer.observe(el);
        if (!el.classList.contains('timeline-item')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        }
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Counter Animation (Fixed)
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.includes('+') ? '+' : '';
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const step = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Typing Animation for Hero Section
function initTypingAnimation() {
    const heroTagline = document.querySelector('.hero-tagline');
    if (!heroTagline) return;
    
    const text = heroTagline.textContent;
    heroTagline.textContent = '';
    heroTagline.style.borderRight = '2px solid var(--color-primary)';
    heroTagline.style.minHeight = '1.5em';
    
    let index = 0;
    const typeSpeed = 50;
    
    function typeWriter() {
        if (index < text.length) {
            heroTagline.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTagline.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing animation after page loads
    setTimeout(typeWriter, 1500);
}

// Project Filtering and Effects
function initProjectFiltering() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Ensure project links work
        const projectLink = card.querySelector('.project-link');
        if (projectLink) {
            projectLink.addEventListener('click', (e) => {
                e.stopPropagation();
                // The href attribute should handle the navigation
            });
        }
    });
}

// Initialize social links animation and functionality
function initSocialLinksAnimation() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Array.from(socialLinks).indexOf(entry.target) * 100;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, { threshold: 0.1 });
    
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        link.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(link);
        
        // Add click tracking
        link.addEventListener('click', (e) => {
            console.log(`Social link clicked: ${link.href}`);
        });
    });
}

// Initialize social links animation
initSocialLinksAnimation();

// Add skill tag hover effects
function initSkillTagEffects() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px) scale(1.05)';
            tag.style.boxShadow = '0 4px 12px rgba(33, 128, 141, 0.3)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
            tag.style.boxShadow = 'none';
        });
    });
}

// Initialize skill tag effects
initSkillTagEffects();

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add parallax effect to hero background
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;
    
    const parallaxScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        if (scrolled <= heroHeight) {
            heroBackground.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
        }
    }, 10);
    
    window.addEventListener('scroll', parallaxScroll);
}

// Initialize parallax effect
initParallaxEffect();

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    
    // Add a subtle fade-in effect for the entire page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add styles for animations and interactions
const style = document.createElement('style');
style.textContent = `
    body.loading {
        opacity: 0;
    }
    
    .timeline-item {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .timeline-item.reveal {
        opacity: 1;
        transform: translateX(0);
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .nav-link.active {
        color: var(--color-primary) !important;
        font-weight: var(--font-weight-semibold);
    }
    
    .navbar.scrolled {
        box-shadow: var(--shadow-md);
        background: rgba(var(--color-slate-900-rgb), 0.98);
    }
    
    .skill-tag {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .project-card {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .social-link {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .theme-toggle {
        transition: all 0.3s ease;
    }
    
    .theme-toggle:hover {
        transform: scale(1.1);
    }
    
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .hero-background {
            animation: none !important;
        }
    }
    
    @media (max-width: 768px) {
        .navbar {
            transition: transform 0.3s ease;
        }
    }
`;
document.head.appendChild(style);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
    
    // Add keyboard shortcuts for theme toggle
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
});

// Console welcome message
console.log(`
🚀 Bobby Seelam Portfolio
Data skills, sharp as a chef's knife!
Built with modern web technologies and attention to detail.

Features:
- ✅ Smooth scrolling navigation
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Scroll animations
- ✅ Social media integration

Contact: linkedin.com/in/geniusfaker
`);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            }
        }, 1000);
    });
}

// Error handling for external links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="http"]');
    if (link) {
        // Add visual feedback for external link clicks
        link.style.opacity = '0.7';
        setTimeout(() => {
            link.style.opacity = '1';
        }, 200);
    }
});

// Ensure all external links open in new tabs
document.addEventListener('DOMContentLoaded', () => {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});