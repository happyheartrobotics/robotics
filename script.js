// ====================================
// DOM Elements
// ====================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const galleryGrid = document.getElementById('galleryGrid');
const videosGrid = document.getElementById('videosGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const contactForm = document.getElementById('contactForm');

let currentFilter = 'all';
let galleryItems = [];
let currentLightboxIndex = 0;

// ====================================
// Initialize App
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeGallery();
    initializeVideos();
    initializeFilters();
    initializeContact();
    initializeScrollAnimations();
    animateStatistics();
});

// ====================================
// Theme Management
// ====================================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    document.body.className = savedTheme;
    updateThemeToggle();
}

function updateThemeToggle() {
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.className);
    updateThemeToggle();
});

// ====================================
// Navigation
// ====================================
function initializeNavigation() {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)';
        } else {
            navbar.style.boxShadow = 'var(--shadow)';
        }
    });
}

function scrollToSection(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

window.scrollToSection = scrollToSection;

// ====================================
// Gallery
// ====================================
function initializeGallery() {
    const galleryData = JSON.parse(document.getElementById('galleryData').textContent);
    galleryItems = galleryData;
    renderGallery(galleryItems);
}

function renderGallery(items) {
    galleryGrid.innerHTML = items.map((item, index) => `
        <div class="gallery-item" data-index="${index}" data-category="${item.category}" onclick="openLightbox(${index})">
            <img src="${item.src}" alt="${item.title}" loading="lazy">
        </div>
    `).join('');
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const item = galleryItems[index];
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDesc = document.querySelector('.lightbox-desc');
    
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function nextLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
    openLightbox(currentLightboxIndex);
}

function prevLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentLightboxIndex);
}

// Lightbox controls
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-next').addEventListener('click', nextLightboxImage);
document.querySelector('.lightbox-prev').addEventListener('click', prevLightboxImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
});

window.openLightbox = openLightbox;

// ====================================
// Gallery Filtering
// ====================================
function initializeFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterGallery();
        });
    });
}

function filterGallery() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (currentFilter === 'all' || item.dataset.category === currentFilter) {
            item.style.display = '';
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = 'fadeIn 0.5s ease-out';
            }, 10);
        } else {
            item.style.display = 'none';
        }
    });
}

// ====================================
// Videos
// ====================================
function initializeVideos() {
    const videosData = JSON.parse(document.getElementById('videosData').textContent);
    renderVideos(videosData);
}

function renderVideos(videos) {
    videosGrid.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-thumbnail">
                <div class="video-play-btn">▶</div>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.desc}</p>
            </div>
        </div>
    `).join('');

    // Add click events to video cards
    document.querySelectorAll('.video-card').forEach((card, index) => {
        card.addEventListener('click', () => playVideo(videos[index].src));
    });
}

function playVideo(src) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        max-width: 800px;
        width: 100%;
        background: rgba(26, 35, 50, 0.9);
        border-radius: 12px;
        overflow: hidden;
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 212, 255, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.5);
        color: #00d4ff;
        font-size: 2rem;
        cursor: pointer;
        width: 50px;
        height: 50px;
        border-radius: 6px;
        z-index: 2001;
    `;
    
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = 'width: 100%; height: auto; display: block;';
    
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    videoContainer.appendChild(closeBtn);
    videoContainer.appendChild(video);
    modal.appendChild(videoContainer);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// ====================================
// Contact Form
// ====================================
function initializeContact() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    });
}

// ====================================
// Scroll Animations
// ====================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ====================================
// Statistics Counter Animation
// ====================================
function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.target);
                animateCounter(target, finalValue);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 50);
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(interval);
        } else {
            element.textContent = current;
        }
    }, 30);
}

// ====================================
// Back to Top Button
// ====================================
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ====================================
// Smooth Scroll
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ====================================
// Keyboard Navigation
// ====================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ====================================
// Touch/Swipe Support for Mobile
// ====================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (!lightbox.classList.contains('active')) return;
    
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextLightboxImage();
        } else {
            prevLightboxImage();
        }
    }
}

// ====================================
// Performance Optimization - Lazy Loading
// ====================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====================================
// Utility Functions
// ====================================
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ====================================
// Mobile Menu Auto-Close on Outside Click
// ====================================
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
    }
});

// ====================================
// Update Active Nav Link
// ====================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.borderBottomColor = 'var(--primary-color)';
        } else {
            link.style.borderBottomColor = 'transparent';
        }
    });
});

// ====================================
// Random Gallery Display
// ====================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initializeGallery() {
    const galleryData = JSON.parse(document.getElementById('galleryData').textContent);
    galleryItems = shuffleArray(galleryData); // Randomize gallery order
    renderGallery(galleryItems);
}

// ====================================
// Kid-Friendly Interactive Features
// ====================================
function initializeFunFeatures() {
    // Add fun hover effects to cards
    const cards = document.querySelectorAll('.activity-card, .project-card, .team-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) rotate(1deg)';
            createConfetti(card);
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add particle effects on click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.activity-card') || e.target.closest('.project-card')) {
            createClickParticles(e.pageX, e.pageY);
        }
    });

    // Easter egg: Konami code for secret message
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showSecretMessage();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Add floating animation to hero section
    addFloatingElements();
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 10px;
            height: 10px;
            background: ${['#00d4ff', '#ff6b9d', '#7c3aed', '#ffd700', '#ff69b4'][Math.floor(Math.random() * 5)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            animation: confetti-fall 0.6s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 600);
    }
}

