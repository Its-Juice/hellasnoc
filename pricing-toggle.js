// Price Toggle Functionality for Pricing Pages
document.addEventListener('DOMContentLoaded', function() {
  const monthlyToggle = document.getElementById('monthly-toggle');
  const annualToggle = document.getElementById('annual-toggle');
  const priceSlider = document.querySelector('.price-toggle-slider');

  // Guard early if this page has no pricing toggle
  if (!monthlyToggle || !annualToggle) return;

  function moveSliderTo(element) {
    if (!priceSlider || !element) return;
    // Align slider with the active button position (pixel-accurate)
    priceSlider.style.transform = `translateX(${element.offsetLeft}px)`;
  }

  function initializeToggle() {
    monthlyToggle.classList.add('active');
    annualToggle.classList.remove('active');
    moveSliderTo(monthlyToggle);

    document.querySelectorAll('.price-monthly').forEach(el => el.classList.add('show'));
    document.querySelectorAll('.price-annual').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.annual-savings').forEach(el => el.classList.remove('show'));
  }

  function showMonthly() {
    monthlyToggle.classList.add('active');
    annualToggle.classList.remove('active');
    moveSliderTo(monthlyToggle);

    document.querySelectorAll('.annual-savings').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.price-annual').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.price-monthly').forEach(el => el.classList.add('show'));
  }

  function showAnnual() {
    annualToggle.classList.add('active');
    monthlyToggle.classList.remove('active');
    moveSliderTo(annualToggle);

    document.querySelectorAll('.price-monthly').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.price-annual').forEach(el => el.classList.add('show'));
    document.querySelectorAll('.annual-savings').forEach(el => el.classList.add('show'));
  }

  monthlyToggle.addEventListener('click', () => {
    if (!monthlyToggle.classList.contains('active')) showMonthly();
  });

  annualToggle.addEventListener('click', () => {
    if (!annualToggle.classList.contains('active')) showAnnual();
  });

  // Recalculate slider on resize (handles layout shifts)
  window.addEventListener('resize', () => {
    const active = document.querySelector('.price-toggle-btn.active');
    moveSliderTo(active);
  });

  initializeToggle();
});