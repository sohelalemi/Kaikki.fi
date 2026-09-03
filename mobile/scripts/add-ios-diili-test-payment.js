const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

// iOS only: add a no-charge test payment action to an accepted Kaikki Diili.
// The backend RPC validates that the signed-in user is the buyer and the deal is accepted.
const rpcAnchor="if(kind==='received'){name='confirm_deal_received';args={p_deal_id:deal.id}}";
const rpcAdd="if(kind==='testpay'){name='test_pay_deal';args={p_deal_id:deal.id}}";
if(s.includes(rpcAnchor)&&!s.includes("name='test_pay_deal'")) s=s.replace(rpcAnchor,rpcAnchor+'\n    '+rpcAdd);

const buttonAnchor="if(buyer&&['pending','accepted'].includes(deal.status))arr.push(['Peruuta','cancel','danger']);";
const buttonAdd="if(buyer&&deal.status==='accepted')arr.unshift(['Testimaksu (ei veloitusta)','testpay','']);";
if(s.includes(buttonAnchor)&&!s.includes("['Testimaksu (ei veloitusta)','testpay'")) s=s.replace(buttonAnchor,buttonAnchor+'\n    '+buttonAdd);

// Support the older inline Diili implementation too, if it is what generated App.js contains.
const inlineRpc="if(kind==='received')return rpc('confirm_deal_received',{p_deal_id:d.id})";
if(s.includes(inlineRpc)&&!s.includes("if(kind==='testpay')return rpc('test_pay_deal'")) s=s.replace(inlineRpc,inlineRpc+";if(kind==='testpay')return rpc('test_pay_deal',{p_deal_id:d.id})");
const inlineButtons="if(buyer&&['pending','accepted'].includes(d.status))buttons.push(['Peruuta','cancel'])";
if(s.includes(inlineButtons)&&!s.includes("buttons.unshift(['Testimaksu (ei veloitusta)','testpay'])")) s=s.replace(inlineButtons,inlineButtons+";if(buyer&&d.status==='accepted')buttons.unshift(['Testimaksu (ei veloitusta)','testpay'])");

fs.writeFileSync(p,s);
console.log('Applied iOS Kaikki Diili test payment action.');
