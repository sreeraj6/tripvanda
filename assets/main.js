'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() {
  if (!menu || !nav) return;
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
}
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menu.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
}
function whatsapp(message) {
  // Same-tab navigation works on mobile and avoids popup blockers.
  window.location.assign('https://wa.me/918129422113?text=' + encodeURIComponent(message));
}
document.querySelector('[data-quick-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const destination = String(values.get('destination') || '').trim();
  if (!destination) { event.currentTarget.elements.destination.focus(); return; }
  whatsapp(`Hi Tripvanda! I’m interested in ${values.get('service')}. My destination is ${destination}. Can you help me plan my journey?`);
});
document.querySelector('[data-enquiry-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const name = String(values.get('name') || '').trim();
  const plans = String(values.get('plans') || '').trim();
  if (!name || !plans) {
    event.currentTarget.querySelector('.form-status').textContent = 'Please add your name and travel plans.';
    return;
  }
  whatsapp(`Hi Tripvanda! My name is ${name}.\nI’m interested in: ${values.get('service')}.\nMy travel plans: ${plans}`);
});
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
