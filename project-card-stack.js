(()=>{
function boot(){
document.querySelectorAll(':is(#selected,#district9,#croki,#gipsy-danger) .project-feature').forEach(card=>{
const image=card.querySelector('img');
function fit(){if(image.naturalWidth&&image.naturalHeight)card.style.setProperty('--feature-ratio',String(image.naturalWidth/image.naturalHeight));}
image.addEventListener('load',fit);fit();
});
const galleries=[...document.querySelectorAll(':is(#selected,#district9,#croki,#gipsy-danger) .project-thumbs')];
function arrange(gallery){
const cards=[...gallery.children],W=gallery.clientWidth,H=gallery.clientHeight;
if(!W||!H||!cards.length)return;
const rows=cards.length>10?3:2,perRow=Math.ceil(cards.length/rows);
for(let row=0;row<rows;row++){
const group=cards.slice(row*perRow,(row+1)*perRow);
if(!group.length)continue;
const emphasized=gallery.closest('section').id==='selected'&&row===0;
const overlap=emphasized?.48:.18;
const targetH=H/(rows-.20*(rows-1))*(emphasized?1.5:1);
let sizes=group.map((card,i)=>{
const im=card.querySelector('img'),ratio=im.naturalWidth&&im.naturalHeight?im.naturalWidth/im.naturalHeight:1;
const h=targetH*[.94,1,.88, .97, .91,1][i%6];
return {w:h*ratio,h};
});
let span=sizes.reduce((sum,s,i)=>sum+s.w-(i?overlap*Math.min(s.w,sizes[i-1].w):0),0);
const factor=Math.min(1,(W-4)/span);
sizes=sizes.map(s=>({w:s.w*factor,h:s.h*factor}));
span*=factor;
let x=(W-span)*(row%2?.65:.15);
const maxH=Math.max(...sizes.map(s=>s.h));
const yBase=rows===1?(H-maxH)/2:row*(H-maxH)/(rows-1);
group.forEach((card,i)=>{
const {w,h}=sizes[i];
const y=yBase+(maxH-h)*(row===rows-1?1:[0,.45,.1,.7][i%4]);
card.style.setProperty('--card-x',x.toFixed(2)+'px');
card.style.setProperty('--card-y',y.toFixed(2)+'px');
card.style.setProperty('--card-w',w.toFixed(2)+'px');
card.style.setProperty('--card-h',h.toFixed(2)+'px');
card.style.setProperty('--card-layer',String(emphasized?40+i:row*perRow+i+1));
x+=w;if(i+1<sizes.length)x-=overlap*Math.min(w,sizes[i+1].w);
});
}
}
const observer=new ResizeObserver(entries=>entries.forEach(entry=>arrange(entry.target)));
galleries.forEach(gallery=>{
gallery.querySelectorAll('.workitem').forEach(card=>{
card.tabIndex=0;card.setAttribute('role','button');
card.setAttribute('aria-label',card.querySelector('img').alt+' — open image');
card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();card.click();}});
const im=card.querySelector('img');im.addEventListener('load',()=>arrange(gallery));im.addEventListener('error',()=>arrange(gallery));
});
observer.observe(gallery);arrange(gallery);
});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
