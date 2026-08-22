import React,{useState} from 'react';
import {View,Text,Pressable} from 'react-native';

// Keep Uusi stable by avoiding a native MapView mount until the user asks for it.
// The real react-native-maps component is preserved and rendered only after
// tapping the button below.
try {
  const maps = require('react-native-maps');
  const NativeMap = maps?.default;

  function LazyMap(props){
    const[open,setOpen]=useState(false);

    if(!open){
      return React.createElement(
        View,
        {style:[props?.style,{alignItems:'center',justifyContent:'center',backgroundColor:'#eef2f6',padding:16}]},
        React.createElement(Text,{style:{color:'#334155',fontWeight:'800',marginBottom:10}},'📍 Sijainti kartalla'),
        React.createElement(Text,{style:{color:'#64748b',textAlign:'center',marginBottom:14}},'Kartta avautuu vasta kun painat alla olevaa painiketta.'),
        React.createElement(
          Pressable,
          {onPress:()=>setOpen(true),style:{backgroundColor:'#1565d8',paddingHorizontal:18,paddingVertical:12,borderRadius:12}},
          React.createElement(Text,{style:{color:'#fff',fontWeight:'900'}},'Näytä kartta')
        )
      );
    }

    if(typeof NativeMap!=='function'&&typeof NativeMap!=='object'){
      return React.createElement(
        View,
        {style:[props?.style,{alignItems:'center',justifyContent:'center',backgroundColor:'#eef2f6',padding:16}]},
        React.createElement(Text,{style:{color:'#b91c1c',textAlign:'center'}},'Karttaa ei voitu ladata tällä laitteella.')
      );
    }

    return React.createElement(NativeMap,props,props?.children);
  }

  if(maps && maps.default) maps.default = LazyMap;
} catch (e) {
  console.warn('lazy map fix', e?.message || e);
}
