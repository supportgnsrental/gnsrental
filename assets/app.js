(() => {
  'use strict';
  const products = window.GNS_CATALOG;
  const config = window.GNS_CONFIG;
  const byId = Object.assign(Object.create(null),Object.fromEntries(products.map(p=>[p.id,p])));
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:n%1?2:0,maximumFractionDigits:2}).format(n);
  const priceLabel=p=>p.price===null?'Pricing by quote':money(p.price);
  const itemPhoto=p=>p.image?`<img src="/assets/images/${p.image}" alt="${esc(p.name)}">`:'<div class="photo-pending"><span>GNS</span><small>Photo pending</small></div>';
  const hasUnpriced=()=>Object.keys(cart).some(id=>byId[id].price===null);
  const estimateLabel=()=>money(total())+(hasUnpriced()?' + pricing by quote':'');
  const storage = {get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{/* List still works for this visit. */}}};
  let cart={};let market='dc';let activeCategory='All';let lastFocus=null;let toastTimer;
  try { const saved=JSON.parse(storage.get('gns-rentals-v1')||'{}');if(saved.market==='dfw')market='dfw';for(const [id,q] of Object.entries(saved.items||{})){if(byId[id]&&Number.isInteger(q)&&q>0&&q<=999)cart[id]=q;} } catch{/* Use a fresh list. */}
  const params=new URLSearchParams(location.search);
  if(['dc','dfw'].includes(params.get('area')))market=params.get('area');
  if(location.pathname.replace(/\/$/,'')==='/service-areas/dfw')market='dfw';
  if(location.pathname.replace(/\/$/,'')==='/service-areas/dc-northern-virginia')market='dc';
  if(products.some(p=>p.category===params.get('category')))activeCategory=params.get('category');
  const save=()=>storage.set('gns-rentals-v1',JSON.stringify({market,items:cart}));
  const total=()=>Object.entries(cart).reduce((n,[id,q])=>n+(byId[id].price??0)*q,0);
  const unavailable=()=>Object.keys(cart).filter(id=>byId[id].markets[market]==='unavailable');
  const status=p=>p.markets[market]==='available'?'Offered in this market · date availability by quote':p.markets[market]==='unavailable'?'Not offered in this market':'Confirm with quote';
  function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('visible'),3300);}
  function renderCart(){
    const count=Object.values(cart).reduce((n,q)=>n+q,0);$$('.cart-count').forEach(n=>n.textContent=count);
    const entries=Object.entries(cart);
    $('#cart-items').innerHTML=entries.length?entries.map(([id,q])=>{const p=byId[id];return `<div class="cart-item">${itemPhoto(p)}<div><h3>${esc(p.name)}</h3><p>${p.price===null?'Pricing by quote':money(p.price)+' each / rental'}</p><p>${status(p)}</p><div class="quantity-controls"><button data-change="${id}" data-step="-1" aria-label="Reduce ${esc(p.name)} quantity">−</button><span aria-label="Quantity">${q}</span><button data-change="${id}" data-step="1" aria-label="Increase ${esc(p.name)} quantity" ${q>=999?'disabled':''}>+</button><button class="remove" data-remove="${id}" aria-label="Remove ${esc(p.name)}">Remove</button></div></div><span class="cart-item-price">${p.price===null?'By quote':money(p.price*q)}</span></div>`}).join(''):`<div class="cart-empty"><h3>A little inspiration<br>goes a long way.</h3><p>Your rental list is waiting for its first beautiful piece.</p><a href="/catalog" class="button button-outline">Explore the collection</a></div>`;
    $('#cart-total').textContent=estimateLabel();
    if($('#quote-items')) {
      $('#quote-items').innerHTML=entries.length?entries.map(([id,q])=>{const p=byId[id];return `<div class="quote-row">${itemPhoto(p)}<div><h3>${esc(p.name)}</h3><p>${q} × ${priceLabel(p)}${p.price===null?'':' / rental'}</p><p>${status(p)}</p></div><strong>${p.price===null?'By quote':money(p.price*q)}</strong></div>`}).join(''):'<p>No pieces selected yet? That’s okay. Tell us your vision below, or explore the collection to start a list.</p>';
      $('#quote-total').textContent=estimateLabel();
    }
    $$('[data-detail-price]').forEach(n=>n.textContent=money(byId[n.dataset.detailPrice].price));
    $$('[data-status]').forEach(n=>{const p=byId[n.dataset.status];n.textContent=(market==='dc'?'DMV':'DFW')+' · '+status(p)});
    $$('[data-add]').forEach(b=>b.disabled=byId[b.dataset.add].markets[market]==='unavailable');
  }
  function setMarket(value){market=value;$$('[data-market-select]').forEach(s=>s.value=market);save();renderCart();filterCatalog();}
  function add(id,quantity=1){const p=byId[id];if(!p||p.markets[market]==='unavailable')return;if(!Number.isInteger(quantity)||quantity<1||quantity>999){toast('Please choose a quantity from 1 to 999.');return}cart[id]=Math.min(999,(cart[id]||0)+quantity);save();renderCart();toast(p.name+' added to your rental list');track('add_to_rental_list',{item_id:id,quantity,service_area:market});}
  const dialog=$('#cart-dialog');
  function openCart(){lastFocus=document.activeElement;renderCart();dialog.showModal();document.body.classList.add('modal-open');}
  function closeCart(){dialog.close();}
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastFocus?.isConnected)lastFocus.focus()});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeCart()}});
  document.addEventListener('click',e=>{
    const addButton=e.target.closest('[data-add]');if(addButton){const input=addButton.dataset.quantityInput?$('#'+addButton.dataset.quantityInput):null;add(addButton.dataset.add,input?Number(input.value):1)}
    if(e.target.closest('[data-open-cart]'))openCart();
    if(e.target.closest('[data-close-cart]'))closeCart();
    const change=e.target.closest('[data-change]');if(change){const id=change.dataset.change;const q=Math.min(999,(cart[id]||0)+Number(change.dataset.step));if(q<1)delete cart[id];else cart[id]=q;save();renderCart();}
    const remove=e.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];save();renderCart();}
    const filter=e.target.closest('[data-filter]');if(filter){activeCategory=filter.dataset.filter;filterCatalog();}
    const consent=e.target.closest('[data-consent]');if(consent)setConsent(consent.dataset.consent);
    if(e.target.closest('[data-cookie-settings]')){$('#cookie-banner').hidden=false;$('#cookie-banner [data-consent]').focus();}
  });
  $$('[data-market-select]').forEach(select=>select.addEventListener('change',()=>setMarket(select.value)));
  const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');$('#nav').classList.toggle('open',open)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'&&!document.querySelector('.nav-trigger[aria-expanded="true"]')){menu.click();menu.focus()}});
  // Accessible click/keyboard dropdowns also work on touch devices.
  const triggers=$$('.nav-trigger');
  function closeDropdowns(except=null){triggers.forEach(t=>{if(t!==except){t.setAttribute('aria-expanded','false');document.getElementById(t.getAttribute('aria-controls')).hidden=true}})}
  triggers.forEach(t=>t.addEventListener('click',()=>{const open=t.getAttribute('aria-expanded')!=='true';closeDropdowns(t);t.setAttribute('aria-expanded',String(open));document.getElementById(t.getAttribute('aria-controls')).hidden=!open}));
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-dropdown'))closeDropdowns()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const active=triggers.find(t=>t.getAttribute('aria-expanded')==='true');if(active){closeDropdowns();active.focus()}}});
  menu.addEventListener('click',()=>{if(menu.getAttribute('aria-expanded')==='false')closeDropdowns()});
  const searchDialog=$('#search-dialog');let searchFocus;
  $$('[data-open-search]').forEach(b=>b.addEventListener('click',()=>{searchFocus=document.activeElement;searchDialog.showModal();document.body.classList.add('modal-open');$('#site-search').focus()}));
  $('[data-close-search]').addEventListener('click',()=>searchDialog.close());
  searchDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');searchFocus?.focus()});
  searchDialog.addEventListener('click',e=>{if(e.target===searchDialog){const r=searchDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)searchDialog.close()}});
  if($('#catalog-search')&&params.has('q'))$('#catalog-search').value=params.get('q').slice(0,100);
  function filterCatalog(){
    const holder=$('#catalog-grid');if(!holder)return;
    const query=($('#catalog-search')?.value||'').trim().toLowerCase();
    let visible=products.filter(p=>p.markets[market]!=='unavailable'&&(activeCategory==='All'||p.category===activeCategory)&&`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query));
    const order=$('#catalog-sort')?.value;if(order==='price-low')visible.sort((a,b)=>(a.price===null?Infinity:a.price)-(b.price===null?Infinity:b.price));if(order==='price-high')visible.sort((a,b)=>(b.price===null?-Infinity:b.price)-(a.price===null?-Infinity:a.price));if(order==='name')visible.sort((a,b)=>a.name.localeCompare(b.name));
    const cards=new Map($$('#catalog-grid [data-product-card]').map(el=>[el.dataset.id,el]));
    cards.forEach(card=>card.hidden=true);const grid=holder.querySelector('.product-grid');visible.forEach(p=>{const card=cards.get(p.id);card.hidden=false;grid.append(card)});
    $('#catalog-count').textContent=`${visible.length} ${visible.length===1?'piece':'pieces'} for ${market==='dc'?'DMV':'Dallas–Fort Worth'}`;
    $('#catalog-empty').hidden=visible.length>0;
    $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===activeCategory)));
    $('#availability-note').textContent=`${market==='dc'?'DMV':'Dallas–Fort Worth'}: inventory, minimums, delivery and setup are reviewed for your location and date. “Confirm with quote” means availability has not yet been confirmed.`;
  }
  $('#catalog-search')?.addEventListener('input',filterCatalog);$('#catalog-sort')?.addEventListener('change',filterCatalog);
  $('#reset-filters')?.addEventListener('click',()=>{activeCategory='All';$('#catalog-search').value='';$('#catalog-sort').value='featured';filterCatalog()});
  const contact=$('#business-contact');if(contact){let html='';if(config.email)html+=`<a href="mailto:${esc(config.email)}">${esc(config.email)}</a>`;if(config.phone)html+=`<a href="tel:${esc(config.phone.replace(/[^+\d]/g,''))}">${esc(config.phone)}</a>`;if(/^https:\/\//.test(config.instagramUrl))html+=`<a href="${esc(config.instagramUrl)}" target="_blank" rel="noopener noreferrer">Find us on Instagram</a>`;contact.innerHTML=html;}
  function localDate(){const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`}
  const form=$('#quote-form');
  if(form){
    const date=form.elements.date,endDate=form.elements.endDate;date.min=localDate();endDate.min=localDate();
    const collection=params.get('collection');
    const occasions={'weddings':'Wedding','nikkah-walimat':'Walimat-ul-Nikkah','birthdays-milestones':'Birthday','baby-bridal-showers':'Baby / bridal shower','graduations':'Graduation','corporate-events':'Corporate event','cultural-celebrations':'Cultural celebration'};
    if(Object.hasOwn(occasions,collection))form.elements.occasion.value=occasions[collection];
    const categoryNames={'chairs':'Chairs','tables':'Tables','linens-napkins':'Linens & Napkins','charger-plates':'Charger Plates','dinnerware':'Dinnerware','flatware':'Flatware','glassware':'Glassware','catering-chafers':'Chafing Dishes & Catering','centerpieces-vases':'Centerpieces & Vases','backdrops-arches':'Backdrops & Arches','pedestals-displays':'Pedestals & Display Stands','cake-dessert-displays':'Cake & Dessert Displays','lounge-specialty':'Lounge & Specialty Furniture','decor-accessories':'Décor & Accessories','tabletop':'Tabletop','specialty-rentals':'Specialty Rentals'};
    if(Object.hasOwn(categoryNames,params.get('category')))form.elements.notes.value='Interested in '+categoryNames[params.get('category')]+'. Styles and quantities: ';
    if(params.get('look')==='gold-white')form.elements.notes.value='Gold & White Collection: please review gold charger plates, gold flatware, gold-accented centerpieces and napkins, along with my selected pieces. Additional quantities and styles: ';
    const style=params.get('style');if(['Modern Black & Gold','Romantic Blush','Timeless White','Royal Blue & Gold','Garden Romance'].includes(style))form.elements.notes.value='Preferred palette: '+style+'. Requested pieces and quantities: ';

    date.addEventListener('change',()=>{endDate.min=date.value||localDate();endDate.setCustomValidity('')});
    endDate.addEventListener('change',()=>endDate.setCustomValidity(endDate.value&&date.value&&endDate.value<date.value?'Return date must be on or after the event date.':''));
    form.addEventListener('submit',async e=>{
      e.preventDefault();const result=$('#quote-result');
      if(endDate.value&&endDate.value<date.value){endDate.setCustomValidity('Return date must be on or after the event date.');form.reportValidity();return}endDate.setCustomValidity('');
      if(!form.reportValidity())return;
      if(unavailable().length){result.hidden=false;result.innerHTML='<h3>Please review your rental list.</h3><p>One or more selected pieces are not offered in this market. Open your list and remove those items before submitting.</p>';result.scrollIntoView({block:'nearest'});return;}
      const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='Sending your request…';
      const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
      try {
        const data=payload();const response=await fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});const reply=await response.json();
        if(!response.ok||!reply.ok)throw new Error(reply.code==='NOT_CONFIGURED'?'Online quote delivery is not connected yet.':reply.message||'Your request could not be submitted.');
        result.hidden=false;result.innerHTML=`<h3>Thank you, ${esc(data.name.split(' ')[0])}.</h3><p>Your request has been submitted to GNS Event Rentals. Your request reference is <strong>${esc(reply.reference)}</strong>. Your event is not booked until GNS confirms availability and the rental agreement.</p>${reply.confirmationSent===true?'<p>A confirmation email has been sent to '+esc(data.email)+'. Please check your inbox and spam folder.</p>':reply.confirmationSent===false?'<p>GNS received your request, but we could not send your confirmation email. You do not need to submit again. Please download a copy for your records.</p>':'<p>You can download a copy of your request for your records.</p>'}`;
        track('quote_request_submitted',{service_area:market,item_count:Object.keys(cart).length});
      } catch(error) {
        result.hidden=false;result.innerHTML=`<h3>Your request has not been sent.</h3><p>${esc(error.name==='AbortError'?'The connection timed out. Please try again.':error.message)} Download your request to keep a copy${config.email?', or open an email draft to send it to GNS':', and try again once online delivery is available'}.</p>${config.email?'<button type="button" class="button button-outline" id="email-request">Open email draft</button>':''}`;
        $('#email-request')?.addEventListener('click',()=>{location.href='mailto:'+encodeURIComponent(config.email)+'?subject='+encodeURIComponent('GNS rental quote request — '+payload().date)+'&body='+encodeURIComponent(requestText(payload()))});
      }finally{clearTimeout(timeout);button.disabled=false;button.textContent='Send quote request';result.scrollIntoView({behavior:'smooth',block:'nearest'})}
    });
    $('#download-request').addEventListener('click',()=>{const data=payload();const blob=new Blob([requestText(data)],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='GNS-Rental-Request-'+(data.date||'Draft')+'.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Request copy downloaded. This does not send it to GNS.');});
  }
  function payload(){const fd=new FormData(form);const data=Object.fromEntries(fd.entries());data.consent=fd.has('consent');data.area=market;data.items=Object.entries(cart).map(([id,quantity])=>({id,quantity}));return data;}
  function requestText(data){return ['GNS EVENT RENTALS — RENTAL QUOTE REQUEST','This copy is not a booking confirmation.','',`Service area: ${data.area==='dc'?config.primaryArea:config.secondaryArea}`,`Event date: ${data.date||'To be confirmed'}`,`End / return date: ${data.endDate||'To be confirmed'}`,`Occasion: ${data.occasion||'To be confirmed'}`,`Guests: ${data.guests||'To be confirmed'}`,`Venue: ${data.venue||'To be confirmed'}`,`Location: ${data.location||'To be confirmed'}`,`Service: ${data.service||'To be confirmed'}`,'','RENTAL LIST',...data.items.map(i=>byId[i.id].price===null?`${i.quantity} × ${byId[i.id].name} — pricing by quote`:`${i.quantity} × ${byId[i.id].name} @ ${money(byId[i.id].price)} = ${money(byId[i.id].price*i.quantity)}`),`Estimated priced-item subtotal: ${estimateLabel()}`,'Items marked pricing by quote are excluded from the estimate.', 'Rates are sample starting estimates for a 24-hour rental. Delivery, setup, taxes and other applicable charges are quoted separately.','',`Name: ${data.name||''}`,`Email: ${data.email||''}`,`Phone: ${data.phone||''}`,`Company: ${data.company||''}`,'',`Notes: ${data.notes||''}`].join('\n');}
  let analyticsLoaded=false;
  function loadAnalytics(){if(analyticsLoaded||!/^G-[A-Z0-9]+$/.test(config.googleAnalyticsId))return;analyticsLoaded=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('js',new Date());gtag('config',config.googleAnalyticsId,{send_page_view:true});const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.googleAnalyticsId);document.head.append(script);}
  function track(event,params){if(analyticsLoaded&&storage.get('gns-analytics-consent')==='yes')window.gtag('event',event,params);}
  function setConsent(value){storage.set('gns-analytics-consent',value);$('#cookie-banner').hidden=true;if(value==='yes'){window['ga-disable-'+config.googleAnalyticsId]=false;loadAnalytics()}else{window['ga-disable-'+config.googleAnalyticsId]=true;window.gtag?.('consent','update',{analytics_storage:'denied'});}}
  const consent=storage.get('gns-analytics-consent');if(consent==='yes')loadAnalytics();else if(config.googleAnalyticsId&&!consent)$('#cookie-banner').hidden=false;
  setMarket(market);
})();
