let DATA = {};

function h(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
        Object.entries(attrs).forEach(function (_a) {
            var k = _a[0], v = _a[1];
            if (k === 'className') { el.className = v; }
            else if (k === 'innerHTML') { el.innerHTML = v; }
            else if (k.startsWith('on')) { el.addEventListener(k.slice(2).toLowerCase(), v); }
            else { el.setAttribute(k, v); }
        });
    }
    if (children) {
        if (typeof children === 'string') { el.innerHTML = children; }
        else { children.forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }); }
    }
    return el;
}

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

// ─── Render ───

function renderSidebar() {
    var p = DATA.personal;
    $('.sidebar-header').innerHTML =
        '<div class="avatar">' + p.initials + '</div>' +
        '<h3>' + p.shortName + '</h3>' +
        '<span class="badge">' + p.badge + '</span>';

    var navHtml = '';
    DATA.nav.forEach(function (n) {
        navHtml += '<li><a href="#' + n.id + '" class="nav-link" data-section="' + n.id + '"><i class="' + n.icon + '"></i> ' + n.label + '</a></li>';
    });
    document.getElementById('navLinks').innerHTML = navHtml;

    var socialHtml = '';
    p.socials.forEach(function (s) {
        socialHtml += '<a href="' + s.url + '" target="_blank" rel="noopener"><i class="' + s.icon + '"></i></a>';
    });
    document.getElementById('socialLinks').innerHTML = socialHtml;
}

function renderHero() {
    var p = DATA.personal;
    $('.hero-greeting').textContent = p.heroGreeting;
    $('.hero-title').innerHTML = p.name.replace(' ', '<br>');
}

function renderAbout() {
    var p = DATA.personal;
    var statsHtml = '';
    p.stats.forEach(function (s) {
        statsHtml += '<div class="stat"><span class="stat-number" data-target="' + s.target + '" data-suffix="' + s.suffix + '">0</span><span class="stat-label">' + s.label + '</span></div>';
    });
    var aboutHtml = '';
    p.aboutParagraphs.forEach(function (para) { aboutHtml += '<p>' + para + '</p>'; });

    return h('section', { id: 'about', className: 'section' }, [
        h('div', { className: 'container' }, [
            h('h2', { className: 'section-title', innerHTML: '<span class="accent">About</span> Me' }),
            h('div', { className: 'about-grid' }, [
                h('div', { className: 'about-image' }, [
                    h('div', { className: 'about-image-placeholder' }, [
                        h('i', { className: 'fas fa-robot' })
                    ])
                ]),
                h('div', { className: 'about-text', innerHTML: aboutHtml + '<div class="about-stats">' + statsHtml + '</div>' })
            ])
        ])
    ]);
}

function renderSkills() {
    var cards = '';
    DATA.skills.forEach(function (s) {
        cards += '<div class="skill-card fade-in"><i class="' + s.icon + ' skill-icon"></i><h4>' + s.name + '</h4><div class="skill-bar"><div class="skill-progress" style="width: 0"></div></div></div>';
    });
    return h('section', { id: 'skills', className: 'section section-alt' }, [
        h('div', { className: 'container' }, [
            h('h2', { className: 'section-title', innerHTML: 'Tech <span class="accent">Stack</span>' }),
            h('div', { className: 'skills-grid', innerHTML: cards })
        ])
    ]);
}

function renderTimelineItems(items, titleField, subtitleField, extraField) {
    var html = '';
    items.forEach(function (item, i) {
        var tagsHtml = '';
        if (item.tags && item.tags.length) {
            tagsHtml = '<div class="timeline-tags">' + item.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>';
        }
        var extra = '';
        if (item[extraField]) { extra = '<p>' + item[extraField] + '</p>'; }
        html += '<div class="timeline-item fade-in">' +
            '<div class="timeline-dot"></div>' +
            '<div class="timeline-content">' +
            '<span class="timeline-date">' + item.period + '</span>' +
            '<h3>' + item[titleField] + '</h3>' +
            '<p class="timeline-org">' + item[subtitleField] + '</p>' +
            '<p>' + item.description + '</p>' +
            extra +
            tagsHtml +
            '</div></div>';
    });
    return html;
}

function renderExperience() {
    return h('section', { id: 'experience', className: 'section' }, [
        h('div', { className: 'container' }, [
            h('h2', { className: 'section-title', innerHTML: 'Work <span class="accent">Experience</span>' }),
            h('div', { className: 'timeline', innerHTML: renderTimelineItems(DATA.experience, 'role', 'company', 'location') })
        ])
    ]);
}

