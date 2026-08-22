import React,{useState}from'react';
import{ActivityIndicator,Modal,Pressable,ScrollView,StyleSheet,Text,View}from'react-native';
import{supabase}from'./src/supabase';

const originalCreateElement=React.createElement.bind(React);

function nodeText(node){
  if(node===null||node===undefined||node===false)return '';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}

function statusLabel(status){
  const map={pending:'Odottaa',accepted:'Hyväksytty',paid:'Maksettu',shipped:'Lähetetty',completed:'Valmis',cancelled:'Peruttu',rejected:'Hylätty'};
  return map[status]||status||'Odottaa';
}

function KaikkiDiiliRow(){
  const[open,setOpen]=useState(false);
  const[loading,setLoading]=useState(false);
  const[deals,setDeals]=useState([]);
  const[error,setError]=useState('');

  async function showDeals(){
    setOpen(true);setLoading(true);setError('');
    try{
      const{data:userData,error:userError}=await supabase.auth.getUser();
      if(userError)throw userError;
      const uid=userData?.user?.id;
      if(!uid)throw new Error('Kirjaudu ensin sisään.');
      const{data,error}=await supabase.from('deals').select('*').or(`buyer_id.eq.${uid},seller_id.eq.${uid}`).order('created_at',{ascending:false});
      if(error)throw error;
      setDeals(data||[]);
    }catch(e){setError(e?.message||'Kaikki Diiliä ei voitu avata.')}finally{setLoading(false)}
  }

  return originalCreateElement(
    React.Fragment,
    null,
    originalCreateElement(
      Pressable,
      {onPress:showDeals,style:styles.row},
      originalCreateElement(Text,{style:styles.icon},'🛡️'),
      originalCreateElement(Text,{style:styles.label},'Kaikki Diili'),
      originalCreateElement(Text,{style:styles.arrow},'›')
    ),
    originalCreateElement(
      Modal,
      {visible:open,animationType:'slide',onRequestClose:()=>setOpen(false)},
      originalCreateElement(
        View,
        {style:styles.page},
        originalCreateElement(View,{style:styles.top},
          originalCreateElement(Text,{style:styles.title},'🛡️ Kaikki Diili'),
          originalCreateElement(Pressable,{onPress:()=>setOpen(false),style:styles.close},originalCreateElement(Text,{style:styles.closeText},'×'))
        ),
        originalCreateElement(Text,{style:styles.subtitle},'Turvallisemmat kaupat yhdessä paikassa'),
        loading?originalCreateElement(ActivityIndicator,{size:'large',style:{marginTop:40}}):
        error?originalCreateElement(Text,{style:styles.error},error):
        originalCreateElement(ScrollView,{contentContainerStyle:styles.list},
          deals.length?deals.map(d=>originalCreateElement(View,{key:String(d.id),style:styles.card},
            originalCreateElement(View,{style:styles.cardTop},
              originalCreateElement(Text,{style:styles.cardTitle},`Diili #${d.id}`),
              originalCreateElement(Text,{style:styles.badge},statusLabel(d.status))
            ),
            originalCreateElement(Text,{style:styles.amount},`${Number(d.amount||0).toLocaleString('fi-FI')} €`),
            originalCreateElement(Text,{style:styles.meta},`Ilmoitus #${d.listing_id}`)
          )):originalCreateElement(View,{style:styles.empty},
            originalCreateElement(Text,{style:styles.emptyIcon},'🛡️'),
            originalCreateElement(Text,{style:styles.emptyTitle},'Ei Diilejä vielä'),
            originalCreateElement(Text,{style:styles.emptyText},'Kaikki Diili -pyynnöt näkyvät täällä.')
          )
        )
      )
    )
  );
}

function shouldPatchProfileMenu(type,props,children){
  if(type!==View||props?.__kaikkiOmaDiiliPatched)return false;
  const text=(children||[]).map(nodeText).join(' ');
  return text.includes('Omat ilmoitukset')&&text.includes('Hakuvahdit')&&text.includes('Suosikit')&&text.includes('Varaukset');
}

function patch(type,props,children,creator){
  if(!shouldPatchProfileMenu(type,props,children))return creator();
  return originalCreateElement(View,{...props,__kaikkiOmaDiiliPatched:true},...children,originalCreateElement(KaikkiDiiliRow,{key:'kaikki-diili-oma'}));
}

React.createElement=(type,props,...children)=>patch(type,props,children,()=>originalCreateElement(type,props,...children));

try{
  const runtime=require('react/jsx-runtime');
  const originalJsx=runtime.jsx;
  const originalJsxs=runtime.jsxs;
  const wrap=(original,type,props,key)=>{
    const children=Array.isArray(props?.children)?props.children:[props?.children].filter(Boolean);
    if(shouldPatchProfileMenu(type,props,children)){
      return original(View,{...props,__kaikkiOmaDiiliPatched:true,children:[...children,originalJsx(KaikkiDiiliRow,{},'kaikki-diili-oma')]},key);
    }
    return original(type,props,key);
  };
  if(typeof originalJsx==='function')runtime.jsx=(type,props,key)=>wrap(originalJsx,type,props,key);
  if(typeof originalJsxs==='function')runtime.jsxs=(type,props,key)=>wrap(originalJsxs,type,props,key);
}catch(e){console.warn('Oma Kaikki Diili patch',e?.message||e)}

const styles=StyleSheet.create({
  row:{minHeight:62,flexDirection:'row',alignItems:'center',paddingHorizontal:16,borderTopWidth:1,borderTopColor:'#e8eaee',backgroundColor:'#fff'},
  icon:{width:38,fontSize:23,textAlign:'center'},
  label:{flex:1,fontSize:17,color:'#111827',fontWeight:'600',marginLeft:8},
  arrow:{fontSize:31,color:'#b7bcc5',fontWeight:'300'},
  page:{flex:1,backgroundColor:'#f7f8fa',paddingTop:48},
  top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20},
  title:{fontSize:27,fontWeight:'900',color:'#111827'},
  close:{width:42,height:42,borderRadius:21,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
  closeText:{fontSize:30,lineHeight:32,color:'#111827'},
  subtitle:{paddingHorizontal:20,marginTop:5,color:'#64748b',fontSize:14},
  list:{padding:18,gap:12},
  card:{backgroundColor:'#fff',borderRadius:16,padding:16,borderWidth:1,borderColor:'#e5e7eb'},
  cardTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  cardTitle:{fontSize:16,fontWeight:'800',color:'#111827'},
  badge:{fontSize:12,fontWeight:'800',color:'#1565d8',backgroundColor:'#eef4ff',paddingHorizontal:9,paddingVertical:5,borderRadius:999},
  amount:{fontSize:24,fontWeight:'900',color:'#1565d8',marginTop:12},
  meta:{color:'#64748b',marginTop:4},
  empty:{alignItems:'center',paddingTop:80,paddingHorizontal:28},
  emptyIcon:{fontSize:52},
  emptyTitle:{fontSize:21,fontWeight:'900',marginTop:10,color:'#111827'},
  emptyText:{textAlign:'center',color:'#64748b',marginTop:6},
  error:{margin:20,color:'#b91c1c',backgroundColor:'#fee2e2',padding:14,borderRadius:12}
});
