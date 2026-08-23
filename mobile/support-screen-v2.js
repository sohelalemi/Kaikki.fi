import React,{useEffect,useState}from'react';
import{Modal,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';
import{supabase}from'./src/supabase';

const originalJsxRuntime=(()=>{try{return require('react/jsx-runtime')}catch{return null}})();
const h=React.createElement.bind(React);

function nodeText(node){
  if(node==null||node===false)return'';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}

function SupportScreen({rowProps}){
  const[open,setOpen]=useState(false);
  const[subject,setSubject]=useState('');
  const[listingId,setListingId]=useState('');
  const[message,setMessage]=useState('');
  const[sending,setSending]=useState(false);
  const[status,setStatus]=useState('');
  const[history,setHistory]=useState([]);

  async function loadHistory(){
    try{
      const{data:{user}}=await supabase.auth.getUser();
      if(!user){setHistory([]);return;}
      const{data,error}=await supabase.from('support_requests').select('id,subject,status,created_at').order('created_at',{ascending:false}).limit(5);
      if(error)throw error;
      setHistory(data||[]);
    }catch{setHistory([])}
  }

  useEffect(()=>{if(open)loadHistory()},[open]);

  async function send(){
    const s=subject.trim(),m=message.trim(),raw=listingId.trim();
    if(s.length<3){setStatus('Kirjoita aihe.');return;}
    if(m.length<5){setStatus('Kuvaile ongelma tarkemmin.');return;}
    const parsed=raw?Number(raw):null;
    if(raw&&!Number.isFinite(parsed)){setStatus('Ilmoituksen numeron pitää olla numero.');return;}
    setSending(true);setStatus('Lähetetään...');
    try{
      const{data:{user}}=await supabase.auth.getUser();
      if(!user)throw new Error('Kirjaudu sisään ennen tukipyynnön lähettämistä.');
      const{error}=await supabase.from('support_requests').insert({user_id:user.id,subject:s,message:m,listing_id:parsed});
      if(error)throw error;
      setSubject('');setListingId('');setMessage('');setStatus('Tukipyyntö lähetetty ✓');
      await loadHistory();
    }catch(e){setStatus(e?.message||'Tukipyynnön lähetys epäonnistui.');}
    finally{setSending(false)}
  }

  return h(React.Fragment,null,
    h(Pressable,{...rowProps,onPress:()=>setOpen(true)},rowProps?.children),
    h(Modal,{visible:open,animationType:'slide',onRequestClose:()=>setOpen(false)},
      h(SafeAreaView,{style:styles.page},
        h(View,{style:styles.header},
          h(Pressable,{style:styles.back,onPress:()=>setOpen(false)},h(Text,{style:styles.backText},'‹')),
          h(Text,{style:styles.title},'Asiakastuki'),h(View,{style:{width:44}})
        ),
        h(ScrollView,{contentContainerStyle:styles.content,keyboardShouldPersistTaps:'handled'},
          h(Text,{style:styles.intro},'Tarvitsetko apua? Lähetä tukipyyntö suoraan Kaikki.fi-tukeen.'),
          h(View,{style:styles.helpCard},
            h(Text,{style:styles.helpTitle},'Miten Kaikki Diili toimii?'),
            h(Text,{style:styles.helpText},'Ostaja lähettää pyynnön, myyjä hyväksyy tai hylkää sen ja hyväksytty Diili etenee maksusta toimitukseen ja vastaanoton vahvistukseen.')
          ),
          h(View,{style:styles.helpCard},
            h(Text,{style:styles.helpTitle},'Ilmoituksen tai käyttäjän ongelma'),
            h(Text,{style:styles.helpText},'Kirjaa ilmoituksen numero ja kuvaile ongelma. Älä lähetä rahaa sovelluksen ulkopuolella, jos epäilet väärinkäytöstä.')
          ),
          h(Text,{style:styles.sectionTitle},'Ota yhteyttä'),
          h(TextInput,{style:styles.input,value:subject,onChangeText:setSubject,placeholder:'Aihe',maxLength:100}),
          h(TextInput,{style:styles.input,value:listingId,onChangeText:setListingId,placeholder:'Ilmoituksen numero (valinnainen)',keyboardType:'number-pad'}),
          h(TextInput,{style:[styles.input,styles.textarea],value:message,onChangeText:setMessage,placeholder:'Kerro mitä tapahtui...',multiline:true,maxLength:1500,textAlignVertical:'top'}),
          h(Pressable,{style:[styles.primary,sending&&styles.disabled],onPress:send,disabled:sending},h(Text,{style:styles.primaryText},sending?'Lähetetään...':'Lähetä tukipyyntö')),
          status?h(Text,{style:[styles.status,status.includes('✓')&&styles.success]},status):null,
          h(Text,{style:styles.sectionTitle},'Viimeisimmät tukipyynnöt'),
          history.length?history.map(x=>h(View,{key:String(x.id),style:styles.history},h(Text,{style:styles.historyTitle},x.subject),h(Text,{style:styles.historyMeta},`${new Date(x.created_at).toLocaleString('fi-FI')} · ${x.status||'open'}`))):h(Text,{style:styles.empty},'Ei tukipyyntöjä vielä.')
        )
      )
    )
  );
}

function shouldReplace(type,props){
  return type===Pressable&&nodeText(props?.children).includes('Asiakastuki');
}

if(originalJsxRuntime){
  const oldJsx=originalJsxRuntime.jsx,oldJsxs=originalJsxRuntime.jsxs;
  if(typeof oldJsx==='function')originalJsxRuntime.jsx=(type,props,key)=>shouldReplace(type,props)?oldJsx(SupportScreen,{rowProps:props},key):oldJsx(type,props,key);
  if(typeof oldJsxs==='function')originalJsxRuntime.jsxs=(type,props,key)=>shouldReplace(type,props)?oldJsx(SupportScreen,{rowProps:props},key):oldJsxs(type,props,key);
}

const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#f7f8fa'},header:{height:64,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#e5e7eb'},back:{width:44,height:44,alignItems:'center',justifyContent:'center'},backText:{fontSize:38,color:'#1565d8',lineHeight:40},title:{fontSize:21,fontWeight:'900',color:'#111827'},content:{padding:18,paddingBottom:70},intro:{fontSize:15,color:'#475569',lineHeight:22,marginBottom:8},helpCard:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e5e7eb',borderRadius:14,padding:14,marginTop:10},helpTitle:{fontSize:15,fontWeight:'900',color:'#111827'},helpText:{fontSize:13,color:'#64748b',lineHeight:19,marginTop:6},sectionTitle:{fontSize:18,fontWeight:'900',color:'#111827',marginTop:24,marginBottom:10},input:{minHeight:50,borderWidth:1,borderColor:'#d7dce3',borderRadius:12,backgroundColor:'#fff',paddingHorizontal:14,paddingVertical:12,fontSize:15,marginBottom:10},textarea:{minHeight:130},primary:{backgroundColor:'#1565d8',borderRadius:12,minHeight:50,alignItems:'center',justifyContent:'center'},disabled:{opacity:.6},primaryText:{color:'#fff',fontWeight:'900'},status:{fontSize:13,color:'#b91c1c',marginTop:10},success:{color:'#15803d'},history:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,padding:12,marginBottom:8},historyTitle:{fontWeight:'800',color:'#111827'},historyMeta:{fontSize:12,color:'#64748b',marginTop:4},empty:{color:'#64748b'}});