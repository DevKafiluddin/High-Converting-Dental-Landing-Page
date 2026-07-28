// Before/After slider
(function(){
  const ba = document.getElementById('ba');
  if(!ba) return;
  const clip = document.getElementById('baClip');
  const handle = document.getElementById('baHandle');
  const clipImg = clip.querySelector('img');
  let dragging = false;

  function setPos(pct){
    pct = Math.max(0, Math.min(100, pct));
    clip.style.width = pct + '%';
    handle.style.left = pct + '%';
    // keep the "before" image aligned with the container (compensate the clip)
    clipImg.style.width = (100 / (pct/100 || 0.0001)) + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }
  setPos(50);
  // reset clip img width properly
  clipImg.style.width = '';
  clipImg.style.position = 'absolute';
  clipImg.style.left = '0';
  clipImg.style.top = '0';
  clipImg.style.height = '100%';
  // Use container-relative width: image spans full ba, clip crops it
  function fixImg(){
    const w = ba.getBoundingClientRect().width;
    clipImg.style.width = w + 'px';
  }
  fixImg();
  window.addEventListener('resize', fixImg);

  function xToPct(x){
    const r = ba.getBoundingClientRect();
    return ((x - r.left) / r.width) * 100;
  }
  function onDown(e){ dragging = true; move(e); }
  function onUp(){ dragging = false; }
  function move(e){
    if(!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const r = ba.getBoundingClientRect();
    const pct = ((x - r.left) / r.width) * 100;
    clip.style.width = Math.max(0,Math.min(100,pct)) + '%';
    handle.style.left = Math.max(0,Math.min(100,pct)) + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }
  ba.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', onUp);
  ba.addEventListener('touchstart', onDown, {passive:true});
  window.addEventListener('touchmove', move, {passive:true});
  window.addEventListener('touchend', onUp);
  handle.addEventListener('keydown', function(e){
    const cur = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
    if(e.key === 'ArrowLeft'){ setKey(cur-5); }
    if(e.key === 'ArrowRight'){ setKey(cur+5); }
  });
  function setKey(pct){
    pct = Math.max(0,Math.min(100,pct));
    clip.style.width = pct + '%';
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }
})();

// Analytics stubs — replace with GA4 / Meta Pixel calls
function track(event, data){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({event:event}, data||{}));
  // console.log('[track]', event, data);
}
document.querySelectorAll('a[href^="tel:"]').forEach(a=>{
  a.addEventListener('click', ()=>track('phone_click',{number:a.getAttribute('href')}));
});
document.querySelectorAll('.btn--cta').forEach(b=>{
  b.addEventListener('click', ()=>track('cta_click',{label:b.textContent.trim()}));
});
document.querySelector('form')?.addEventListener('submit', ()=>track('booking_submit'));

// Scroll depth
(function(){
  const marks = [25,50,75,100]; const fired = new Set();
  window.addEventListener('scroll', ()=>{
    const p = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    marks.forEach(m=>{ if(p>=m && !fired.has(m)){ fired.add(m); track('scroll_depth',{percent:m}); } });
  }, {passive:true});
})();




