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
  // lead source tracking (Google / Facebook / Instagram / Website / Referral)
  var leadSrc='Website Direct';
  try{
    var uu=new URLSearchParams(location.search).get('utm_source');
    if(uu){leadSrc=uu;}
    else{var stored=null;try{stored=localStorage.getItem('mp_lead_src');}catch(e){}
      if(stored){leadSrc=stored;}
      else{var rf=document.referrer||'';
        if(/google\./i.test(rf))leadSrc='Google Search';
        else if(/facebook\.com/i.test(rf))leadSrc='Facebook';
        else if(/instagram\.com/i.test(rf))leadSrc='Instagram';
        else if(rf){try{var hn=new URL(rf).hostname;leadSrc=(hn.indexOf('localhost')>-1||hn.indexOf('127.')===0||hn.indexOf('mpadvertising')>-1)?'Website Direct':'Referral ('+hn+')';}catch(e){leadSrc='Referral';}}
        try{localStorage.setItem('mp_lead_src',leadSrc);}catch(e){}}}
  }catch(e){}
  // mobile sticky call bar (CALL | WHATSAPP | QUOTE) — site-wide injected
  var sb=document.createElement('div');sb.className='stickybar';
  sb.innerHTML='<a href="tel:+919303624365">📞 CALL NOW</a><a href="https://api.whatsapp.com/send?phone=919303624365&text='+encodeURIComponent('Hello MP Advertising & Marketing, I want to know about your advertising services. Please share suitable options and pricing for my business.')+'" target="_blank">💬 WHATSAPP</a><a href="enquiry.html">GET QUOTE</a>';
  document.body.appendChild(sb);
  // offer banner from SITE_CONFIG (admin editable)
  try{
    if(window.SITE_CONFIG){
      var C=window.SITE_CONFIG;
      ['offBadge','offBadge2'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=C.OFFER_BADGE;});
      var t=document.getElementById('offTitle');if(t)t.textContent=C.OFFER_TITLE;
      var d=document.getElementById('offText');if(d)d.textContent=C.OFFER_TEXT;
      var cta=document.getElementById('offCta');if(cta){cta.textContent=(C.OFFER_CTA||'Claim Offer')+' → WhatsApp';cta.href='https://api.whatsapp.com/send?phone='+C.WHATSAPP+'&text='+encodeURIComponent('Hello MP Advertising & Marketing, I want to claim the offer: '+C.OFFER_TITLE+' - '+C.OFFER_TEXT);}
    }
  }catch(e){}
  // conversion click tracking (GA4-ready via dataLayer)
  document.addEventListener('click',function(e){
    var a=e.target.closest?e.target.closest('a'):null;if(!a||!a.href)return;
    window.dataLayer=window.dataLayer||[];
    if(a.href.indexOf('whatsapp')>-1||/api\.whatsapp/.test(a.href))window.dataLayer.push({'event':'whatsapp_click','page':location.pathname});
    else if(a.href.indexOf('tel:')===0)window.dataLayer.push({'event':'call_click','page':location.pathname});
    else if(a.href.indexOf('enquiry')>-1||/GET.*QUOTE/i.test(a.textContent||''))window.dataLayer.push({'event':'get_quote_click','page':location.pathname});
  });
  // budget planner pills -> enquiry with budget preselected
  document.querySelectorAll('.pills').forEach(function(box){
    var btn=box.parentElement.querySelector('[data-plan-go]');
    box.querySelectorAll('.pill').forEach(function(p){p.addEventListener('click',function(){
      box.querySelectorAll('.pill').forEach(function(x){x.classList.remove('on');});p.classList.add('on');
      if(btn)btn.href='enquiry.html?budget='+encodeURIComponent(p.dataset.budget||p.textContent.trim());
    });});
  });
  // prefill budget from URL (?budget=)
  try{var bq=new URLSearchParams(location.search).get('budget');var bs=document.getElementById('fBudget');
    if(bq&&bs){for(var i=0;i<bs.options.length;i++){if(bs.options[i].text===bq||bq.indexOf(bs.options[i].text)>-1){bs.selectedIndex=i;break;}}}}catch(e){}
  // enquiry -> WhatsApp
  var form=document.getElementById('enquiryForm');
  if(form){form.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(id){return (document.getElementById(id)||{}).value||'';};
    var msg='Hello MP Advertising & Marketing,\n\nI want to promote my business.\n\nBusiness Name: '+v('fBiz')+'\nYour Name: '+v('fName')+'\nMobile: '+v('fMobile')+'\nCity: '+v('fCity')+'\nBusiness Category: '+v('fCat')+'\nAdvertising Requirement: '+v('fService')+'\nApproximate Budget: '+v('fBudget')+'\nMessage: '+v('fMsg')+'\nLead Source: '+leadSrc+'\n\nPlease suggest the best advertising options and send me a quotation.\n\nThank you.';
    window.dataLayer=window.dataLayer||[];window.dataLayer.push({'event':'lead_submit','service':v('fService'),'source':leadSrc});
    try{var L=JSON.parse(localStorage.getItem('mp_leads')||'[]');L.push({t:new Date().toISOString(),name:v('fName'),biz:v('fBiz'),mob:v('fMobile'),city:v('fCity'),svc:v('fService'),budget:v('fBudget'),src:leadSrc});localStorage.setItem('mp_leads',JSON.stringify(L));}catch(e){}
    window.open('https://api.whatsapp.com/send?phone=919303624365&text='+encodeURIComponent(msg),'_blank');
    var ok=document.getElementById('formOk');if(ok)ok.style.display='block';
    var mf=document.getElementById('mailFallback');
    if(mf){mf.style.display='inline-flex';mf.href='mailto:mpadvertisingandmarketing@gmail.com?subject='+encodeURIComponent('New Enquiry - '+v('fBiz'))+'&body='+encodeURIComponent(msg);}
    setTimeout(function(){location.href='thank-you.html';},900);
  });}
})();
