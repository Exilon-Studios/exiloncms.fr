/**
 * Hostinkar Theme - JavaScript Entry Point
 * Modern JavaScript with ES6+ features
 */

// Import required modules
import '../css/app.css';

// Import theme components
import { animate, scroll, inView } from 'motion';

// Initialize theme functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Hostinkar theme initialized');

  // Smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Header scroll effect
  let lastScroll = 0;
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header?.classList.add('shadow-lg');
    } else {
      header?.classList.remove('shadow-lg');
    }

    lastScroll = currentScroll;
  });

  // Initialize animations on scroll
  inView('.animate-on-scroll', () => {
    animate('.animate-on-scroll', { opacity: [0, 1], y: [30, 0] });
  });

  // Counter animation for stats
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target') || '0');
    const duration = parseInt(counter.getAttribute('data-duration') || '2000');
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    // Start animation when element is in view
    inView(counter, () => {
      updateCounter();
    });
  });

  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Initialize tooltips
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', (e) => {
      const text = tooltip.getAttribute('data-tooltip');
      const tooltipEl = document.createElement('div');
      tooltipEl.className = 'absolute bg-gray-800 text-white text-xs rounded px-2 py-1 z-50';
      tooltipEl.textContent = text;
      tooltip.appendChild(tooltipEl);
    });

    tooltip.addEventListener('mouseleave', () => {
      const tooltipEl = tooltip.querySelector('.absolute');
      if (tooltipEl) {
        tooltipEl.remove();
      }
    });
  });

  // Initialize theme toggle (dark/light mode)
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Initialize form validation
  const forms = document.querySelectorAll('[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation logic
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('border-red-500');
        } else {
          field.classList.remove('border-red-500');
        }
      });

      if (isValid) {
        form.submit();
      }
    });
  });
});

// Export theme utilities
export const themeUtils = {
  // Utility to format currency
  formatCurrency: (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Utility to format large numbers
  formatNumber: (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  // Debounce utility
  debounce: (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};