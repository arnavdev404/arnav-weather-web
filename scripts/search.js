'use strict';
(() => {
  let timer=null,active=-1;
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function setup(inputId,boxId,clearId,submitId){
    const input=document.getElementById(inputId),box=document.getElementById(boxId),clear=document.getElementById(clearId),submit=document.getElementById(submitId); if(!input)return;
    const search=()=>{const q=input.value.trim();if(q)window.awApp?.loadCity(q).then(()=>window.awRouter?.navigate('dashboard'));};
    input.addEventListener('input',()=>{clear.style.display=input.value?'grid':'none';clearTimeout(timer);const q=input.value.trim();if(q.length<2){box.style.display='none';return;}timer=setTimeout(async()=>{try{const rows=await awApi.geocode(q);render(rows,input,box);}catch{box.style.display='none';}},300)});
    input.addEventListener('keydown',e=>{const items=[...box.querySelectorAll('.aw-suggestion')];if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(active+1,items.length-1);select(items);}else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(active-1,0);select(items);}else if(e.key==='Enter'){e.preventDefault();if(items[active])items[active].click();else search();}else if(e.key==='Escape'){box.style.display='none';}});
    clear?.addEventListener('click',()=>{input.value='';clear.style.display='none';box.style.display='none';input.focus();}); submit?.addEventListener('click',search);
  }
  function select(items){items.forEach((x,i)=>x.setAttribute('aria-selected',i===active?'true':'false'));items[active]?.scrollIntoView({block:'nearest'});}
  function render(rows,input,box){active=-1;box.innerHTML=(rows||[]).map((r,i)=>`<button class="aw-suggestion" role="option" data-i="${i}"><i class="fas fa-location-dot"></i><span><strong>${escapeHtml(r.name)}</strong><span class="aw-suggestion__meta">${escapeHtml([r.state,r.country].filter(Boolean).join(', '))}</span></span></button>`).join('')||'<div class="aw-suggestion__meta" style="padding:1rem">No matching cities found.</div>';box.style.display='block';box.querySelectorAll('.aw-suggestion').forEach((btn,i)=>btn.addEventListener('click',()=>{const r=rows[i];input.value=r.name;box.style.display='none';window.awApp?.loadCoords(r.lat,r.lon,{name:r.name,state:r.state,country:r.country}).then(()=>window.awRouter?.navigate('dashboard'));}));}
  document.addEventListener('DOMContentLoaded',()=>{setup('aw-header-search-input','aw-header-suggestions','aw-header-search-clear','aw-header-search-submit');setup('aw-search-input','aw-search-suggestions','aw-search-clear','aw-search-submit');document.getElementById('aw-search-location-btn')?.addEventListener('click',()=>window.awApp?.useLocation());});
  window.awSearch={setup};
})();
