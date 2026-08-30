const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

// Make settings controls use a dedicated touch component on iOS.
s=s.replace(/import\{([^}]*)\}from'react-native';/, (m,items)=>{
  if(items.includes('TouchableOpacity')) return m;
  return `import{${items},TouchableOpacity}from'react-native';`;
});

const rowRe=/function settingsRow\(title,subtitle,onPress,last=false\)\{return <Pressable onPress=\{onPress\} style=\{\{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last\?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'\}\}><View style=\{\{flex:1\}\}><Text style=\{\{fontSize:17,fontWeight:'800',color:'#111827'\}\}>\{title\}<\/Text>\{subtitle\?<Text style=\{\{fontSize:14,color:'#718096',marginTop:4\}\}>\{subtitle\}<\/Text>:null\}<\/View><Text style=\{\{fontSize:31,color:'#b7bcc5'\}\}>›<\/Text><\/Pressable>\}/;
const rowNew="function settingsRow(title,subtitle,onPress,last=false){return <TouchableOpacity activeOpacity={0.65} onPress={onPress} style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><Text style={{fontSize:31,color:'#b7bcc5'}}>›</Text></TouchableOpacity>}";
s=s.replace(rowRe,rowNew);

const switchRe=/function settingsSwitch\(title,subtitle,key,last=false\)\{return <View style=\{\{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last\?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'\}\}><View style=\{\{flex:1\}\}><Text style=\{\{fontSize:17,fontWeight:'800',color:'#111827'\}\}>\{title\}<\/Text>\{subtitle\?<Text style=\{\{fontSize:14,color:'#718096',marginTop:4\}\}>\{subtitle\}<\/Text>:null\}<\/View><Switch value=\{!!settingFlags\[key\]\} onValueChange=\{v=>changeSettingFlag\(key,v\)\}\/><\/View>\}/;
const switchNew="function settingsSwitch(title,subtitle,key,last=false){return <TouchableOpacity activeOpacity={0.8} onPress={()=>changeSettingFlag(key,!settingFlags[key])} style={{minHeight:82,paddingHorizontal:16,paddingVertical:13,borderBottomWidth:last?0:1,borderBottomColor:'#e7ebf0',flexDirection:'row',alignItems:'center'}}><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:'#111827'}}>{title}</Text>{subtitle?<Text style={{fontSize:14,color:'#718096',marginTop:4}}>{subtitle}</Text>:null}</View><View pointerEvents=\"none\"><Switch value={!!settingFlags[key]}/></View></TouchableOpacity>}";
s=s.replace(switchRe,switchNew);

fs.writeFileSync(p,s);
console.log('Settings touch actions fixed.');
