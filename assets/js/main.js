/* ═══════════════════════════════════════════════════════
   Hardik Meisheri — Personal Site · main.js
   ═══════════════════════════════════════════════════════ */

// ─── Theme ────────────────────────────────────────────────
const THEME_KEY = 'hm-theme';

function initTheme() {
  const saved     = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(saved || preferred);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

// ─── Mobile Navigation ────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); });
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── Helpers ──────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Bold "Hardik Meisheri"; truncate long author lists with et al.
function formatAuthors(authors) {
  const MAX = 5;
  let list   = authors;
  let suffix = '';

  if (authors.length > MAX) {
    const meIdx = authors.indexOf('Hardik Meisheri');
    list = authors.slice(0, MAX - 1);
    if (meIdx >= MAX - 1) list.push('Hardik Meisheri');
    suffix = ', <em style="color:var(--text-faint)">et al.</em>';
  }

  return list.map(a =>
    a === 'Hardik Meisheri' ? `<strong>${escHtml(a)}</strong>` : escHtml(a)
  ).join(', ') + suffix;
}

function makeBibtex(pub) {
  const lastName = (pub.authors[0] || '').trim().split(' ').pop().toLowerCase();
  const word     = pub.title.split(/\W+/).find(w => w.length > 3)?.toLowerCase() || 'paper';
  const id       = `${lastName}${pub.year}${word.slice(0, 6)}`;

  const typeMap = {
    'conference': 'inproceedings', 'workshop': 'inproceedings',
    'journal': 'article', 'book-chapter': 'incollection',
    'preprint': 'misc', 'patent': 'misc', 'thesis': 'misc',
  };
  const entryType = typeMap[pub.type] || 'inproceedings';
  const venueField = entryType === 'article' ? 'journal' : 'booktitle';

  const authStr = pub.authors.map(a => {
    const parts = a.trim().split(' ');
    return parts.length > 1 ? `${parts.at(-1)}, ${parts.slice(0, -1).join(' ')}` : a;
  }).join(' and ');

  return [
    `@${entryType}{${id},`,
    `  title   = {${pub.title}},`,
    `  author  = {${authStr}},`,
    `  ${venueField.padEnd(7)} = {${pub.venue || pub.venue_short || ''}},`,
    `  year    = {${pub.year}}`,
    `}`,
  ].join('\n');
}

// ─── Publications ─────────────────────────────────────────
let allPubs = [];

async function initPublications() {
  if (!document.getElementById('publications-list')) return;
  try {
    const res  = await fetch('data/publications.json');
    if (!res.ok) throw new Error('Publications unavailable');
    const data = await res.json();
    allPubs = data;
    initResearchExplorer(data);
    renderCompactPubs(data);
  } catch (err) {
    const list = document.getElementById('publications-list');
    if (list) {
      list.innerHTML = `<p class="loading-state">
        Publications are temporarily unavailable. <a href="https://scholar.google.co.in/citations?user=7y5pV-gAAAAJ&amp;hl=en">Find my work on Google Scholar ↗</a>
      </p>`;
    }
  }
}


const researchTopics = [
  { id: 'core-rl', label: 'Core RL', icon: '<path d="M7 12a7 7 0 0 1 12-4m0-4v4h-4M21 16a7 7 0 0 1-12 4m0 4v-4h4"/>', description: 'Exploration, action representations, and learning with limited observations.', match: p => p.tags.includes('Reinforcement Learning') && !p.tags.some(t => ['Supply Chain', 'Games', 'Pommerman', 'Multi-Agent'].includes(t)) },
  { id: 'supply-chain', label: 'Applications of RL', icon: '<path d="m4 8 6-3 6 3-6 3-6-3Zm0 0v7l6 3 6-3V8m-6 3v7m8-3 6 3v7l-6 3-6-3v-5m6-5-6 3 6 3 6-3m-6 3v7"/>', description: 'Inventory control, fulfilment, and routing under uncertainty.', match: p => p.tags.includes('Supply Chain') },
  { id: 'nlp', label: 'NLP', icon: '<path d="M4 5h20v15H12l-6 5v-5H4V5Zm4 5h12M8 14h8"/>', description: 'Language representations, summarization, and learning from news and social media.', match: p => p.tags.includes('NLP') },
  { id: 'sentiment', label: 'Sentiment', icon: '<circle cx="14" cy="14" r="10"/><path d="M9 11h1m8 0h1M9 17q5 5 10 0"/>', description: 'Recognizing emotion and sentiment in short, noisy text.', match: p => p.tags.includes('Sentiment Analysis') },
  { id: 'multi-agent', label: 'Multi-agent', icon: '<circle cx="14" cy="5" r="3"/><circle cx="5" cy="22" r="3"/><circle cx="23" cy="22" r="3"/><path d="m12 8-5 11m10-11 5 11M8 22h12"/>', description: 'Learning with teammates and opponents, from Pommerman to coordinated fulfilment.', match: p => p.tags.some(t => ['Multi-Agent', 'Games', 'Pommerman'].includes(t)) },
  { id: 'signals', label: 'Signals & behavior', icon: '<path d="M2 15h5l3-9 5 18 4-14 3 5h5"/>', description: 'EEG signals, air quality prediction, and behavior in online communities.', match: p => p.tags.some(t => ['BCI', 'Time Series', 'Behavioral Analysis'].includes(t)) }
];

function initResearchExplorer(pubs) {
  const wheel = document.getElementById('topic-wheel');
  if (!wheel) { renderSelectedPubs(pubs.filter(p => p.featured)); return; }
  const papers = pubs.filter(p => p.type !== 'patent');
  wheel.innerHTML = '<div class="topic-orbit" aria-hidden="true"></div>' + researchTopics.map((topic, i) => {
    const count = papers.filter(topic.match).length;
    return `<button class="topic-node topic-node-${i}" data-topic="${topic.id}" aria-pressed="false" aria-controls="selected-pubs"><svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${topic.icon}</svg><span>${topic.label}</span><small>${count} papers</small></button>`;
  }).join('') + '<button class="topic-center" data-topic="selected" aria-pressed="true" aria-controls="selected-pubs"><span>Selected</span><small>Start here ↗</small></button>';
  document.getElementById('research-explorer').hidden = false;
  document.getElementById('topic-results').hidden = false;
  function selectTopic(id) {
    const topic = researchTopics.find(t => t.id === id);
    const filtered = (topic ? papers.filter(topic.match) : papers.filter(p => p.featured)).sort((a,b) => b.year - a.year);
    wheel.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === id)));
    document.getElementById('topic-title').textContent = topic ? topic.label : 'Selected papers';
    document.getElementById('topic-description').textContent = topic ? topic.description : 'A few papers to start with. Open one for the abstract and links.';
    document.getElementById('topic-status').textContent = `${filtered.length} papers shown`;
    renderSelectedPubs(filtered);
  }
  wheel.addEventListener('click', event => {
    const button = event.target.closest('button[data-topic]');
    if (button) selectTopic(button.dataset.topic);
  });
  selectTopic('selected');
}

