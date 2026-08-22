import React,{useEffect,useState}from'react';
import{Linking,Modal,Pressable,ScrollView,StyleSheet,Switch,Text,View}from'react-native';
import AsyncStorage from'@react-native-async-storage/async-storage';

const originalCreateElement=React.createElement.bind(React);

function nodeText(node){
  if(node===null||node===undefined||node===false)return '';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}

function SettingsPressable({originalProps}){
  const[open,setOpen]=useState(false);
  const[notifications,setNotifications]=useState(true);

  useEffect(()=>{
    AsyncStorage.getItem('kaikki.settings.notifications').then(v=>{
      if(v!==null)setNotifications(v==='true');
    }).catch(()=>{});
  },[]);

  async function changeNotifications(value){
    setNotifications(value);
    try{await AsyncStorage.setItem('kaikki.settings.notifications',String(value));}catch(e){}
  }

  return originalCreateElement(
    React.Fragment,
    null,
    originalCreateElement(Pressable,{...originalProps,onPress:()=>setOpen(true),__kaikkiSettingsPatched:true},originalProps.children),
    originalCreateElement(
      Modal,
      {visible:open,animationType:'slide',onRequestClose:()=>setOpen(false)},
      originalCreateElement(
        View,{style:styles.page},
        originalCreateElement(View,{style:styles.header},
          originalCreateElement(Pressable,{onPress:()=>setOpen(false),style:styles.back},originalCreateElement(Text,{style:styles.backText},'‹')),
          originalCreateElement(Text,{style:styles.title},'Asetukset'),
          originalCreateElement(View,{style:styles.back})
        ),
        originalCreateElement(ScrollView,{contentContainerStyle:styles.content},
          originalCreateElement(Text,{style:styles.sectionTitle},'Kaikki.fi'),
          originalCreateElement(View,{style:styles.card},
            originalCreateElement(View,{style:styles.row},
              originalCreateElement(View,{style:styles.rowCopy},
                originalCreateElement(Text,{style:styles.rowTitle},'Ilmoitukset'),
                originalCreateElement(Text,{style:styles.rowSub},notifications?'Käytössä':'Pois käytöstä')
              ),
              originalCreateElement(Switch,{value:notifications,onValueChange:changeNotifications})
            ),
            originalCreateElement(View,{style:styles.divider}),
            originalCreateElement(View,{style:styles.row},
              originalCreateElement(View,{style:styles.rowCopy},
                originalCreateElement(Text,{style:styles.rowTitle},'Kieli'),
                originalCreateElement(Text,{style:styles.rowSub},'Suomi')
              )
            ),
            originalCreateElement(View,{style:styles.divider}),
            originalCreateElement(View,{style:styles.row},
              originalCreateElement(View,{style:styles.rowCopy},
                originalCreateElement(Text,{style:styles.rowTitle},'Teema'),
                originalCreateElement(Text,{style:styles.rowSub},'Järjestelmän mukaan')
              )
            )
          ),
          originalCreateElement(Text,{style:styles.sectionTitle},'Puhelimen asetukset'),
          originalCreateElement(View,{style:styles.card},
            originalCreateElement(Pressable,{style:styles.linkRow,onPress:()=>Linking.openSettings().catch(()=>{})},
              originalCreateElement(View,{style:styles.rowCopy},
                originalCreateElement(Text,{style:styles.rowTitle},'Sovellusluvat'),
                originalCreateElement(Text,{style:styles.rowSub},'Kamera, mikrofoni, sijainti ja ilmoitukset')
              ),
              originalCreateElement(Text,{style:styles.arrow},'›')
            )
          ),
          originalCreateElement(Text,{style:styles.note},'Ilmoitusvalinta tallennetaan tähän laitteeseen. Androidin järjestelmäluvat avautuvat kohdasta Sovellusluvat.')
        )
      )
    )
  );
}

function shouldPatch(type,props){
  if(type!==Pressable||props?.__kaikkiSettingsPatched)return false;
  const text=nodeText(props?.children).trim();
  return text.includes('Asetukset')&&text.includes('›');
}

try{
  const runtime=require('react/jsx-runtime');
  const originalJsx=runtime.jsx;
  const originalJsxs=runtime.jsxs;
  const wrap=(original,type,props,key)=>{
    if(shouldPatch(type,props))return original(SettingsPressable,{originalProps:props},key);
    return original(type,props,key);
  };
  if(typeof originalJsx==='function')runtime.jsx=(type,props,key)=>wrap(originalJsx,type,props,key);
  if(typeof originalJsxs==='function')runtime.jsxs=(type,props,key)=>wrap(originalJsxs,type,props,key);
}catch(e){console.warn('settings screen patch',e?.message||e)}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:'#f7f8fa',paddingTop:36},
  header:{height:62,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,borderBottomWidth:1,borderBottomColor:'#e5e7eb'},
  back:{width:46,height:46,alignItems:'center',justifyContent:'center'},
  backText:{fontSize:38,lineHeight:40,color:'#1565d8'},
  title:{fontSize:21,fontWeight:'900',color:'#111827'},
  content:{padding:16,paddingBottom:50},
  sectionTitle:{fontSize:14,fontWeight:'800',color:'#64748b',marginTop:14,marginBottom:8,marginLeft:4},
  card:{backgroundColor:'#fff',borderRadius:16,overflow:'hidden',borderWidth:1,borderColor:'#e8ebef'},
  row:{minHeight:70,flexDirection:'row',alignItems:'center',paddingHorizontal:16},
  linkRow:{minHeight:76,flexDirection:'row',alignItems:'center',paddingHorizontal:16},
  rowCopy:{flex:1},
  rowTitle:{fontSize:17,fontWeight:'700',color:'#111827'},
  rowSub:{fontSize:13,color:'#64748b',marginTop:3},
  divider:{height:1,backgroundColor:'#eceff3',marginLeft:16},
  arrow:{fontSize:31,color:'#b7bcc5'},
  note:{fontSize:12.5,lineHeight:18,color:'#64748b',paddingHorizontal:4,marginTop:12}
});
