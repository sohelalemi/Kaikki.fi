const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

// Make sure TouchableOpacity is available. Keep this patch limited to settings touch handling.
s=s.replace(
  "import{ActivityIndicator,Alert,FlatList,Image,Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Switch,Text,TextInput,View}from'react-native';",
  "import{ActivityIndicator,Alert,FlatList,Image,Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Switch,Text,TextInput,TouchableOpacity,View}from'react-native';"
);
s=s.replace(
  "import{ActivityIndicator,Alert,FlatList,Image,Linking,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Switch,Text,TextInput,View}from'react-native';",
  "import{ActivityIndicator,Alert,FlatList,Image,Linking,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Switch,Text,TextInput,TouchableOpacity,View}from'react-native';"
);

const rowStart=s.indexOf('function settingsRow(');
const switchStart=s.indexOf('function settingsSwitch(',rowStart);
if(rowStart<0||switchStart<=rowStart){
  console.error('Settings row helper not found');
  process.exit(1);
}

const rowNew=`function settingsRow(title,subtitle,onPress,last=false){return <TouchableOpacity activeOpacity={0.65} onPress={()=>{if(typeof onPress==='function')onPress()}} style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Text style={{fontSize:31,color:'#b7bcc5'}}>›</Text></TouchableOpacity>}\n `;
s=s.slice(0,rowStart)+rowNew+s.slice(switchStart);

const swStart=s.indexOf('function settingsSwitch(');
const swEnd=s.indexOf('\n function openChat(',swStart);
if(swStart<0||swEnd<=swStart){
  console.error('Settings switch helper not found');
  process.exit(1);
}

// Native Switch handles its own touch directly; the text area is separately tappable.
const swNew=`function settingsSwitch(title,subtitle,key,last=false){const toggle=()=>changeSettingFlag(key,!settingFlags[key]);return <View style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><TouchableOpacity activeOpacity={0.65} onPress={toggle} style={{flex:1,paddingVertical:6}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</TouchableOpacity><Switch value={!!settingFlags[key]} onValueChange={v=>changeSettingFlag(key,v)}/></View>}\n`;
s=s.slice(0,swStart)+swNew+s.slice(swEnd);

// Navigation rows must point to real screens.
s=s.replace(/settingsRow\('Kieli',languageName,[^}]*\)/g,"settingsRow('Kieli',languageName,()=>setTab('settings-language'))");
s=s.replace(/settingsRow\('Teema',themeName,[^}]*\)/g,"settingsRow('Teema',themeName,()=>setTab('settings-theme'),true)");

// ScrollView should allow nested controls to receive taps immediately.
s=s.replace("tab==='settings'&&<ScrollView keyboardShouldPersistTaps=\"handled\" ","tab==='settings'&&<ScrollView keyboardShouldPersistTaps=\"always\" ");
if(!s.includes('keyboardShouldPersistTaps="always"')){
  s=s.replace("tab==='settings'&&<ScrollView ","tab==='settings'&&<ScrollView keyboardShouldPersistTaps=\"always\" ");
}

if(!s.includes('TouchableOpacity')||!s.includes("setTab('settings-language')")||!s.includes("setTab('settings-theme')")||!s.includes('onValueChange={v=>changeSettingFlag(key,v)}')){
  console.error('Settings native touch verification failed');
  process.exit(1);
}

fs.writeFileSync(p,s);
console.log('Settings use native TouchableOpacity rows and direct iOS switches.');
