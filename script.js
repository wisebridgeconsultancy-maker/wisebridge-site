// Count-up when the stat scrolls into view. Runs once per element.
// Uses data-count-to attribute. Respects prefers-reduced-motion.
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.stat-number[data-count-to]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el, to, duration = 1400) => {
    if (prefersReduced) {
      el.textContent = String(to);
      return;
    }
    let start = null;
    const from = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(from + (to - from) * progress);
      el.textContent = String(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = String(to);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.counted) return;
      const to = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      if (Number.isNaN(to) || to <= 0) {
        el.textContent = String(el.getAttribute('data-count-to') || '0');
        el.dataset.counted = 'true';
        io.unobserve(el);
        return;
      }
      animate(el, to, Number(el.dataset.duration) || 1400);
      el.dataset.counted = 'true';
      io.unobserve(el);
    });
  }, { threshold: 0.35 });

  counters.forEach(c => io.observe(c));
});
