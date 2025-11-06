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

  // ====== FAQ ======
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    q.addEventListener('click', () => {
      faqItems.forEach(i => { if (i !== item) i.classList.remove('active'); });
      item.classList.toggle('active');
    });
  });

  // ====== Валидация и отправка формы ======
  const form = document.getElementById('contactForm');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');

  form.addEventListener('submit', async (e) => {
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

    try {
      const resp = await fetch('send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message })
      });

      const result = await resp.json();
      if (result.success) {
        popup.classList.add('active');
        form.reset();
      } else {
        alert('Ошибка: ' + (result.error || 'не удалось отправить сообщение'));
      }
    } catch (err) {
      console.error('Ошибка отправки:', err);
      alert('Произошла ошибка при отправке. Попробуйте позже.');
    }
  });

  // ====== Закрытие popup ======
  closePopup.addEventListener('click', () => popup.classList.remove('active'));
  popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.classList.remove('active');
  });
});
