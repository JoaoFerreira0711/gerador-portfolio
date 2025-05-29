
window.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const progressItems = document.querySelectorAll(".progressbar li");
  const previewFrame = document.getElementById("previewFrame");
  const btnPrev = document.getElementById("prevBtn");
  const btnNext = document.getElementById("nextBtn");
  const btnSkip = document.getElementById("skipBtn");
  const btnRestart = document.getElementById("restartBtn");
  const btnAddProject = document.getElementById("btn-add-project");
  const btnSave = document.getElementById("saveDraft");
  const btnLoad = document.getElementById("loadDraft");
  const btnTheme = document.getElementById("toggleTheme");

  let currentStep = 0;
  progressItems[0].classList.add("active");

  btnTheme?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  });

  btnSave?.addEventListener("click", () => {
    const dados = capturarDadosFormulario();
    localStorage.setItem("portfolioDraft", JSON.stringify(dados));
    alert("Rascunho salvo com sucesso!");
  });

  btnLoad?.addEventListener("click", () => {
    const dados = localStorage.getItem("portfolioDraft");
    if (!dados) return alert("Nenhum rascunho encontrado.");
    preencherFormulario(JSON.parse(dados));
    alert("Rascunho carregado!");
  });

  btnRestart?.addEventListener("click", () => {
    document.getElementById("portfolio-form").reset();
    document.getElementById("projetos-container").innerHTML = "";
    currentStep = 0;
    updateSteps();
  });

  btnAddProject?.addEventListener("click", () => {
    adicionarProjeto();
  });

  btnPrev?.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateSteps();
    }
  });

  btnSkip?.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateSteps();
    }
  });

  btnNext?.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === steps.length - 1) {
      gerarPortfolio();
      return;
    }

    currentStep++;
    updateSteps();

    if (currentStep === steps.length - 1) {
      const dados = capturarDadosFormulario();
      previewFrame.srcdoc = gerarHtmlPreview(dados);
    }
  });

  document.getElementById("foto")?.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        document.getElementById("fotoBase64").value = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

 function updateSteps() {
  steps.forEach((s, i) => s.classList.toggle("active", i === currentStep));
  progressItems.forEach((p, i) => p.classList.toggle("active", i <= currentStep));
  btnPrev.disabled = currentStep === 0;
  btnNext.textContent = currentStep === steps.length - 1 ? "Finalizar" : "Próximo";

  // mover bolinha
  const indicator = document.querySelector(".progress-indicator");
  if (indicator) {
    const target = progressItems[currentStep];
    indicator.style.transform = `translateX(${target.offsetLeft}px)`;
  }
}

  function validateStep(step) {
    const inputs = steps[step].querySelectorAll("input, textarea, select");
    for (let input of inputs) {
      if (input.required && !input.value.trim()) {
        input.focus();
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
    }
    return true;
  }

  function capturarDadosFormulario() {
    const projetos = [];
    document.querySelectorAll(".projeto-bloco").forEach((div) => {
      const nome = div.querySelector(".projeto-nome")?.value || "";
      const descricao = div.querySelector(".projeto-descricao")?.value || "";
      const link = div.querySelector(".projeto-link")?.value || "";
      projetos.push({ nome, descricao, link });
    });

    return {
      modelo: document.getElementById("modelo")?.value || "",
      nome: document.getElementById("nome")?.value || "",
      bio: document.getElementById("bio")?.value || "",
      formacao: document.getElementById("formacao")?.value || "",
      habilidades: document.getElementById("habilidades")?.value || "",
      objetivo: document.getElementById("objetivo")?.value || "",
      email: document.getElementById("email")?.value || "",
      linkedin: document.getElementById("linkedin")?.value || "",
      fotoBase64: document.getElementById("fotoBase64")?.value || "",
      fundo: document.getElementById("fundo")?.value || "",
      projetos
    };
  }

  function preencherFormulario(data) {
    document.getElementById("modelo").value = data.modelo || "";
    document.getElementById("nome").value = data.nome || "";
    document.getElementById("bio").value = data.bio || "";
    document.getElementById("formacao").value = data.formacao || "";
    document.getElementById("habilidades").value = data.habilidades || "";
    document.getElementById("objetivo").value = data.objetivo || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("linkedin").value = data.linkedin || "";
    document.getElementById("fotoBase64").value = data.fotoBase64 || "";
    document.getElementById("fundo").value = data.fundo || "";

    const container = document.getElementById("projetos-container");
    container.innerHTML = "";
    (data.projetos || []).forEach(p => adicionarProjeto(p.nome, p.descricao, p.link));
  }

  function adicionarProjeto(nome = "", descricao = "", link = "") {
    const div = document.createElement("div");
    div.className = "projeto-bloco";
    div.innerHTML = `
      <label>Nome do Projeto:</label>
      <input type="text" class="projeto-nome" value="${nome}" required />
      <label>Descrição:</label>
      <textarea class="projeto-descricao" required>${descricao}</textarea>
      <label>Link (opcional):</label>
      <input type="url" class="projeto-link" value="${link}" />
      <button type="button" class="btn-remove-project">Remover Projeto</button>
    `;
    div.querySelector(".btn-remove-project").addEventListener("click", () => div.remove());
    document.getElementById("projetos-container").appendChild(div);
  }

  function gerarPortfolio() {
    const dados = capturarDadosFormulario();
    const html = gerarHtmlPreview(dados);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-${dados.nome.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
  }

  function gerarHtmlPreview(d) {
    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Portfólio de ${d.nome}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 2rem;
          background: ${d.fundo || '#f0f0f0'};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: #333;
        }
        h1, h2 { color: #0a3d62; }
        section { margin-top: 2rem; background: #fff; padding: 1rem; border-radius: 8px; }
        img { max-width: 120px; border-radius: 50%; margin-bottom: 1rem; display: block; }
      </style>
    </head>
    <body>
      <h1>${d.nome}</h1>
      ${d.fotoBase64 ? `<img src="${d.fotoBase64}" alt="Foto de ${d.nome}" />` : ""}
      <p>${d.bio}</p>
      <section><h2>Formação</h2><p>${d.formacao}</p></section>
      <section><h2>Habilidades</h2><p>${d.habilidades}</p></section>
      <section><h2>Objetivo</h2><p>${d.objetivo}</p></section>
      <section><h2>Projetos</h2><ul>
        ${d.projetos.map(p => `<li><strong>${p.nome}</strong>: ${p.descricao} ${p.link ? `<a href="${p.link}" target="_blank">Link</a>` : ""}</li>`).join("")}
      </ul></section>
      <section><h2>Contato</h2><p>Email: ${d.email}</p>${d.linkedin ? `<p>LinkedIn: <a href="${d.linkedin}" target="_blank">${d.linkedin}</a></p>` : ""}</section>
    </body>
    </html>
    `;
  }

});
