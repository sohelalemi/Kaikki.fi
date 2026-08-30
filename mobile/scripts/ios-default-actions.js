const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','App.js');
let s=fs.readFileSync(p,'utf8');

// iOS home: add compact message/reserve actions under each 3-column card.
const oldGrid="{filtered.slice(0,6).map(item=><View key={String(item.id)} style={{width:'32%'}}>{marketCard(item)}</View>)}";
const newGrid=`{filtered.slice(0,6).map(item=><View key={String(item.id)} style={{width:'32%'}}>{marketCard(item)}{item.user_id!==session.user.id?<View style={{flexDirection:'row',gap:5,marginTop:6,alignItems:'center'}}><Pressable onPress={()=>openChat(item)} style={{width:34,height:32,borderRadius:10,backgroundColor:'#eef5ff',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:15}}>💬</Text></Pressable><Pressable onPress={()=>reserve(item)} style={{flex:1,height:32,borderRadius:10,backgroundColor:'#1677e8',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:11,fontWeight:'900',color:'#fff'}}>Varaa</Text></Pressable></View>:null}</View>)}`;
if(s.includes(oldGrid)) s=s.replace(oldGrid,newGrid);

// Bottom navigation is shown only on main tabs and pinned to the real bottom edge.
// Main scroll/list screens already have bottom padding so content stays visible above it.
const start=s.lastIndexOf(" <View style={s.bottom}>");
const end=start>=0?s.indexOf('</SafeAreaView>',start):-1;
if(start>=0&&end>start){
 const bottom=` {['home','notifications','sell','messages','profile','favorites'].includes(tab)?<View style={{position:'absolute',left:0,right:0,bottom:0,height:88,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#e5e7eb',flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingBottom:8,zIndex:50,elevation:20}}>
  <Pressable onPress={()=>setTab('home')} style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:25,color:tab==='home'?'#1677e8':'#111827'}}>⌂</Text><Text style={{fontSize:10.5,fontWeight:'800',marginTop:3,color:tab==='home'?'#1677e8':'#111827'}}>Etusivu</Text></Pressable>
  <Pressable onPress={()=>setTab('notifications')} style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:22,color:tab==='notifications'?'#1677e8':'#111827'}}>♢</Text><Text style={{fontSize:10.5,fontWeight:'800',marginTop:3,color:tab==='notifications'?'#1677e8':'#111827'}}>Ilmoitukset</Text></Pressable>
  <Pressable onPress={()=>setTab('sell')} style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:-30}}><View style={{width:58,height:58,borderRadius:29,backgroundColor:'#1677e8',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:.12,shadowRadius:8,shadowOffset:{width:0,height:3}}}><Text style={{fontSize:38,lineHeight:40,color:'#fff',fontWeight:'300'}}>+</Text></View><Text style={{fontSize:10.5,fontWeight:'800',marginTop:1,color:'#111827'}}>Lisää</Text></Pressable>
  <Pressable onPress={()=>setTab('messages')} style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:22,color:tab==='messages'?'#1677e8':'#111827'}}>✉</Text><Text style={{fontSize:10.5,fontWeight:'800',marginTop:3,color:tab==='messages'?'#1677e8':'#111827'}}>Viestit</Text></Pressable>
  <Pressable onPress={()=>setTab('profile')} style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:22,color:tab==='profile'?'#1677e8':'#111827'}}>♙</Text><Text style={{fontSize:10.5,fontWeight:'800',marginTop:3,color:tab==='profile'?'#1677e8':'#111827'}}>Oma</Text></Pressable>
 </View>:null}\n`;
 s=s.slice(0,start)+bottom+s.slice(end);
}

fs.writeFileSync(p,s);
console.log('Applied iOS listing actions and bottom-pinned main navigation.');