function renderEducation() {
    return h('section', { id: 'education', className: 'section section-alt' }, [
        h('div', { className: 'container' }, [
            h('h2', { className: 'section-title', innerHTML: '<span class="accent">Education</span>' }),
            h('div', { className: 'timeline', innerHTML: renderTimelineItems(DATA.education, 'degree', 'institution', 'gpa') })
        ])
    ]);
}

function renderProjects(filter) {
    var filtered = DATA.projects;
    if (filter && filter !== 'all') {
        filtered = DATA.projects.filter(function (p) { return p.category === filter; });
    }

    var cats = ['all'];
    DATA.projects.forEach(function (p) {
        if (cats.indexOf(p.category) === -1) { cats.push(p.category); }
    });

    var filterHtml = '<div class="project-filters">';
    cats.forEach(function (c) {
        var active = (c === (filter || 'all')) ? ' active' : '';
        filterHtml += '<button class="filter-btn' + active + '" data-category="' + c + '">' + c + '</button>';
    });
    filterHtml += '</div>';

    var gridHtml = '<div class="projects-grid">';
    filtered.forEach(function (p) {
        gridHtml += '<div class="project-card fade-in"><div class="project-header"><i class="' + p.icon + ' project-icon"></i><span class="project-tag">' + p.category + '</span></div><h3>' + p.title + '</h3><p>' + p.description + '</p><div class="project-footer"><a href="' + p.github + '" target="_blank" rel="noopener"><i class="fab fa-github"></i> View Code</a></div></div>';
    });
    gridHtml += '</div>';

    return h('section', { id: 'projects', className: 'section' }, [
        h('div', { className: 'container' }, [
            h('h2', { className: 'section-title', innerHTML: 'Featured <span class="accent">Projects</span>' }),
            h('div', { innerHTML: filterHtml + gridHtml })
        ])
    ]);
}

function renderCertifications() {
    var html = '';
    DATA.certifications.forEach(function (c) {
        html += '<div class="cert-card fade-in"><i class="' + c.icon + ' cert-icon"></i><h4>' + c.name + '</h4><p>' + c.issuer + '</p></div>';
    });
    return h('section', { id: 'certifications', className: 'section section-alt' }, [
        h('div', { className: 'container' }, [
            h('h2', { className: 'section-title', innerHTML: '<span class="accent">Certifications</span>' }),
            h('div', { className: 'certs-grid', innerHTML: html })
        ])
    ]);
}

function renderContact() {
    var c = DATA.personal.contact;
    return h('section', { id: 'contact', className: 'section' }, [
        h('div', { className: 'container' }, [
            h('h2', { className: 'section-title', innerHTML: 'Get In <span class="accent">Touch</span>' }),
            h('div', { className: 'contact-grid' }, [
                h('div', { className: 'contact-info', innerHTML:
                    '<div class="contact-item"><i class="fas fa-map-marker-alt"></i><div><h4>Location</h4><p>' + c.location + '</p></div></div>' +
                    '<div class="contact-item"><i class="fas fa-envelope"></i><div><h4>Email</h4><a href="mailto:' + c.email + '">' + c.email + '</a></div></div>' +
                    '<div class="contact-item"><i class="fas fa-phone"></i><div><h4>Phone</h4><a href="tel:' + c.phone + '">' + c.phone + '</a></div></div>' +
                    '<div class="contact-item"><i class="fab fa-linkedin"></i><div><h4>LinkedIn</h4><a href="' + c.linkedin + '" target="_blank" rel="noopener">' + c.linkedin.replace('https://', '') + '</a></div></div>' +
                    '<div class="contact-item"><i class="fab fa-github"></i><div><h4>GitHub</h4><a href="' + c.github + '" target="_blank" rel="noopener">' + c.github.replace('https://', '') + '</a></div></div>'
                }),
                h('form', { className: 'contact-form', id: 'contactForm' }, [
                    h('div', { className: 'form-group' }, [h('input', { type: 'text', id: 'name', placeholder: 'Your Name', required: '' })]),
                    h('div', { className: 'form-group' }, [h('input', { type: 'email', id: 'email', placeholder: 'Your Email', required: '' })]),
                    h('div', { className: 'form-group' }, [h('textarea', { id: 'message', rows: '5', placeholder: 'Your Message', required: '' })]),
                    h('button', { type: 'submit', className: 'btn btn-primary', innerHTML: 'Send Message <i class="fas fa-paper-plane"></i>' })
                ])
            ])
        ])
    ]);
}

