const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

if(!s.includes("import SettingsScreen from'./src/SettingsScreen';")){
  const anchor="import{loadFavoriteIds,toggleFavorite as toggleFavoriteRemote}from'./src/favorites';";
  if(!s.includes(anchor))throw new Error('Settings install: import anchor not found');
  s=s.replace(anchor,anchor+"\nimport SettingsScreen from'./src/SettingsScreen';");
}

// Render settings in a native full-screen Modal so no app overlay, header or
// absolutely-positioned navigation can intercept taps on iOS.
if(!s.includes('Modal,Pressable')){
  s=s.replace('Image,Linking,Pressable','Image,Linking,Modal,Pressable');
}

s=s.replace("{menuRow('⚙','Asetukset',()=>comingSoon('Asetukset'))}","{menuRow('⚙','Asetukset',()=>setTab('settings'))}");

if(!s.includes('visible={tab===\'settings\'}')){
  const anchor=" {tab==='profile'&&<ScrollView contentContainerStyle={s.profilePage}>";
  if(!s.includes(anchor))throw new Error('Settings install: profile screen anchor not found');
  const modal=" <Modal visible={tab==='settings'} animationType=\"none\" presentationStyle=\"fullScreen\" onRequestClose={()=>setTab('profile')}><SafeAreaView style={{flex:1,backgroundColor:'#f6f7f9'}}><SettingsScreen session={session} onBack={()=>setTab('profile')}/></SafeAreaView></Modal>\n";
  s=s.replace(anchor,modal+anchor);
}

if(!s.includes("setTab('settings')")||!s.includes("visible={tab==='settings'}")||!s.includes('Modal,Pressable')){
  throw new Error('Settings modal install verification failed');
}

fs.writeFileSync(p,s);
console.log('Installed SettingsScreen in isolated full-screen iOS Modal.');
