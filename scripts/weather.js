'use strict';
(() => {
  const iconClass = id => {
    if (id >= 200 && id < 300) return 'storm';
    if (id >= 300 && id < 600) return 'rain';
    if (id >= 600 && id < 700) return 'snow';
    if (id >= 700 && id < 800) return 'mist';
    if (id === 800) return 'clear';
    return 'clouds';
  };
  function iconMarkup(id, size='md') {
    const kind = iconClass(Number(id));
    const sizeClass = ['hero','lg','sm','xs'].includes(size) ? ` aw-weather-icon--${size}` : '';
    if (kind === 'clear') return `<span class="aw-weather-icon aw-icon-sun${sizeClass}" aria-hidden="true"></span>`;
    const extra = kind === 'rain' ? ' aw-icon-rain' : kind === 'snow' ? ' aw-icon-snow' : kind === 'storm' ? ' aw-icon-storm' : '';
    return `<span class="aw-weather-icon aw-icon-cloudy${extra}${sizeClass}" aria-hidden="true"><span class="aw-icon-cloud"></span></span>`;
  }
  function localDate(epoch, offset=0) { return new Date((epoch + offset) * 1000); }
  function dateKey(epoch, offset=0) { return localDate(epoch,offset).toISOString().slice(0,10); }
  function formatTime(epoch, offset=0, format='12h') {
    const d=localDate(epoch,offset); const h=d.getUTCHours(); const m=String(d.getUTCMinutes()).padStart(2,'0');
    if(format==='24h') return `${String(h).padStart(2,'0')}:${m}`;
    return `${h%12||12}:${m} ${h>=12?'PM':'AM'}`;
  }
  function formatDate(epoch, offset=0, opts={}) { return localDate(epoch,offset).toLocaleDateString('en-US',{timeZone:'UTC',weekday:'long',month:'short',day:'numeric',...opts}); }
  const cToF = c => Math.round((c*9/5)+32);
  const kmhToMph = k => Math.round(k*0.621371);
  const hpaToInhg = h => (h*0.02953).toFixed(2);
  const kmToMiles = k => (k*0.621371).toFixed(1);
  function estimateUv(current){
    if(!current?.sys) return 0; const daylight=current.dt>current.sys.sunrise&&current.dt<current.sys.sunset; if(!daylight)return 0;
    const cloud=current.clouds?.all||0; const hour=localDate(current.dt,current.timezone||0).getUTCHours();
    return Math.max(1,Math.min(10,Math.round((7-Math.abs(13-hour))*(1-cloud/140)+2)));
  }
  function normalize(current, forecast, locationHint={}) {
    const offset=current.timezone||forecast.city?.timezone||0;
    const hourly=(forecast.list||[]).slice(0,24).map(x=>({
      epoch:x.dt,temp:Math.round(x.main.temp),feels:Math.round(x.main.feels_like),humidity:x.main.humidity,pressure:x.main.pressure,
      windKmh:Math.round((x.wind?.speed||0)*3.6),pop:Math.round((x.pop||0)*100),condition:x.weather?.[0]?.description||'Unknown',id:x.weather?.[0]?.id||800,precip:(x.rain?.['3h']||x.snow?.['3h']||0)
    }));
    const groups={};
    for(const x of forecast.list||[]){const key=dateKey(x.dt,offset);(groups[key] ||= []).push(x);}
    const daily=Object.entries(groups).slice(0,5).map(([key,items])=>{
      const rep=[...items].sort((a,b)=>Math.abs(localDate(a.dt,offset).getUTCHours()-12)-Math.abs(localDate(b.dt,offset).getUTCHours()-12))[0];
      return {key,epoch:items[0].dt,max:Math.round(Math.max(...items.map(i=>i.main.temp))),min:Math.round(Math.min(...items.map(i=>i.main.temp))),
        humidity:Math.round(items.reduce((s,i)=>s+i.main.humidity,0)/items.length),windKmh:Math.round(Math.max(...items.map(i=>(i.wind?.speed||0)*3.6))),
        pop:Math.round(Math.max(...items.map(i=>i.pop||0))*100),precip:Number(items.reduce((s,i)=>s+(i.rain?.['3h']||i.snow?.['3h']||0),0).toFixed(1)),
        condition:rep.weather?.[0]?.description||'Unknown',id:rep.weather?.[0]?.id||800};
    });
    return {
      location:{name:current.name||locationHint.name||'Unknown',state:locationHint.state||'',country:current.sys?.country||locationHint.country||'',lat:current.coord?.lat,lon:current.coord?.lon,offset},
      current:{epoch:current.dt,temp:Math.round(current.main.temp),feels:Math.round(current.main.feels_like),humidity:current.main.humidity,pressure:current.main.pressure,
        windKmh:Math.round((current.wind?.speed||0)*3.6),visibilityKm:Number(((current.visibility||0)/1000).toFixed(1)),clouds:current.clouds?.all||0,
        condition:current.weather?.[0]?.description||'Unknown',id:current.weather?.[0]?.id||800,rainMm:current.rain?.['1h']||0,uv:estimateUv(current),sunrise:current.sys?.sunrise,sunset:current.sys?.sunset},
      hourly,daily
    };
  }
  function demo() {
    const now=Math.floor(Date.now()/1000), offset=19800;
    const current={name:'Delhi',coord:{lat:28.6139,lon:77.209},timezone:offset,dt:now,main:{temp:29,feels_like:32,humidity:64,pressure:1008},wind:{speed:3.8},visibility:9000,clouds:{all:42},weather:[{id:802,description:'partly cloudy'}],sys:{country:'IN',sunrise:now-18000,sunset:now+18000}};
    const list=Array.from({length:40},(_,i)=>{const h=i*3; const temp=29+Math.sin(i/2)*4; const rain=i%7===3?.55:.08; return {dt:now+h*3600,main:{temp,feels_like:temp+2,humidity:58+(i%5)*5,pressure:1008+(i%4)},wind:{speed:2.5+(i%4)},pop:rain,weather:[{id:rain>.5?500:(i%6===0?800:802),description:rain>.5?'light rain':(i%6===0?'clear sky':'partly cloudy')}],rain:rain>.5?{'3h':1.2}:undefined};});
    return normalize(current,{list,city:{timezone:offset}},{});
  }
  window.AWWeather={normalize,demo,iconMarkup,iconClass,formatTime,formatDate,cToF,kmhToMph,hpaToInhg,kmToMiles};
})();
