import React,{useEffect,useState}from'react';
import{Alert,Modal,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';
import{supabase}from'./src/supabase';

const runtime=(()=>{try{return require('react/jsx-runtime')}catch{return null}})();
const h=React.createElement.bind(React);

function nodeText(node){
  if(node==null||node===false)return'';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}

function ProfileEdit({rowProps}){
  const[open,setOpen]=useState(false);
  const[name,setName]=useState('');
  const[phone,setPhone]=useState('');
  const[city,setCity]=useState('');
  const[saving,setSaving]=useState(false);

  useEffect(()=>{if(!open)return;(async()=>{const{data}=await supabase.auth.getUser();const m=data?.user?.user_metadata||{};setName(m.full_name||m.name||'');setPhone(m.phone||'');setCity(m.city||'');})().catch(()=>{})},[open]);

  async function save(){
    setSaving(true);
    try{
      const{error}=await supabase.auth.updateUser({data:{full_name:name.trim(),phone:phone.trim(),city:city.trim()}});
      if(error)throw error;
      Alert.alert('Tallennettu','Profiilin tiedot päivitettiin.');
      setOpen(false);
    }catch(e){Alert.alert('Virhe',e?.message||'Profiilin tallentaminen epäonnistui.');}
    finally{setSaving(false)}
  }

  return h(React.Fragment,null,
    h(Pressable,{...rowProps,onPress:()=>setOpen(true)},rowProps?.children),
    h(Modal,{visible:open,animationType:'slide',onRequestClose:()=>setOpen(false)},
      h(SafeAreaView,{style:s.page},
        h(View,{style:s.header},h(Pressable,{style:s.back,onPress:()=>setOpen(false)},h(Text,{style:s.backText},'‹')),h(Text,{style:s.title},'Muokkaa profiilia'),h(View,{style:{width:44}})),
        h(ScrollView,{contentContainerStyle:s.content,keyboardShouldPersistTaps:'handled'},
          h(Text,{style:s.help},'Päivitä profiilissasi näkyvät perustiedot.'),
          h(Text,{style:s.label},'Nimi'),h(TextInput,{style:s.input,value:name,onChangeText:setName,placeholder:'Nimi',maxLength:80}),
          h(Text,{style:s.label},'Puhelinnumero'),h(TextInput,{style:s.input,value:phone,onChangeText:setPhone,placeholder:'Puhelinnumero',keyboardType:'phone-pad',maxLength:30}),
          h(Text,{style:s.label},'Kaupunki'),h(TextInput,{style:s.input,value:city,onChangeText:setCity,placeholder:'Kaupunki',maxLength:80}),
          h(Pressable,{style:[s.primary,saving&&s.disabled],disabled:saving,onPress:save},h(Text,{style:s.primaryText},saving?'Tallennetaan...':'Tallenna muutokset'))
        )
      )
    )
  );
}

function shouldReplace(type,props){return type===Pressable&&nodeText(props?.children).includes('Muokkaa profiilia')}
if(runtime){const oldJsx=runtime.jsx,oldJsxs=runtime.jsxs;if(typeof oldJsx==='function')runtime.jsx=(t,p,k)=>shouldReplace(t,p)?oldJsx(ProfileEdit,{rowProps:p},k):oldJsx(t,p,k);if(typeof oldJsxs==='function')runtime.jsxs=(t,p,k)=>shouldReplace(t,p)?oldJsx(ProfileEdit,{rowProps:p},k):oldJsxs(t,p,k)}

const s=StyleSheet.create({page:{flex:1,backgroundColor:'#f7f8fa'},header:{height:64,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#e5e7eb'},back:{width:44,height:44,alignItems:'center',justifyContent:'center'},backText:{fontSize:38,color:'#1565d8',lineHeight:40},title:{fontSize:21,fontWeight:'900',color:'#111827'},content:{padding:18,paddingBottom:70},help:{fontSize:15,color:'#64748b',lineHeight:21,marginBottom:18},label:{fontWeight:'800',color:'#334155',marginBottom:6},input:{minHeight:52,borderWidth:1,borderColor:'#d7dce3',borderRadius:12,backgroundColor:'#fff',paddingHorizontal:14,fontSize:15,marginBottom:14},primary:{marginTop:8,backgroundColor:'#1565d8',borderRadius:12,minHeight:50,alignItems:'center',justifyContent:'center'},disabled:{opacity:.6},primaryText:{color:'#fff',fontWeight:'900'}});