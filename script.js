
const form = document.getElementById('portfolio-form');
const steps = form.querySelectorAll('.step');
const progressbarItems = document.querySelectorAll('.progressbar li');
const btnNext = document.getElementById('nextBtn');
const btnPrev = document.getElementById('prevBtn');
const btnRestart = document.getElementById('restartBtn');
const projetosContainer = document.getElementById('projetos-container');
const btnAddProject = document.getElementById('btn-add-project');

let currentStep = 0;

btnNext.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;

  steps[currentStep].classList.remove('active');
  progressbarItems[currentStep].classList.remove('active');

  currentStep++;

  if (currentStep >= steps.length) {
    gerarPortfolio();
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

btnRestart.addEventListener('click', () => {
  form.reset();
  steps[currentStep].classList.remove('active');
  progressbarItems[currentStep].classList.remove('active');
  currentStep = 0;
  steps[currentStep].classList.add('active');
  progressbarItems[currentStep].classList.add('active');
  projetosContainer.innerHTML = '';
  updateButtons();
});

btnAddProject.addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'projeto-bloco';

  div.innerHTML = `
    <label>Nome do Projeto:</label>
    <input type="text" class="projeto-nome" required />

    <label>Descrição:</label>
    <textarea class="projeto-descricao" rows="2" required></textarea>

    <label>Link (opcional):</label>
    <input type="url" class="projeto-link" />
  `;

  projetosContainer.appendChild(div);
});

function updateButtons() {
  btnPrev.disabled = currentStep === 0;
  btnNext.textContent = currentStep === steps.length - 1 ? 'Gerar Portfólio' : 'Próximo';
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

function gerarPortfolio() {
  const nome = document.getElementById('nome').value;
  const bio = document.getElementById('bio').value;
  const formacao = document.getElementById('formacao').value;
  const habilidades = document.getElementById('habilidades').value;
  const objetivo = document.getElementById('objetivo').value;
  const email = document.getElementById('email').value;
  const linkedin = document.getElementById('linkedin').value;
  const modeloSelecionado = document.getElementById("modelo").value;

  let fotoBase64 = "";
  const fotoInput = document.getElementById("foto");

  const projetos = [];
  document.querySelectorAll('.projeto-bloco').forEach(div => {
    const nome = div.querySelector('.projeto-nome').value;
    const descricao = div.querySelector('.projeto-descricao').value;
    const link = div.querySelector('.projeto-link').value;
    projetos.push({ nome, descricao, link });
  });

  const dados = { nome, bio, formacao, habilidades, objetivo, email, linkedin, fotoBase64, projetos };

  if (fotoInput && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onloadend = function () {
      dados.fotoBase64 = reader.result;
      finalizarGeracao(dados, modeloSelecionado);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    finalizarGeracao(dados, modeloSelecionado);
  }
}

function finalizarGeracao(d, modelo) {
  let html = "";

  if (modelo === "classico") html = gerarHtmlClassico(d);
  else if (modelo === "moderno") html = gerarHtmlModerno(d);
  else html = gerarHtmlDark(d);

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-${d.nome.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
}

// MODELO CLÁSSICO
function gerarHtmlClassico(d) {
  return `
  <!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8">
  <title>Portfólio de ${d.nome}</title>
  <style>
    body { font-family: serif; background: #fff; padding: 2rem; color: #222; }
    h1 { border-bottom: 2px solid #222; }
    section { margin-top: 2rem; }
  </style></head><body>
    <h1>${d.nome}</h1>
    <p>${d.bio}</p>
    <section><h2>Formação</h2><p>${d.formacao}</p></section>
    <section><h2>Habilidades</h2><p>${d.habilidades}</p></section>
    <section><h2>Objetivo</h2><p>${d.objetivo}</p></section>
    <section><h2>Projetos</h2><ul>
      ${d.projetos.map(p => `<li><strong>${p.nome}</strong>: ${p.descricao} ${p.link ? `<a href="${p.link}">Link</a>` : ""}</li>`).join('')}
    </ul></section>
    <section><h2>Contato</h2><p>Email: ${d.email}</p>${d.linkedin ? `<p>LinkedIn: <a href="${d.linkedin}">${d.linkedin}</a></p>` : ""}
    </section>
  </body></html>`;
}
// MODELO MODERNO
function gerarHtmlModerno(d) {
  return `
  <!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8">
  <title>Portfólio de ${d.nome}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #f8f9fa, #e0f7fa); color: #333; }
    header { background: #0a3d62; color: white; text-align: center; padding: 2rem; }
    header img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-top: 1rem; }
    section { background: white; margin: 2rem auto; padding: 2rem; border-radius: 12px; max-width: 800px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    h2 { color: #0a3d62; }
    a { color: #0a3d62; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style></head><body>
    <header>
      <h1>${d.nome}</h1>
      ${d.fotoBase64 ? `<img src="${d.fotoBase64}" alt="Foto de ${d.nome}">` : ""}
      <p>${d.bio}</p>
    </header>
    <section><h2>Formação</h2><p>${d.formacao}</p></section>
    <section><h2>Habilidades</h2><p>${d.habilidades}</p></section>
    <section><h2>Objetivo</h2><p>${d.objetivo}</p></section>
    <section><h2>Projetos</h2><ul>
      ${d.projetos.map(p => `<li><strong>${p.nome}</strong>: ${p.descricao} ${p.link ? `<a href="${p.link}" target="_blank">Link</a>` : ""}</li>`).join('')}
    </ul></section>
    <section><h2>Contato</h2><p>Email: ${d.email}</p>${d.linkedin ? `<p>LinkedIn: <a href="${d.linkedin}" target="_blank">${d.linkedin}</a></p>` : ""}</section>
  </body></html>`;
}
// MODELO DARK
function gerarHtmlDark(d) {
  return `
  <!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8">
  <title>Portfólio de ${d.nome}</title>
  <style>
    body { background: #121212; color: #eee; font-family: Arial, sans-serif; padding: 2rem; }
    section { margin-top: 2rem; }
    h1, h2 { color: #bb86fc; }
    a { color: #03dac6; }
  </style></head><body>
    <h1>${d.nome}</h1>
    <p>${d.bio}</p>
    <section><h2>Formação</h2><p>${d.formacao}</p></section>
    <section><h2>Habilidades</h2><p>${d.habilidades}</p></section>
    <section><h2>Objetivo</h2><p>${d.objetivo}</p></section>
    <section><h2>Projetos</h2><ul>
      ${d.projetos.map(p => `<li><strong>${p.nome}</strong>: ${p.descricao} ${p.link ? `<a href="${p.link}" target="_blank">Link</a>` : ""}</li>`).join('')}
    </ul></section>
    <section><h2>Contato</h2><p>Email: ${d.email}</p>${d.linkedin ? `<p>LinkedIn: <a href="${d.linkedin}" target="_blank">${d.linkedin}</a></p>` : ""}</section>
  </body></html>`;
}
