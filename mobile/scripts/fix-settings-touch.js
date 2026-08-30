const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

const rowStart=s.indexOf('function settingsRow(');
const switchStart=s.indexOf('function settingsSwitch(',rowStart);
if(rowStart<0||switchStart<=rowStart){
  console.error('Settings row helper not found');
  process.exit(1);
}
const rowNew=`function settingsRow(title,subtitle,onPress,last=false){return <Pressable onPress={()=>onPress&&onPress()} hitSlop={4} style={({pressed})=>({minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center',opacity:pressed?0.55:1})}><View pointerEvents="none" style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Text pointerEvents="none" style={{fontSize:31,color:'#b7bcc5'}}>›</Text></Pressable>}\n `;
s=s.slice(0,rowStart)+rowNew+s.slice(switchStart);

const swStart=s.indexOf('function settingsSwitch(');
const swEnd=s.indexOf('\n function openChat(',swStart);
if(swStart<0||swEnd<=swStart){
  console.error('Settings switch helper not found');
  process.exit(1);
}
const swNew=`function settingsSwitch(title,subtitle,key,last=false){return <Pressable onPress={()=>changeSettingFlag(key,!settingFlags[key])} hitSlop={4} style={({pressed})=>({minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center',opacity:pressed?0.65:1})}><View pointerEvents="none" style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><View pointerEvents="none"><Switch value={!!settingFlags[key]}/></View></Pressable>}\n`;
s=s.slice(0,swStart)+swNew+s.slice(swEnd);

const languageAlert=/settingsRow\('Kieli',languageName,\(\)=>Alert\.alert\('Kieli'[\s\S]*?\]\)\)/;
if(languageAlert.test(s)) s=s.replace(languageAlert,"settingsRow('Kieli',languageName,()=>setTab('settings-language'))");
const languageOld="settingsRow('Kieli',languageName,()=>setTab('settings-language'))";
if(!s.includes(languageOld)){
  console.error('Kieli action not found');
  process.exit(1);
}

const themeAlert=/settingsRow\('Teema',themeName,\(\)=>Alert\.alert\('Teema'[\s\S]*?\]\),true\)/;
if(themeAlert.test(s)) s=s.replace(themeAlert,"settingsRow('Teema',themeName,()=>setTab('settings-theme'),true)");
const themeOld="settingsRow('Teema',themeName,()=>setTab('settings-theme'),true)";
if(!s.includes(themeOld)){
  console.error('Teema action not found');
  process.exit(1);
}

if(!s.includes('keyboardShouldPersistTaps="always"')){
  s=s.replace("tab==='settings'&&<ScrollView contentContainerStyle=","tab==='settings'&&<ScrollView keyboardShouldPersistTaps=\"always\" contentContainerStyle=");
}

if(!s.includes("settingsRow('Kieli',languageName,()=>setTab('settings-language'))")||!s.includes("settingsRow('Teema',themeName,()=>setTab('settings-theme'),true)")||!s.includes("onPress={()=>changeSettingFlag(key,!settingFlags[key])}")){
  console.error('Settings Pressable verification failed');
  process.exit(1);
}

fs.writeFileSync(p,s);
console.log('Settings controls use standard Pressable rows and full-row toggles.');
