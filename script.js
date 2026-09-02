document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('connect-form');
const statusEl = document.getElementById('form-status');
const submitBtn = form.querySelector('.btn-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    mobile: form.mobile.value.trim(),
    country: form.country.value,
    intake: form.intake.value,
    message: form.message.value.trim(),
  };

  if (!data.name || !data.mobile || !data.country || !data.intake || !data.message) {
    statusEl.dataset.state = 'error';
    statusEl.textContent = 'Please fill every field before sending — even a short answer works.';
    return;
  }

  submitBtn.disabled = true;
  statusEl.dataset.state = '';
  statusEl.textContent = 'Sending…';

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Request failed');

    statusEl.dataset.state = 'ok';
    statusEl.textContent = "Sent. A mentor will call or WhatsApp you within 48 hours.";
    form.reset();
  } catch (err) {
    statusEl.dataset.state = 'error';
    statusEl.innerHTML = 'Something went wrong on our end. Please try again, or ' +
      '<a href="https://wa.me/918825942429" target="_blank" rel="noopener">message us directly on WhatsApp</a> instead.';
  } finally {
    submitBtn.disabled = false;
  }
});
