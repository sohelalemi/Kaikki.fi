import React from 'react';
import {View,StyleSheet} from 'react-native';
import {registerRootComponent} from 'expo';
import App from './App';
import ExploreOverlay from './src/ExploreOverlay';

function Root(){return <View style={s.root}><App/><ExploreOverlay/></View>}
const s=StyleSheet.create({root:{flex:1}});
registerRootComponent(Root);
