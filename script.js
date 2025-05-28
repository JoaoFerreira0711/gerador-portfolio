
// Referências DOM
const form = document.getElementById('portfolio-form');
const steps = form.querySelectorAll('.step');
const progressbarItems = document.querySelectorAll('.progressbar li');
const btnNext = document.getElementById('nextBtn');
const btnPrev = document.getElementById('prevBtn');
const output = document.getElementById('output');
const iframe = document.getElementById('portfolio-preview');
const btnAddProject = document.getElementById('btn-add-project');
const projetosContainer = document.getElementById('projetos-container');
const btnDownload = document.getElementById('btn-download');
const themeSelect = document.getElementById('theme-select');

let portfolioHTML = '';

themeSelect.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSelect.value === 'dark');
});

btnAddProject.addEventListener('click', () => {
  const div = document.createElement('div');
  div.classList.add('projeto-bloco');

  div.innerHTML = `
    <label>Título:</label>
    <input type="text" class="proj-titulo" required />

    <label>Descrição:</label>
    <textarea class="proj-desc" rows="2" required></textarea>

    <label>Link (opcional):</label>
    <input type="url" class="proj-link" />

    <button type="button" class="btn-remover">Remover</button>
  `;

  div.querySelector('.btn-remover').addEventListener('click', () => div.remove());

  projetosContainer.appendChild(div);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const bio = document.getElementById('bio').value.trim();
  const formacao = document.getElementById('formacao').value.split(',').map(f => f.trim());
  const habilidades = document.getElementById('habilidades').value.split(',').map(h => h.trim());
  const objetivo = document.getElementById('objetivo').value.trim();
  const email = document.getElementById('email').value.trim();
  const linkedin = document.getElementById('linkedin').value.trim();
  const theme = themeSelect.value;

  const projetos = Array.from(projetosContainer.children).map(div => ({
    titulo: div.querySelector('.proj-titulo').value.trim(),
    desc: div.querySelector('.proj-desc').value.trim(),
    link: div.querySelector('.proj-link').value.trim()
  })).filter(p => p.titulo);

  let fotoBase64 = '';
  const fotoInput = document.getElementById('foto');
  if (fotoInput.files.length > 0) {
    const file = fotoInput.files[0];
    fotoBase64 = await toBase64(file);
  }

  portfolioHTML = `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Portfólio - ${nome}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: ${theme === 'dark' ? '#121212' : '#fff'};
        color: ${theme === 'dark' ? '#eee' : '#000'};
        padding: 2rem;
        line-height: 1.6;
      }
      h1, h2 { color: ${theme === 'dark' ? '#90e0ef' : '#0077b6'}; }
      a { color: ${theme === 'dark' ? '#48cae4' : '#0077b6'}; }
      ul { padding-left: 20px; }
    </style>
  </head>
  <body>
    <h1>${nome}</h1>
    ${fotoBase64 ? <img src="${fotoBase64}" alt="Foto de ${nome}" style="max-width:150px; border-radius:8px;" /> : ''}
    
    <section>
      <h2>Sobre mim</h2>
      <p>${bio}</p>
    </section>

    <section>
      <h2>Formação</h2>
      <ul>
        ${formacao.map(item => <li>${item}</li>).join('')}
      </ul>
    </section>

    <section>
      <h2>Habilidades</h2>
      <ul>
        ${habilidades.map(h => <li>${h}</li>).join('')}
      </ul>
    </section>

    <section>
      <h2>Objetivo</h2>
      <p>${objetivo}</p>
    </section>

    ${projetos.length > 0 ? `
    <section>
      <h2>Projetos</h2>
      <ul>
        ${projetos.map(p => `
          <li>
            <strong>${p.titulo}</strong><br/>
            <span>${p.desc}</span><br/>
            ${p.link ? <a href="${p.link}" target="_blank">Ver projeto</a> : ''}
          </li>
        `).join('')}
      </ul>
    </section>
    ` : ''}

    <section>
      <h2>Contato</h2>
      <p>Email: <a href="mailto:${email}">${email}</a></p>
      ${linkedin ? <p>LinkedIn: <a href="${linkedin}" target="_blank">${linkedin}</a></p> : ''}
    </section>
  </body>
  </html>
  `;

  iframe.srcdoc = portfolioHTML;
  output.style.display = 'block';
  btnDownload.style.display = 'inline-block';
});

btnDownload.addEventListener('click', () => {
  const blob = new Blob([portfolioHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'meu-portfolio.html';
  a.click();

  URL.revokeObjectURL(url);
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    });
}
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
 return true;
}
