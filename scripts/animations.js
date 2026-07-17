'use strict';
(() => {
  function update(condition){const bg=document.getElementById('aw-weather-bg');if(!bg)return;const id=Number(condition);bg.dataset.weather=AWWeather.iconClass(id);}
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('aw-page-hidden',document.hidden));
  window.awAnimations={update};
})();
