// HellasNOC pricing toggle (2025)
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.querySelector('.billing-toggle');
  if (!wrap) return;
  const btnM = wrap.querySelector('[data-billing="monthly"]');
  const btnY = wrap.querySelector('[data-billing="annual"]');

  function show(period) {
    const isAnnual = period === 'annual';
    btnM.classList.toggle('active', !isAnnual);
    btnY.classList.toggle('active', isAnnual);
    document.querySelectorAll('.price-monthly').forEach(el => el.classList.toggle('show', !isAnnual));
    document.querySelectorAll('.price-annual').forEach(el => el.classList.toggle('show', isAnnual));
    document.querySelectorAll('.savings').forEach(el => el.classList.toggle('show', isAnnual));
  }

  btnM?.addEventListener('click', () => show('monthly'));
  btnY?.addEventListener('click', () => show('annual'));
  show('monthly');
});