function createClickParticles(x, y) {
    const particles = 8;
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        const angle = (i / particles) * Math.PI * 2;
        const velocity = 3 + Math.random() * 2;
        const life = 0.5 + Math.random() * 0.5;

        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            background: ${['⭐', '✨', '🎯', '🚀'][Math.floor(Math.random() * 4)]};
            font-size: 12px;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(particle);

        let px = x, py = y;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let age = 0;
        const maxAge = life * 1000;

        const animate = () => {
            age += 16;
            px += vx;
            py += vy;
            vy += 0.1; // gravity
            
            const alpha = Math.max(0, 1 - (age / maxAge));
            particle.style.opacity = alpha;
            particle.style.transform = `translate(${px - x}px, ${py - y}px) scale(${1 - age / maxAge})`;
            
            if (age < maxAge) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        animate();
    }
}

function showSecretMessage() {
    const messages = [
        '🎉 Amazing! You found the secret code! 🤖',
        '✨ Congratulations! You\'re awesome! 🚀',
        '🌟 You unlocked the Hidden Easter Egg! 🎯'
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #00d4ff, #7c3aed);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        z-index: 3000;
        animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
    `;
    modal.textContent = message;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.animation = 'popOut 0.4s ease-in forwards';
        setTimeout(() => modal.remove(), 400);
    }, 3000);
}

function addFloatingElements() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const floatingEmojis = ['🤖', '⚙️', '💻', '🔧', '🚀', '✨'];
    
    for (let i = 0; i < 10; i++) {
        const floater = document.createElement('div');
        const emoji = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
        floater.textContent = emoji;
        floater.style.cssText = `
            position: absolute;
            font-size: ${20 + Math.random() * 30}px;
            opacity: 0.1;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        heroSection.appendChild(floater);
    }
}

// Add CSS animations for fun effects
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(60px) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(10deg);
        }
    }

    @keyframes popIn {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }

    @keyframes popOut {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }

    .activity-card, .project-card, .team-card {
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
`;
document.head.appendChild(style);

// Initialize fun features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeFunFeatures();
    initializeDailyChallenge();
    addSparkleEffects();
    createMicroInteractions();
});

// ====================================
// Daily Challenge Feature
// ====================================
function initializeDailyChallenge() {
    const challenges = [
        'Can you build a robot that moves in a square? 🟦',
        'Try to program a robot to follow a red line! 📍',
        'Design a robot that can climb stairs! 🪜',
        'Create a robot that responds to sound! 🔊',
        'Build a robot that can pick up objects! 🤖',
        'Program a robot that avoids obstacles! 🚧',
        'Make a robot that draws patterns! 🎨',
        'Design a robot that sorts objects by color! 🌈'
    ];

    // Show a random challenge on page load
    if (!sessionStorage.getItem('challengeShown')) {
        setTimeout(() => {
            const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
            showDailyChallenge(randomChallenge);
            sessionStorage.setItem('challengeShown', 'true');
        }, 2000);
    }
}

function showDailyChallenge(challenge) {
    const popup = document.getElementById('funChallenge');
    if (popup) {
        document.getElementById('challengeText').textContent = challenge;
        popup.style.display = 'flex';
        popup.style.animation = 'slideInUp 0.5s ease-out';
    }
}

window.closeFunChallenge = function() {
    const popup = document.getElementById('funChallenge');
    if (popup) {
        popup.style.animation = 'slideOutDown 0.3s ease-in forwards';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
};

// ====================================
// Sparkle Effects
// ====================================
function addSparkleEffects() {
    const titles = document.querySelectorAll('h2, h3');
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            createSparkles(title);
        });
    });
}

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30;
        
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            box-shadow: 0 0 10px #ffd700;
            animation: sparkleAnimation 0.6s ease-out forwards;
        `;
        
        sparkle.style.setProperty('--angle', angle);
        sparkle.style.setProperty('--distance', distance + 'px');
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
    }
}

// ====================================
// Micro Interactions
// ====================================
function createMicroInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '';
        });
    });

    // Section scroll reveal animations
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'sectionReveal 0.8s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => sectionObserver.observe(section));

    // Add ripple effect on click to links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const rect = link.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 212, 255, 0.6);
                width: 20px;
                height: 20px;
                top: ${e.clientY - rect.top - 10}px;
                left: ${e.clientX - rect.left - 10}px;
                animation: rippleAnimation 0.6s ease-out forwards;
                pointer-events: none;
            `;
            link.style.position = 'relative';
            link.style.overflow = 'hidden';
            link.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add more CSS animations
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }

    @keyframes sparkleAnimation {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(calc(var(--distance) * cos(var(--angle))), calc(var(--distance) * sin(var(--angle)))) scale(0);
        }
    }

    @keyframes sectionReveal {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    #funChallenge {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2000;
        display: flex !important;
        align-items: center;
        justify-content: center;
    }

    .challenge-content {
        background: linear-gradient(135deg, #00d4ff, #7c3aed);
        color: white;
        padding: 2.5rem;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
        animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .challenge-content h2 {
        margin-bottom: 1rem;
        font-size: 1.8rem;
    }

    .challenge-content p {
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    }

    .challenge-content button {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid white;
        padding: 0.8rem 1.5rem;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .challenge-content button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }
`;
document.head.appendChild(additionalStyle);

// ====================================
// Console Welcome Message
// ====================================
console.log('%cWelcome to Happy Heart School Robotics Club', 'color: #00d4ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(0,212,255,0.5);');
console.log('%cEmpowering Future Innovators', 'color: #ff6b9d; font-size: 14px;');
