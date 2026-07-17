'use strict';
(() => {
  async function request(endpoint, params={}) {
    const url=new URL(`/api/${endpoint}`,location.origin); Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=='')url.searchParams.set(k,v)});
    const controller=new AbortController(); const t=setTimeout(()=>controller.abort(),15000);
    try{const res=await fetch(url,{headers:{accept:'application/json'},signal:controller.signal}); const data=await res.json().catch(()=>({})); if(!res.ok){const e=new Error(data.message||data.error||`Request failed (${res.status})`);e.code=data.code;e.status=res.status;throw e;} return data;}finally{clearTimeout(t)}
  }
  async function bundleByCity(city){const [current,forecast]=await Promise.all([request('weather',{q:city,units:'metric'}),request('forecast',{q:city,units:'metric'})]);return AWWeather.normalize(current,forecast,{name:city});}
  async function bundleByCoords(lat,lon,hint={}){const [current,forecast]=await Promise.all([request('weather',{lat,lon,units:'metric'}),request('forecast',{lat,lon,units:'metric'})]);return AWWeather.normalize(current,forecast,hint);}
  async function geocode(q){return request('geocode',{q,limit:7});}
  async function airQuality(lat,lon){return request('air-quality',{lat,lon});}
  window.awApi={request,bundleByCity,bundleByCoords,geocode,airQuality};
})();
