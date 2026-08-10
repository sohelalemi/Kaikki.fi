import React from 'react';
import {View,StyleSheet} from 'react-native';
import {registerRootComponent} from 'expo';
import App from './App';
import ExploreOverlay from './src/ExploreOverlay';
import LocationManager from './src/LocationManager';
import PushRegistrar from './src/PushRegistrar';
import AdvancedSellManager from './src/AdvancedSellManager';

function Root(){return <View style={s.root}><App/><ExploreOverlay/><LocationManager/><AdvancedSellManager/><PushRegistrar/></View>}
const s=StyleSheet.create({root:{flex:1}});
registerRootComponent(Root);
