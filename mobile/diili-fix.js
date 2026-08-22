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

function rememberDetailPrice(type,props){
  if(type!==Text)return;
  const flat=StyleSheet.flatten(props?.style)||{};
  if(flat.fontSize===30&&String(flat.fontWeight)==='900'){
    const amount=parseEuro(nodeText(props?.children));
    if(amount>0)lastDetailAmount=amount;
  }
}

// Kaikki Diili starts from the same listing context as the existing Varaa button.
// While Diili mode is active, the reservation insert is redirected into the
// dedicated deals table instead of creating a normal reservation.
supabase.from=(table)=>{
  const builder=originalFrom(table);
  if(table!=='reservations'||!builder?.insert)return builder;
  const originalInsert=builder.insert.bind(builder);
  builder.insert=(values,...args)=>{
    if(!diiliMode)return originalInsert(values,...args);
    diiliMode=false;
    suppressReservationSuccess=true;
    lastDealCreated=false;
    const rows=(Array.isArray(values)?values:[values]).map(r=>({
      listing_id:r.listing_id,
      buyer_id:r.buyer_id,
      seller_id:r.seller_id,
      amount:lastDetailAmount||0,
      status:'pending',
    }));
    return Promise.resolve(originalFrom('deals').insert(Array.isArray(values)?rows:rows[0],...args)).then(result=>{
      lastDealCreated=!result?.error;
      return result;
    });
  };
  return builder;
};

Alert.alert=(title,message,...rest)=>{
  if(suppressReservationSuccess&&title==='Varaus lähetetty'){
    suppressReservationSuccess=false;
    return;
  }
  return originalAlert(title,message,...rest);
};

function DiiliButton({reservePress}){
  const start=()=>{
    originalAlert(
      'Kaikki Diili',
      'Turvallisempi tapa tehdä kauppa. Lähetä Diili-pyyntö myyjälle. Maksua ei vielä veloiteta tässä MVP-versiossa.',
      [
        {text:'Peruuta',style:'cancel'},
        {text:'Lähetä Diili-pyyntö',onPress:async()=>{
          diiliMode=true;
          lastDealCreated=false;
          try{
            await Promise.resolve(reservePress?.());
            if(lastDealCreated){
              originalAlert('Kaikki Diili','Diili-pyyntö lähetettiin myyjälle. 🛡️');
            }
          }catch(e){
            diiliMode=false;
            originalAlert('Kaikki Diili',e?.message||'Diili-pyyntöä ei voitu lähettää.');
          }
        }}
      ]
    );
  };
  return originalCreateElement(
    Pressable,
    {style:styles.diiliButton,onPress:start},
    originalCreateElement(Text,{style:styles.diiliText},'🛡️ Kaikki Diili')
  );
}

function patchDetailActionRow(type,props,children,creator){
  rememberDetailPrice(type,props);
  if(type!==View||props?.__kaikkiDiiliPatched)return creator();
  const list=Array.isArray(children)?children:[];
  const combined=list.map(nodeText).join(' ');
  if(!combined.includes('Lähetä viesti')||!combined.includes('Varaa'))return creator();
  const reserve=list.find(child=>nodeText(child).trim()==='Varaa'||nodeText(child).includes('Varaa'));
  if(!reserve?.props?.onPress)return creator();
  return originalCreateElement(
    View,
    {...props,__kaikkiDiiliPatched:true,style:[props.style,styles.actionWrap]},
    ...list,
    originalCreateElement(DiiliButton,{reservePress:reserve.props.onPress})
  );
}

React.createElement=(type,props,...children)=>patchDetailActionRow(
  type,
  props,
  children,
  ()=>originalCreateElement(type,props,...children)
);

try{
  const runtime=require('react/jsx-runtime');
  const originalJsx=runtime.jsx;
  const originalJsxs=runtime.jsxs;
  const patch=(original,type,props,key)=>{
    rememberDetailPrice(type,props);
    const children=Array.isArray(props?.children)?props.children:[props?.children].filter(Boolean);
    if(type===View&&!props?.__kaikkiDiiliPatched){
      const combined=children.map(nodeText).join(' ');
      if(combined.includes('Lähetä viesti')&&combined.includes('Varaa')){
        const reserve=children.find(child=>nodeText(child).includes('Varaa'));
        if(reserve?.props?.onPress){
          return original(View,{...props,__kaikkiDiiliPatched:true,style:[props.style,styles.actionWrap],children:[...children,originalJsx(DiiliButton,{reservePress:reserve.props.onPress},'kaikki-diili')]},key);
        }
      }
    }
    return original(type,props,key);
  };
  if(typeof originalJsx==='function')runtime.jsx=(type,props,key)=>patch(originalJsx,type,props,key);
  if(typeof originalJsxs==='function')runtime.jsxs=(type,props,key)=>patch(originalJsxs,type,props,key);
}catch(e){
  console.warn('Kaikki Diili JSX patch',e?.message||e);
}

const styles=StyleSheet.create({
  actionWrap:{flexWrap:'wrap'},
  diiliButton:{width:'100%',marginTop:8,minHeight:46,borderRadius:12,backgroundColor:'#eaf2ff',borderWidth:1,borderColor:'#1565d8',alignItems:'center',justifyContent:'center',paddingHorizontal:14},
  diiliText:{color:'#1565d8',fontWeight:'900',fontSize:15},
});
