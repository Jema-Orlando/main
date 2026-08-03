document.addEventListener('DOMContentLoaded', () => {
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
    if (captchaInputElement) captchaInputElement.value = '';
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

  // --- 5. Submission Simulator Modal ---
  const estimateForm = document.getElementById('estimate-form');
  const submitModal = document.getElementById('submit-modal');
  const loaderEl = document.getElementById('modal-loader');
  const successEl = document.getElementById('modal-success');
  const modalText = document.getElementById('modal-text');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (estimateForm && submitModal) {
    estimateForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation check
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const zip = document.getElementById('zip').value.trim();
      const captchaAns = parseInt(captchaInputElement ? captchaInputElement.value.trim() : '0');

      if (!name || !phone || !email || !zip) {
        alert("Please fill in all required fields.");
        return;
      }

      // CAPTCHA check
      if (captchaAns !== correctAnswer) {
        alert("Incorrect CAPTCHA answer. Please try again.");
        generateCaptcha();
        return;
      }

      // Open Modal in Loading State
      submitModal.classList.add('active');
      loaderEl.style.display = 'block';
      successEl.style.display = 'none';
      if (modalCloseBtn) modalCloseBtn.style.display = 'none';
      
      const serviceType = serviceTypeInput.value;

      // Simulate API submission
      setTimeout(() => {
        // Success Transition
        loaderEl.style.display = 'none';
        successEl.style.display = 'flex';
        if (modalCloseBtn) modalCloseBtn.style.display = 'inline-block';
        
        modalText.innerHTML = `
          <h4 style="color:#0f172a; margin-bottom: 0.5rem; font-size:1.5rem;">Estimate Request Sent!</h4>
          <p style="color:#64748b; font-size:1rem;">
            Thank you <strong>${name}</strong>. Your request for <strong>${serviceType} Services</strong> has been processed successfully. 
            We will contact you at <strong>${phone}</strong> within 24 hours.
          </p>
        `;
      }, 2000);
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        submitModal.classList.remove('active');
        estimateForm.reset();
        generateCaptcha();
        if (zipHint) {
          zipHint.textContent = "Orlando, FL coverage ZIP Code (e.g. 32801)";
          zipHint.style.color = "";
        }
        // Reset subservices display
        if (remodelingChip) remodelingChip.click();
      });
    }
  }
});
