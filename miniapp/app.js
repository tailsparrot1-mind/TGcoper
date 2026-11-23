(() => {
  const tg = window.Telegram && window.Telegram.WebApp;
  const LICENSE_API_URL = window.TG_COPER_LICENSE_API || '';
  if (tg) {
    tg.ready(); tg.expand();
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
    pages.forEach(p => { const el = document.getElementById('page-' + p); if (el) el.classList.toggle('active', p === name); });
    document.querySelectorAll('[data-page]').forEach(el => { if (el.classList.contains('nav-item')) el.classList.toggle('selected', el.dataset.page === name); });
    window.scrollTo({top: 0, behavior: 'smooth'});
    if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
  }
  document.addEventListener('click', e => { const target = e.target.closest('[data-page]'); if (target) { e.preventDefault(); showPage(target.dataset.page); } });
  document.getElementById('profileShortcut').addEventListener('click', () => showPage('profile'));

  // Desktop-to-Mini-App account proof: the server validates raw initData with the bot token.
  async function confirmDesktopLink() {
    const nonce = tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param;
    if (!nonce) return;
    showPage('licenses');
    const status = document.getElementById('licenseLinkStatus');
    status.hidden = false;
    if (!LICENSE_API_URL) { status.textContent = 'Сервер лицензий ещё не подключён. Подтверждение пока недоступно.'; return; }
    if (!tg.initData) { status.textContent = 'Откройте приложение из Telegram, чтобы подтвердить аккаунт.'; return; }
    status.textContent = 'Подтверждаем ваш Telegram-аккаунт…';
    try {
      const response = await fetch(LICENSE_API_URL.replace(/\/$/, '') + '/api/telegram/verify', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({init_data: tg.initData, nonce})
      });
      const data = await response.json();
      if (response.ok && data.authorized) {
        status.textContent = 'Аккаунт подтверждён. Вернитесь в TG_Coper — лицензия активируется автоматически.';
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
      } else {
        const reasons = {no_active_license:'Для этого Telegram-аккаунта пока нет активной лицензии.',device_limit_reached:'Достигнут лимит устройств. Обратитесь в поддержку.'};
        status.textContent = reasons[data.reason] || 'Не удалось подтвердить вход: ' + (data.error || data.reason || 'ошибка сервера');
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
      }
    } catch (_) { status.textContent = 'Не удалось связаться с сервером лицензий. Проверьте подключение и повторите вход.'; }
  }
  confirmDesktopLink();

  document.getElementById('requestLicense').addEventListener('click', () => {
    const message = 'Здравствуйте! Хочу узнать условия покупки лицензии TG_Coper.';
    if (tg && tg.showPopup) tg.showPopup({title:'Покупка лицензии', message:'Контакт для оформления покупки будет добавлен перед запуском.', buttons:[{type:'ok'}]});
    else alert('Контакт для оформления покупки будет добавлен перед запуском.\n\n' + message);
  });
})();