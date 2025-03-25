document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for navbar links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll spy functionality
    function updateActiveNavItem() {
        const navHeight = document.querySelector('nav').offsetHeight;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scroll = window.scrollY;
            const navItem = document.querySelector(`nav a[href="#${section.id}"]`);
            
            if (navItem) {
                if (scroll >= sectionTop && scroll < sectionBottom) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            }
        });
    }

    // Update active nav item on scroll
    window.addEventListener('scroll', updateActiveNavItem);
    // Update active nav item on page load
    updateActiveNavItem();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                
                // Start typing animation for about text when about content is revealed
                if (entry.target.classList.contains('about-content')) {
                    setTimeout(() => {
                        const aboutText = entry.target.querySelector('p');
                        if (aboutText) {
                            aboutText.classList.add('typing');
                            // Add finished class after typing animation completes
                            setTimeout(() => {
                                aboutText.classList.add('finished');
                            }, 1200); // Same duration as typing animation
                        }
                    }, 500); // Start typing after the fade-in animation
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = {
        about: {
            section: document.querySelector('.about'),
            image: document.querySelector('.about-image'),
            content: document.querySelector('.about-content')
        },
        project: {
            header: document.querySelector('.project-header'),
            items: document.querySelectorAll('.project-item'),
            images: document.querySelectorAll('.project-images img')
        },
        contact: {
            section: document.querySelector('.contact')
        }
    };

    // Observe about section
    if (sections.about.section) observer.observe(sections.about.section);
    if (sections.about.image) observer.observe(sections.about.image);
    if (sections.about.content) {
        observer.observe(sections.about.content);
        sections.about.content.addEventListener('reveal', () => {
            setTimeout(() => {
                const aboutText = sections.about.content.querySelector('p');
                if (aboutText) {
                    aboutText.classList.add('typing');
                    setTimeout(() => {
                        aboutText.classList.add('finished');
                    }, 1200);
                }
            }, 500);
        });
    }

    // Observe project section
    if (sections.project.header) observer.observe(sections.project.header);
    sections.project.items.forEach(item => observer.observe(item));
    sections.project.images.forEach((img, index) => {
        observer.observe(img);
        img.style.animationDelay = `${0.2 * (index % 3)}s`;
    });

    // Observe contact section
    if (sections.contact.section) observer.observe(sections.contact.section);

    // Modal functionality
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close-modal');

    function closeModal() {
        modal.classList.add('hiding');
        setTimeout(() => {
            modal.classList.remove('show', 'hiding');
            document.body.style.overflow = '';
        }, 300); // Match this with the animation duration
    }

    // Open modal
    sections.project.images.forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.classList.remove('hiding');
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close modal
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}); 