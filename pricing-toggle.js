// Price Toggle Functionality for Pricing Pages
document.addEventListener('DOMContentLoaded', function() {
  const monthlyToggle = document.getElementById('monthly-toggle');
  const annualToggle = document.getElementById('annual-toggle');
  const priceSlider = document.querySelector('.price-toggle-slider');

  function initializeToggle() {
    monthlyToggle.classList.add('active');
    annualToggle.classList.remove('active');
    if (priceSlider) priceSlider.style.transform = 'translateX(0)';
    
    document.querySelectorAll('.price-monthly').forEach(el => {
      el.classList.add('show');
    });
    document.querySelectorAll('.price-annual').forEach(el => {
      el.classList.remove('show');
    });
    document.querySelectorAll('.annual-savings').forEach(el => {
      el.classList.remove('show');
    });
  }

  function showMonthly() {
    monthlyToggle.classList.add('active');
    annualToggle.classList.remove('active');
    if (priceSlider) priceSlider.style.transform = 'translateX(0)';
    
    document.querySelectorAll('.annual-savings').forEach(el => {
      el.classList.remove('show');
    });
    
    document.querySelectorAll('.price-annual').forEach(el => {
      el.classList.remove('show');
    });
    document.querySelectorAll('.price-monthly').forEach(el => {
      el.classList.add('show');
    });
  }

  function showAnnual() {
    annualToggle.classList.add('active');
    monthlyToggle.classList.remove('active');
    if (priceSlider) priceSlider.style.transform = 'translateX(calc(100% + 8px))';
    
    document.querySelectorAll('.price-monthly').forEach(el => {
      el.classList.remove('show');
    });
    
    document.querySelectorAll('.price-annual').forEach(el => {
      el.classList.add('show');
    });
    
    document.querySelectorAll('.annual-savings').forEach(el => {
      el.classList.add('show');
    });
  }

  monthlyToggle.addEventListener('click', () => {
    if (!monthlyToggle.classList.contains('active')) {
      showMonthly();
    }
  });
  
  annualToggle.addEventListener('click', () => {
    if (!annualToggle.classList.contains('active')) {
      showAnnual();
    }
  });

  initializeToggle();
});