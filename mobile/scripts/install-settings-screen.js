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

if(!s.includes("tab==='settings'&&<SettingsScreen")){
  const anchor=" {tab==='profile'&&<ScrollView contentContainerStyle={s.profilePage}>";
  if(!s.includes(anchor))throw new Error('Settings install: profile screen anchor not found');
  s=s.replace(anchor," {tab==='settings'&&<SettingsScreen session={session} onBack={()=>setTab('profile')}/>}\n"+anchor);
}

if(!s.includes("setTab('settings')")||!s.includes("tab==='settings'&&<SettingsScreen")){
  throw new Error('Settings install verification failed');
}

fs.writeFileSync(p,s);
console.log('Installed stable SettingsScreen source component.');
