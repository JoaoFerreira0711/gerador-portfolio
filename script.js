window.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.step');
  const progress = document.querySelectorAll('.progressbar li');
  let currentIndex = 0;

function showStep(index) {
  steps.forEach(s => s.classList.remove('active'));
  progress.forEach(p => p.classList.remove('active'));

  steps[index].classList.add('active');
  progress[index].classList.add('active');

  document.getElementById('prevBtn').disabled = index === 0;
  document.getElementById('nextBtn').textContent = index === steps.length - 1 ? 'Finalizar' : 'Próximo';

  // 🔵 Anima a bolinha do progresso
  const indicator = document.querySelector(".progress-indicator");
  const target = progress[index];
  if (indicator && target) {
    indicator.style.transform = `translateX(${target.offsetLeft}px)`;
  }
}

  function validateStep(index) {
    const inputs = steps[index].querySelectorAll('input, textarea, select');
    for (const input of inputs) {
      if (input.required && !input.value.trim()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        input.focus();
        return false;
      }
    }
    return true;
  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showStep(currentIndex);
    }
  });

  document.getElementById('skipBtn').addEventListener('click', () => {
    if (currentIndex < steps.length - 1) {
      currentIndex++;
      showStep(currentIndex);
    }
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex === steps.length - 1) {
      gerarPortfolio();
      return;
    }

    if (!validateStep(currentIndex)) return;

    currentIndex++;
    showStep(currentIndex);

    if (currentIndex === steps.length - 1) {
      const dados = capturarDadosFormulario();
      const htmlPreview = gerarHtmlPreview(dados);
      document.getElementById('previewFrame').srcdoc = htmlPreview;
    }
  });

  document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('portfolio-form').reset();
    document.getElementById('projetos-container').innerHTML = '';
    currentIndex = 0;
    showStep(currentIndex);
  });

  document.getElementById('saveDraft').addEventListener('click', () => {
    const dados = capturarDadosFormulario();
    localStorage.setItem('portfolioDraft', JSON.stringify(dados));
    alert('Rascunho salvo com sucesso!');
  });

  document.getElementById('loadDraft').addEventListener('click', () => {
    const saved = localStorage.getItem('portfolioDraft');
    if (!saved) return alert('Nenhum rascunho salvo encontrado.');
    preencherFormulario(JSON.parse(saved));
    alert('Rascunho carregado!');
  });

  document.getElementById('btn-add-project').addEventListener('click', () => adicionarProjeto());

  document.getElementById('exportPdfBtn')?.addEventListener('click', () => {
    const iframe = document.getElementById('previewFrame');
    const content = iframe.contentDocument.body;
    html2pdf().from(content).save("portfolio.pdf");
  });

  Sortable.create(document.getElementById('projetos-container'), {
    animation: 150,
    handle: '.projeto-bloco',
    ghostClass: 'sortable-ghost'
  });

  showStep(currentIndex);
});

function capturarDadosFormulario() {
  const projetos = [];
  document.querySelectorAll('.projeto-bloco').forEach(div => {
    projetos.push({
      nome: div.querySelector('.projeto-nome')?.value || '',
      descricao: div.querySelector('.projeto-descricao')?.value || '',
      link: div.querySelector('.projeto-link')?.value || ''
    });
  });

  return {
    modelo: document.getElementById('modelo').value,
    nome: document.getElementById('nome').value,
    bio: document.getElementById('bio').value,
    formacao: document.getElementById('formacao').value,
    habilidades: document.getElementById('habilidades').value,
    objetivo: document.getElementById('objetivo').value,
    email: document.getElementById('email').value,
    linkedin: document.getElementById('linkedin').value,
    fotoBase64: document.getElementById('fotoBase64')?.value || '',
    fundo: document.getElementById('fundo')?.value || '',
    projetos
  };
}

function preencherFormulario(data) {
  document.getElementById('modelo').value = data.modelo || '';
  document.getElementById('nome').value = data.nome || '';
  document.getElementById('bio').value = data.bio || '';
  document.getElementById('formacao').value = data.formacao || '';
  document.getElementById('habilidades').value = data.habilidades || '';
  document.getElementById('objetivo').value = data.objetivo || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('linkedin').value = data.linkedin || '';
  if (data.fotoBase64) document.getElementById('fotoBase64').value = data.fotoBase64;
  if (data.fundo) document.getElementById('fundo').value = data.fundo;

  const projetosContainer = document.getElementById('projetos-container');
  projetosContainer.innerHTML = '';
  (data.projetos || []).forEach(p => adicionarProjeto(p.nome, p.descricao, p.link));
}

function adicionarProjeto(nome = '', descricao = '', link = '') {
  const div = document.createElement('div');
  div.className = 'projeto-bloco';
  div.innerHTML = `
    <label>Nome do Projeto:</label>
    <input type="text" class="projeto-nome" value="${nome}" required />
    <label>Descrição:</label>
    <textarea class="projeto-descricao" rows="2" required>${descricao}</textarea>
    <label>Link (opcional):</label>
    <input type="url" class="projeto-link" value="${link}" />
    <button type="button" class="btn-remove-project">Remover Projeto</button>
  `;
  div.querySelector('.btn-remove-project').addEventListener('click', () => div.remove());
  document.getElementById('projetos-container').appendChild(div);
}

function gerarPortfolio() {
  const dados = capturarDadosFormulario();
  const fotoInput = document.getElementById("foto");

  if (fotoInput && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onloadend = function () {
      dados.fotoBase64 = reader.result;
      finalizarGeracao(dados);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    finalizarGeracao(dados);
  }
}

function finalizarGeracao(d) {
  const html = gerarHtmlPreview(d);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-${d.nome.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
}

function gerarHtmlPreview(d) {
  return `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>${d.nome}</title>
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
    <style>
      body {
        font-family: 'Arial';
        padding: 2rem;
        color: #333;
        background: ${d.fundo || '#f0f0f0'};
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
      h1, h2 { color: #0a3d62; }
      section { margin: 2rem 0; background: #fff; padding: 1rem; border-radius: 8px; }
      img { max-width: 150px; border-radius: 50%; margin-top: 1rem; }
    </style>
  </head>
  <body>
    <h1 data-aos="fade-down">${d.nome}</h1>
    ${d.fotoBase64 ? `<img src="${d.fotoBase64}" alt="Foto de ${d.nome}" />` : ""}
    <p data-aos="fade-in">${d.bio}</p>
    <section data-aos="fade-up"><h2>Formação</h2><p>${d.formacao}</p></section>
    <section data-aos="fade-up"><h2>Habilidades</h2><p>${d.habilidades}</p></section>
    <section data-aos="fade-up"><h2>Objetivo</h2><p>${d.objetivo}</p></section>
    <section data-aos="fade-up"><h2>Projetos</h2>
      <ul>${d.projetos.map(p => `<li><strong>${p.nome}</strong>: ${p.descricao}</li>`).join('')}</ul>
    </section>
    <section data-aos="fade-up"><h2>Contato</h2>
      <p>Email: ${d.email}</p>${d.linkedin ? `<p>LinkedIn: ${d.linkedin}</p>` : ''}
    </section>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>AOS.init();</script>
  </body>
  </html>
  `;
}
