document.addEventListener('DOMContentLoaded', function () {

  // ── Sticky header scroll class ──────────────
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── Scroll reveal ────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Contact form ─────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Sending...</span><i class="fas fa-spinner fa-spin"></i>';
      }

      // Simulate send
      setTimeout(function () {
        showMessage('Message received — I\'ll respond within 24–48 hours. Fair winds!', 'success');
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-text">Send the Signal</span><i class="fas fa-paper-plane"></i>';
        }

        setTimeout(function () {
          formMessage.style.display = 'none';
        }, 6000);
      }, 1400);
    });
  }

  function showMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});
