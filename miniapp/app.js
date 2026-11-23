(() => {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    try { tg.setHeaderColor('#0c0d18'); tg.setBackgroundColor('#0c0d18'); } catch (_) {}
    const user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (user) {
      const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь Telegram';
      document.getElementById('profileName').textContent = name;
      document.getElementById('profileId').textContent = user.username ? '@' + user.username : 'Telegram ID: ' + user.id;
      document.getElementById('avatar').textContent = (user.first_name || 'TG').slice(0, 2).toUpperCase();
    }
  }

  const pages = ['home', 'download', 'licenses', 'profile', 'support'];
  function showPage(name) {
    if (!pages.includes(name)) return;
    pages.forEach(p => {
      const el = document.getElementById('page-' + p);
      if (el) el.classList.toggle('active', p === name);
    });
    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.classList.contains('nav-item')) el.classList.toggle('selected', el.dataset.page === name);
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
    if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
  }
  document.addEventListener('click', e => {
    const target = e.target.closest('[data-page]');
    if (target) { e.preventDefault(); showPage(target.dataset.page); }
  });
  document.getElementById('profileShortcut').addEventListener('click', () => showPage('profile'));
  document.getElementById('requestLicense').addEventListener('click', () => {
    const message = 'Здравствуйте! Хочу узнать условия покупки лицензии TG_Coper.';
    if (tg && tg.openTelegramLink) {
      // Replace with the official support username before production.
      tg.showPopup({title:'Покупка лицензии', message:'Контакт для оформления покупки будет добавлен перед запуском.', buttons:[{type:'ok'}]});
    } else {
      alert('Контакт для оформления покупки будет добавлен перед запуском.\n\n' + message);
    }
  });
})();