// ── Selected publications (featured, with abstracts) ───
function renderSelectedPubs(pubs) {
  const container = document.getElementById('selected-pubs');
  if (!container) return;
  if (!pubs.length) { container.innerHTML = '<p class="no-results">No papers in this topic yet.</p>'; return; }

  container.innerHTML = pubs.map(pub => {
    const bib   = makeBibtex(pub);
    const links = [];
    if (pub.links?.paper)  links.push(`<a href="${pub.links.paper}"  class="pub-inline-link" target="_blank" rel="noopener">PDF</a>`);
    if (pub.links?.arxiv)  links.push(`<a href="${pub.links.arxiv}"  class="pub-inline-link" target="_blank" rel="noopener">arXiv</a>`);
    if (pub.links?.code)   links.push(`<a href="${pub.links.code}"   class="pub-inline-link" target="_blank" rel="noopener">Code</a>`);
    if (pub.links?.slides) links.push(`<a href="${pub.links.slides}" class="pub-inline-link" target="_blank" rel="noopener">Slides</a>`);
    links.push(`<button class="pub-inline-link bib-btn" data-bib="${encodeURIComponent(bib)}">BibTeX</button>`);

    const abstract = pub.abstract
      ? `<p class="sel-abstract">${escHtml(pub.abstract)}</p>`
      : '';

    return `
<details class="sel-entry">
  <summary><span class="paper-marker" aria-hidden="true">↗</span><span class="paper-heading"><span class="sel-title">${escHtml(pub.title)}</span><span class="sel-venue">${escHtml(pub.venue_short)}${String(pub.venue_short || '').includes(String(pub.year)) ? '' : ' &middot; ' + pub.year}</span></span><span class="disclosure-plus" aria-hidden="true">+</span></summary>
  <div class="paper-detail">${pub.thumbnail ? `<img src="${pub.thumbnail}" alt="" class="sel-thumb" loading="lazy">` : ''}
  <div class="sel-content">
    <div class="sel-authors">${formatAuthors(pub.authors)}</div>
    ${abstract}
    <div class="sel-links">${links.join('')}</div>
  </div></div>
</details>`;
  }).join('');

  container.querySelectorAll('.bib-btn').forEach(btn => {
    btn.addEventListener('click', () => openBibtex(decodeURIComponent(btn.dataset.bib)));
  });
}

