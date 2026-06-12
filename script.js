/**
 * STACKLY - Premium Pet Care
 * Vanilla JavaScript interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------------------------------
    // Preloader
    // -----------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(() => { preloader.style.display = 'none'; }, 500);
            }, 500);
        });
    }

    // -----------------------------------------------------------------------
    // Sticky Navbar & Active Links
    // -----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // -----------------------------------------------------------------------
    // Mobile Menu Toggle
    // -----------------------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        document.querySelectorAll('.nav-link, .nav-buttons-mobile .btn').forEach(n => {
            n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // -----------------------------------------------------------------------
    // Dark Mode Toggle
    // -----------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme  = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (dark) => {
        if (dark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    };

    applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(!isDark);
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }

    // -----------------------------------------------------------------------
    // Scroll Reveal Animations
    // -----------------------------------------------------------------------
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // -----------------------------------------------------------------------
    // Counter Animation
    // -----------------------------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target = +el.getAttribute('data-target');
                const duration = 1800;
                const step     = Math.ceil(target / (duration / 16));
                let current = 0;

                const tick = () => {
                    current = Math.min(current + step, target);
                    el.textContent = current.toLocaleString();
                    if (current < target) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // -----------------------------------------------------------------------
    // Shop Filtering & Search
    // -----------------------------------------------------------------------
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput  = document.getElementById('shop-search');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            if (searchInput) searchInput.value = '';

            productCards.forEach(card => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                if (match) {
                    card.style.opacity = '0';
                    card.style.display = 'block';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => { card.style.opacity = '1'; });
                    });
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            filterBtns.forEach(b => b.classList.remove('active'));
            const allBtn = document.querySelector('[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');

            productCards.forEach(card => {
                const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
                const match = title.includes(term);
                card.style.display = match ? 'block' : 'none';
            });
        });
    }

    // -----------------------------------------------------------------------
    // Testimonial Slider
    // -----------------------------------------------------------------------
    const slider      = document.getElementById('testimonial-slider');
    const dotsWrapper = document.getElementById('slider-dots');

    if (slider && dotsWrapper) {
        const slides = slider.querySelectorAll('.testimonial-card');
        let current  = 0;
        let autoTimer;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsWrapper.appendChild(dot);
        });

        const dots = dotsWrapper.querySelectorAll('.dot');

        const goTo = (n) => {
            current = (n + slides.length) % slides.length;
            slider.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        };

        const startAuto = () => {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 5000);
        };

        // Swipe support
        let touchStartX = 0;
        slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; });
        slider.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
            startAuto();
        });

        slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
        slider.parentElement.addEventListener('mouseleave', startAuto);

        startAuto();
    }

    // -----------------------------------------------------------------------
    // Shared form helpers
    // -----------------------------------------------------------------------
    const setErr = (input, msg) => {
        const g = input.closest('.form-group');
        if (!g) return;
        const span = g.querySelector('.error-message');
        g.classList.add('error');
        if (span) { span.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`; }
    };

    const clrErr = (input) => {
        input.closest('.form-group')?.classList.remove('error');
    };

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const NAME_RE  = /^[A-Za-z\s'\-]{2,}$/;

    // -----------------------------------------------------------------------
    // Booking Form Validation
    // -----------------------------------------------------------------------
    const bookingForm = document.getElementById('booking-form');
    const formSuccess = document.getElementById('form-success');

    if (bookingForm) {
        bookingForm.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input',  () => clrErr(el));
            el.addEventListener('change', () => clrErr(el));
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            const ownerName   = document.getElementById('ownerName');
            const petName     = document.getElementById('petName');
            const serviceType = document.getElementById('serviceType');
            const bookDate    = document.getElementById('bookingDate');
            const bookTime    = document.getElementById('bookingTime');

            if (!ownerName?.value.trim()) {
                setErr(ownerName, 'Your name is required.'); valid = false;
            } else if (!NAME_RE.test(ownerName.value.trim())) {
                setErr(ownerName, 'Name should contain only letters.'); valid = false;
            }

            if (!petName?.value.trim()) {
                setErr(petName, "Your pet's name is required."); valid = false;
            } else if (petName.value.trim().length < 2) {
                setErr(petName, 'Pet name must be at least 2 characters.'); valid = false;
            }

            if (!serviceType?.value) {
                setErr(serviceType, 'Please select a service type.'); valid = false;
            }

            if (!bookDate?.value) {
                setErr(bookDate, 'Please pick an appointment date.'); valid = false;
            } else {
                const today = new Date(); today.setHours(0,0,0,0);
                if (new Date(bookDate.value) < today) {
                    setErr(bookDate, 'Date must be today or in the future.'); valid = false;
                }
            }

            if (!bookTime?.value) {
                setErr(bookTime, 'Please pick an appointment time.'); valid = false;
            }

            if (!valid) return;

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const origText  = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitBtn.disabled  = true;

            setTimeout(() => {
                bookingForm.reset();
                submitBtn.innerHTML = origText;
                submitBtn.disabled  = false;
                bookingForm.style.display = 'none';
                if (formSuccess) formSuccess.classList.remove('hidden');
                setTimeout(() => {
                    bookingForm.style.display = 'block';
                    if (formSuccess) formSuccess.classList.add('hidden');
                }, 5000);
            }, 1500);
        });
    }

    // -----------------------------------------------------------------------
    // Contact Form Validation
    // -----------------------------------------------------------------------
    const contactMsgForm = document.getElementById('contact-msg-form');
    if (contactMsgForm) {
        contactMsgForm.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => clrErr(el));
        });

        contactMsgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            const cName    = document.getElementById('contactName');
            const cEmail   = document.getElementById('contactEmail');
            const cSubject = document.getElementById('contactSubject');
            const cMsg     = document.getElementById('contactMessage');

            if (!cName?.value.trim()) {
                setErr(cName, 'Your name is required.'); valid = false;
            } else if (!NAME_RE.test(cName.value.trim())) {
                setErr(cName, 'Name should contain only letters.'); valid = false;
            }

            if (!cEmail?.value.trim()) {
                setErr(cEmail, 'Email address is required.'); valid = false;
            } else if (!EMAIL_RE.test(cEmail.value)) {
                setErr(cEmail, 'Enter a valid email (e.g. name@example.com).'); valid = false;
            }

            if (!cSubject?.value.trim()) {
                setErr(cSubject, 'Please enter a subject.'); valid = false;
            } else if (cSubject.value.trim().length < 3) {
                setErr(cSubject, 'Subject must be at least 3 characters.'); valid = false;
            }

            if (!cMsg?.value.trim()) {
                setErr(cMsg, 'Please write your message.'); valid = false;
            } else if (cMsg.value.trim().length < 10) {
                setErr(cMsg, 'Message must be at least 10 characters.'); valid = false;
            }

            if (!valid) return;

            const btn  = contactMsgForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled  = true;

            setTimeout(() => {
                contactMsgForm.reset();
                btn.innerHTML = orig;
                btn.disabled  = false;
                showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
            }, 1500);
        });
    }

    // -----------------------------------------------------------------------
    // Login Form Validation
    // -----------------------------------------------------------------------
    const loginForm = document.querySelector('.auth-form-panel #login-form');
    if (loginForm) {
        const emailInput = loginForm.querySelector('input[type="email"]');
        const passInput  = loginForm.querySelector('input[type="password"]');
        const roleSelect = loginForm.querySelector('#loginRole');

        [emailInput, passInput].filter(Boolean).forEach(el => {
            el.addEventListener('input', () => clrErr(el));
        });
        if (roleSelect) roleSelect.addEventListener('change', () => clrErr(roleSelect));

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            if (!emailInput?.value.trim()) {
                setErr(emailInput, 'Email address is required.'); valid = false;
            } else if (!EMAIL_RE.test(emailInput.value)) {
                setErr(emailInput, 'Enter a valid email address.'); valid = false;
            }

            if (!passInput?.value) {
                setErr(passInput, 'Password is required.'); valid = false;
            } else if (passInput.value.length < 6) {
                setErr(passInput, 'Password must be at least 6 characters.'); valid = false;
            }

            if (!roleSelect?.value) {
                setErr(roleSelect, 'Please select a role to continue.'); valid = false;
            }

            if (!valid) return;

            const role  = roleSelect.value;
            const email = emailInput.value.trim();
            const dest  = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
            const label = role === 'admin' ? 'Admin Dashboard' : 'Dashboard';

            // Derive display name from email (e.g. john.doe@mail.com → John Doe)
            const namePart = email.split('@')[0].replace(/[._-]+/g, ' ');
            const displayName = namePart.replace(/\b\w/g, c => c.toUpperCase());
            const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

            sessionStorage.setItem('stacklyUser', JSON.stringify({ email, role, displayName, initials }));

            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging In...';
            btn.disabled  = true;

            setTimeout(() => {
                showToast(`Welcome back, ${displayName}! Redirecting to ${label}...`, 'success');
                setTimeout(() => { window.location.href = dest; }, 1500);
            }, 1200);
        });
    }

    // -----------------------------------------------------------------------
    // Sign Up Form Validation
    // -----------------------------------------------------------------------
    const signupForm    = document.getElementById('signup-form');
    const signupSuccess = document.getElementById('signup-success');

    if (signupForm) {
        const nameInput     = document.getElementById('signupName');
        const emailInput    = document.getElementById('signupEmail');
        const passwordInput = document.getElementById('signupPassword');
        const strengthMeter = document.getElementById('password-strength');
        const strengthBar   = strengthMeter?.querySelector('.strength-bar');
        const strengthText  = strengthMeter?.querySelector('.strength-text');

        const getStrength = (pwd) => {
            if (!pwd || pwd.length < 8) return 1;
            let s = 1;
            if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
            if (/[0-9]/.test(pwd)) s++;
            if (/[^A-Za-z0-9]/.test(pwd)) s++;
            return s;
        };

        if (passwordInput && strengthBar && strengthText) {
            passwordInput.addEventListener('input', () => {
                const s = getStrength(passwordInput.value);
                const map = [
                    { pct: 0, color: '', txt: '' },
                    { pct: 25, color: 'var(--danger-color)', txt: 'Weak' },
                    { pct: 50, color: 'var(--warning-color)', txt: 'Medium' },
                    { pct: 75, color: '#5c97ff', txt: 'Good' },
                    { pct: 100, color: 'var(--success-color)', txt: 'Strong' },
                ];
                strengthBar.style.width = map[s].pct + '%';
                strengthBar.style.backgroundColor = map[s].color;
                strengthText.textContent = map[s].txt;
                strengthText.style.color = map[s].color;
            });
        }

        [nameInput, emailInput, passwordInput].filter(Boolean).forEach(el => {
            el.addEventListener('input', () => clrErr(el));
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            if (!nameInput?.value.trim()) {
                setErr(nameInput, 'Full name is required.'); valid = false;
            } else if (!NAME_RE.test(nameInput.value.trim())) {
                setErr(nameInput, 'Name should contain only letters.'); valid = false;
            }

            if (!emailInput?.value.trim()) {
                setErr(emailInput, 'Email address is required.'); valid = false;
            } else if (!EMAIL_RE.test(emailInput.value)) {
                setErr(emailInput, 'Enter a valid email (e.g. name@example.com).'); valid = false;
            }

            if (!passwordInput?.value) {
                setErr(passwordInput, 'Password is required.'); valid = false;
            } else if (passwordInput.value.length < 8) {
                setErr(passwordInput, 'Password must be at least 8 characters.'); valid = false;
            }

            if (!valid) return;

            const btn  = signupForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            btn.disabled  = true;

            setTimeout(() => {
                signupForm.style.display = 'none';
                if (signupSuccess) signupSuccess.classList.remove('hidden');
                setTimeout(() => { window.location.href = 'client-dashboard.html'; }, 2000);
            }, 1500);
        });
    }

    // -----------------------------------------------------------------------
    // Password Toggle
    // -----------------------------------------------------------------------
    document.querySelectorAll('.password-toggle-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            if (!input) return;
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !isPass);
            icon.classList.toggle('fa-eye-slash', isPass);
        });
    });

    // -----------------------------------------------------------------------
    // FAQ Accordion
    // -----------------------------------------------------------------------
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question')?.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                const a = i.querySelector('.faq-answer');
                if (a) a.style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add('active');
                const ans = item.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
            }
        });
    });

    // -----------------------------------------------------------------------
    // Newsletter Form Validation (footer + sidebar)
    // -----------------------------------------------------------------------
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.removeAttribute('onsubmit');

        const input = form.querySelector('input[type="email"]');
        const btn   = form.querySelector('button[type="submit"]');
        if (!input || !btn) return;

        // Inject error element after input
        let errorMsg = form.querySelector('.nl-error');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'nl-error';
            input.insertAdjacentElement('afterend', errorMsg);
        }

        const showError = (msg) => {
            input.classList.add('nl-input-error');
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
            input.focus();
        };

        const clearError = () => {
            input.classList.remove('nl-input-error');
            errorMsg.style.display = 'none';
            errorMsg.textContent  = '';
        };

        input.addEventListener('input', clearError);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();

            const val   = input.value.trim();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

            if (!val) {
                showError('Please enter your email address.'); return;
            }
            if (!valid) {
                showError('Please enter a valid email (e.g. name@example.com).'); return;
            }

            // Loading state
            const origHTML        = btn.innerHTML;
            btn.innerHTML         = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            btn.disabled          = true;
            input.disabled        = true;

            setTimeout(() => {
                form.reset();
                clearError();
                btn.innerHTML         = '<i class="fas fa-check"></i> Subscribed!';
                btn.style.background  = 'var(--success-color)';
                btn.style.boxShadow   = '0 6px 18px rgba(34,197,94,0.35)';

                showToast('You\'re subscribed! Pet care tips coming your way.', 'success');

                setTimeout(() => {
                    btn.innerHTML        = origHTML;
                    btn.style.background = '';
                    btn.style.boxShadow  = '';
                    btn.disabled         = false;
                    input.disabled       = false;
                }, 3000);
            }, 1200);
        });
    });

    // -----------------------------------------------------------------------
    // Back to Top
    // -----------------------------------------------------------------------
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.classList.toggle('show', window.scrollY > 500);
        });
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -----------------------------------------------------------------------
    // Toast Notification
    // -----------------------------------------------------------------------
    window.showToast = (message, type = 'success') => {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                z-index: 99999; display: flex; flex-direction: column; gap: 10px;
                align-items: center; pointer-events: none;
            `;
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        const bg = type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)';
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

        toast.style.cssText = `
            background: ${bg}; color: white; padding: 14px 24px; border-radius: 50px;
            font-family: var(--font-body); font-weight: 600; font-size: 0.9rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2); display: flex; align-items: center;
            gap: 10px; pointer-events: auto; opacity: 0; transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // -----------------------------------------------------------------------
    // Donut Chart Animation (dashboard)
    // -----------------------------------------------------------------------
    document.querySelectorAll('.donut-fill').forEach(el => {
        const pct    = parseFloat(el.getAttribute('data-pct') || 0);
        const offset = 283 - (283 * pct / 100);
        el.style.setProperty('--offset', offset);
        setTimeout(() => { el.style.strokeDashoffset = offset; }, 300);
    });

    // -----------------------------------------------------------------------
    // Chart Bars Animation (dashboard)
    // -----------------------------------------------------------------------
    document.querySelectorAll('.chart-bar').forEach(bar => {
        const h = bar.getAttribute('data-height') || '0%';
        bar.style.height = '0';
        setTimeout(() => { bar.style.height = h; }, 400);
    });

    // -----------------------------------------------------------------------
    // Dashboard Sidebar Toggle (mobile)
    // -----------------------------------------------------------------------
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose  = document.getElementById('sidebar-close');
    const dashSidebar   = document.getElementById('dashboard-sidebar');
    if (sidebarToggle && dashSidebar) {
        sidebarToggle.addEventListener('click', () => {
            dashSidebar.classList.toggle('open');
        });
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                dashSidebar.classList.remove('open');
            });
        }
        document.addEventListener('click', (e) => {
            if (!dashSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                dashSidebar.classList.remove('open');
            }
        });
    }

    // -----------------------------------------------------------------------
    // Dashboard Tab Switching
    // -----------------------------------------------------------------------
    document.querySelectorAll('[data-tab-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab-target');
            document.querySelectorAll('[data-tab-target]').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

});
