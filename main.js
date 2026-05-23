// 1. Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// 2. Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium smooth easing curve
    smoothWheel: true,
    wheelMultiplier: 1.1,
});

// 3. Update ScrollTrigger whenever the user scrolls
lenis.on('scroll', ScrollTrigger.update);

// 4. Hook Lenis into GSAP's ticker so they frame-sync perfectly
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// 5. Tell GSAP not to throttle animations while scrolling
gsap.ticker.lagSmoothing(0);

// ==========================================
// Accessibility & Motion Preferences Check
// ==========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = window.matchMedia('(hover: hover)').matches;

// ==========================================
// Pre-processing Text Content (Word-by-word reveal setup)
// ==========================================
const aboutTextEl = document.querySelector('.about-text');
if (aboutTextEl) {
    const text = aboutTextEl.textContent.trim();
    const words = text.split(/\s+/);
    aboutTextEl.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
}

// ==========================================
// Page Load Entrance Animations
// ==========================================
const entranceTimeline = gsap.timeline({
    defaults: { ease: "power4.out" }
});

if (!prefersReducedMotion) {
    entranceTimeline
        .fromTo(".hero-title", 
            { opacity: 0, y: 50, scale: 0.96, filter: "blur(12px)" }, 
            { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.4 }
        )
        .fromTo(".hero-subtitle",
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 1.0 },
            "-=0.9" // overlaps with title
        )
        .fromTo(".header",
            { opacity: 0, y: -25 },
            { opacity: 1, y: 0, duration: 0.8 },
            "-=0.7"
        );
} else {
    // If user prefers reduced motion, display content immediately
    gsap.set([".hero-title", ".hero-subtitle", ".header"], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
}

// ==========================================
// Scroll Trigger Animations
// ==========================================

// --- Hero Background Zoom Out ---
if (!prefersReducedMotion) {
    gsap.to(".hero-bg", {
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });
} else {
    gsap.set(".hero-bg", { scale: 1 });
}

// --- Hero Content Fade & Scale Away ---
if (!prefersReducedMotion) {
    gsap.fromTo(".hero-content", 
        { opacity: 1, scale: 1 },
        {
            opacity: 0,
            scale: 0.85,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "30% top",
                end: "80% top",
                scrub: true
            }
        }
    );
}

// --- Stacking Project Cards Animation ---
if (!prefersReducedMotion) {
    const cards = gsap.utils.toArray(".project-card");
    cards.forEach((card, index) => {
        if (index < cards.length - 1) {
            gsap.to(card, {
                scale: 0.9,
                opacity: 0.5,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: card,
                    start: "top 15%",
                    endTrigger: cards[index + 1],
                    end: "top 15%",
                    scrub: true
                }
            });
        }
    });
}

// --- Card Scroll-Driven Reveal Animation ---
const projectCardsElements = document.querySelectorAll('.project-card');
projectCardsElements.forEach(card => {
    if (!prefersReducedMotion) {
        gsap.fromTo(card,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    } else {
        gsap.set(card, { opacity: 1, y: 0 });
    }
});

// --- About Section Word-by-Word Reveal ---
const aboutSpans = document.querySelectorAll('.about-text span');
if (aboutSpans.length > 0) {
    if (!prefersReducedMotion) {
        gsap.to(aboutSpans, {
            color: '#ffffff',
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 80%',
                end: 'bottom 55%',
                scrub: true
            }
        });
    } else {
        gsap.set(aboutSpans, { color: '#ffffff' });
    }
}

// --- Timeline Progress Line Animation ---
if (!prefersReducedMotion) {
    gsap.to('.timeline-progress-line', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 65%',
            end: 'bottom 65%',
            scrub: true
        }
    });
} else {
    gsap.set('.timeline-progress-line', { scaleY: 1 });
}

// --- Timeline Item Active Class Toggle ---
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        end: 'bottom 35%',
        toggleClass: 'active-item'
    });
});

// ==========================================
// Interactive Elements (Spotlight, Magnetic)
// ==========================================
if (hasHover) {
    // --- Project Card Spotlight Move ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // --- Proximity Magnetic Hover Physics ---
    const magneticTargets = document.querySelectorAll('.magnetic-target');
    magneticTargets.forEach(target => {
        let originalCenter = null;
        
        target.addEventListener('mouseenter', () => {
            const rect = target.getBoundingClientRect();
            originalCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });
        
        target.addEventListener('mousemove', (e) => {
            if (!originalCenter) return;
            
            const deltaX = e.clientX - originalCenter.x;
            const deltaY = e.clientY - originalCenter.y;
            
            gsap.to(target, {
                x: deltaX * 0.35,
                y: deltaY * 0.35,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        target.addEventListener('mouseleave', () => {
            originalCenter = null;
            gsap.to(target, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// ==========================================
// Header Scroll Styling & Active Links
// ==========================================
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Shrinking and darkening header on scroll
lenis.on('scroll', (e) => {
    if (e.scroll > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
    
    // Remove active highlight from all nav links when user is in the hero section
    if (e.scroll < 200) {
        navLinks.forEach(link => link.classList.remove('active'));
    }
});

// IntersectionObserver for tracking current visible section
const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // Matches center scroll window
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// ==========================================
// Local Clock (Timezone Locked: Manila / PHT)
// ==========================================
function updateLocalTime() {
    const timeElement = document.getElementById('local-time');
    if (!timeElement) return;
    
    const now = new Date();
    const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    timeElement.textContent = `${formatter.format(now)} PHT`;
}
updateLocalTime();
setInterval(updateLocalTime, 1000);
