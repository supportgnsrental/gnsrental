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
 assert.equal(html.length,57);
 for(const file of html){const doc=fs.readFileSync(file,'utf8');const ids=[...doc.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,path.relative(root,file)+' duplicate IDs');
  for(const m of doc.matchAll(/\s(?:href|src)="(\/[^"?]*)[^"\s]*"/g)){let u=m[1].split('#')[0];if(u==='/')u='/index.html';if(!path.extname(u))u+='.html';assert.ok(fs.existsSync(path.join(root,u)),`${file}: missing ${u}`)}
  assert.match(doc,/<h1[ >]/);assert.match(doc,/<meta name="description"/);
 }
});
test('dedicated categories and celebrations include honest availability language',()=>{
 for(const c of content.categories){const doc=fs.readFileSync(path.join(root,'rental-categories',c.slug+'.html'),'utf8');assert.ok(doc.includes(c.name.replaceAll('&','&amp;')));if(!c.ids.length)assert.match(doc,/does not confirm inventory/)}
 for(const c of content.celebrations)assert.ok(fs.existsSync(path.join(root,'collections',c.slug+'.html')));
});
test('quote dates use the event market calendar after UTC midnight',async()=>{
 const handler=require('../api/quote');
 const RealDate=global.Date,oldKey=process.env.RESEND_API_KEY;
 let now='2026-10-01T00:30:00Z';
 const body={area:'dc',name:'Test Customer',email:'test@example.com',date:'2026-09-30',location:'Woodbridge, VA 22191',occasion:'Wedding',service:'Delivery & pickup',consent:true,guests:'100',items:[]};
 const call=async overrides=>{let status,payload;await handler({method:'POST',headers:{host:'localhost','content-type':'application/json'},body:{...body,...overrides}},{setHeader(){},status(n){status=n;return this},json(v){payload=v}});return{status,payload}};
 try{
  delete process.env.RESEND_API_KEY;
  global.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[now]))}static now(){return RealDate.parse(now)}};
  // Valid same-day requests reach email configuration validation; no email is sent.
  assert.equal((await call({area:'dc'})).status,503);
  assert.equal((await call({area:'dfw'})).status,503);
  const past=await call({date:'2026-09-29'});assert.equal(past.status,400);assert.equal(past.payload.field,'date');assert.match(past.payload.message,/past/);
  now='2026-10-01T04:30:00Z'; // Oct 1 in DMV, still Sep 30 in DFW.
  assert.equal((await call({area:'dc'})).status,400);
  assert.equal((await call({area:'dfw'})).status,503);
  for(const [field,value] of [['name',''],['email','invalid'],['date','2026-02-30'],['area','other'],['location',''],['occasion',''],['service',''],['consent',false]]){
   const result=await call({date:'2026-10-02',[field]:value});assert.equal(result.status,400);assert.equal(result.payload.field,field);
  }
 }finally{global.Date=RealDate;if(oldKey===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=oldKey}
});
test('quote API requires a guest count and recomputes trusted prices',async()=>{
 const handler=require('../api/quote');const call=async body=>{let status,payload;const res={setHeader(){},status(n){status=n;return this},json(v){payload=v;return v}};await handler({method:'POST',headers:{host:'localhost','content-type':'application/json'},body},res);return{status,payload}};
 const body={area:'dc',name:'Test Customer',email:'test@example.com',date:'2099-06-20',location:'Woodbridge, VA 22191',occasion:'Wedding',service:'Delivery & pickup',consent:true,guests:'100',items:[{id:'gold-chiavari-chair',quantity:2,price:0}]};
 assert.equal((await call({...body,guests:''})).status,400);
 assert.equal((await call({...body,items:[{id:'gold-chiavari-chair',quantity:0}]})).status,400);
 const keys=['RESEND_API_KEY','QUOTE_TO_EMAIL','QUOTE_FROM_EMAIL'];const old=keys.map(k=>process.env[k]);const oldFetch=global.fetch;let sent=[];
 try{process.env.RESEND_API_KEY='test-only';process.env.QUOTE_TO_EMAIL='old-inbox@example.com';process.env.QUOTE_FROM_EMAIL='test@example.com';global.fetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');sent.push(JSON.parse(options.body));return{ok:true,json:async()=>({id:'mocked-email'})}};
 const result=await call(body);assert.equal(result.status,200);assert.match(sent[0].text,/Estimated 24-hour rental subtotal: \$18\.00/);assert.match(sent[0].text,/Guest count: 100/);assert.deepEqual(sent[0].to,['support@gnsrental.com']);assert.equal(sent[0].reply_to,body.email);
 assert.equal(sent.length,2);assert.deepEqual(sent[1].to,[body.email]);assert.equal(sent[1].reply_to,'support@gnsrental.com');assert.match(sent[1].subject,new RegExp(result.payload.reference));assert.match(sent[1].text,/not a confirmed reservation/);assert.match(sent[1].text,/2 × Gold Chiavari Chair/);assert.equal(result.payload.confirmationSent,true);
 let attempts=0;global.fetch=async()=>{attempts++;return attempts===1?{ok:true,json:async()=>({id:'business-email'})}:{ok:false,status:403,json:async()=>({message:'Provider rejection'})}};
 const partial=await call(body);assert.equal(partial.status,200);assert.equal(partial.payload.ok,true);assert.equal(partial.payload.confirmationSent,false);assert.equal(attempts,2);
 sent=[];global.fetch=async(url,options)=>{sent.push(JSON.parse(options.body));return{ok:true,json:async()=>({id:'mocked-email'})}};
 delete process.env.QUOTE_TO_EMAIL;assert.equal((await call(body)).status,200);
 let rejectedCalls=0;global.fetch=async()=>{rejectedCalls++;return{ok:false,json:async()=>({message:'Provider failure'})}};assert.equal((await call(body)).status,502);assert.equal(rejectedCalls,1);
 delete process.env.RESEND_API_KEY;assert.equal((await call(body)).status,503);
 let health;await handler({method:'GET',headers:{}},{setHeader(){},status(n){assert.equal(n,200);return this},json(v){health=v}});assert.deepEqual(health,{ok:true,emailConfigured:false});
 }finally{keys.forEach((k,i)=>old[i]===undefined?delete process.env[k]:process.env[k]=old[i]);global.fetch=oldFetch}
});
