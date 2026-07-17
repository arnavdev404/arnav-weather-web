'use strict';
const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const ROOT=__dirname;dotenv.config({path:path.join(ROOT,'.env')});
const app=express();const PORT=Number(process.env.PORT||5055);const HOST='0.0.0.0';
app.disable('x-powered-by');
const endpoints={weather:'https://api.openweathermap.org/data/2.5/weather',forecast:'https://api.openweathermap.org/data/2.5/forecast',geocode:'https://api.openweathermap.org/geo/1.0/direct','air-quality':'https://api.openweathermap.org/data/2.5/air_pollution'};
const allowed={weather:new Set(['q','lat','lon','units','lang']),forecast:new Set(['q','lat','lon','units','lang','cnt']),geocode:new Set(['q','limit']),'air-quality':new Set(['lat','lon'])};

const key=()=>String(process.env.OPENWEATHER_API_KEY||'').trim();
function missingKey(res){return res.status(503).json({error:'OPENWEATHER_API_KEY is not configured',code:'API_KEY_REQUIRED'});}
function sanitize(name,query){const u=new URL(endpoints[name]);for(const [k,raw] of Object.entries(query)){if(!allowed[name].has(k))continue;const v=Array.isArray(raw)?raw.at(-1):raw;if(v!=null&&String(v).trim())u.searchParams.set(k,String(v).trim());}u.searchParams.set('appid',key());return u;}
app.get('/api/:endpoint',async(req,res)=>{const name=req.params.endpoint;if(!endpoints[name])return res.status(404).json({error:'Unknown API route'});if(!key())return missingKey(res);if(name==='geocode'&&String(req.query.q||'').trim().length<2)return res.status(400).json({error:'Search query must contain at least two characters'});if(name==='air-quality'&&(!req.query.lat||!req.query.lon))return res.status(400).json({error:'Latitude and longitude are required'});const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(sanitize(name,req.query),{headers:{accept:'application/json','user-agent':'Arnav-Weather-Web/2.0'},signal:controller.signal});const text=await r.text();res.status(r.status).set('content-type',r.headers.get('content-type')||'application/json').set('cache-control',r.ok?'public,max-age=300':'no-store').send(text);}catch(e){res.status(502).json({error:e.name==='AbortError'?'Weather service request timed out':'Weather service unavailable'});}finally{clearTimeout(timer);}});
const staticOptions={dotfiles:'deny',maxAge:process.env.NODE_ENV==='production'?'1h':0};
app.get(['/', '/index.html'],(req,res)=>res.set('Cache-Control','no-store, max-age=0').set('Pragma','no-cache').sendFile(path.join(ROOT,'index.html')));
app.use('/styles',express.static(path.join(ROOT,'styles'),staticOptions));
app.use('/scripts',express.static(path.join(ROOT,'scripts'),staticOptions));
app.use('/assets',express.static(path.join(ROOT,'assets'),staticOptions));
app.get('/sw.js',(req,res)=>res.status(410).set('Cache-Control','no-store').type('application/javascript').send("self.registration && self.registration.unregister();"));
app.use((req,res)=>res.status(404).json({error:'Route not found'}));
app.listen(PORT,HOST,()=>console.log(`Arnav Weather Web running at http://localhost:${PORT}`));
