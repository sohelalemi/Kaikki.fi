(() => {
  const style=document.createElement('style');
  style.textContent=`
  #kaikkiLightbox{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.94);display:none;align-items:center;justify-content:center}
  #kaikkiLightbox.show{display:flex}
  #kaikkiLightbox img{max-width:92vw;max-height:88vh;object-fit:contain;user-select:none;transition:transform .18s ease;transform-origin:center center;cursor:zoom-in}
  #kaikkiLightbox.zoomed img{transform:scale(1.8);cursor:zoom-out}
  #kaikkiLightbox .lb-close,#kaikkiLightbox .lb-prev,#kaikkiLightbox .lb-next{position:absolute;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:34px;line-height:1;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;cursor:pointer;z-index:2}
  #kaikkiLightbox .lb-close{top:18px;right:18px}
  #kaikkiLightbox .lb-prev{left:18px;top:50%;transform:translateY(-50%)}
  #kaikkiLightbox .lb-next{right:18px;top:50%;transform:translateY(-50%)}
  #kaikkiLightbox .lb-count{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);color:#fff;background:rgba(0,0,0,.45);padding:7px 12px;border-radius:999px;font-size:14px}
  #detailsModal #detailMainImage{cursor:zoom-in}
  @media(max-width:640px){#kaikkiLightbox .lb-prev{left:8px}#kaikkiLightbox .lb-next{right:8px}#kaikkiLightbox .lb-close{top:10px;right:10px}#kaikkiLightbox img{max-width:96vw;max-height:84vh}}
  `;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend',`<div id="kaikkiLightbox" aria-hidden="true"><button type="button" class="lb-close" aria-label="Sulje">×</button><button type="button" class="lb-prev" aria-label="Edellinen kuva">‹</button><img alt="Ilmoituksen kuva"><button type="button" class="lb-next" aria-label="Seuraava kuva">›</button><div class="lb-count"></div></div>`);
  const box=document.querySelector('#kaikkiLightbox'),img=box.querySelector('img'),count=box.querySelector('.lb-count');
  let photos=[],index=0;
  function show(){if(!photos.length)return;index=(index+photos.length)%photos.length;img.src=photos[index];count.textContent=`${index+1} / ${photos.length}`;box.classList.remove('zoomed');box.classList.add('show');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';const multi=photos.length>1;box.querySelector('.lb-prev').style.display=multi?'grid':'none';box.querySelector('.lb-next').style.display=multi?'grid':'none'}
  function close(){box.classList.remove('show','zoomed');box.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  function collectFromDetails(main){const thumbs=[...document.querySelectorAll('#detailsModal .detail-thumb img')].map(x=>x.src);photos=thumbs.length?thumbs:[main.src];index=Math.max(0,photos.indexOf(main.src));show()}
  document.addEventListener('click',e=>{const main=e.target.closest('#detailsModal #detailMainImage');if(main){e.preventDefault();e.stopPropagation();collectFromDetails(main);return}if(e.target===box)close()});
  box.querySelector('.lb-close').onclick=close;
  box.querySelector('.lb-prev').onclick=()=>{index--;show()};
  box.querySelector('.lb-next').onclick=()=>{index++;show()};
  img.onclick=()=>box.classList.toggle('zoomed');
  document.addEventListener('keydown',e=>{if(!box.classList.contains('show'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft'){index--;show()}if(e.key==='ArrowRight'){index++;show()}});
  let touchX=null;box.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});box.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)<45)return;index+=dx<0?1:-1;show()},{passive:true});
})();