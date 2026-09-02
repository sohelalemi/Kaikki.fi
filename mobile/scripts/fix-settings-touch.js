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

// Use the same plain Pressable pattern that already works elsewhere in the app.
const rowNew=`function settingsRow(title,subtitle,onPress,last=false){return <Pressable onPress={onPress} style={({pressed})=>({minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center',backgroundColor:pressed?'#f3f6fa':'transparent'})}><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Text style={{fontSize:31,color:'#b7bcc5'}}>›</Text></Pressable>}\n `;
s=s.slice(0,rowStart)+rowNew+s.slice(switchStart);

const swStart=s.indexOf('function settingsSwitch(');
const swEnd=s.indexOf('\n function openChat(',swStart);
if(swStart<0||swEnd<=swStart){
  console.error('Settings switch helper not found');
  process.exit(1);
}

// Let the native iOS Switch receive the touch directly. Tapping the row also toggles it.
const swNew=`function settingsSwitch(title,subtitle,key,last=false){const toggle=()=>changeSettingFlag(key,!settingFlags[key]);return <Pressable onPress={toggle} style={({pressed})=>({minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center',backgroundColor:pressed?'#f3f6fa':'transparent'})}><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Switch value={!!settingFlags[key]} onValueChange={v=>changeSettingFlag(key,v)} onTouchEnd={e=>e.stopPropagation&&e.stopPropagation()}/></Pressable>}\n`;
s=s.slice(0,swStart)+swNew+s.slice(swEnd);

// Keep navigation actions explicit.
s=s.replace(/settingsRow\('Kieli',languageName,[^}]*\)/g,"settingsRow('Kieli',languageName,()=>setTab('settings-language'))");
s=s.replace(/settingsRow\('Teema',themeName,[^}]*\)/g,"settingsRow('Teema',themeName,()=>setTab('settings-theme'),true)");

if(!s.includes('keyboardShouldPersistTaps="handled"')){
  s=s.replace("tab==='settings'&&<ScrollView ","tab==='settings'&&<ScrollView keyboardShouldPersistTaps=\"handled\" ");
}

if(!s.includes("onPress={onPress}")||!s.includes("onValueChange={v=>changeSettingFlag(key,v)}")||!s.includes("setTab('settings-language')")||!s.includes("setTab('settings-theme')")){
  console.error('Settings touch verification failed');
  process.exit(1);
}

fs.writeFileSync(p,s);
console.log('Fixed iOS settings rows and switches with direct native touch handling.');
