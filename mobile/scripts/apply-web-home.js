const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'App.js');
let source = fs.readFileSync(appPath, 'utf8');

const homePattern = /\{tab==='home'&&[\s\S]*?(?=\n \{tab==='favorites'&&)/;

const webHome = String.raw`{tab==='home'&&<ScrollView contentContainerStyle={{paddingBottom:170,backgroundColor:'#f4f6f9'}} showsVerticalScrollIndicator={false}>
<View style={{backgroundColor:'#07111f',paddingHorizontal:16,paddingTop:20,paddingBottom:20}}>
  <Text style={{fontSize:32,fontWeight:'900',color:'#fff',lineHeight:37}}>Kaikki mitä etsit, yhdestä paikasta.</Text>
  <Text style={{fontSize:14,color:'#d7deea',marginTop:10,lineHeight:20}}>Osta ja myy tavaroita sekä löydä koteja myyntiin ja vuokralle.</Text>
  <View style={{marginTop:16,backgroundColor:'#fff',borderRadius:16,padding:5,flexDirection:'row',alignItems:'center'}}>
    <TextInput style={{flex:1,height:48,paddingHorizontal:14,fontSize:15,color:'#111827'}} value={query} onChangeText={setQuery} placeholder="Mitä etsit?" placeholderTextColor="#8b97a8"/>
    <Pressable style={{height:46,minWidth:58,borderRadius:12,backgroundColor:'#1677e8',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:'900'}}>Hae</Text></Pressable>
  </View>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:12}}>
    {['🛡️ Turvallista kaupankäyntiä','💬 Helppoa viestintää','♡ Suosikit','🇫🇮 Koko Suomi'].map(x=><View key={x} style={{backgroundColor:'#111d2d',borderRadius:999,paddingHorizontal:9,paddingVertical:6}}><Text style={{color:'#e7edf6',fontSize:10.5,fontWeight:'700'}}>{x}</Text></View>)}
  </View>
</View>
<View style={{marginHorizontal:10,marginTop:-4,backgroundColor:'#fff',borderRadius:18,overflow:'hidden',borderWidth:1,borderColor:'#e4e9f0',flexDirection:'row',flexWrap:'wrap'}}>
  {[
    ['Autot','🚗','Autot'],['Asunnot','🏠','Asunnot'],['Elektroniikka','📱','Elektroniikka'],['Koti & Sisustus','🛋️','Koti'],['Vapaa-aika','🚲','Vapaa-aika'],
    ['Lapset ja vanhemmat','👶','Lapset ja vanhemmat'],['Eläintarvikkeet','🐾','Eläintarvikkeet'],['Piha ja remontointi','🌿','Piha ja remontointi'],['Antiikki ja taide','🖼️','Antiikki ja taide'],['ja paljon muuta','🏷️','Kaikki']
  ].map(([label,icon,value])=><Pressable key={label} onPress={()=>setCategory(value)} style={{width:'50%',minHeight:82,paddingHorizontal:12,paddingVertical:13,borderRightWidth:1,borderBottomWidth:1,borderColor:'#eef1f5',flexDirection:'row',alignItems:'center',gap:10,backgroundColor:category===value?'#eef5ff':'#fff'}}>
    <Text style={{fontSize:23}}>{icon}</Text><View style={{flex:1}}><Text style={{fontSize:12.5,fontWeight:'900',color:'#26364c'}}>{label}</Text><Text style={{fontSize:9.5,color:'#8b97a8',marginTop:2}}>{value==='Asunnot'?'Myynti & vuokra':value==='Elektroniikka'?'Puhelimet & laitteet':value==='Koti'?'Huonekalut & koti':value==='Kaikki'?'Katso kaikki':'Selaa ilmoituksia'}</Text></View>
  </Pressable>)}
</View>
<View style={{paddingHorizontal:14,paddingTop:26,paddingBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
  <View><Text style={{fontSize:22,fontWeight:'900',color:'#101827'}}>{category==='Kaikki'?'Uusimmat ilmoitukset':category}</Text><Text style={{fontSize:12,color:'#7b8798',marginTop:3}}>{filtered.length} ilmoitusta</Text></View>
  {category!=='Kaikki'?<Pressable onPress={()=>setCategory('Kaikki')} style={{backgroundColor:'#fff',borderRadius:12,paddingHorizontal:12,paddingVertical:9,borderWidth:1,borderColor:'#e3e8ef'}}><Text style={{color:'#1677e8',fontWeight:'800',fontSize:12}}>Näytä kaikki</Text></Pressable>:null}
</View>
{filtered.length?<View style={{paddingHorizontal:12,gap:14}}>{filtered.map(item=><View key={String(item.id)}>{marketCard(item)}</View>)}</View>:<View style={s.emptyState}><Text style={s.emptyEmoji}>🔎</Text><Text style={s.emptyTitle}>Ei ilmoituksia</Text><Text style={s.emptyText}>Kokeile toista kategoriaa.</Text></View>}
</ScrollView>}`;

if (!homePattern.test(source)) {
  console.error('Could not find the existing home view in App.js');
  process.exit(1);
}

source = source.replace(homePattern, webHome);
fs.writeFileSync(appPath, source);
console.log('Applied current Kaikki.fi web home layout to Android source.');
