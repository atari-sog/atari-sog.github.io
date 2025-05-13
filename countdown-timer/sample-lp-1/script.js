document.addEventListener('DOMContentLoaded', function() {
    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });

    // スクロールアニメーション
    const fadeInElements = document.querySelectorAll('.section');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    fadeInElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(element);
    });

    // CTAボタンのパルスエフェクト
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.classList.add('pulse');
        });
        
        button.addEventListener('mouseout', () => {
            button.classList.remove('pulse');
        });
    });

    // FAQアコーディオン
    const faqItems = document.querySelectorAll('.faq-item');
    
    // 最初のFAQを開いた状態にする
    faqItems[0].classList.add('active');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // すでにアクティブなアイテムであれば閉じる
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            } else {
                // 既存のアクティブなアイテムをすべて閉じる（アコーディオン形式）
                // コメントアウトすると複数のFAQを同時に開けるようになります
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // クリックしたアイテムを開く
                item.classList.add('active');
            }
        });
    });
});

// スクロール位置に基づく固定ナビゲーションの表示/非表示
window.addEventListener('scroll', () => {
    const fixedNav = document.getElementById('fixedNav');
    const aboutSection = document.getElementById('about');
    const scrollPosition = window.scrollY;
    
    if (aboutSection && scrollPosition >= aboutSection.offsetTop - 100) {
        fixedNav.classList.add('visible');
    } else {
        fixedNav.classList.remove('visible');
    }

    // アクティブなナビゲーションリンクをハイライト
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
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
});
