// ============================================================
//  PAINEL DE CERTIFICADOS
//
//  Para adicionar um certificado, copie um bloco { ... } e cole
//  dentro da lista abaixo. Só "titulo" e "instituicao" são
//  obrigatórios; o resto é opcional e some se ficar vazio.
//
//  {
//    titulo:      "Java COMPLETO",              // nome do curso
//    instituicao: "Udemy",                      // quem emitiu
//    data:        "2025",                       // ano ou "mar. 2025"
//    carga:       "40h",                        // carga horária
//    tags:        ["Java", "POO"],              // assuntos (opcional)
//    link:        "https://...",                // página de validação
//    arquivo:     "assets/certificados/java.pdf" // o certificado em si
//  },
//
//  Para usar "arquivo", crie a pasta assets/certificados e
//  coloque lá o PDF ou a imagem do certificado.
// ============================================================

const CERTIFICADOS = [
  // Cole os seus certificados aqui.
];

// ------------------------------------------------------------
// Daqui para baixo é a montagem dos cartões na tela.
// ------------------------------------------------------------
(function montarCertificados() {
  const grid = document.getElementById("cert-grid");
  const contagem = document.getElementById("cert-contagem");
  if (!grid) return;

  if (CERTIFICADOS.length === 0) {
    grid.innerHTML = `<p class="cert-vazio">Em breve: estou cursando e publico os certificados aqui conforme concluo.</p>`;
    // Lembrete que só aparece para mim, rodando o site na minha máquina.
    if (location.hostname === "localhost" || location.protocol === "file:") {
      grid.innerHTML += `<p class="cert-dica">Para adicionar: edite a lista <code>CERTIFICADOS</code> no arquivo <code>certificados.js</code>.</p>`;
    }
    return;
  }

  contagem.textContent =
    CERTIFICADOS.length === 1 ? "1 certificado" : `${CERTIFICADOS.length} certificados`;

  // textContent (em vez de innerHTML) evita que um texto com < ou >
  // quebre a página ou injete HTML indesejado.
  const texto = (tag, classe, valor) => {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    el.textContent = valor;
    return el;
  };

  for (const cert of CERTIFICADOS) {
    const card = document.createElement("article");
    card.className = "cert-card";

    card.append(texto("h4", null, cert.titulo));
    card.append(texto("p", "cert-org", cert.instituicao));

    const meta = [cert.data, cert.carga].filter(Boolean).join(" · ");
    if (meta) card.append(texto("p", "cert-meta", meta));

    if (Array.isArray(cert.tags) && cert.tags.length) {
      const tags = document.createElement("ul");
      tags.className = "tags cert-tags";
      for (const t of cert.tags) tags.append(texto("li", null, t));
      card.append(tags);
    }

    const links = document.createElement("div");
    links.className = "cert-links";
    if (cert.arquivo) {
      const a = document.createElement("a");
      a.href = cert.arquivo;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Ver certificado";
      links.append(a);
    }
    if (cert.link) {
      const a = document.createElement("a");
      a.href = cert.link;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Validar";
      links.append(a);
    }
    if (links.children.length) card.append(links);

    grid.append(card);
  }
})();
