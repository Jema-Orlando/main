document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // CONFIGURACION DEL FORMULARIO
  // Reemplaza FORM_ENDPOINT con tu URL de Formspree o EmailJS.
  //   Formspree: https://formspree.io/f/TU_ID  (debes crear el formulario en formspree.io)
  // Si queda vacio, el formulario abre el cliente de correo
  // con la solicitud pre-llenada (mailto fallback).
  // ============================================================
  const FORM_ENDPOINT = '';

  // --- 1. Budget Slider Label Updates ---
  const budgetSlider = document.getElementById('budget');
  const budgetValueText = document.getElementById('budget-val');
  
  const budgetLabels = [
    "Under $1,500",
    "$1,500 - $5,000",
    "$5,000 - $15,000",
    "$15,000 - $40,000",
    "$40,000+"
  ];

  if (budgetSlider && budgetValueText) {
    const updateBudgetText = () => {
      const val = parseInt(budgetSlider.value);
      budgetValueText.textContent = budgetLabels[val - 1] || "Select Budget";
    };
    budgetSlider.addEventListener('input', updateBudgetText);
    updateBudgetText(); // Initial run
  }

  // --- 2. Service Category Chip Toggling ---
  const remodelingChip = document.getElementById('chip-remodeling');
  const electricalChip = document.getElementById('chip-electrical');
  const plumbingChip = document.getElementById('chip-plumbing');
  const serviceTypeInput = document.getElementById('service-type');
  
  const remodelingGroup = document.getElementById('subservices-remodeling');
  const electricalGroup = document.getElementById('subservices-electrical');
  const plumbingGroup = document.getElementById('subservices-plumbing');

  if (remodelingChip && electricalChip && plumbingChip) {
    remodelingChip.addEventListener('click', () => {
      remodelingChip.classList.add('active');
      electricalChip.classList.remove('active');
      plumbingChip.classList.remove('active');
      serviceTypeInput.value = 'Remodeling';
      
      remodelingGroup.classList.add('active');
      electricalGroup.classList.remove('active');
      plumbingGroup.classList.remove('active');
    });

    electricalChip.addEventListener('click', () => {
      electricalChip.classList.add('active');
      remodelingChip.classList.remove('active');
      plumbingChip.classList.remove('active');
      serviceTypeInput.value = 'Electrical';
      
      electricalGroup.classList.add('active');
      remodelingGroup.classList.remove('active');
      plumbingGroup.classList.remove('active');
    });

    plumbingChip.addEventListener('click', () => {
      plumbingChip.classList.add('active');
      remodelingChip.classList.remove('active');
      electricalChip.classList.remove('active');
      serviceTypeInput.value = 'Plumbing';
      
      plumbingGroup.classList.add('active');
      remodelingGroup.classList.remove('active');
      electricalGroup.classList.remove('active');
    });
  }

  // --- 3. Interactive Math CAPTCHA ---
  const captchaTextElement = document.getElementById('captcha-question');
  const captchaInputElement = document.getElementById('captcha-input');
  
  let num1 = 0;
  let num2 = 0;
  let correctAnswer = 0;

  const generateCaptcha = () => {
    if (!captchaTextElement) return;
    num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    num2 = Math.floor(Math.random() * 9) + 1; // 1-9
    correctAnswer = num1 + num2;
    captchaTextElement.textContent = `What is ${num1} + ${num2}?`;
    if (captchaInputElement) {
      captchaInputElement.value = '';
      captchaInputElement.classList.remove('has-error');
    }
  };

  generateCaptcha();

  // --- 4. ZIP Code Service Area Warning ---
  const zipInput = document.getElementById('zip');
  const zipHint = document.getElementById('zip-hint');
  
  if (zipInput) {
    zipInput.addEventListener('input', () => {
      const zipVal = zipInput.value.trim();
      if (zipVal.length >= 3) {
        // Central Florida zip codes generally start with 327, 328, 347, 338, 329
        const isCentralFL = /^(327|328|347|338|329)/.test(zipVal);
        if (!isCentralFL) {
          zipHint.textContent = "Outside our primary Central Florida service zone. Response times may be longer.";
          zipHint.style.color = "#e11d48"; // Rose-600
        } else {
          zipHint.textContent = "✔ Verified Service Coverage Area";
          zipHint.style.color = "#16a34a"; // Green-600
        }
      } else {
        zipHint.textContent = "Orlando, FL coverage ZIP Code (e.g. 32801)";
        zipHint.style.color = "";
      }
    });
  }

  // --- 5. Inline Validation Helpers ---
  const showError = (input, message) => {
    input.classList.add('has-error');
    let errorEl = input.parentElement.querySelector('.form-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error-msg';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  };

  const clearErrors = (form) => {
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    form.querySelectorAll('.form-error-msg').forEach(el => el.remove());
  };

  // --- 6. Submission to Formspree (with mailto fallback) ---
  const estimateForm = document.getElementById('estimate-form');
  const submitModal = document.getElementById('submit-modal');
  const loaderEl = document.getElementById('modal-loader');
  const successEl = document.getElementById('modal-success');
  const modalText = document.getElementById('modal-text');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const setModalLoading = () => {
    loaderEl.style.display = 'block';
    successEl.style.display = 'none';
    if (modalCloseBtn) modalCloseBtn.style.display = 'none';
    modalText.innerHTML = `
      <h4 style="color:var(--text-dark); margin-bottom: 0.5rem;">Sending Estimate Request...</h4>
      <p style="color:var(--text-muted);">Securing your request. Please wait a moment.</p>
    `;
  };

  const setModalSuccess = (html) => {
    loaderEl.style.display = 'none';
    successEl.style.display = 'flex';
    if (modalCloseBtn) modalCloseBtn.style.display = 'inline-block';
    modalText.innerHTML = html;
  };

  const setModalError = (message) => {
    loaderEl.style.display = 'none';
    successEl.style.display = 'none';
    if (modalCloseBtn) modalCloseBtn.style.display = 'inline-block';
    modalText.innerHTML = `
      <h4 style="color:#b91c1c; margin-bottom: 0.5rem;">Something went wrong</h4>
      <p style="color:var(--text-muted);">${message}</p>
      <p style="color:var(--text-muted); font-size: 0.9rem;">Please call us at <a href="tel:+14075550199" style="color:var(--accent); font-weight:600;">(407) 555-0199</a> or try again.</p>
    `;
  };

  const getSelectedSubservices = () => {
    const checked = estimateForm.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checked).map(cb => cb.value).join(', ');
  };

  if (estimateForm && submitModal) {
    estimateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous inline errors
      clearErrors(estimateForm);

      // --- Validation ---
      const nameEl = document.getElementById('name');
      const phoneEl = document.getElementById('phone');
      const emailEl = document.getElementById('email');
      const zipEl = document.getElementById('zip');

      const name = nameEl.value.trim();
      const phone = phoneEl.value.trim();
      const email = emailEl.value.trim();
      const zip = zipEl.value.trim();

      let valid = true;

      if (!name) { showError(nameEl, 'Please enter your full name.'); valid = false; }
      if (!phone || phone.replace(/\D/g, '').length < 7) { showError(phoneEl, 'Please enter a valid phone number.'); valid = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(emailEl, 'Please enter a valid email address.'); valid = false; }
      if (!zip) { showError(zipEl, 'Please enter your ZIP code.'); valid = false; }

      const captchaAns = parseInt(captchaInputElement ? captchaInputElement.value.trim() : '0');
      if (isNaN(captchaAns) || captchaAns !== correctAnswer) {
        showError(captchaInputElement, 'Incorrect answer. Please try again.');
        generateCaptcha();
        valid = false;
      }

      if (!valid) return;

      // Open Modal in Loading State
      submitModal.classList.add('active');
      setModalLoading();

      const serviceType = serviceTypeInput.value;
      const subServices = getSelectedSubservices();
      const budgetLabel = budgetValueText ? budgetValueText.textContent : '';
      const description = document.getElementById('description').value.trim();

      if (FORM_ENDPOINT) {
        // --- Real submission via Formspree (or compatible endpoint) ---
        try {
          const formData = new FormData(estimateForm);
          formData.set('service-type', serviceType);
          formData.append('sub-services', subServices);
          formData.append('budget-label', budgetLabel);
          formData.append('_subject', `New Estimate Request - ${serviceType} (${name})`);
          formData.append('_replyto', email);

          const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' },
          });

          if (!response.ok) {
            throw new Error('The server rejected the request.');
          }

          setModalSuccess(`
            <h4 style="color:var(--text-dark); margin-bottom: 0.5rem; font-size:1.5rem;">Estimate Request Sent!</h4>
            <p style="color:var(--text-muted); font-size:1rem;">
              Thank you <strong>${name}</strong>. Your request for <strong>${serviceType} Services</strong> has been received.
              We will contact you at <strong>${phone}</strong> within 24 hours.
            </p>
          `);
        } catch (err) {
          setModalError('We could not send your request online. Please try again or reach us by phone.');
        }
      } else {
        // --- Fallback: open mail client with pre-filled request ---
        const subject = encodeURIComponent(`Free Estimate Request - ${serviceType} - ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          `Email: ${email}\n` +
          `ZIP: ${zip}\n` +
          `Service: ${serviceType}\n` +
          (subServices ? `Sub-services: ${subServices}\n` : '') +
          `Budget: ${budgetLabel}\n` +
          (description ? `Description: ${description}\n` : '')
        );

        // Small delay so the loading modal is visible before redirecting
        setTimeout(() => {
          window.location.href = `mailto:info@jemaorlando.com?subject=${subject}&body=${body}`;
          setModalSuccess(`
            <h4 style="color:var(--text-dark); margin-bottom: 0.5rem; font-size:1.5rem;">Almost done!</h4>
            <p style="color:var(--text-muted); font-size:1rem;">
              Your email client is opening with your request pre-filled.
              Press <strong>Send</strong> to confirm and we will reply within 24 hours.
            </p>
          `);
        }, 800);
      }
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        submitModal.classList.remove('active');
        estimateForm.reset();
        clearErrors(estimateForm);
        generateCaptcha();
        if (zipHint) {
          zipHint.textContent = "Orlando, FL coverage ZIP Code (e.g. 32801)";
          zipHint.style.color = "";
        }
        // Reset subservices display
        if (remodelingChip) remodelingChip.click();
        budgetValueText.textContent = budgetLabels[1]; // $1,500 - $5,000
      });
    }
  }
});
