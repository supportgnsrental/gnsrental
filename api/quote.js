const crypto = require('node:crypto');
const products = require('../assets/catalog.js');
const config = require('../assets/config.js');
const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.QUOTE_FROM_EMAIL && config.email);
const byId = Object.assign(Object.create(null),Object.fromEntries(products.map(p=>[p.id,p])));
const rateBuckets = new Map();
const validDate = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0,10)===d;
const text = (v,max) => typeof v==='string'?v.trim().slice(0,max):'';
const marketDate = area => {
  const parts = new Intl.DateTimeFormat('en-US',{timeZone:area==='dfw'?'America/Chicago':'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return `${values.year}-${values.month}-${values.day}`;
};
module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  // Read-only readiness check; never exposes credentials or customer data.
  if(req.method==='GET')return res.status(200).json({ok:true,emailConfigured:emailConfigured()});
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).json({ok:false,message:'Use POST to submit a request.'})}
  const origin=req.headers.origin;
  if(origin){try{if(new URL(origin).host!==req.headers.host)return res.status(403).json({ok:false,message:'Please submit your request from the GNS website.'});}catch{return res.status(403).json({ok:false,message:'Invalid origin.'})}}
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({ok:false,message:'Please submit a JSON request.'});
  if(Number(req.headers['content-length']||0)>24000)return res.status(413).json({ok:false,message:'Request is too large.'});
  let data;
  try{data=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({ok:false,message:'Please check your request.'})}
  if(!data||typeof data!=='object'||Array.isArray(data)||JSON.stringify(data).length>24000)return res.status(400).json({ok:false,message:'Please check your request.'});
  if(data.website)return res.status(400).json({ok:false,message:'Unable to submit this request.'});
  const area=data.area;
  const name=text(data.name,100),email=text(data.email,180),date=text(data.date,10),endDate=text(data.endDate,10),location=text(data.location,180),occasion=text(data.occasion,100),service=text(data.service,100);
  const invalid = (field,message) => res.status(400).json({ok:false,code:'VALIDATION_ERROR',field,message});
  if(!['dc','dfw'].includes(area))return invalid('area','Please select Washington, DC / Northern Virginia or Dallas–Fort Worth.');
  if(!name||/[\r\n]/.test(name))return invalid('name','Please enter your full name.');
  if(!/^\S+@\S+\.\S+$/.test(email)||/[\r\n]/.test(email))return invalid('email','Please enter a valid email address, such as name@example.com.');
  if(!validDate(date))return invalid('date','Please enter a valid event date, including the four-digit year.');
  // Calendar dates must be compared in the event market, not at UTC midnight.
  if(date<marketDate(area))return invalid('date','Your event date is in the past. Please choose today or a future date in your selected service area.');
  if(!location)return invalid('location','Please enter the venue city and ZIP code.');
  if(!occasion)return invalid('occasion','Please select a celebration type.');
  if(!service)return invalid('service','Please select your preferred delivery or pickup service.');
  if(data.consent!==true)return invalid('consent','Please check the consent box so GNS can respond to your request.');
  if(endDate&&(!validDate(endDate)||endDate<date))return res.status(400).json({ok:false,message:'Return date must be on or after the event date.'});
  if(!/^\d+$/.test(String(data.guests||''))||Number(data.guests)<1||Number(data.guests)>100000)return res.status(400).json({ok:false,message:'Please enter a valid guest count.'});
  if(!Array.isArray(data.items)||data.items.length>products.length)return res.status(400).json({ok:false,message:'Please review your rental list.'});
  const seen=new Set();let subtotal=0;
  for(const i of data.items){if(!i||!byId[i.id]||seen.has(i.id)||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>999)return res.status(400).json({ok:false,message:'Please check selected items and quantities.'});seen.add(i.id);if(byId[i.id].markets[area]==='unavailable')return res.status(400).json({ok:false,message:'Please remove items not offered in your selected market.'});subtotal+=(byId[i.id].price??0)*i.quantity;}
  if(!emailConfigured())return res.status(503).json({ok:false,code:'NOT_CONFIGURED',message:'Online quote delivery is not connected yet.'});
  // Best-effort per-instance throttling; add a Vercel Firewall rate-limit rule for public launch.
  const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0];const key=crypto.createHash('sha256').update(ip).digest('hex');const now=Date.now();
  for(const [k,v] of rateBuckets)if(now-v.since>600000)rateBuckets.delete(k);
  const bucket=rateBuckets.get(key)||{since:now,count:0};if(bucket.count>=5)return res.status(429).json({ok:false,message:'Please wait a few minutes before sending another request.'});bucket.count++;rateBuckets.set(key,bucket);
  const reference='GNS-'+crypto.randomUUID().slice(0,8).toUpperCase();
  const currency=n=>'$'+n.toFixed(2);
  const lines=[`Quote reference: ${reference}`,`Service area: ${area==='dc'?'Washington, DC / Northern Virginia':'Dallas–Fort Worth, Texas'}`,`Event: ${occasion}`,`Event date: ${date}`,`End / return date: ${endDate||'To be confirmed'}`,`Guest count: ${text(String(data.guests||''),10)||'To be confirmed'}`,`Venue: ${text(data.venue,150)||'To be confirmed'}`,`Venue city / ZIP: ${location}`,`Service: ${service}`,'','RENTAL LIST',...data.items.map(i=>byId[i.id].price===null?`${i.quantity} × ${byId[i.id].name} — pricing by quote`:`${i.quantity} × ${byId[i.id].name} @ ${currency(byId[i.id].price)} = ${currency(byId[i.id].price*i.quantity)}`),`Estimated 24-hour rental subtotal: ${currency(subtotal)}${data.items.some(i=>byId[i.id].price===null)?' + items priced by quote (excluded from subtotal)':''}`,'Delivery, setup, taxes and applicable charges are quoted separately. Inventory and rental terms require confirmation.','',`Name: ${name}`,`Email: ${email}`,`Phone: ${text(data.phone,35)}`,`Company: ${text(data.company,150)}`,'',`Notes: ${text(data.notes,3000)}`,'','Customer consented to using these details to respond to this quote request.'];
  try{
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.QUOTE_FROM_EMAIL,to:[config.email],reply_to:email,subject:`${reference} | ${area==='dc'?'DC / NoVA':'DFW'} rental request | ${date}`,text:lines.join('\n')}),signal:AbortSignal.timeout(10000)});
    const responseData=await response.json();if(!response.ok||!responseData.id)return res.status(502).json({ok:false,message:'Email delivery is temporarily unavailable. Please try again or download your request.'});
    // The business request is accepted. A failed customer copy must not tell
    // the customer to resubmit and create a duplicate business notification.
    let confirmationSent=false;
    try{
      const confirmation=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.QUOTE_FROM_EMAIL,to:[email],reply_to:config.email,subject:`We received your GNS rental quote request | ${reference}`,text:[`Hi ${name},`,'','Thank you for contacting GNS Event Rentals. We have received your quote request. Our team will review availability, your event details and service needs, then follow up with your personalized quote.','',...lines.slice(0,-2),'','This is a receipt for your request, not a confirmed reservation or final quote. Rentals are secured only after GNS confirms availability and you complete the agreement and required payment.','',`Questions or changes? Reply to this email and include ${reference}.`,'','From Our Family Celebrations to Yours.','GNS Event Rentals',config.email,'https://www.gnsrental.com'].join('\n')}),signal:AbortSignal.timeout(6000)});
      const confirmationData=await confirmation.json();confirmationSent=Boolean(confirmation.ok&&confirmationData.id);
      if(!confirmationSent)console.error('Quote confirmation not accepted',{reference,status:confirmation.status});
    }catch(error){console.error('Quote confirmation unavailable',{reference,timeout:error.name==='TimeoutError'});}
    return res.status(200).json({ok:true,reference,confirmationSent});
  }catch{return res.status(502).json({ok:false,message:'Email delivery is temporarily unavailable. Please try again or download your request.'})}
};
