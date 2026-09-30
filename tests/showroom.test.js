const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const content=require('../content/showroom');
const root=path.join(__dirname,'../public');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(path.join(dir,f.name)):[path.join(dir,f.name)])}
const html=files(root).filter(f=>f.endsWith('.html'));
test('homepage follows the approved order and publishes no pretend reviews',()=>{
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.deepEqual([...home.matchAll(/data-home-section="([^"]+)"/g)].map(m=>m[1]),['hero','welcome','categories','featured','celebrations','look','new-arrivals','how-it-works','service-areas','gallery','difference','social','final-cta']);
 assert.match(home,/Beautiful Celebrations/);assert.match(home,/Begin Here/);
 assert.doesNotMatch(home,/Client Name|★★★★★|AggregateRating|Review"/);
 assert.equal([...home.matchAll(/data-home-section="featured"[\s\S]*?(?=<section)/g)][0][0].match(/data-product-card/g).length,6);
});
test('the complete founder story is published',()=>{
 const about=fs.readFileSync(path.join(root,'about.html'),'utf8').replace(/<[^>]+>/g,'').replaceAll('&amp;','&');
 for(const p of content.story)assert.ok(about.includes(p),p);
 assert.ok(about.includes('Founders, GNS Event Rentals'));
});
test('every generated page has unique IDs, local destinations and images',()=>{
 assert.equal(html.length,56);
 for(const file of html){const doc=fs.readFileSync(file,'utf8');const ids=[...doc.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,path.relative(root,file)+' duplicate IDs');
  for(const m of doc.matchAll(/\s(?:href|src)="(\/[^"?]*)[^"\s]*"/g)){let u=m[1].split('#')[0];if(u==='/')u='/index.html';if(!path.extname(u))u+='.html';assert.ok(fs.existsSync(path.join(root,u)),`${file}: missing ${u}`)}
  assert.match(doc,/<h1[ >]/);assert.match(doc,/<meta name="description"/);
 }
});
test('dedicated categories and celebrations include honest availability language',()=>{
 for(const c of content.categories){const doc=fs.readFileSync(path.join(root,'rental-categories',c.slug+'.html'),'utf8');assert.ok(doc.includes(c.name.replaceAll('&','&amp;')));if(!c.ids.length)assert.match(doc,/does not confirm inventory/)}
 for(const c of content.celebrations)assert.ok(fs.existsSync(path.join(root,'collections',c.slug+'.html')));
});
test('quote API requires a guest count and recomputes trusted prices',async()=>{
 const handler=require('../api/quote');const call=async body=>{let status,payload;const res={setHeader(){},status(n){status=n;return this},json(v){payload=v;return v}};await handler({method:'POST',headers:{host:'localhost','content-type':'application/json'},body},res);return{status,payload}};
 const body={area:'dc',name:'Test Customer',email:'test@example.com',date:'2099-06-20',location:'Woodbridge, VA 22191',occasion:'Wedding',service:'Delivery & pickup',consent:true,guests:'100',items:[{id:'gold-chiavari-chair',quantity:2,price:0}]};
 assert.equal((await call({...body,guests:''})).status,400);
 assert.equal((await call({...body,items:[{id:'gold-chiavari-chair',quantity:0}]})).status,400);
 const keys=['RESEND_API_KEY','QUOTE_TO_EMAIL','QUOTE_FROM_EMAIL'];const old=keys.map(k=>process.env[k]);const oldFetch=global.fetch;let sent;
 try{process.env.RESEND_API_KEY='test-only';process.env.QUOTE_TO_EMAIL='old-inbox@example.com';process.env.QUOTE_FROM_EMAIL='test@example.com';global.fetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');sent=JSON.parse(options.body);return{ok:true,json:async()=>({id:'mocked-email'})}};
 const result=await call(body);assert.equal(result.status,200);assert.match(sent.text,/Estimated 24-hour rental subtotal: \$18\.00/);assert.match(sent.text,/Guest count: 100/);assert.deepEqual(sent.to,['support@gnsrental.com']);assert.equal(sent.reply_to,body.email);
 delete process.env.QUOTE_TO_EMAIL;assert.equal((await call(body)).status,200);
 global.fetch=async()=>({ok:false,json:async()=>({message:'Provider failure'})});assert.equal((await call(body)).status,502);
 delete process.env.RESEND_API_KEY;assert.equal((await call(body)).status,503);
 let health;await handler({method:'GET',headers:{}},{setHeader(){},status(n){assert.equal(n,200);return this},json(v){health=v}});assert.deepEqual(health,{ok:true,emailConfigured:false});
 }finally{keys.forEach((k,i)=>old[i]===undefined?delete process.env[k]:process.env[k]=old[i]);global.fetch=oldFetch}
});
