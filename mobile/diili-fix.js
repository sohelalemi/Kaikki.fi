import React from 'react';
import {Alert,Pressable,StyleSheet,Text,View} from 'react-native';
import {supabase} from './src/supabase';

const originalCreateElement=React.createElement.bind(React);
const originalFrom=supabase.from.bind(supabase);
const originalAlert=Alert.alert.bind(Alert);
let diiliMode=false;
let suppressReservationSuccess=false;
let lastDealCreated=false;
let lastDetailAmount=0;
let detailRenderContext=false;

function nodeText(node){
  if(node===null||node===undefined||node===false)return '';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}
function parseEuro(text){
  const cleaned=String(text||'').replace(/\s/g,'').replace(',','.').replace(/[^0-9.]/g,'');
  const value=Number(cleaned);
  return Number.isFinite(value)?value:0;
}
function rememberPrice(type,props){
  if(type!==Text)return;
  const flat=StyleSheet.flatten(props?.style)||{};
  const weight=String(flat.fontWeight||'');
  if(flat.fontSize===30&&weight==='900'){
    const amount=parseEuro(nodeText(props?.children));
    if(amount>0)lastDetailAmount=amount;
    detailRenderContext=true;
    return;
  }
  // Listing cards use the smaller marketplace price style. Reset the context
  // there so Kaikki Diili is not injected into every card on the home screen.
  if(flat.fontSize===18&&weight==='900')detailRenderContext=false;
}

supabase.from=(table)=>{
  const builder=originalFrom(table);
  if(table!=='reservations'||!builder?.insert)return builder;
  const originalInsert=builder.insert.bind(builder);
  builder.insert=(values,...args)=>{
    if(!diiliMode)return originalInsert(values,...args);
    diiliMode=false;
    suppressReservationSuccess=true;
    lastDealCreated=false;
    const rows=(Array.isArray(values)?values:[values]).map(r=>({listing_id:r.listing_id,buyer_id:r.buyer_id,seller_id:r.seller_id,amount:lastDetailAmount||0,status:'pending'}));
    return Promise.resolve(originalFrom('deals').insert(Array.isArray(values)?rows:rows[0],...args)).then(result=>{lastDealCreated=!result?.error;return result;});
  };
  return builder;
};
Alert.alert=(title,message,...rest)=>{
  if(suppressReservationSuccess&&title==='Varaus lähetetty'){suppressReservationSuccess=false;return;}
  return originalAlert(title,message,...rest);
};

function startDiili(reservePress){
  originalAlert('Kaikki Diili','Turvallisempi tapa tehdä kauppa. Lähetä Diili-pyyntö myyjälle. Maksua ei vielä veloiteta tässä MVP-versiossa.',[
    {text:'Peruuta',style:'cancel'},
    {text:'Lähetä Diili-pyyntö',onPress:async()=>{
      diiliMode=true;lastDealCreated=false;
      try{
        await Promise.resolve(reservePress?.());
        if(lastDealCreated)originalAlert('Kaikki Diili','Diili-pyyntö lähetettiin myyjälle. 🛡️');
      }catch(e){diiliMode=false;originalAlert('Kaikki Diili',e?.message||'Diili-pyyntöä ei voitu lähettää.');}
    }}
  ]);
}
function DiiliButton({reservePress}){
  return originalCreateElement(Pressable,{style:styles.diiliButton,onPress:()=>startDiili(reservePress)},originalCreateElement(Text,{style:styles.diiliText},'🛡️ Kaikki Diili'));
}

// Add Kaikki Diili only beside the Varaa action inside the listing detail view.
// Home/favorites cards keep their compact Viesti + Varaa layout.
function patchElement(original,type,props,key){
  rememberPrice(type,props);
  if(detailRenderContext&&type===Pressable&&!props?.__kaikkiDiiliOriginal&&typeof props?.onPress==='function'&&nodeText(props?.children).trim()==='Varaa'){
    const originalButton=original(Pressable,{...props,__kaikkiDiiliOriginal:true},key?`${key}-varaa`:undefined);
    const diili=original(DiiliButton,{reservePress:props.onPress},key?`${key}-diili`:undefined);
    detailRenderContext=false;
    return original(View,{style:styles.stack,children:[originalButton,diili]},key);
  }
  return original(type,props,key);
}

React.createElement=(type,props,...children)=>{
  rememberPrice(type,props);
  if(detailRenderContext&&type===Pressable&&!props?.__kaikkiDiiliOriginal&&typeof props?.onPress==='function'&&nodeText(children).trim()==='Varaa'){
    detailRenderContext=false;
    return originalCreateElement(View,{style:styles.stack},
      originalCreateElement(Pressable,{...props,__kaikkiDiiliOriginal:true},...children),
      originalCreateElement(DiiliButton,{reservePress:props.onPress})
    );
  }
  return originalCreateElement(type,props,...children);
};

try{
  const runtime=require('react/jsx-runtime');
  const originalJsx=runtime.jsx;
  const originalJsxs=runtime.jsxs;
  if(typeof originalJsx==='function')runtime.jsx=(type,props,key)=>patchElement(originalJsx,type,props,key);
  if(typeof originalJsxs==='function')runtime.jsxs=(type,props,key)=>patchElement(originalJsxs,type,props,key);
}catch(e){console.warn('Kaikki Diili JSX patch',e?.message||e);}

const styles=StyleSheet.create({
  stack:{flex:1,gap:8},
  diiliButton:{minHeight:42,borderRadius:11,backgroundColor:'#eaf2ff',borderWidth:1,borderColor:'#1565d8',alignItems:'center',justifyContent:'center',paddingHorizontal:10,paddingVertical:9},
  diiliText:{color:'#1565d8',fontWeight:'900',fontSize:13},
});
