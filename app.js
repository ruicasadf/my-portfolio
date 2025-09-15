// Portfolio JavaScript Functionality

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupScrollReveal();
    this.setupProgressBars();
    this.setupContactForm();
    this.setupScrollEffects();
    this.setupHoverEffects();
  }

  // Theme Toggle Functionality
  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
    
    // Set initial theme
    const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
    this.updateThemeIcon(themeIcon, currentTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-color-scheme', newTheme);
      this.updateThemeIcon(themeIcon, newTheme);
      
      // Add animation effect
      themeToggle.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 300);
    });
  }

  updateThemeIcon(icon, theme) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // Mobile Menu Toggle
  setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');

    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Smooth Scroll for Navigation - Enhanced fix
  setupSmoothScroll() {
    // Handle all navigation links and hero buttons
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      
      const href = link.getAttribute('href');
      const targetId = href.substring(1);
      
      // Special handling for empty hash or just "#"
      if (!targetId) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Use a more reliable calculation
        setTimeout(() => {
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 70;
          const elementTop = targetElement.offsetTop;
          const targetPosition = elementTop - headerHeight - 20;
          
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });
        }, 10);

        // Close mobile menu if open
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav__menu');
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      }
    });
  }

  // Scroll Reveal Animation
  setupScrollReveal() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Add reveal class to elements
    const revealElements = document.querySelectorAll('.section__title, .skill-card, .project-card, .roadmap-item, .about__content, .contact__content');
    
    revealElements.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.transitionDelay = `${index * 0.1}s`;
      revealObserver.observe(element);
    });
  }

  // Animated Progress Bars
  setupProgressBars() {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressFills = entry.target.querySelectorAll('.progress-fill');
          progressFills.forEach(fill => {
            const progress = fill.dataset.progress;
            setTimeout(() => {
              fill.style.width = `${progress}%`;
            }, 100);
          });
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills');
    const roadmapSection = document.querySelector('.roadmap');
    
    if (skillsSection) progressObserver.observe(skillsSection);
    if (roadmapSection) progressObserver.observe(roadmapSection);
  }

  // Contact Form Handling
  setupContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const message = formData.get('message').trim();
      
      // Validate form
      if (!this.validateForm(name, email, message)) {
        return;
      }
      
      // Simulate form submission
      this.submitForm(form, { name, email, message });
    });
  }

  validateForm(name, email, message) {
    const errors = [];
    
    if (name.length < 2) {
      errors.push('Имя должно содержать минимум 2 символа');
    }
    
    if (!this.isValidEmail(email)) {
      errors.push('Введите корректный email адрес');
    }
    
    if (message.length < 10) {
      errors.push('Сообщение должно содержать минимум 10 символов');
    }
    
    if (errors.length > 0) {
      this.showNotification('Ошибка валидации: ' + errors.join(', '), 'error');
      return false;
    }
    
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  submitForm(form, data) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      this.showNotification('Сообщение отправлено успешно!', 'success');
      form.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon">${this.getNotificationIcon(type)}</span>
        <span class="notification__message">${message}</span>
        <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10000;
      background: var(--color-surface);
      color: var(--color-text);
      padding: var(--space-16);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      max-width: 400px;
      transform: translateX(100%);
      transition: transform var(--duration-normal) var(--ease-standard);
    `;
    
    if (type === 'success') {
      notification.style.borderColor = 'var(--color-success)';
      notification.style.background = `rgba(var(--color-success-rgb), 0.1)`;
    } else if (type === 'error') {
      notification.style.borderColor = 'var(--color-error)';
      notification.style.background = `rgba(var(--color-error-rgb), 0.1)`;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }

  // Scroll Effects
  setupScrollEffects() {
    let lastScrollY = 0;
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // Header hide/show on scroll
      if (scrollY > lastScrollY && scrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      // Add header background on scroll
      if (scrollY > 50) {
        header.style.background = `var(--color-surface)`;
        header.style.backdropFilter = 'blur(20px)';
      } else {
        header.style.background = `rgba(var(--color-surface), 0.8)`;
        header.style.backdropFilter = 'blur(20px)';
      }
      
      lastScrollY = scrollY;
      
      // Update active navigation
      this.updateActiveNav();
    });

    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero__background');
    if (heroBackground) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      });
    }
  }

  // Update active navigation link based on scroll position
  updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - headerHeight - 150)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Enhanced Hover Effects
  setupHoverEffects() {
    // Skill cards hover effect
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.skill-card__icon');
        if (icon) {
          icon.style.transform = 'scale(1.2) rotate(10deg)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.skill-card__icon');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      });
    });

    // Project cards tilt effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          left: ${x}px;
          top: ${y}px;
          width: 20px;
          height: 20px;
          margin-left: -10px;
          margin-top: -10px;
          pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  
  // Add loading animation
  document.body.classList.add('loaded');
});

// Add utility CSS for enhanced effects
const style = document.createElement('style');
style.textContent = `
  body:not(.loaded) {
    overflow: hidden;
  }
  
  body:not(.loaded) .hero__content {
    opacity: 0;
  }
  
  body.loaded .hero__content {
    animation: fadeIn 1s var(--ease-standard) forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .notification__content {
    display: flex;
    align-items: center;
    gap: var(--space-12);
  }
  
  .notification__close {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: var(--font-size-lg);
    padding: 0;
    margin-left: auto;
  }
  
  .notification__close:hover {
    color: var(--color-text);
  }
  
  .skill-card__icon {
    transition: transform var(--duration-normal) var(--ease-standard);
  }
  
  .project-card {
    transition: transform var(--duration-normal) var(--ease-standard);
  }
  
  /* Enhanced button hover effects */
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-full);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
    pointer-events: none;
  }
  
  .btn:hover::before {
    width: 300px;
    height: 300px;
  }
  
  /* Active navigation link highlighting */
  .nav__link.active {
    color: var(--color-primary);
  }
  
  .nav__link.active::after {
    width: 100%;
  }
`;

document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile menu
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navMenu && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
    
    // Close any notifications
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => notification.remove());
  }
});