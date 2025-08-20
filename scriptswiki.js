// Busca client-side simples + navegação de páginas simulada + TOC automático

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const pagesList = document.getElementById('pagesList');
  const pageLinks = document.querySelectorAll('.page-link, .nav-card');
  const article = document.getElementById('article');
  const currentTitle = document.getElementById('currentPageTitle');
  const tocContainer = document.getElementById('toc');
  const btnShare = document.getElementById('btnShare');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  // mobile menu toggle
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Fake navigation: troque conteúdo do article.data-page e título
  function openPage(pageName) {
    // Ajuste o título e atributo data-page
    article.setAttribute('data-page', pageName);
    const titleEl = article.querySelector('.article-title');
    titleEl.textContent = pageName;
    currentTitle.textContent = pageName;
    // Para demo, atualiza alguns trechos rapidamente
    const body = article.querySelector('.article-body');
    body.innerHTML = `<p class="lead">Conteúdo de exemplo para <strong>${pageName}</strong>. Esta é uma página da wiki do mod.</p>
      <h3 id="sec-1">Introdução</h3>
      <p>Texto explicativo e instruções.</p>
      <h3 id="sec-2">Detalhes</h3>
      <p>Mais informações técnicas e exemplos.</p>
      <h3 id="sec-3">Notas</h3>
      <p>Observações e recomendações.</p>`;
    buildTOC();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pageLinks.forEach(el => {
    el.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.target || e.currentTarget.dataset.title;
      if (target) {
        e.preventDefault();
        openPage(target);
      }
    });
  });

  // Search: filtra links na sidebar e cards
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.pages-list a').forEach(a => {
      const t = a.dataset.title.toLowerCase();
      a.style.display = t.includes(q) ? 'block' : 'none';
    });
    document.querySelectorAll('.card').forEach(card => {
      const txt = card.textContent.toLowerCase();
      card.style.display = txt.includes(q) ? 'block' : 'none';
    });
  });

  // TOC builder: coleta H3/H4 do artigo e monta links
  function buildTOC() {
    tocContainer.innerHTML = '';
    const headings = article.querySelectorAll('.article-body h3, .article-body h4');
    if (!headings.length) {
      tocContainer.style.display = 'none';
      return;
    }
    tocContainer.style.display = 'block';
    const ul = document.createElement('div');
    headings.forEach(h => {
      const id = h.id || h.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      h.id = id;
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = h.textContent;
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      ul.appendChild(a);
    });
    tocContainer.appendChild(ul);
  }

  // Copiar link simples
  btnShare.addEventListener('click', () => {
    const page = article.getAttribute('data-page');
    const fakeUrl = `${location.origin}${location.pathname}#${encodeURIComponent(page)}`;
    navigator.clipboard?.writeText(fakeUrl).then(() => {
      alert('Link copiado: ' + fakeUrl);
    }).catch(() => {
      alert('Não foi possível copiar o link.');
    });
  });

  // Inicializa TOC na tela inicial
  buildTOC();
});
