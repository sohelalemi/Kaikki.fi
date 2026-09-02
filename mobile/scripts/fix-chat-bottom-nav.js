const fs=require('fs');
const path=require('path');

const appPath=path.join(__dirname,'..','App.js');
let src=fs.readFileSync(appPath,'utf8');

const oldNav="<View style={s.bottom}>";
const newNav="<View style={[s.bottom,tab==='messages'&&chat&&{display:'none'}]}>";

if(src.includes(oldNav)) src=src.replace(oldNav,newNav);
else if(!src.includes("tab==='messages'&&chat&&{display:'none'}")) throw new Error('Bottom navigation source did not match expected layout.');

if(!src.includes("tab==='messages'&&chat&&{display:'none'}")) throw new Error('Chat bottom navigation fix verification failed.');

fs.writeFileSync(appPath,src);
console.log('Hide bottom navigation while an active chat is open so the message composer stays fully visible.');
