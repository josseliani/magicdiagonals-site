const vd=document.getElementById('video-dialog');
if(vd){
 const vv=vd.querySelector('video');
 document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>{
   vv.pause(); vv.replaceChildren();
   const source=document.createElement('source');source.src=b.dataset.video;source.type='video/mp4';vv.append(source);
   const lang=document.documentElement.lang;
   if(['de','es','ja','zh'].includes(lang)){
     const type=b.dataset.video.includes('rcc-')?'rcc':'rsi';
     const track=document.createElement('track');track.kind='captions';track.src=`assets/${type}-${lang}.vtt`;
     track.srclang=lang;track.label=lang.toUpperCase();track.default=true;vv.append(track);
   }
   vv.load();vd.showModal();
   vv.addEventListener('loadedmetadata',()=>{vv.currentTime=Number(b.dataset.start||0)},{once:true});
   vv.play().catch(()=>{});
 }));
 vd.querySelector('.close').addEventListener('click',()=>vd.close());
 vd.addEventListener('close',()=>{vv.pause();vv.replaceChildren();vv.load()});
 vd.addEventListener('click',e=>{if(e.target===vd)vd.close()});
}
const foreignEnhancer=document.createElement('script');foreignEnhancer.src='foreign-enhance.js';document.body.append(foreignEnhancer);