function renderFooter() {
    var year = new Date().getFullYear();
    $('#footer p').innerHTML = '&copy; ' + year + ' ' + DATA.personal.name + '. Built with <i class="fas fa-heart" style="color: #f85149;"></i> and AI';
}

// ─── App ───

function initApp() {
    renderSidebar();
    renderHero();

    var container = document.getElementById('dynamic-sections');
    [renderAbout, renderSkills, renderExperience, renderEducation, function () { return renderProjects('all'); }, renderCertifications, renderContact].forEach(function (fn) {
        container.appendChild(fn());
    });
    renderFooter();

    setupNav();
    setupHamburger();
    setupTyping();
    setupScrollAnimations();
    setupCounters();
    setupProjectFilters();
    setupContactForm();
    setupSmoothScroll();
    updateActiveLink();
}

// ─── Interactions ───

function setupHamburger() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('navOverlay');
    var hamburger = document.getElementById('hamburger');
    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener('click', function () { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); });
        overlay.addEventListener('click', function () { sidebar.classList.remove('open'); overlay.classList.remove('active'); });
    }
}

function setupNav() {
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
        link.addEventListener('click', function () {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('navOverlay').classList.remove('active');
        });
    });

    // Hero buttons
    $$('.hero-actions .btn[data-target]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.getElementById(this.getAttribute('data-target'));
            if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}

function setupTyping() {
    var words = DATA.personal.heroTypedWords;
    var typedText = $('.typed-text');
    var cursor = $('.cursor');
    if (!typedText || !cursor) return;

    var wordIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        var currentWord = words[wordIndex];
        if (isDeleting) {
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        var speed = isDeleting ? 40 : 80;
        if (!isDeleting && charIndex === currentWord.length) { speed = 2000; isDeleting = true; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; speed = 500; }
        setTimeout(typeEffect, speed);
    }
    setTimeout(typeEffect, 1000);
}

function setupScrollAnimations() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate skill bars inside visible section
                entry.target.querySelectorAll('.skill-progress').forEach(function (bar) {
                    var parent = bar.closest('.skill-card');
                    if (parent) {
                        var idx = Array.from(parent.parentNode.children).indexOf(parent);
                        var level = DATA.skills[idx] ? DATA.skills[idx].level : 0;
                        setTimeout(function () { bar.style.width = level + '%'; }, 200);
                    }
                });
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });

    // Also observe sections for skill cards
    var skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-progress').forEach(function (bar) {
                    var parent = bar.closest('.skill-card');
                    if (parent) {
                        var idx = Array.from(parent.parentNode.children).indexOf(parent);
                        var level = DATA.skills[idx] ? DATA.skills[idx].level : 0;
                        setTimeout(function () { bar.style.width = level + '%'; }, 200);
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    skillObserver.observe(document.getElementById('skills'));
}

function setupCounters() {
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseFloat(el.getAttribute('data-target'));
                var suffix = el.getAttribute('data-suffix') || '';
                var current = 0;
                var isFloat = target % 1 !== 0;
                var increment = target / 30;
                var timer = setInterval(function () {
                    current += increment;
                    if (current >= target) { el.textContent = target + suffix; clearInterval(timer); }
                    else { el.textContent = isFloat ? current.toFixed(2) : Math.floor(current); }
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    });
    document.querySelectorAll('.stat-number').forEach(function (c) { counterObserver.observe(c); });
}

function setupProjectFilters() {
    document.getElementById('projects').addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        var category = btn.getAttribute('data-category');
        var container = btn.closest('.container');
        var newSection = renderProjects(category);
        container.innerHTML = newSection.querySelector('.container').innerHTML;
        document.querySelectorAll('.fade-in').forEach(function (el) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
                });
            }, { threshold: 0.1 });
            obs.observe(el);
        });
    });
}

function setupContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var original = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        setTimeout(function () {
            btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #3fb950, #2ea043)';
            setTimeout(function () {
                btn.innerHTML = original;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}

// ─── Active Nav ───

function updateActiveLink() {
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        var current = '';
        sections.forEach(function (s) {
            var top = s.offsetTop - 120;
            var bottom = top + s.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) { current = s.id; }
        });
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === current);
        });
    });
}

// ─── Boot ───

fetch('data/data.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { DATA = data; initApp(); })
    .catch(function (err) { document.getElementById('mainContent').innerHTML = '<div style="padding:100px;text-align:center"><h2>Failed to load data</h2><p>' + err.message + '</p></div>'; console.error(err); });
