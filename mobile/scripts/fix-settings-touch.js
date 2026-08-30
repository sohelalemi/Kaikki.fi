const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

s=s.replace(/import\{([^}]*)\}from'react-native';/,(m,items)=>{
  const parts=items.split(',').map(x=>x.trim()).filter(Boolean);
  if(!parts.includes('TouchableOpacity')) parts.push('TouchableOpacity');
  return `import{${parts.join(',')}}from'react-native';`;
});

const rowStart=s.indexOf('function settingsRow(');
const switchStart=s.indexOf('function settingsSwitch(',rowStart);
if(rowStart<0||switchStart<=rowStart){
  console.error('Settings row helper not found');
  process.exit(1);
}
const rowNew=`function settingsRow(title,subtitle,onPress,last=false){return <TouchableOpacity activeOpacity={0.55} onPressIn={onPress} style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><View pointerEvents="none" style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Text pointerEvents="none" style={{fontSize:31,color:'#b7bcc5'}}>›</Text></TouchableOpacity>}\n `;
s=s.slice(0,rowStart)+rowNew+s.slice(switchStart);

const swStart=s.indexOf('function settingsSwitch(');
const swEnd=s.indexOf('\n function openChat(',swStart);
if(swStart<0||swEnd<=swStart){
  console.error('Settings switch helper not found');
  process.exit(1);
}
const swNew=`function settingsSwitch(title,subtitle,key,last=false){return <View style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Switch value={!!settingFlags[key]} onValueChange={v=>changeSettingFlag(key,v)}/></View>}\n`;
s=s.slice(0,swStart)+swNew+s.slice(swEnd);

const languageOld="settingsRow('Kieli',languageName,()=>setTab('settings-language'))";
const languageNew=`settingsRow('Kieli',languageName,()=>Alert.alert('Kieli','Valitse kieli',[{text:'Suomi',onPress:()=>chooseLanguage('fi')},{text:'English',onPress:()=>chooseLanguage('en')},{text:'فارسی',onPress:()=>chooseLanguage('fa')},{text:'Русский',onPress:()=>chooseLanguage('ru')},{text:'Peruuta',style:'cancel'}]))`;
if(s.includes(languageOld)){
  s=s.replace(languageOld,languageNew);
}else if(!s.includes("Alert.alert('Kieli'")){
  console.error('Kieli action not found');
  process.exit(1);
}

const themeOld="settingsRow('Teema',themeName,()=>setTab('settings-theme'),true)";
const themeNew=`settingsRow('Teema',themeName,()=>Alert.alert('Teema','Valitse teema',[{text:'Järjestelmän mukaan',onPress:()=>chooseTheme('system')},{text:'Vaalea',onPress:()=>chooseTheme('light')},{text:'Tumma',onPress:()=>chooseTheme('dark')},{text:'Peruuta',style:'cancel'}]),true)`;
if(s.includes(themeOld)){
  s=s.replace(themeOld,themeNew);
}else if(!s.includes("Alert.alert('Teema'")){
  console.error('Teema action not found');
  process.exit(1);
}

if(!s.includes('keyboardShouldPersistTaps="always"')){
  s=s.replace("tab==='settings'&&<ScrollView contentContainerStyle=","tab==='settings'&&<ScrollView keyboardShouldPersistTaps=\"always\" contentContainerStyle=");
}

if(!s.includes("Alert.alert('Kieli'")||!s.includes("Alert.alert('Teema'")||!s.includes('onValueChange={v=>changeSettingFlag(key,v)}')){
  console.error('Settings native controls verification failed');
  process.exit(1);
}

fs.writeFileSync(p,s);
console.log('Settings native controls applied safely (repeatable on GitHub and EAS).');
