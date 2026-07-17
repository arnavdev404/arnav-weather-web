'use strict';
(() => {
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',e=>{if(el.onclick)return;e.preventDefault();window.awRouter.navigate(el.dataset.route);}));
    const toggle=()=>{document.body.classList.toggle('aw-sidebar-collapsed');localStorage.setItem('arnav-weather-sidebar',document.body.classList.contains('aw-sidebar-collapsed')?'1':'0');};
    if(localStorage.getItem('arnav-weather-sidebar')==='1')document.body.classList.add('aw-sidebar-collapsed');
    document.getElementById('aw-sidebar-toggle')?.addEventListener('click',toggle);document.getElementById('aw-header-collapse')?.addEventListener('click',toggle);
    const more=document.getElementById('aw-more-menu'),moreBtn=document.getElementById('aw-more-btn');moreBtn?.addEventListener('click',e=>{e.stopPropagation();const open=more.classList.toggle('is-open');moreBtn.setAttribute('aria-expanded',String(open));});document.addEventListener('click',e=>{if(!e.target.closest('#aw-more-menu')&&!e.target.closest('#aw-more-btn'))more?.classList.remove('is-open');});
    document.querySelector('.aw-sidebar__logo')?.addEventListener('click',e=>{e.preventDefault();awRouter.navigate('dashboard')});
  });
})();
