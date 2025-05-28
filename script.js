const form = document.getElementById('portfolio-form');
const steps = form.querySelectorAll('.step');
const progressbarItems = document.querySelectorAll('.progressbar li');
const btnNext = document.getElementById('nextBtn');
const btnPrev = document.getElementById('prevBtn');

let currentStep = 0;

btnNext.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;

  steps[currentStep].classList.remove('active');
  progressbarItems[currentStep].classList.remove('active');

  currentStep++;

  if (currentStep >= steps.length) {
    // Aqui você pode submeter o form ou gerar o portfólio
    form.submit();
    return;
  }

  steps[currentStep].classList.add('active');
  progressbarItems[currentStep].classList.add('active');

  updateButtons();
});

btnPrev.addEventListener('click', () => {
  if (currentStep <= 0) return;

  steps[currentStep].classList.remove('active');
  progressbarItems[currentStep].classList.remove('active');

  currentStep--;

  steps[currentStep].classList.add('active');
  progressbarItems[currentStep].classList.add('active');

  updateButtons();
});

function updateButtons() {
  btnPrev.disabled = currentStep === 0;
  btnNext.textContent = currentStep === steps.length - 1 ? 'Enviar' : 'Próximo';
}

function validateStep(step) {
  const inputs = steps[step].querySelectorAll('input, textarea');
  for (let input of inputs) {
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.focus();
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
  }
  return true;
}