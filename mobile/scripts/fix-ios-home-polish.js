const fs=require('fs');
const path=require('path');
const appPath=path.join(__dirname,'..','App.js');
let source=fs.readFileSync(appPath,'utf8');

const oldLatest="{filtered.length?<View style={{paddingHorizontal:10,flexDirection:'row',flexWrap:'wrap',gap:6,alignItems:'flex-start'}}>{filtered.slice(0,6).map(item=><View key={String(item.id)} style={{width:'32%'}}>{marketCard(item)}</View>)}</View>:<View style={s.emptyState}><Text style={s.emptyEmoji}>🔎</Text><Text style={s.emptyTitle}>Ei ilmoituksia</Text><Text style={s.emptyText}>Kokeile toista kategoriaa.</Text></View>}";
const newLatest="{filtered.length?<View style={{paddingHorizontal:10,flexDirection:'row',gap:7,alignItems:'flex-start'}}>{filtered.slice(0,3).map(item=><Pressable key={String(item.id)} onPress={()=>showListing(item)} style={{width:'32%',backgroundColor:'#fff',borderRadius:15,overflow:'hidden',borderWidth:1,borderColor:'#e5e7eb'}}>{item.image_urls?.[0]?<Image source={{uri:item.image_urls[0]}} style={{width:'100%',height:92,backgroundColor:'#eef2f6'}}/>:<View style={{height:92,backgroundColor:'#eef2f6',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:34}}>📦</Text></View>}<View style={{padding:8,gap:3}}><Text numberOfLines={2} style={{fontSize:11.5,fontWeight:'900',color:'#0f172a',lineHeight:14}}>{item.title}</Text><Text numberOfLines={1} style={{fontSize:15,fontWeight:'900',color:'#1565d8'}}>{Number(item.price||0).toLocaleString('fi-FI')} €</Text><Text numberOfLines={1} style={{fontSize:9.5,color:'#64748b'}}>📍 {item.city}</Text></View></Pressable>)}</View>:<View style={s.emptyState}><Text style={s.emptyEmoji}>🔎</Text><Text style={s.emptyTitle}>Ei ilmoituksia</Text><Text style={s.emptyText}>Kokeile toista kategoriaa.</Text></View>}";
if(source.includes(oldLatest)) source=source.replace(oldLatest,newLatest);

source=source.replace("bottom:{position:'absolute',left:0,right:0,bottom:-28,height:82,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#e5e7eb',flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingBottom:4}","bottom:{position:'absolute',left:0,right:0,bottom:0,height:76,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#e5e7eb',flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingBottom:8,paddingTop:4}");
source=source.replace("sellTab:{width:52,height:52,borderRadius:26,backgroundColor:'#1565d8',alignItems:'center',justifyContent:'center',marginTop:-22,borderWidth:4,borderColor:'#fff'}","sellTab:{width:50,height:50,borderRadius:25,backgroundColor:'#1565d8',alignItems:'center',justifyContent:'center',marginTop:-14,borderWidth:4,borderColor:'#fff'}");
source=source.replace("bottomLabel:{fontSize:10.5,color:'#111827',fontWeight:'600'}","bottomLabel:{fontSize:10.5,color:'#111827',fontWeight:'700',marginTop:1}");
source=source.replace("bottomLabelActive:{fontSize:10.5,color:'#1565d8',fontWeight:'800'}","bottomLabelActive:{fontSize:10.5,color:'#1565d8',fontWeight:'900',marginTop:1}");

fs.writeFileSync(appPath,source);
console.log('Polished iPhone home cards and bottom navigation.');
