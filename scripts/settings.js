'use strict';
(() => {
  const KEY='arnav-weather-settings'; const defaults={defaultCity:'Delhi',timeFormat:'12h',updateInterval:'10',units:'celsius',windUnit:'kmh',pressureUnit:'hpa',distUnit:'km',useLocation:false,reducedMotion:false,compactCards:false};
  const load=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}; let state=load();
  function save(){localStorage.setItem(KEY,JSON.stringify(state));document.body.classList.toggle('aw-reduced-motion',!!state.reducedMotion);document.body.classList.toggle('aw-compact',!!state.compactCards);window.dispatchEvent(new CustomEvent('aw:settingschange',{detail:state}));}
  function bind(){
    const mapping={defaultCity:'aw-setting-default-city',timeFormat:'aw-setting-time-format',updateInterval:'aw-setting-update-interval',units:'aw-setting-units',windUnit:'aw-setting-wind-unit',pressureUnit:'aw-setting-pressure-unit',distUnit:'aw-setting-dist-unit',useLocation:'aw-setting-use-location',reducedMotion:'aw-setting-reduced-motion',compactCards:'aw-setting-compact-cards'};
    Object.entries(mapping).forEach(([k,id])=>{const el=document.getElementById(id);if(!el)return;el[el.type==='checkbox'?'checked':'value']=state[k];el.addEventListener(el.tagName==='INPUT'&&el.type==='text'?'change':'change',()=>{state[k]=el.type==='checkbox'?el.checked:el.value;save();window.awApp?.renderAll();});});
    document.querySelectorAll('.aw-settings-nav-item').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.aw-settings-nav-item').forEach(x=>x.classList.remove('aw-settings-nav-item--active'));b.classList.add('aw-settings-nav-item--active');document.getElementById(`aw-settings-${b.dataset.section}`)?.scrollIntoView({behavior:'smooth',block:'start'});}));
    document.getElementById('aw-clear-data-btn')?.addEventListener('click',()=>{if(confirm('Clear theme, settings, favorites and recent app data?')){Object.keys(localStorage).filter(k=>k.startsWith('arnav-weather')).forEach(k=>localStorage.removeItem(k));location.reload();}});
    save();
  }
  document.addEventListener('DOMContentLoaded',bind);
  window.awSettings={get state(){return state},save,defaults};
})();
