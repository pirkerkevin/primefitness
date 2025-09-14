
// Smooth scroll
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{ const id=a.getAttribute('href'); if(id.startsWith('#')){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth'}); } });
  });
});
// Consent + GA4
(function(){ 
  var CONSENT_KEY='pfg_consent_v1';
  var GA_ID='G-EDT465YDT4';
  function hasConsent(){ return localStorage.getItem(CONSENT_KEY)==='accepted'; }
  function saveConsent(v){ localStorage.setItem(CONSENT_KEY, v); }
  function injectGA(){ 
    if (!GA_ID || document.getElementById('ga4-script')) return;
    var s1=document.createElement('script'); s1.id='ga4-script'; s1.async=true; s1.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID; document.head.appendChild(s1);
    var s2=document.createElement('script'); s2.text = "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','"+GA_ID+"');"; document.head.appendChild(s2);
  }
  function banner(){ 
    var b=document.createElement('div'); b.id='cookie-banner'; b.setAttribute('role','dialog'); b.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#0f172a;color:#fff;padding:1rem;display:flex;gap:.75rem;align-items:center;z-index:9999;flex-wrap:wrap';
    b.innerHTML="<span>Wir verwenden Cookies für Analyse (GA4). Du kannst zustimmen oder ablehnen.</span>";
    var a=document.createElement('button'); a.textContent='Zustimmen'; a.className='btn btn-primary';
    var d=document.createElement('button'); d.textContent='Ablehnen'; d.className='btn btn-secondary';
    a.onclick=function(){ saveConsent('accepted'); injectGA(); b.remove(); };
    d.onclick=function(){ saveConsent('declined'); b.remove(); };
    b.appendChild(a); b.appendChild(d); document.body.appendChild(b);
  }
  if (hasConsent()){ injectGA(); } else if(localStorage.getItem(CONSENT_KEY)==='declined'){ } else { banner(); }
})();
// Cart
(function(){
  const CART_KEY='pfg_cart_v1';
  function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); }catch(e){ return []; } }
  function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  function addItem(sku, name, price, qty){ const cart=getCart(); const i=cart.findIndex(x=>x.sku===sku); if(i>-1){ cart[i].qty+=qty; } else { cart.push({sku,name,price,qty}); } saveCart(cart); updateCartBadge(); modal('Zum Warenkorb hinzugefügt'); }
  function removeItem(sku){ const cart=getCart().filter(x=>x.sku!==sku); saveCart(cart); renderCart(); updateCartBadge(); }
  function setQty(sku, qty){ const cart=getCart(); const i=cart.findIndex(x=>x.sku===sku); if(i>-1){ cart[i].qty=qty; saveCart(cart); } renderCart(); updateCartBadge(); }
  function sum(){ return getCart().reduce((s,x)=>s+(x.price*x.qty),0); }
  function updateCartBadge(){ const n=getCart().reduce((s,x)=>s+x.qty,0); document.querySelectorAll('.cart-badge').forEach(el=> el.textContent = n>0? String(n):''); }
  function modal(msg){ const m=document.createElement('div'); m.style.cssText='position:fixed;inset:0;display:grid;place-items:center;background:rgba(2,6,23,.5)'; m.innerHTML=`<div class='card' style='background:white;padding:1rem 1.2rem;'><p>${msg}</p><div class='cta'><a class='btn btn-secondary' href='./shop.html'>Zum Warenkorb</a><button class='btn btn-primary'>Weiter shoppen</button></div></div>`; m.querySelector('button').onclick=()=>m.remove(); document.body.appendChild(m); setTimeout(()=>m.remove(), 2000); }
  window.PFG_CART = { addItem, removeItem, setQty, getCart, sum, updateCartBadge, saveCart };
  document.addEventListener('DOMContentLoaded', updateCartBadge);
})();
function renderCart(){
  const table=document.getElementById('cart-table'); if(!table) return;
  const tbody=table.querySelector('tbody'); tbody.innerHTML='';
  const cart=window.PFG_CART.getCart();
  cart.forEach(item=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${item.name}</td>
      <td><input class='qty' type='number' min='1' value='${item.qty}' /></td>
      <td class='right'>${item.price.toFixed(2)} €</td>
      <td class='right'>${(item.price*item.qty).toFixed(2)} €</td>
      <td class='right'><button class='btn btn-secondary small'>Entfernen</button></td>`;
    tr.querySelector('.qty').addEventListener('change', e=> window.PFG_CART.setQty(item.sku, Math.max(1, parseInt(e.target.value||'1'))));
    tr.querySelector('button').addEventListener('click', ()=> window.PFG_CART.removeItem(item.sku));
    tbody.appendChild(tr);
  });
  document.getElementById('cart-total').textContent = window.PFG_CART.sum().toFixed(2) + ' €';
}
document.addEventListener('DOMContentLoaded', renderCart);
