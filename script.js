/**
 * Petale și Poveste - Core Interactive Script
 * High Performance & Tactile Motion Architecture
 * Targets: INP < 200ms, Main Thread Idle, smooth 60fps renders
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Throttling Helper (16ms limits for 60fps scrolling/mousemove animations)
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    // 3. Navigation Scrolling & Parallax Hero
    const navbar = document.getElementById('navbar');
    const parallaxHero = document.getElementById('parallaxHero');
    const hasHero = !!document.querySelector('.hero');
    const isAdmin = window.location.pathname.includes('admin.html');
    const PARALLAX_SPEED = 0.3;

    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        
        // Parallax image shift (transform3d uses GPU acceleration)
        if (parallaxHero && scrolled < window.innerHeight) {
            parallaxHero.style.transform = `translate3d(0, ${scrolled * PARALLAX_SPEED}px, 0)`;
        }
        
        // Sticky glass navbar effect
        if (navbar) {
            // Apply scrolled class if:
            // 1. User has scrolled down > 50px
            // 2. We are on a page without a dark hero (subpages)
            // 3. We are on the admin page
            if (scrolled > 50 || !hasHero || isAdmin) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
    handleScroll(); // Trigger initially

    // 4. Hamburger Menu Mobile Overlay
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('navOverlay');

    if (hamburger && navOverlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navOverlay.classList.toggle('active');
        });

        // Close menu when clicking overlay links
        navOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navOverlay.classList.remove('active');
            });
        });
    }

    // 5. High Performance Custom Cursor
    const cursor = document.getElementById('cursor');
    const CURSOR_LAG = 0.15;

    if (cursor && !window.matchMedia("(pointer: coarse)").matches) {
        document.documentElement.classList.add('has-custom-cursor');
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('mousemove', throttle(onMouseMove, 16), { passive: true });

        const animateCursor = () => {
            let dx = mouseX - cursorX;
            let dy = mouseY - cursorY;
            cursorX += dx * CURSOR_LAG;
            cursorY += dy * CURSOR_LAG;
            
            // translate3d bypasses layout re-flows
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);
    }

    // 6. Reveal-on-Scroll Logic (Using IntersectionObserver for best performance)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 7. Light / Dark Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    const updateThemeIcon = (theme) => {
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.setAttribute('data-lucide', 'sun');
            } else {
                themeIcon.setAttribute('data-lucide', 'moon');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    // Initial sync
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcon(initialTheme);

    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    };

    themeToggle?.addEventListener('click', toggleTheme);

    // Sync with OS preferences changes in real time
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                const nextTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', nextTheme);
                updateThemeIcon(nextTheme);
            }
        });

    // 8. Bouquet Builder Widget Interactive Logic
    const choiceBtns = document.querySelectorAll('.choice-btn');
    const builderTotalPrice = document.getElementById('builderTotalPrice');
    
    // SVG layers
    const layerFlower1 = document.getElementById('layerFlower1');
    const layerFlower2 = document.getElementById('layerFlower2');
    const layerFlowerAccent = document.getElementById('layerFlowerAccent');
    const layerFoliage = document.getElementById('layerFoliage');
    const wrappingPath = document.getElementById('wrappingPath');

    const updateBuilderMockup = () => {
        // Collect current selections
        const activeButtons = document.querySelectorAll('.choice-btn.active');
        let total = 0;
        let selections = {
            style: 'classic',
            flower: 'roses',
            accent: 'eucalyptus',
            wrapping: 'kraft'
        };

        activeButtons.forEach(btn => {
            const step = btn.getAttribute('data-step');
            const val = btn.getAttribute('data-val');
            const price = parseInt(btn.getAttribute('data-price') || '0');
            
            selections[step] = val;
            total += price;
        });

        // 1. Flowers layers toggle
        if (selections.flower === 'roses') {
            if(layerFlower1) { layerFlower1.style.opacity = '1'; layerFlower1.style.transform = 'scale(1)'; }
            if(layerFlower2) { layerFlower2.style.opacity = '0'; layerFlower2.style.transform = 'scale(0.8)'; }
        } else if (selections.flower === 'peonies') {
            if(layerFlower1) { layerFlower1.style.opacity = '0'; layerFlower1.style.transform = 'scale(0.8)'; }
            if(layerFlower2) { layerFlower2.style.opacity = '1'; layerFlower2.style.transform = 'scale(1)'; }
        } else { // Mixed
            if(layerFlower1) { layerFlower1.style.opacity = '1'; layerFlower1.style.transform = 'scale(0.9)'; }
            if(layerFlower2) { layerFlower2.style.opacity = '1'; layerFlower2.style.transform = 'scale(0.9)'; }
        }

        // 2. Accents foliage layers toggle
        if (selections.accent === 'eucalyptus') {
            if(layerFoliage) layerFoliage.style.opacity = '1';
            if(layerFlowerAccent) { layerFlowerAccent.style.opacity = '0'; layerFlowerAccent.style.transform = 'translateY(10px)'; }
        } else if (selections.accent === 'lavender') {
            if(layerFoliage) layerFoliage.style.opacity = '0';
            if(layerFlowerAccent) { layerFlowerAccent.style.opacity = '1'; layerFlowerAccent.style.transform = 'translateY(0)'; }
        } else { // Both
            if(layerFoliage) layerFoliage.style.opacity = '0.9';
            if(layerFlowerAccent) { layerFlowerAccent.style.opacity = '0.9'; layerFlowerAccent.style.transform = 'translateY(0)'; }
        }

        // 3. Wrapping Color Fill Change
        const activeWrapBtn = document.querySelector('.choice-btn[data-step="wrapping"].active');
        if (activeWrapBtn && wrappingPath) {
            const colorCode = activeWrapBtn.getAttribute('data-color');
            wrappingPath.setAttribute('fill', colorCode);
        }

        // Update price text
        if (builderTotalPrice) {
            builderTotalPrice.textContent = `${total} RON`;
        }

        return { total, selections };
    };

    // Button choice clicks
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.getAttribute('data-step');
            
            // Remove active from step sibling buttons
            document.querySelectorAll(`.choice-btn[data-step="${step}"]`).forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            // Re-render
            updateBuilderMockup();
        });
    });

    // Initial render call
    if (choiceBtns.length > 0) {
        updateBuilderMockup();
    }

    // Modal success drawer handles
    const btnOrderBouquet = document.getElementById('btnOrderBouquet');
    const builderSuccessModal = document.getElementById('builderSuccessModal');
    const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');
    const btnConfirmWhatsAppOrder = document.getElementById('btnConfirmWhatsAppOrder');
    const builderSuccessText = document.getElementById('builderSuccessText');
    const builderSuccessPrice = document.getElementById('builderSuccessPrice');

    const handleBouquetSubmit = () => {
        const data = updateBuilderMockup();
        
        // Construct Romanian summary text
        let summary = `Rezumat Buchet Personalizat:\n`;
        const wrapName = document.querySelector('.choice-btn[data-step="wrapping"].active span').textContent;
        const flowerName = document.querySelector('.choice-btn[data-step="flower"].active span').textContent;
        const styleName = document.querySelector('.choice-btn[data-step="style"].active span').textContent;
        const accentName = document.querySelector('.choice-btn[data-step="accent"].active span').textContent;

        summary += `- Stil: ${styleName}\n- Flori Principale: ${flowerName}\n- Elemente Accent: ${accentName}\n- Ambalaj: ${wrapName}\nCost Estimativ: ${data.total} RON.`;

        if (builderSuccessText) {
            builderSuccessText.textContent = `Ai personalizat un buchet ${styleName.toLowerCase()} cu ${flowerName.toLowerCase()} și elemente de ${accentName.toLowerCase()}, aranjat în ambalaj tip ${wrapName.toLowerCase()}.`;
        }
        if (builderSuccessPrice) {
            builderSuccessPrice.textContent = `${data.total} RON`;
        }

        // Setup WhatsApp Direct Link
        const waLink = `https://wa.me/40700000000?text=${encodeURIComponent(`Bună ziua! Mi-am creat un buchet personalizat pe site:\n\n${summary}`)}`;
        if (btnConfirmWhatsAppOrder) {
            btnConfirmWhatsAppOrder.href = waLink;
        }

        // Log this order/request in localStorage for admin panel demo
        const saveToAdminInbox = () => {
            const currentLogs = JSON.parse(localStorage.getItem('admin_messages') || '[]');
            const newOrder = {
                id: Date.now(),
                sender: 'Client personalizare buchet',
                email: 'client-custom-builder@demo.com',
                text: summary.replace(/\n/g, '<br>'),
                timestamp: new Date().toLocaleTimeString('ro-RO') + ' ' + new Date().toLocaleDateString('ro-RO'),
                status: 'Pending'
            };
            currentLogs.unshift(newOrder);
            localStorage.setItem('admin_messages', JSON.stringify(currentLogs));
            
            // Dispatch event to sync immediately if other tabs are open
            window.dispatchEvent(new Event('storage'));
        };

        // Bind logging to WhatsApp button and open modal
        btnConfirmWhatsAppOrder?.addEventListener('click', saveToAdminInbox);
        
        if (builderSuccessModal) {
            builderSuccessModal.classList.add('active');
        }
    };

    btnOrderBouquet?.addEventListener('click', handleBouquetSubmit);
    btnCloseSuccessModal?.addEventListener('click', () => builderSuccessModal.classList.remove('active'));

    // 9. Virtual Consultation Quiz State Logic
    let currentStep = 1;
    let quizAnswers = {
        occasion: '',
        mood: '',
        budget: ''
    };

    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizBar = document.getElementById('quizBar');
    const quizResultTitle = document.getElementById('quizResultTitle');
    const quizResultDesc = document.getElementById('quizResultDesc');
    const quizResultPrice = document.getElementById('quizResultPrice');
    const quizResultImg = document.getElementById('quizResultImg');
    const btnOrderQuizResult = document.getElementById('btnOrderQuizResult');
    const btnRestartQuiz = document.getElementById('btnRestartQuiz');

    const updateQuizProgress = () => {
        if(quizBar) {
            const pct = ((currentStep - 1) / 3) * 100;
            quizBar.style.width = `${pct}%`;
        }
    };

    const displayQuizStep = (step) => {
        quizSteps.forEach(s => s.classList.remove('active'));
        const nextStepEl = document.querySelector(`.quiz-step[data-step="${step}"]`) || document.getElementById('quizResults');
        if(nextStepEl) {
            nextStepEl.classList.add('active');
        }
        updateQuizProgress();
    };

    const generateQuizRecommendation = () => {
        let recommendation = {
            title: 'Buchetul „Poezie în Roz”',
            desc: 'Un buchet bogat în trandafiri pastel, flori de câmp delicate și crenguțe de eucalipt proaspăt. Perfect pentru a transmite afecțiune și rafinament.',
            price: 280,
            img: 'imgs/service-1.png'
        };

        if (quizAnswers.occasion === 'wedding' || quizAnswers.mood === 'elegance') {
            recommendation = {
                title: 'Aranjament Regal cu Bujori & Peonii',
                desc: 'O creație florală fastuoasă în nuanțe reci alb-violet, asamblată pe structură asimetrică elegantă. Reprezintă luxul discret și admirația profundă.',
                price: 480,
                img: 'imgs/service-2.png'
            };
        } else if (quizAnswers.occasion === 'sorry' || quizAnswers.mood === 'calm') {
            recommendation = {
                title: 'Buchet „Armonie & Pace”',
                desc: 'O selecție liniștitoare de hortensii albe, lavandă aromată din Transilvania și frunze fine de in, aducând calm în orice cămin.',
                price: 220,
                img: 'imgs/service-3.png'
            };
        } else if (quizAnswers.budget === 'budget') {
            recommendation = {
                title: 'Buchet Boutique „Gând Spontan”',
                desc: 'Un buchet cochet format din flori locale proaspete recoltate în dimineața comenzi, însoțit de cartonaș caligrafiat manual.',
                price: 180,
                img: 'imgs/service-1.png'
            };
        }

        // Apply visual updates
        if(quizResultTitle) quizResultTitle.textContent = recommendation.title;
        if(quizResultDesc) quizResultDesc.textContent = recommendation.desc;
        if(quizResultPrice) quizResultPrice.textContent = `${recommendation.price} RON`;
        if(quizResultImg) quizResultImg.src = recommendation.img;

        // Set WhatsApp ordering pre-fill
        const summary = `Quiz Rezultat Recomandat: „${recommendation.title}” (${recommendation.price} RON).\nOcazie selectată: ${quizAnswers.occasion}, Mood dorit: ${quizAnswers.mood}, Buget: ${quizAnswers.budget}.`;
        const waLink = `https://wa.me/40700000000?text=${encodeURIComponent(`Bună ziua! Am realizat chestionarul de pe site și recomandarea mea este ${recommendation.title}. Doresc să plasez o comandă:\n\n${summary}`)}`;
        if(btnOrderQuizResult) btnOrderQuizResult.href = waLink;

        // Automatically log this calculation demo in admin dashboard
        const currentLogs = JSON.parse(localStorage.getItem('admin_messages') || '[]');
        const newMsg = {
            id: Date.now(),
            sender: 'Recomandare Chestionar Virtual',
            email: 'client-quiz@demo.com',
            text: summary.replace(/\n/g, '<br>'),
            timestamp: new Date().toLocaleTimeString('ro-RO') + ' ' + new Date().toLocaleDateString('ro-RO'),
            status: 'Pending'
        };
        currentLogs.unshift(newMsg);
        localStorage.setItem('admin_messages', JSON.stringify(currentLogs));
        window.dispatchEvent(new Event('storage'));
    };

    // Attach click listeners to quiz option elements
    document.querySelectorAll('.quiz-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            const stepEl = opt.closest('.quiz-step');
            const step = parseInt(stepEl.getAttribute('data-step'));
            const ans = opt.getAttribute('data-ans');

            // Highlight choice
            stepEl.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            if (step === 1) {
                quizAnswers.occasion = ans;
                currentStep = 2;
                setTimeout(() => displayQuizStep(2), 250);
            } else if (step === 2) {
                quizAnswers.mood = ans;
                currentStep = 3;
                setTimeout(() => displayQuizStep(3), 250);
            } else if (step === 3) {
                quizAnswers.budget = ans;
                currentStep = 4;
                generateQuizRecommendation();
                setTimeout(() => displayQuizStep(4), 250);
            }
        });
    });

    btnRestartQuiz?.addEventListener('click', () => {
        currentStep = 1;
        quizAnswers = { occasion: '', mood: '', budget: '' };
        document.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('active'));
        displayQuizStep(1);
    });

    // 10. Testimonials Carousel Transitions
    const testimonialTrack = document.getElementById('testimonialTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const btnPrevTestimonial = document.getElementById('btnPrevTestimonial');
    const btnNextTestimonial = document.getElementById('btnNextTestimonial');
    
    if (testimonialTrack && slides.length > 0) {
        let currentSlideIndex = 0;
        const totalSlides = slides.length;

        const updateSlidePosition = () => {
            // Using translate3d triggers hardware graphics units directly
            testimonialTrack.style.transform = `translate3d(${-currentSlideIndex * 100}%, 0, 0)`;
        };

        btnNextTestimonial?.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            updateSlidePosition();
        });

        btnPrevTestimonial?.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            updateSlidePosition();
        });
    }

    // 11. Florist Live Chat Drawer Widget
    const btnToggleChat = document.getElementById('btnToggleChat');
    const chatWindow = document.getElementById('chatWindow');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    btnToggleChat?.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });

    chatForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Append User bubble
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.textContent = text;
        chatBody.appendChild(userBubble);
        
        // Clear input
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // 2. Wait 1.5s, then append simulated florist responsive answer
        setTimeout(() => {
            const botBubble = document.createElement('div');
            botBubble.className = 'chat-bubble florist';
            
            let replyText = "Mulțumesc pentru mesaj! Voi citi solicitarea ta imediat ce eliberez masa de montaj. 😊";
            if (text.toLowerCase().includes('pret') || text.toLowerCase().includes('cost')) {
                replyText = "Prețurile noastre încep de la 180 RON pentru buchete boutique, iar pentru aranjamente personalizate îți sugerez să încerci simulatorul nostru de preț din site!";
            } else if (text.toLowerCase().includes('nunta') || text.toLowerCase().includes('eveniment')) {
                replyText = "Felicitări pentru eveniment! Organizăm scenografii complete. Te rog să ne trimiți detaliile în pagina de Contact sau să ne contactezi direct pe WhatsApp pentru a stabili o consultanță gratuită.";
            }

            botBubble.textContent = replyText;
            chatBody.appendChild(botBubble);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1200);
    });
});
