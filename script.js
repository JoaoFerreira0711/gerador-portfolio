window.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const progressItems = document.querySelectorAll(".progressbar li");
  const previewFrame = document.getElementById("previewFrame");
  const btnPrev = document.getElementById("prevBtn");
  const btnNext = document.getElementById("nextBtn");
  const btnSkip = document.getElementById("skipBtn");
  let currentStep = 0;

  progressItems[0].classList.add("active");

  btnPrev.addEventListener("click", () => {
    if (currentStep > 0) {
      steps[currentStep].classList.remove("active");
      progressItems[currentStep].classList.remove("active");
      currentStep--;
      steps[currentStep].classList.add("active");
      progressItems[currentStep].classList.add("active");
      updateButtons();
    }
  });

  btnSkip.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      steps[currentStep].classList.remove("active");
      progressItems[currentStep].classList.remove("active");
      currentStep++;
      steps[currentStep].classList.add("active");
      progressItems[currentStep].classList.add("active");
      updateButtons();
    }
  });

  btnNext.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === steps.length - 1) {
      gerarPortfolio();
      return;
    }

    steps[currentStep].classList.remove("active");
    progressItems[currentStep].classList.remove("active");
    currentStep++;
    steps[currentStep].classList.add("active");
    progressItems[currentStep].classList.add("active");
    updateButtons();

    if (currentStep === steps.length - 1) {
      const dados = capturarDadosFormulario();
      const htmlPreview = gerarHtmlPreview(dados);
      previewFrame.srcdoc = htmlPreview;
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

  function updateButtons() {
    btnPrev.disabled = currentStep === 0;
    btnNext.textContent = currentStep === steps.length - 1 ? "Finalizar" : "Próximo";
  }

  function validateStep(step) {
    const inputs = steps[step].querySelectorAll("input, textarea, select");
    for (let input of inputs) {
      if (input.hasAttribute("required") && !input.value.trim()) {
        input.focus();
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
    }
    return true;
  }

  function capturarDadosFormulario() {
    const nome = document.getElementById("nome").value;
    const bio = document.getElementById("bio").value;
    const formacao = document.getElementById("formacao").value;
    const habilidades = document.getElementById("habilidades").value;
    const objetivo = document.getElementById("objetivo").value;
    const email = document.getElementById("email").value;
    const linkedin = document.getElementById("linkedin").value;
    const modelo = document.getElementById("modelo").value;
    const fundo = document.getElementById("fundo").value;
    const fotoBase64 = document.getElementById("fotoBase64").value;

    const projetos = [];
    document.querySelectorAll(".projeto-bloco").forEach((div) => {
      const nome = div.querySelector(".projeto-nome").value;
      const descricao = div.querySelector(".projeto-descricao").value;
      const link = div.querySelector(".projeto-link").value;
      projetos.push({ nome, descricao, link });
    });

    return { nome, bio, formacao, habilidades, objetivo, email, linkedin, modelo, projetos, fundo, fotoBase64 };
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
    <title>${d.nome}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 2rem;
        background: ${d.fundo || '#f0f0f0'};
        color: #333;
      }
      h1, h2 { color: #0a3d62; }
      section { margin-top: 2rem; background: #fff; padding: 1rem; border-radius: 8px; }
      img { max-width: 120px; border-radius: 50%; margin-bottom: 1rem; }
    </style>
  </head>
  <body>
    <h1>${d.nome}</h1>
    ${d.fotoBase64 ? `<img src="${d.fotoBase64}" alt="Foto de ${d.nome}" />` : ""}
    <p>${d.bio}</p>

    <section>
      <h2>Formação</h2>
      <p>${d.formacao}</p>
    </section>

    <section>
      <h2>Habilidades</h2>
      <p>${d.habilidades}</p>
    </section>

    <section>
      <h2>Objetivo</h2>
      <p>${d.objetivo}</p>
    </section>

    <section>
      <h2>Projetos</h2>
      <ul>
        ${d.projetos.map(p => `
          <li><strong>${p.nome}</strong>: ${p.descricao} ${p.link ? `<a href="${p.link}" target="_blank">Link</a>` : ""}</li>
        `).join("")}
      </ul>
    </section>

    <section>
      <h2>Contato</h2>
      <p>Email: ${d.email}</p>
      ${d.linkedin ? `<p>LinkedIn: <a href="${d.linkedin}" target="_blank">${d.linkedin}</a></p>` : ""}
    </section>
  </body>
  </html>
  `;
}
});
