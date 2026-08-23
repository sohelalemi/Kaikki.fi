import React,{useEffect,useState}from'react';
import{Alert,Modal,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';
import AsyncStorage from'@react-native-async-storage/async-storage';

const originalCreateElement=React.createElement.bind(React);
const targets=new Set(['Hakuvahdit','Arvostelut','Seuraajat','Yksityisyys','Asiakastuki']);

function nodeText(node){if(node==null||node===false)return'';if(typeof node==='string'||typeof node==='number')return String(node);if(Array.isArray(node))return node.map(nodeText).join(' ');return nodeText(node?.props?.children)}
function SwitchRow({label,value,onChange}){return originalCreateElement(Pressable,{style:styles.switchRow,onPress:()=>onChange(!value)},originalCreateElement(Text,{style:styles.switchLabel},label),originalCreateElement(View,{style:[styles.switchTrack,value&&styles.switchTrackOn]},originalCreateElement(View,{style:[styles.switchKnob,value&&styles.switchKnobOn]})))}

function ToolContent({label}){
  const[watchText,setWatchText]=useState('');
  const[watches,setWatches]=useState([]);
  const[showPhone,setShowPhone]=useState(false);
  const[showCity,setShowCity]=useState(true);
  const[allowMessages,setAllowMessages]=useState(true);

  useEffect(()=>{
    if(label==='Hakuvahdit')AsyncStorage.getItem('kaikki.searchWatches').then(v=>{if(v)setWatches(JSON.parse(v))}).catch(()=>{});
    if(label==='Yksityisyys')AsyncStorage.multiGet(['kaikki.privacy.phone','kaikki.privacy.city','kaikki.privacy.messages']).then(rows=>{const o=Object.fromEntries(rows);if(o['kaikki.privacy.phone']!=null)setShowPhone(o['kaikki.privacy.phone']==='true');if(o['kaikki.privacy.city']!=null)setShowCity(o['kaikki.privacy.city']==='true');if(o['kaikki.privacy.messages']!=null)setAllowMessages(o['kaikki.privacy.messages']==='true')}).catch(()=>{});
  },[label]);

  const saveWatches=next=>{setWatches(next);AsyncStorage.setItem('kaikki.searchWatches',JSON.stringify(next)).catch(()=>{})};
  const savePrivacy=(key,setter)=>(value)=>{setter(value);AsyncStorage.setItem('kaikki.privacy.'+key,String(value)).catch(()=>{})};

  if(label==='Hakuvahdit')return originalCreateElement(View,null,
    originalCreateElement(Text,{style:styles.info},'Tallenna haku ja seuraa uusia ilmoituksia.'),
    originalCreateElement(TextInput,{style:styles.input,value:watchText,onChangeText:setWatchText,placeholder:'Esim. iPhone 15 Pro Lahti'}),
    originalCreateElement(Pressable,{style:styles.primary,onPress:()=>{const v=watchText.trim();if(!v)return;if(watches.includes(v)){Alert.alert('Hakuvahti','Tämä hakuvahti on jo tallennettu.');return}saveWatches([v,...watches]);setWatchText('')}},originalCreateElement(Text,{style:styles.primaryText},'+ Lisää hakuvahti')),
    watches.length?originalCreateElement(View,{style:styles.cards},...watches.map((w,i)=>originalCreateElement(View,{key:`${w}-${i}`,style:styles.card},originalCreateElement(Text,{style:styles.cardTitle},'🔎 '+w),originalCreateElement(Pressable,{onPress:()=>saveWatches(watches.filter((_,n)=>n!==i))},originalCreateElement(Text,{style:styles.remove},'Poista'))))):originalCreateElement(Text,{style:styles.empty},'Ei hakuvahteja vielä.')
  );

  if(label==='Arvostelut')return originalCreateElement(View,null,originalCreateElement(Text,{style:styles.info},'Täällä näkyvät saamasi ja antamasi arvostelut.'),originalCreateElement(View,{style:styles.emptyBox},originalCreateElement(Text,{style:styles.emptyIcon},'★'),originalCreateElement(Text,{style:styles.emptyTitle},'Ei arvosteluja vielä'),originalCreateElement(Text,{style:styles.empty},'Arvostelut näkyvät täällä onnistuneiden kauppojen jälkeen.')));
  if(label==='Seuraajat')return originalCreateElement(View,null,originalCreateElement(Text,{style:styles.info},'Täällä näet käyttäjät, jotka seuraavat profiiliasi.'),originalCreateElement(View,{style:styles.emptyBox},originalCreateElement(Text,{style:styles.emptyIcon},'♙'),originalCreateElement(Text,{style:styles.emptyTitle},'Ei seuraajia vielä')));
  if(label==='Yksityisyys')return originalCreateElement(View,null,
    originalCreateElement(Text,{style:styles.info},'Valitse, mitä tietoja muut käyttäjät voivat nähdä.'),
    originalCreateElement(SwitchRow,{label:'Näytä puhelinnumero',value:showPhone,onChange:savePrivacy('phone',setShowPhone)}),
    originalCreateElement(SwitchRow,{label:'Näytä kaupunki',value:showCity,onChange:savePrivacy('city',setShowCity)}),
    originalCreateElement(SwitchRow,{label:'Salli viestit muilta käyttäjiltä',value:allowMessages,onChange:savePrivacy('messages',setAllowMessages)}),
    originalCreateElement(Text,{style:styles.note},'Valinnat tallennetaan tähän laitteeseen ja säilyvät sovelluksen uudelleenkäynnistyksen jälkeen.')
  );

  return originalCreateElement(View,null,
    originalCreateElement(Text,{style:styles.info},'Kaikki.fi tukikeskus'),
    originalCreateElement(Pressable,{style:styles.card,onPress:()=>Alert.alert('Miten Kaikki Diili toimii?','1. Ostaja lähettää Diili-pyynnön.\n2. Myyjä hyväksyy tai hylkää pyynnön.\n3. Hyväksytyn Diilin jälkeen siirrytään maksuun.\n4. Myyjä toimittaa tuotteen.\n5. Ostaja vahvistaa vastaanoton ja kauppa valmistuu.')},originalCreateElement(Text,{style:styles.cardTitle},'Miten Kaikki Diili toimii?'),originalCreateElement(Text,{style:styles.cardText},'Ostaja lähettää pyynnön, myyjä hyväksyy sen ja kauppa etenee vaiheittain maksusta toimitukseen.'),originalCreateElement(Text,{style:styles.openHint},'Avaa ›')),
    originalCreateElement(Pressable,{style:styles.card,onPress:()=>Alert.alert('Ilmoituksen tai käyttäjän ongelma','Tallenna ilmoituksen numero, ota tarvittaessa kuvakaappaus ja kuvaile ongelma mahdollisimman tarkasti.')},originalCreateElement(Text,{style:styles.cardTitle},'Ilmoituksen tai käyttäjän ongelma'),originalCreateElement(Text,{style:styles.cardText},'Avaa ohjeet ennen yhteydenottoa.'),originalCreateElement(Text,{style:styles.openHint},'Avaa ›'))
  );
}

function FunctionalProfileRow({rowProps,label}){const[open,setOpen]=useState(false);return originalCreateElement(React.Fragment,null,originalCreateElement(Pressable,{...rowProps,onPress:()=>setOpen(true)},rowProps?.children),originalCreateElement(Modal,{visible:open,animationType:'slide',onRequestClose:()=>setOpen(false)},originalCreateElement(SafeAreaView,{style:styles.page},originalCreateElement(View,{style:styles.header},originalCreateElement(Pressable,{style:styles.back,onPress:()=>setOpen(false)},originalCreateElement(Text,{style:styles.backText},'‹')),originalCreateElement(Text,{style:styles.title},label),originalCreateElement(View,{style:{width:44}})),originalCreateElement(ScrollView,{contentContainerStyle:styles.content,keyboardShouldPersistTaps:'handled'},originalCreateElement(ToolContent,{label})))))}
function shouldReplace(type,props){if(type!==Pressable)return null;const text=nodeText(props?.children);for(const label of targets)if(text.includes(label))return label;return null}
function patchRuntime(){try{const runtime=require('react/jsx-runtime');const oldJsx=runtime.jsx,oldJsxs=runtime.jsxs;if(typeof oldJsx==='function')runtime.jsx=(t,p,k)=>{const label=shouldReplace(t,p);return label?oldJsx(FunctionalProfileRow,{rowProps:p,label,children:p?.children},k):oldJsx(t,p,k)};if(typeof oldJsxs==='function')runtime.jsxs=(t,p,k)=>{const label=shouldReplace(t,p);return label?oldJsx(FunctionalProfileRow,{rowProps:p,label,children:p?.children},k):oldJsxs(t,p,k)}}catch(e){console.warn('profile-menu-tools',e?.message||e)}}patchRuntime();

const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#f7f8fa'},header:{height:64,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#e5e7eb'},back:{width:44,height:44,alignItems:'center',justifyContent:'center'},backText:{fontSize:38,color:'#1565d8',lineHeight:40},title:{fontSize:21,fontWeight:'900',color:'#111827'},content:{padding:18,paddingBottom:60},info:{fontSize:15,color:'#475569',lineHeight:21,marginBottom:16},input:{height:52,borderWidth:1,borderColor:'#d7dce3',borderRadius:12,backgroundColor:'#fff',paddingHorizontal:14,fontSize:15},primary:{marginTop:10,backgroundColor:'#1565d8',borderRadius:12,minHeight:48,alignItems:'center',justifyContent:'center'},primaryText:{color:'#fff',fontWeight:'900'},cards:{marginTop:14,gap:10},card:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e5e7eb',borderRadius:14,padding:14,marginTop:10},cardTitle:{fontSize:15,fontWeight:'900',color:'#111827'},cardText:{fontSize:13,color:'#64748b',lineHeight:19,marginTop:6},openHint:{color:'#1565d8',fontWeight:'800',marginTop:10},remove:{color:'#dc2626',fontWeight:'800',marginTop:8},emptyBox:{backgroundColor:'#fff',borderRadius:16,padding:28,alignItems:'center',borderWidth:1,borderColor:'#e5e7eb'},emptyIcon:{fontSize:38,color:'#94a3b8'},emptyTitle:{fontSize:18,fontWeight:'900',color:'#111827',marginTop:8},empty:{color:'#64748b',textAlign:'center',marginTop:7},switchRow:{minHeight:62,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#e5e7eb',paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},switchLabel:{fontSize:15,fontWeight:'700',color:'#111827',flex:1,paddingRight:12},switchTrack:{width:50,height:29,borderRadius:15,backgroundColor:'#cbd5e1',padding:3},switchTrackOn:{backgroundColor:'#1565d8'},switchKnob:{width:23,height:23,borderRadius:12,backgroundColor:'#fff'},switchKnobOn:{marginLeft:21},note:{fontSize:12,color:'#64748b',lineHeight:18,marginTop:14}});