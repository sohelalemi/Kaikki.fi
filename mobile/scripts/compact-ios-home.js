const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');
const pairs=[
["paddingTop:24,paddingBottom:18","paddingTop:18,paddingBottom:14"],
["fontSize:31,fontWeight:'900',color:'#fff',lineHeight:37","fontSize:28,fontWeight:'900',color:'#fff',lineHeight:33"],
["fontSize:14.5,color:'#e8eef8',marginTop:12,lineHeight:21","fontSize:13.5,color:'#e8eef8',marginTop:8,lineHeight:19"],
["height:60,marginTop:20","height:54,marginTop:14"],
["width:48,height:48,borderRadius:24","width:44,height:44,borderRadius:22"],
["flexDirection:'row',gap:8,marginTop:14","flexDirection:'row',gap:8,marginTop:10"],
["flex:1,minHeight:58,borderRadius:16","flex:1,minHeight:52,borderRadius:15"],
["paddingHorizontal:16,paddingTop:24,paddingBottom:10","paddingHorizontal:16,paddingTop:18,paddingBottom:8"],
["width:64,height:64,borderRadius:19","width:58,height:58,borderRadius:18"],
["fontSize:29,fontWeight:'800'","fontSize:26,fontWeight:'800'"],
["rowGap:12","rowGap:8"],
["paddingHorizontal:16,paddingTop:27,paddingBottom:10","paddingHorizontal:16,paddingTop:20,paddingBottom:8"]
];
for(const [a,b] of pairs)s=s.replace(a,b);
fs.writeFileSync(p,s);
console.log('Compacted iOS home so one complete latest-listings row fits on screen.');
