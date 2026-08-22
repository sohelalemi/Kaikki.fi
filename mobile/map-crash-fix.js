// Temporary stability fix for Android Uusi screen.
// Some Android builds can terminate when react-native-maps mounts before a
// working native maps configuration is available. Replace only the native
// MapView component with a lightweight View so the listing form always opens.
// Address/city fields and the rest of the listing form continue to work.
import React from 'react';
import {View,Text} from 'react-native';

try {
  const maps = require('react-native-maps');
  const SafeMap = (props) => React.createElement(
    View,
    {style:[props?.style,{alignItems:'center',justifyContent:'center',backgroundColor:'#eef2f6'}]},
    React.createElement(Text,{style:{color:'#64748b',textAlign:'center',padding:16}},'📍 Kartta otetaan käyttöön seuraavassa korjauksessa')
  );
  if (maps && maps.default) maps.default = SafeMap;
} catch (e) {
  console.warn('map crash fix', e?.message || e);
}
