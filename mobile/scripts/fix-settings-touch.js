const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

// Always add a native iOS touch component.
s=s.replace(/import\{([^}]*)\}from'react-native';/, (m,items)=>{
  const parts=items.split(',').map(x=>x.trim()).filter(Boolean);
  if(!parts.includes('TouchableOpacity')) parts.push('TouchableOpacity');
  return `import{${parts.join(',')}}from'react-native';`;
});

// Replace helpers by boundaries instead of fragile full-regex matching.
const rowStart=s.indexOf('function settingsRow(');
const switchStart=s.indexOf('function settingsSwitch(',rowStart);
if(rowStart>=0&&switchStart>rowStart){
  const rowNew=`function settingsRow(title,subtitle,onPress,last=false){return <TouchableOpacity activeOpacity={0.55} onPress={onPress} style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><View pointerEvents="none" style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Text pointerEvents="none" style={{fontSize:31,color:'#b7bcc5'}}>›</Text></TouchableOpacity>}\n `;
  s=s.slice(0,rowStart)+rowNew+s.slice(switchStart);
}

const swStart=s.indexOf('function settingsSwitch(');
const swEnd=s.indexOf('\n function openChat(',swStart);
if(swStart>=0&&swEnd>swStart){
  const swNew=`function settingsSwitch(title,subtitle,key,last=false){return <TouchableOpacity activeOpacity={0.75} onPress={()=>changeSettingFlag(key,!settingFlags[key])} style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><View pointerEvents="none" style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><View pointerEvents="none"><Switch value={!!settingFlags[key]}/></View></TouchableOpacity>}\n`;
  s=s.slice(0,swStart)+swNew+s.slice(swEnd);
}

// Make ScrollViews explicitly allow taps to reach settings controls.
s=s.replace("tab==='settings'&&<ScrollView contentContainerStyle=", "tab==='settings'&&<ScrollView keyboardShouldPersistTaps=\"always\" contentContainerStyle=");
s=s.replace("tab==='settings-language'&&<ScrollView contentContainerStyle=", "tab==='settings-language'&&<ScrollView keyboardShouldPersistTaps=\"always\" contentContainerStyle=");
s=s.replace("tab==='settings-theme'&&<ScrollView contentContainerStyle=", "tab==='settings-theme'&&<ScrollView keyboardShouldPersistTaps=\"always\" contentContainerStyle=");

fs.writeFileSync(p,s);
console.log('Robust iOS Settings touch/navigation patch applied.');
