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
    gerarPortfolio();
    return;
  }

  steps[currentStep].classList.add('active');
  progressbarItems[currentStep].classList.add('active');

  updateButtons();
});

function gerarPortfolio() {
  const nome = document.getElementById('nome').value;
  const bio = document.getElementById('bio').value;
  const formacao = document.getElementById('formacao').value;
  const habilidades = document.getElementById('habilidades').value;
  const objetivo = document.getElementById('objetivo').value;
  const email = document.getElementById('email').value;
  const linkedin = document.getElementById('linkedin').value;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Portfólio de ${nome}</title>
      <style>
        body { font-family: Arial; padding: 2rem; max-width: 800px; margin: auto; }
        h1 { color: #0a3d62; }
        section { margin-bottom: 1.5rem; }
        strong { color: #05407a; }
      </style>
    </head>
    <body>
      <h1>${nome}</h1>
      <section><strong>Sobre:</strong><p>${bio}</p></section>
      <section><strong>Formação:</strong><p>${formacao}</p></section>
      <section><strong>Habilidades:</strong><p>${habilidades}</p></section>
      <section><strong>Objetivo:</strong><p>${objetivo}</p></section>
      <section><strong>Contato:</strong>
        <p>Email: ${email}</p>
        ${linkedin ? `<p>LinkedIn: <a href="${linkedin}" target="_blank">${linkedin}</a></p>` : ""}
      </section>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Abre nova aba com o portfólio
  window.open(url, '_blank');

  // Ou pode oferecer download direto:
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-${nome.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
}

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