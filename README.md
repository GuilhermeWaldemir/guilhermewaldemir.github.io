# Portfólio · Guilherme Waldemir

Site de portfólio em slides horizontais: uma apresentação sobre mim e um slide para cada projeto,
com o que ele faz, por que eu o construí, como ele funciona por dentro e as tecnologias usadas.

**No ar:** https://guilhermewaldemir.github.io

## Projetos apresentados

| Projeto | Stack | Repositório |
|---|---|---|
| Tracker Responsável | Java 21, Swing, SQLite, Maven, JUnit 5 | [tracker-responsavel](https://github.com/GuilhermeWaldemir/tracker-responsavel) |
| Painel Pessoal | React 19, TypeScript, Vite, Supabase, PWA | [painel-pessoal](https://github.com/GuilhermeWaldemir/painel-pessoal) |
| Monitor de Preços | Python 3.13, Flask, SQLite, pytest | [monitor-de-precos](https://github.com/GuilhermeWaldemir/monitor-de-precos) |

## Tecnologias

HTML, CSS e JavaScript puros, sem framework e sem etapa de build. O site é estático: são três
arquivos servidos direto, o que o deixa rápido de abrir e simples de hospedar.

## Como funciona

- **Slides horizontais com CSS.** O trilho usa `scroll-snap-type: x mandatory`, então a rolagem
  “gruda” em cada slide. No celular e no trackpad, arrastar para o lado já funciona sem JavaScript.
- **Rolagem do mouse.** O JavaScript só assume a roda do mouse quando o slide já foi lido até o
  fim; aí ele pula para o próximo. Uma trava impede que a inércia do trackpad pule vários slides.
- **Slide ativo.** Um `IntersectionObserver` avisa qual slide está na tela e atualiza o menu, o
  contador e o endereço (`#painel`, `#monitor`…), então dá para compartilhar o link de um projeto.
- **Funciona sem JavaScript.** Sem JS, o conteúdo continua visível e os links do menu levam a cada
  slide; o JS apenas melhora a navegação.
- **Tema claro e escuro** seguindo a preferência do sistema, via `prefers-color-scheme`.
- **Acessibilidade:** navegação pelo teclado (← → Home End), link para pular direto ao conteúdo,
  textos alternativos nas imagens e respeito a `prefers-reduced-motion`.

## Estrutura

```
index.html   conteúdo dos 4 slides
style.css    tokens de cor, layout dos slides e responsividade
script.js    navegação (roda do mouse, setas, abas, teclado, #hash)
assets/      imagens dos projetos (WebP, ~97 KB no total)
```

## Rodando localmente

Basta abrir o `index.html` no navegador. Para servir por HTTP:

```bash
python -m http.server 8000   # http://localhost:8000
```
