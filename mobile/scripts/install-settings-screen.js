const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

if(!s.includes("import SettingsScreen from'./src/SettingsScreen';")){
  const anchor="import{loadFavoriteIds,toggleFavorite as toggleFavoriteRemote}from'./src/favorites';";
  if(!s.includes(anchor))throw new Error('Settings install: import anchor not found');
  s=s.replace(anchor,anchor+"\nimport SettingsScreen from'./src/SettingsScreen';");
}

s=s.replace("{menuRow('⚙','Asetukset',()=>comingSoon('Asetukset'))}","{menuRow('⚙','Asetukset',()=>setTab('settings'))}");

// Settings is rendered with an early return. When tab === 'settings', the legacy
// app tree, fixed bottom navigation and any sibling overlays are not mounted at all.
if(!s.includes("if(tab==='settings')return <SafeAreaView")){
  const anchor=" return <SafeAreaView style={s.container}>";
  if(!s.includes(anchor))throw new Error('Settings install: root return anchor not found');
  const settingsReturn=" if(tab==='settings')return <SafeAreaView style={{flex:1,backgroundColor:'#f6f7f9'}}><SettingsScreen session={session} onBack={()=>setTab('profile')}/></SafeAreaView>;\n";
  s=s.replace(anchor,settingsReturn+anchor);
}

if(!s.includes("setTab('settings')")||!s.includes("if(tab==='settings')return <SafeAreaView")){
  throw new Error('Settings root-screen install verification failed');
}

fs.writeFileSync(p,s);
console.log('Installed SettingsScreen as isolated root screen.');
