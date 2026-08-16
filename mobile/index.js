import React,{useState} from 'react';
import {View,StyleSheet} from 'react-native';
import {registerRootComponent} from 'expo';
import App from './App';
import HomeRedesign from './src/HomeRedesign';

function Root(){
  const[showFullApp,setShowFullApp]=useState(false);
  return <View style={s.root}>{showFullApp?<App/>:<HomeRedesign onOpenApp={()=>setShowFullApp(true)}/>}</View>;
}

const s=StyleSheet.create({root:{flex:1}});
registerRootComponent(Root);
