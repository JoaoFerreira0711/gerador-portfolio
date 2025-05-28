
// Alternância de tema
document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// Salvar rascunho
document.getElementById('saveDraft').addEventListener('click', () => {
  const dados = capturarDadosFormulario();
  localStorage.setItem('portfolioDraft', JSON.stringify(dados));
  alert('Rascunho salvo com sucesso!');
});

// Carregar rascunho
document.getElementById('loadDraft').addEventListener('click', () => {
  const saved = localStorage.getItem('portfolioDraft');
  if (!saved) return alert('Nenhum rascunho salvo encontrado.');
  preencherFormulario(JSON.parse(saved));
  alert('Rascunho carregado!');
});

// Captura os dados do formulário
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
    projetos
  };
}

// Preenche os campos com dados
function preencherFormulario(data) {
  document.getElementById('modelo').value = data.modelo || '';
  document.getElementById('nome').value = data.nome || '';
  document.getElementById('bio').value = data.bio || '';
  document.getElementById('formacao').value = data.formacao || '';
  document.getElementById('habilidades').value = data.habilidades || '';
  document.getElementById('objetivo').value = data.objetivo || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('linkedin').value = data.linkedin || '';

  const projetosContainer = document.getElementById('projetos-container');
  projetosContainer.innerHTML = '';
  (data.projetos || []).forEach(p => {
    adicionarProjeto(p.nome, p.descricao, p.link);
  });
}

// Adiciona novo projeto
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

// Botão adicionar projeto
document.getElementById('btn-add-project').addEventListener('click', () => adicionarProjeto());

// Etapas e preview
document.getElementById('nextBtn').addEventListener('click', () => {
  const steps = document.querySelectorAll('.step');
  const currentIndex = [...steps].findIndex(s => s.classList.contains('active'));
  if (currentIndex < steps.length - 1) {
    steps[currentIndex].classList.remove('active');
    steps[currentIndex + 1].classList.add('active');
  }

  if (currentIndex + 1 === steps.length - 1) {
    const dados = capturarDadosFormulario();
    const htmlPreview = gerarHtmlPreview(dados);
    const frame = document.getElementById('previewFrame');
    frame.srcdoc = htmlPreview;
  }
});

// Reiniciar
document.getElementById('restartBtn').addEventListener('click', () => {
  document.getElementById('portfolio-form').reset();
  document.getElementById('projetos-container').innerHTML = '';
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.progressbar li').forEach(li => li.classList.remove('active'));
  document.querySelectorAll('.step')[0].classList.add('active');
  document.querySelectorAll('.progressbar li')[0].classList.add('active');
});

// Reordenação com Sortable.js
Sortable.create(document.getElementById('projetos-container'), {
  animation: 150,
  handle: '.projeto-bloco',
  ghostClass: 'sortable-ghost'
});

// Exportar como PDF
document.getElementById('exportPdfBtn').addEventListener('click', () => {
  const iframe = document.getElementById('previewFrame');
  const content = iframe.contentDocument.body;
  html2pdf().from(content).save("portfolio.pdf");
});

// Gera HTML com animações para preview
function gerarHtmlPreview(d) {
  return `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <title>${d.nome}</title>
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
    <style>
      body { font-family: 'Arial'; padding: 2rem; color: #333; background: #f0f0f0; }
      h1, h2 { color: #0a3d62; }
      section { margin: 2rem 0; background: #fff; padding: 1rem; border-radius: 8px; }
    </style>
  </head>
  <body>
    <h1 data-aos="fade-down">${d.nome}</h1>
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