// ── Compact full list (grouped by year, all visible) ───
function buildPubEntry(pub) {
  const bib      = makeBibtex(pub);
  const isPatent = pub.type === 'patent';

  const linkBtns = [];
  if (pub.links?.paper)  linkBtns.push(`<a href="${pub.links.paper}"  class="pub-inline-link" target="_blank" rel="noopener">PDF</a>`);
  if (pub.links?.arxiv)  linkBtns.push(`<a href="${pub.links.arxiv}"  class="pub-inline-link" target="_blank" rel="noopener">arXiv</a>`);
  if (pub.links?.code)   linkBtns.push(`<a href="${pub.links.code}"   class="pub-inline-link" target="_blank" rel="noopener">Code</a>`);
  if (pub.links?.slides) linkBtns.push(`<a href="${pub.links.slides}" class="pub-inline-link" target="_blank" rel="noopener">Slides</a>`);
  if (!isPatent) linkBtns.push(`<button class="pub-inline-link bib-btn" data-bib="${encodeURIComponent(bib)}">BibTeX</button>`);

  const patentBadge = isPatent ? `<span class="pub-badge-patent">Patent</span>` : '';

  return `
<div class="pub-entry" role="listitem">
  <div class="pub-entry-title">${escHtml(pub.title)}</div>
  <div class="pub-entry-authors">${formatAuthors(pub.authors)}</div>
  <div class="pub-entry-venue">${escHtml(pub.venue_short || pub.venue || '')}</div>
  <div class="pub-entry-links">${linkBtns.join('')}${patentBadge}</div>
</div>`;
}

function renderCompactPubs(pubs) {
  const list = document.getElementById('publications-list');
  if (!list) return;

  if (!pubs.length) {
    list.innerHTML = '<p class="no-results">No publications found.</p>';
    return;
  }

  const byYear = {};
  pubs.forEach(p => {
    if (!byYear[p.year]) byYear[p.year] = [];
    byYear[p.year].push(p);
  });

  const years = Object.keys(byYear).sort((a, b) => b - a);

  list.innerHTML = years.map(year => `
<div class="pub-year-group">
  <h3 class="pub-year-label">${year}</h3>
  <div class="pub-entries">${byYear[year].map(buildPubEntry).join('')}</div>
</div>`).join('');

  list.querySelectorAll('.bib-btn').forEach(btn => {
    btn.addEventListener('click', () => openBibtex(decodeURIComponent(btn.dataset.bib)));
  });
}

// ─── BibTeX Modal ─────────────────────────────────────────
let citationTrigger = null;
function openBibtex(bib) {
  const modal   = document.getElementById('bib-modal');
  const overlay = document.getElementById('bib-overlay');
  const code    = document.getElementById('bib-code');
  if (!modal || !overlay || !code) return;
  citationTrigger = document.activeElement;
  code.textContent = bib;
  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('bib-modal-close')?.focus();
}

function closeBibtex() {
  document.getElementById('bib-modal')?.classList.remove('open');
  document.getElementById('bib-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
  citationTrigger?.focus();
}

function initBibtexModal() {
  document.getElementById('bib-modal-close')?.addEventListener('click', closeBibtex);
  document.getElementById('bib-overlay')?.addEventListener('click', closeBibtex);
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('bib-modal');
    if (!modal?.classList.contains('open')) return;
    if (e.key === 'Escape') closeBibtex();
    if (e.key === 'Tab') {
      const first = document.getElementById('bib-modal-close');
      const last = document.getElementById('bib-copy-btn');
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.getElementById('bib-copy-btn')?.addEventListener('click', () => {
    const text = document.getElementById('bib-code')?.textContent || '';
    navigator.clipboard?.writeText(text).then(() => {
      const btn = document.getElementById('bib-copy-btn');
      if (!btn) return;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    }).catch(() => {});
  });
}

// ─── Footer ───────────────────────────────────────────────
function initFooter() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── Boot ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  initMobileNav();
  initPublications();
  initBibtexModal();
  initFooter();
});
