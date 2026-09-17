// MP Advertising & Marketing — shared interactions
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // mobile dropdown from TOP
  var burger=document.getElementById('burger'), mnav=document.getElementById('mnav');
  if(burger&&mnav){burger.addEventListener('click',function(){mnav.classList.toggle('open');});mnav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mnav.classList.remove('open');});});}
  // scroll reveal
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}});},{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('vis');}); }
  // gallery filter + lightbox (images + videos)
  var fbtns=document.querySelectorAll('.fbtn'), gitems=document.querySelectorAll('#galGrid img'),
      galGrid=document.getElementById('galGrid'), videoGrid=document.getElementById('videoGrid'),
      videoLabel=document.getElementById('videoLabel');
  function pauseVids(){if(videoGrid)videoGrid.querySelectorAll('video').forEach(function(v){v.pause();});}
  if(videoGrid)videoGrid.querySelectorAll('video').forEach(function(v){v.addEventListener('play',function(){videoGrid.querySelectorAll('video').forEach(function(o){if(o!==v)o.pause();});});});
  fbtns.forEach(function(b){b.addEventListener('click',function(){
    fbtns.forEach(function(x){x.classList.remove('on');});b.classList.add('on');
    var f=b.dataset.filter;
    if(f==='videos'){
      if(galGrid)galGrid.style.display='none';
      if(videoGrid)videoGrid.style.display='grid';
      if(videoLabel)videoLabel.style.display='block';
    } else {
      pauseVids();
      if(galGrid)galGrid.style.display='';
      var showV=(f==='all');
      if(videoGrid)videoGrid.style.display=showV?'grid':'none';
      if(videoLabel)videoLabel.style.display=showV?'block':'none';
      gitems.forEach(function(im){im.parentElement.style.display=(f==='all'||im.dataset.cat===f)?'':'none';});
    }
  });});
  var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg');
  if(lb){gitems.forEach(function(im){im.addEventListener('click',function(){lbImg.src=im.src;lb.classList.add('open');});});
    lb.addEventListener('click',function(){lb.classList.remove('open');});document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open');});}
  // service detail modal
  var modal=document.getElementById('svcModal');
  function openSvc(title,desc,img,uses){
    if(!modal) return;
    document.getElementById('mTitle').textContent=title;
    document.getElementById('mDesc').textContent=desc;
    document.getElementById('mUses').textContent=uses||'';
    document.getElementById('mImg').src=img;
    document.getElementById('mQuote').href='enquiry.html?service='+encodeURIComponent(title);
    modal.classList.add('open');
  }
  document.querySelectorAll('[data-svc]').forEach(function(btn){
    btn.addEventListener('click',function(e){e.preventDefault();
      openSvc(btn.dataset.title,btn.dataset.desc,btn.dataset.img,btn.dataset.uses);
    });
  });
  if(modal){modal.addEventListener('click',function(e){if(e.target===modal||e.target.dataset.close)modal.classList.remove('open');});}
  // prefill service from URL
  var sel=document.getElementById('fService');
  if(sel){var q=new URLSearchParams(location.search).get('service');if(q){sel.value=q;}}
  // broken-image safety net — kabhi tooti image mat dikhao (QR ko chhod kar)
  document.querySelectorAll('img').forEach(function(im){
    im.addEventListener('error',function h(){
      im.removeEventListener('error',h);
      if(/qrserver/.test(im.src))return;
      var svg="<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ff3d00'/><stop offset='1' stop-color='#ffb300'/></linearGradient></defs><rect width='800' height='600' fill='#141419'/><rect width='800' height='600' fill='url(#g)' opacity='0.3'/><text x='400' y='290' fill='white' font-family='Arial' font-size='44' font-weight='bold' text-anchor='middle'>MP Advertising</text><text x='400' y='335' fill='#ffb300' font-family='Arial' font-size='22' text-anchor='middle'>&amp; Marketing</text></svg>";
      im.src='data:image/svg+xml;utf8,'+encodeURIComponent(svg);
    });
  });
  // video slider — slide badalne par doosri video pause, audio user play par
  document.querySelectorAll('.vslider').forEach(function(sl){
    var track=sl.querySelector('.vtrack'), slides=sl.querySelectorAll('.vslide'),
        dots=sl.parentElement.querySelectorAll('.vdots button'), i=0;
    function go(n){
      i=(n+slides.length)%slides.length;
      track.style.transform='translateX(-'+(i*100)+'%)';
      slides.forEach(function(s,k){var v=s.querySelector('video');if(v&&k!==i)v.pause();});
      dots.forEach(function(d,k){d.classList.toggle('on',k===i);});
      var vv=slides[i].querySelector('video');if(vv&&vv.dataset.autonext==='1')vv.play().catch(function(){});
    }
    sl.querySelector('.vprev').addEventListener('click',function(){go(i-1);});
    sl.querySelector('.vnext').addEventListener('click',function(){go(i+1);});
    dots.forEach(function(d,k){d.addEventListener('click',function(){go(k);});});
    slides.forEach(function(s){var v=s.querySelector('video');if(v)v.addEventListener('play',function(){slides.forEach(function(o){var ov=o.querySelector('video');if(ov&&ov!==v)ov.pause();});});});
  });
  // enquiry -> WhatsApp
  var form=document.getElementById('enquiryForm');
  if(form){form.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(id){return (document.getElementById(id)||{}).value||'';};
    var msg='New Enquiry - MP Advertising & Marketing\n\nName: '+v('fName')+'\nMobile: '+v('fMobile')+'\nBusiness Name: '+v('fBiz')+'\nBusiness Category: '+v('fCat')+'\nCity / Location: '+v('fCity')+'\nAdvertising Service: '+v('fService')+'\nApprox Budget: '+v('fBudget')+'\nMessage: '+v('fMsg');
    window.open('https://api.whatsapp.com/send?phone=919303624365&text='+encodeURIComponent(msg),'_blank');
    var ok=document.getElementById('formOk');if(ok)ok.style.display='block';
  });}
})();
