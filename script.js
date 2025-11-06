// ====== Анимация появления ======
document.addEventListener('DOMContentLoaded', () => {
  const animated = document.querySelectorAll('.fade-up');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  animated.forEach(el => io.observe(el));
});

// ====== FAQ ======
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    q.addEventListener('click', () => {
      items.forEach(i => { if (i !== item) i.classList.remove('active'); });
      item.classList.toggle('active');
    });
  });
});

// ====== Валидация и отправка формы ======
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    // проверка телефона
    const phonePattern = /^\+?[78]\d{10}$/;
    if (!phonePattern.test(phone)) {
      alert('Введите корректный номер телефона в формате +7XXXXXXXXXX');
      return;
    }

    // ⚠️ токен и chat_id лучше хранить на сервере или в .env, а не в коде
    const BOT_TOKEN = 'ЗДЕСЬ_ТОКЕН_НА_СЕРВЕРЕ';
    const CHAT_ID = '1080472563';

    const text =
`✨ *Новая заявка с сайта*
👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message}`;

    try {
      const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
      });

      if (!resp.ok) throw new Error(await resp.text());
      popup.classList.add('active');
      form.reset();
    } catch (err) {
      console.error('Ошибка Telegram:', err);
      alert('Не удалось отправить сообщение. Попробуйте позже.');
    }
  });

  closePopup.addEventListener('click', () => popup.classList.remove('active'));
  popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.classList.remove('active');
  });
});
