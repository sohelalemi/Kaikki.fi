const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','oma-diili-v2.js');
let s=fs.readFileSync(p,'utf8');

// Add participant profile state.
s=s.replace(
"const[open,setOpen]=useState(false),[loading,setLoading]=useState(false),[deals,setDeals]=useState([]),[error,setError]=useState(''),[uid,setUid]=useState(''),[q,setQ]=useState(''),[tab,setTab]=useState('sales'),[selected,setSelected]=useState(null),[listing,setListing]=useState(null),[detailLoading,setDetailLoading]=useState(false);",
"const[open,setOpen]=useState(false),[loading,setLoading]=useState(false),[deals,setDeals]=useState([]),[error,setError]=useState(''),[uid,setUid]=useState(''),[q,setQ]=useState(''),[tab,setTab]=useState('sales'),[selected,setSelected]=useState(null),[listing,setListing]=useState(null),[participants,setParticipants]=useState(null),[detailLoading,setDetailLoading]=useState(false);"
);

// Fetch seller/buyer names and cities securely through RPC when a deal opens.
s=s.replace(
"async function openDeal(d){setSelected(d);setListing(null);setDetailLoading(true);try{const{data}=await supabase.from('listings').select('id,title,price,image_urls').eq('id',d.listing_id).maybeSingle();setListing(data||null)}finally{setDetailLoading(false)}}",
"async function openDeal(d){setSelected(d);setListing(null);setParticipants(null);setDetailLoading(true);try{const[{data:l},{data:p,error:pe}]=await Promise.all([supabase.from('listings').select('id,title,price,image_urls').eq('id',d.listing_id).maybeSingle(),supabase.rpc('get_deal_participants',{p_deal_id:d.id})]);setListing(l||null);if(!pe)setParticipants(Array.isArray(p)?p[0]||null:p||null)}finally{setDetailLoading(false)}}"
);

// Replace generic participant labels with names + city. The current user still gets “Sinä” plus their real profile name when available.
const oldPeople="originalCreateElement(View,{style:styles.peopleRow},originalCreateElement(View,{style:styles.personBox},originalCreateElement(Text,{style:styles.personLabel},'Myyjä'),originalCreateElement(Text,{style:styles.personValue},selected.seller_id===uid?'Sinä':selected.seller_name||'Kaikki-käyttäjä')),originalCreateElement(View,{style:styles.personBox},originalCreateElement(Text,{style:styles.personLabel},'Ostaja'),originalCreateElement(Text,{style:styles.personValue},selected.buyer_id===uid?'Sinä':selected.buyer_name||'Kaikki-käyttäjä')))";
const newPeople="originalCreateElement(View,{style:styles.peopleRow},originalCreateElement(View,{style:styles.personBox},originalCreateElement(Text,{style:styles.personLabel},'Myyjä'),originalCreateElement(Text,{style:styles.personValue},selected.seller_id===uid?'Sinä':participants?.seller_name||'Kaikki-käyttäjä'),participants?.seller_name&&selected.seller_id===uid?originalCreateElement(Text,{style:styles.personDetail},participants.seller_name):null,participants?.seller_city?originalCreateElement(Text,{style:styles.personDetail},participants.seller_city):null),originalCreateElement(View,{style:styles.personBox},originalCreateElement(Text,{style:styles.personLabel},'Ostaja'),originalCreateElement(Text,{style:styles.personValue},selected.buyer_id===uid?'Sinä':participants?.buyer_name||'Kaikki-käyttäjä'),participants?.buyer_name&&selected.buyer_id===uid?originalCreateElement(Text,{style:styles.personDetail},participants.buyer_name):null,participants?.buyer_city?originalCreateElement(Text,{style:styles.personDetail},participants.buyer_city):null))";
if(s.includes(oldPeople)) s=s.replace(oldPeople,newPeople);

// Add compact secondary text style once.
if(!s.includes("personDetail:{")) s=s.replace("personValue:{fontSize:14,fontWeight:'900',color:'#111827',marginTop:3}","personValue:{fontSize:14,fontWeight:'900',color:'#111827',marginTop:3},personDetail:{fontSize:11.5,color:'#64748b',marginTop:2}");

fs.writeFileSync(p,s);
console.log('Applied iOS Kaikki Diili participant profile names and cities.');
