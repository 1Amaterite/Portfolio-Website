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
// 6. Scroll Trigger Animations
// ==========================================

// --- Hero Background Zoom Out ---
gsap.to(".hero-bg", {
    scale: 1,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom bottom",
        scrub: true // Link animation progress directly to scroll distance
    }
});

// --- Hero Content Fade & Scale Away ---
gsap.fromTo(".hero-content", 
    { opacity: 1, scale: 1 },
    {
        opacity: 0,
        scale: 0.85,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "30% top", // Begins fading 30% into the scroll
            end: "80% top",   // Fully faded by 80% scroll
            scrub: true
        }
    }
);

// --- Stacking Project Cards Animation ---
const cards = gsap.utils.toArray(".project-card");
cards.forEach((card, index) => {
    // Only animate cards that will have a card stacking on top of them (cards 0 and 1)
    if (index < cards.length - 1) {
        gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: card,
                // Start animation when the card hits its sticky position (15vh from viewport top)
                start: "top 15%",
                // End animation when the NEXT card reaches its sticky point
                endTrigger: cards[index + 1],
                startTrigger: card,
                end: "top 15%",
                scrub: true
            }
        });
    }
});
