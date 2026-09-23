// Navegação entre slides horizontais.
// O CSS (scroll-snap) já faz o deslizar funcionar sozinho no touch e no trackpad;
// este arquivo adiciona: rolagem do mouse, setas, abas, teclado e link por #hash.

const deck = document.getElementById("deck");
const slides = [...deck.querySelectorAll(".slide")];
const tabs = [...document.querySelectorAll(".dock-tabs a")];
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const counterNow = document.getElementById("counter-now");
const counterTotal = document.getElementById("counter-total");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pad = (n) => String(n).padStart(2, "0");

let current = 0;

counterTotal.textContent = pad(slides.length);

function goTo(index, { smooth = true } = {}) {
  const i = Math.max(0, Math.min(slides.length - 1, index));
  deck.scrollTo({
    left: slides[i].offsetLeft,
    behavior: smooth && !reduceMotion.matches ? "smooth" : "auto",
  });
  setCurrent(i);
}

function setCurrent(i) {
  current = i;
  slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
  tabs.forEach((t, n) => t.setAttribute("aria-current", n === i ? "true" : "false"));
  prevBtn.disabled = i === 0;
  nextBtn.disabled = i === slides.length - 1;
  counterNow.textContent = pad(i + 1);
  // Atualiza o endereço (#tracker, #painel...) sem criar entrada no histórico,
  // assim dá para mandar o link direto de um projeto.
  history.replaceState(null, "", `#${slides[i].id}`);
}

// Descobre qual slide está na tela quando a pessoa arrasta com o dedo/trackpad.
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) setCurrent(slides.indexOf(entry.target));
    }
  },
  { root: deck, threshold: 0.6 }
);
slides.forEach((s) => observer.observe(s));

// ---------- Rolagem do mouse ----------
// Rolar para baixo lê o slide até o fim; chegando no fim, pula para o próximo.
// Uma trava evita que um único "giro" da roda (ou a inércia do trackpad) pule vários slides.
let locked = false;
let lockedAt = 0;
let idleTimer;
let accumulated = 0;

function releaseLockWhenIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    const elapsed = performance.now() - lockedAt;
    if (elapsed >= 500) locked = false;
    else releaseLockWhenIdle();
  }, 180);
}

deck.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) return; // Ctrl + roda = zoom do navegador
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // gesto horizontal: o navegador cuida

    if (locked) {
      e.preventDefault();
      releaseLockWhenIdle();
      return;
    }

    const slide = slides[current];
    const goingDown = e.deltaY > 0;
    const atEdge = goingDown
      ? slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 2
      : slide.scrollTop <= 0;

    if (!atEdge) return; // ainda tem conteúdo para ler dentro do slide

    e.preventDefault();
    accumulated += e.deltaY;
    if (Math.abs(accumulated) < 40) return; // ignora toques muito leves

    const target = current + (goingDown ? 1 : -1);
    accumulated = 0;
    if (target < 0 || target >= slides.length) return;

    locked = true;
    lockedAt = performance.now();
    releaseLockWhenIdle();
    goTo(target);
  },
  { passive: false } // necessário para poder chamar preventDefault()
);

// ---------- Setas e abas ----------
prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));

document.querySelectorAll("[data-go]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const i = Number(link.dataset.go);
    goTo(i);
    slides[i].focus({ preventScroll: true }); // leitor de tela e Tab continuam do slide certo
  });
});

// ---------- Teclado ----------
document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target.closest("input, textarea, select")) return;

  const keys = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: slides.length - 1 };
  if (e.key in keys) {
    e.preventDefault();
    goTo(keys[e.key]);
  }
});

// ---------- Estado inicial ----------
// Abre direto no slide do #hash (ex.: site.com/#painel).
const fromHash = slides.findIndex((s) => `#${s.id}` === location.hash);
goTo(fromHash >= 0 ? fromHash : 0, { smooth: false });

// Ao redimensionar a janela a largura dos slides muda; realinha no slide atual.
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => goTo(current, { smooth: false }), 120);
});
