(function () {
    'use strict';

    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.setAttribute('data-theme', 'dark');
    }

    window.addEventListener('load', function () {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(function () { loader.style.display = 'none'; }, 600);
        }
    });

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.marco');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            items.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'none';
                    item.offsetHeight;
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentIndex = -1;
    let allImages = [];

    function getVisibleItems() {
        const visible = [];
        document.querySelectorAll('.marco:not(.hidden) .marco-img img').forEach(function (img) {
            visible.push({
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt')
            });
        });
        return visible;
    }

    function openLightbox(index) {
        allImages = getVisibleItems();
        if (allImages.length === 0) return;
        currentIndex = index;
        const img = allImages[currentIndex];
        lightboxImg.setAttribute('src', img.src);
        lightboxImg.setAttribute('alt', img.alt);
        lightboxCaption.textContent = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        if (currentIndex === -1) return;
        allImages = getVisibleItems();
        if (allImages.length === 0) return;
        currentIndex = (currentIndex + direction + allImages.length) % allImages.length;
        const img = allImages[currentIndex];
        lightboxImg.setAttribute('src', img.src);
        lightboxImg.setAttribute('alt', img.alt);
        lightboxCaption.textContent = img.alt;
    }

    document.querySelectorAll('.marco').forEach(function (marco, index) {
        marco.addEventListener('click', function () {
            const imgs = marco.querySelectorAll('.marco-img img');
            if (imgs.length > 0) {
                const visibleItems = getVisibleItems();
                const clickedSrc = imgs[0].getAttribute('src');
                const foundIndex = visibleItems.findIndex(function (item) { return item.src === clickedSrc; });
                openLightbox(foundIndex !== -1 ? foundIndex : 0);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });

    if (lightboxNext) lightboxNext.addEventListener('click', function () { navigateLightbox(1); });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.marco').forEach(function (item) {
        observer.observe(item);
    });
})();
