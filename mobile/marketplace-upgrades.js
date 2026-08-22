import React,{useState}from'react';
import{Alert,Image,Pressable,ScrollView,Share,StyleSheet,Text,View}from'react-native';
import{supabase}from'./src/supabase';

const originalCreateElement=React.createElement.bind(React);
const originalFrom=supabase.from.bind(supabase);
let lastDetailTitle='';
let lastDetailPrice='';
let soldMode=false;

function nodeText(node){
  if(node===null||node===undefined||node===false)return '';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}

function rememberDetailText(type,props){
  if(type!==Text)return;
  const flat=StyleSheet.flatten(props?.style)||{};
  const text=nodeText(props?.children).trim();
  if(flat.fontSize===28&&String(flat.fontWeight)==='900'&&text)lastDetailTitle=text;
  if(flat.fontSize===30&&String(flat.fontWeight)==='900'&&text.includes('€'))lastDetailPrice=text;
}

function GalleryCounter({children,scrollProps}){
  const[index,setIndex]=useState(0);
  const items=Array.isArray(children)?children:[children].filter(Boolean);
  const onEnd=e=>{
    const width=e?.nativeEvent?.layoutMeasurement?.width||1;
    const x=e?.nativeEvent?.contentOffset?.x||0;
    setIndex(Math.max(0,Math.min(items.length-1,Math.round(x/width))));
    scrollProps?.onMomentumScrollEnd?.(e);
  };
  return originalCreateElement(View,{style:styles.galleryWrap},
    originalCreateElement(ScrollView,{...scrollProps,horizontal:true,pagingEnabled:true,showsHorizontalScrollIndicator:false,onMomentumScrollEnd:onEnd},...items),
    items.length>1?originalCreateElement(View,{style:styles.counter},originalCreateElement(Text,{style:styles.counterText},`${index+1}/${items.length}`)):null
  );
}

async function shareListing(){
  const title=lastDetailTitle||'Kaikki.fi ilmoitus';
  const price=lastDetailPrice?` — ${lastDetailPrice}`:'';
  try{await Share.share({message:`${title}${price}\nKaikki.fi`});}catch(e){Alert.alert('Jakaminen',e?.message||'Ilmoitusta ei voitu jakaa.');}
}

function ShareButton(){
  return originalCreateElement(Pressable,{style:styles.shareButton,onPress:shareListing},originalCreateElement(Text,{style:styles.shareText},'↗ Jaa'));
}

supabase.from=(table)=>{
  const builder=originalFrom(table);
  if(table!=='listings'||!builder?.update)return builder;
  const originalUpdate=builder.update.bind(builder);
  builder.update=(values,...args)=>{
    if(soldMode){
      soldMode=false;
      values={...(values||{}),status:'sold'};
    }
    return originalUpdate(values,...args);
  };
  return builder;
};

function patch(type,props,children,creator){
  rememberDetailText(type,props);
  const list=Array.isArray(children)?children:[];

  if(type===ScrollView&&props?.horizontal&&props?.pagingEnabled&&!props?.__kaikkiCounterPatched){
    const imageCount=list.filter(c=>c?.type===Image||c?.props?.source?.uri).length;
    if(imageCount>0)return originalCreateElement(GalleryCounter,{scrollProps:{...props,__kaikkiCounterPatched:true},children:list});
  }

  if(type===View&&!props?.__kaikkiSharePatched){
    const combined=list.map(nodeText).join(' ');
    if(combined.includes('Lähetä viesti')&&combined.includes('Varaa')){
      return originalCreateElement(View,{...props,__kaikkiSharePatched:true,style:[props.style,styles.wrap]},...list,originalCreateElement(ShareButton,{key:'share-detail'}));
    }
    if(combined.includes('Muokkaa')&&(combined.includes('Piilota')||combined.includes('Näytä'))){
      const toggle=list.find(c=>{const t=nodeText(c);return t.includes('Piilota')||t.includes('Näytä')});
      const soldPress=()=>{
        if(!toggle?.props?.onPress)return;
        Alert.alert('Merkitse myydyksi','Merkitäänkö ilmoitus myydyksi?',[{text:'Peruuta',style:'cancel'},{text:'Myyty',onPress:async()=>{soldMode=true;try{await Promise.resolve(toggle.props.onPress());Alert.alert('Myyty','Ilmoitus merkittiin myydyksi.');}catch(e){soldMode=false;Alert.alert('Virhe',e?.message||'Tilaa ei voitu muuttaa.');}}}]);
      };
      return originalCreateElement(View,{...props,__kaikkiSharePatched:true,style:[props.style,styles.wrap]},...list,originalCreateElement(Pressable,{key:'sold-action',style:styles.soldButton,onPress:soldPress},originalCreateElement(Text,{style:styles.soldText},'✓ Myyty')));
    }
  }

  if(type===Pressable&&!props?.__kaikkiOwnerDetailPatched&&nodeText(props?.children).includes('Muokkaa ilmoitusta')){
    return originalCreateElement(View,{__kaikkiOwnerDetailPatched:true,style:styles.ownerActions},creator(),originalCreateElement(ShareButton,{key:'owner-share'}));
  }

  return creator();
}

React.createElement=(type,props,...children)=>patch(type,props,children,()=>originalCreateElement(type,props,...children));

try{
  const runtime=require('react/jsx-runtime');
  const originalJsx=runtime.jsx;
  const originalJsxs=runtime.jsxs;
  const run=(original,type,props,key)=>{
    const children=Array.isArray(props?.children)?props.children:[props?.children].filter(Boolean);
    return patch(type,props,children,()=>original(type,props,key));
  };
  if(typeof originalJsx==='function')runtime.jsx=(type,props,key)=>run(originalJsx,type,props,key);
  if(typeof originalJsxs==='function')runtime.jsxs=(type,props,key)=>run(originalJsxs,type,props,key);
}catch(e){console.warn('marketplace upgrades',e?.message||e)}

const styles=StyleSheet.create({
  galleryWrap:{position:'relative'},
  counter:{position:'absolute',right:14,bottom:14,backgroundColor:'rgba(15,23,42,.72)',paddingHorizontal:10,paddingVertical:6,borderRadius:999},
  counterText:{color:'#fff',fontWeight:'900',fontSize:13},
  wrap:{flexWrap:'wrap'},
  shareButton:{minHeight:44,borderRadius:11,borderWidth:1,borderColor:'#cbd5e1',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',paddingHorizontal:16,marginTop:8},
  shareText:{fontWeight:'800',color:'#334155'},
  soldButton:{minHeight:44,borderRadius:11,backgroundColor:'#ecfdf5',borderWidth:1,borderColor:'#86efac',alignItems:'center',justifyContent:'center',paddingHorizontal:16,marginTop:8},
  soldText:{fontWeight:'900',color:'#15803d'},
  ownerActions:{gap:8}
});
