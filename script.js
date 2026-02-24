/* ─── PIXEL CAT RENDERER ─── */
(function(){
  const S = 4; // px per pixel

  // Each row is a string; chars = pixel type. '.' = transparent.
  // Shared running-cat silhouette, 14 wide × 15 tall
  // Leg frames — two rows swap for run cycle (handled via CSS alternating frames)
  const rows = {
    // BLACK CAT — body=#1a1a1a, eyes=green #4dde7a, nose/ear=pink
    black: [
      '..B...........',
      '.BBB..........',
      'BPBBB.........',  // P = pink inner ear
      'BBBBBBBB......',
      'BBBBBBB.......',
      'BEEBBEE.......',  // E = green eyes
      'BBBBNBBB......',  // N = pink nose
      'BBBBBBBBBB....',
      '.BBBBBBBBBB.BB',  // tail at end
      '.BBBBBBBBBBB..',
      '.BBBBBBBBB....',
      '..BBB..BBB....',  // legs A
      '..BB....BB....',  // legs B
      '.BBB...BBB....',  // paws
      '..............', 
    ],
    // WHITE CAT — body=#ede8d0, eyes=yellow #FFD700
    white: [
      '..W...........',
      '.WWW..........',
      'WPWWW.........',
      'WWWWWWWW......',
      'WWWWWWW.......',
      'WYYWWYY.......',  // Y = yellow eyes
      'WWWWNWWW......',  // N = pink nose
      'WWWWWWWWWW....',
      '.WWWWWWWWWW.WW',
      '.WWWWWWWWWWW..',
      '.WWWWWWWWW....',
      '..WWW..WWW....',
      '..WW....WW....',
      '.WWW...WWW....',
      '..............',
    ],
    // SPOTTED CAT — white base + black spots, eyes=orange #FF8C00
    spotted: [
      '..W...........',
      '.WSW..........',  // spot on ear
      'WPWWW.........',
      'WWSSSWWW......',  // spots on head
      'WWWWWWW.......',
      'WOOSWOO.......',  // O = orange eyes, S = spot between
      'WWWWNWWW......',
      'WWSWWWWWWW....',  // spot on shoulder
      '.WWWWSWWWWW.WW',  // spot on hip
      '.WWWWWWWWWWW..',
      '.WWWWWWWWW....',
      '..WWW..WWW....',
      '..WW....WW....',
      '.WWW...WWW....',
      '..............',
    ]
  };

  const colors = {
    black:   { B:'#1a1a1a', E:'#4dde7a', P:'#cc4466', N:'#cc4466' },
    white:   { W:'#ede8d0', Y:'#FFD700', P:'#e8a0b0', N:'#e8a0b0' },
    spotted: { W:'#ede8d0', S:'#1a1a1a', O:'#FF8C00', P:'#e8a0b0', N:'#e8a0b0' }
  };

  function makeSVG(type) {
    const pixRows = rows[type];
    const pal = colors[type];
    const h = pixRows.length;
    const w = pixRows[0].length;
    let r = '';
    pixRows.forEach((row, y) => {
      for(let x = 0; x < row.length; x++) {
        const ch = row[x];
        if(ch !== '.') {
          const col = pal[ch];
          if(col) r += `<rect x="${x*S}" y="${y*S}" width="${S}" height="${S}" fill="${col}"/>`;
        }
      }
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w*S}" height="${h*S}" style="image-rendering:pixelated;display:block">${r}</svg>`;
  }

  ['black','white','spotted'].forEach(type => {
    const el = document.getElementById('pcat-' + type);
    if(el) el.innerHTML = makeSVG(type);
  });
})();

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('gone'), 3200);
});

/* ─── CURSOR ─── */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx+'px'; cur.style.top = my+'px';
});
(function animRing(){
  rx += (mx-rx)*.1; ry += (my-ry)*.1;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animRing);
})();

/* ─── SPARKLE CLICKS ─── */
const sparks = ['✦','✸','⋆','★','✺'];
document.addEventListener('click', e => {
  for(let i=0;i<7;i++){
    const el = document.createElement('div');
    el.className = 'click-spark';
    el.textContent = sparks[Math.floor(Math.random()*sparks.length)];
    const angle = (i/7)*360*Math.PI/180;
    const dist  = 28 + Math.random()*36;
    const tx = Math.cos(angle)*dist + 'px';
    const ty = Math.sin(angle)*dist + 'px';
    const rot = (Math.random()*200-100)+'deg';
    el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--tx:${tx};--ty:${ty};--rot:${rot};font-size:${.6+Math.random()*.7}rem;`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 700);
  }
});

/* ─── THEME TOGGLE ─── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const phLabel  = document.getElementById('ph-mode-label');
function updateTheme(){
  const isDark = html.getAttribute('data-theme')==='dark';
  if(phLabel) phLabel.textContent = isDark ? 'Dark mode photo' : 'Light mode photo';
}
themeBtn.addEventListener('click', () => {
  const curr = html.getAttribute('data-theme');
  html.setAttribute('data-theme', curr==='dark'?'light':'dark');
  updateTheme();
});
updateTheme();

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if(y>80) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  if(y>lastY && y>200) navbar.classList.add('hide'); else navbar.classList.remove('hide');
  lastY = y;
});

/* ─── SCROLL REVEAL ─── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold:.08, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ─── HERO PARALLAX ─── */
const heroBg = document.querySelector('.hero-bg-name');
window.addEventListener('scroll', () => {
  if(heroBg) heroBg.style.transform = `translate(-50%,calc(-50% + ${window.scrollY*.25}px))`;
});

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.btn,.nav-hire,.form-submit,.pl').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*.12}px,${y*.25}px)`;
  });
  btn.addEventListener('mouseleave',()=>{ btn.style.transform=''; });
});

/* ─── PROJECT FILTER ─── */
const ftabs = document.querySelectorAll('.ftab');
const pcards = document.querySelectorAll('.proj-card');
ftabs.forEach(tab => {
  tab.addEventListener('click', () => {
    ftabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    pcards.forEach(card => {
      const cat = card.dataset.cat;
      if(f==='all' || cat===f) {
        card.classList.remove('hidden');
        card.style.opacity='0'; card.style.transform='translateY(20px)';
        requestAnimationFrame(()=>{
          card.style.transition='opacity .4s ease,transform .4s ease';
          card.style.opacity='1'; card.style.transform='translateY(0)';
        });
      } else { card.classList.add('hidden'); }
    });
  });
});

/* ─── CONTACT FORM (Formspree) ─── */
const form = document.getElementById('contactForm');
const msg  = document.getElementById('formMsg');
if(form){
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit span');
    btn.textContent = 'Sending...';
    try {
      const res = await fetch(form.action, {
        method:'POST',
        body: new FormData(form),
        headers:{ Accept:'application/json' }
      });
      if(res.ok){
        msg.textContent = '✦ Message sent! I\'ll get back to you soon.';
        form.reset(); btn.textContent = 'Send Message ✦';
      } else {
        msg.textContent = 'Oops — something went wrong. Please try again.';
        btn.textContent = 'Send Message ✦';
      }
    } catch {
      msg.textContent = 'Network error. Please try again.';
      btn.textContent = 'Send Message ✦';
    }
  });
}

/* ─── ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-center a');
window.addEventListener('scroll', () => {
  let curr='';
  sections.forEach(s=>{
    if(window.scrollY>=s.offsetTop-150) curr=s.id;
  });
  navLinks.forEach(a=>{
    a.style.color='';
    if(a.getAttribute('href')==='#'+curr) a.style.color='var(--pink)';
  });
});
