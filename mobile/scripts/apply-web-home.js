const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'App.js');
let source = fs.readFileSync(appPath, 'utf8');

if (!source.includes('Linking,Platform,Pressable')) {
  source = source.replace(
    "import{ActivityIndicator,Alert,FlatList,Image,Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';",
    "import{ActivityIndicator,Alert,FlatList,Image,Linking,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';"
  );
}

const homePattern = /\{tab==='home'&&[\s\S]*?(?=\n \{tab==='favorites'&&)/;

const platformHome = String.raw`{tab==='home'&&(Platform.OS==='ios'?
<ScrollView contentContainerStyle={{paddingBottom:170,backgroundColor:'#f6f8fb'}} showsVerticalScrollIndicator={false}>
  <View style={{marginHorizontal:14,marginTop:10,borderRadius:24,overflow:'hidden',backgroundColor:'#0d47a1',paddingHorizontal:16,paddingTop:24,paddingBottom:18,shadowColor:'#0b2b5b',shadowOpacity:.22,shadowRadius:16,shadowOffset:{width:0,height:8},elevation:6}}>
    <View style={{position:'absolute',right:-28,top:-18,width:180,height:180,borderRadius:90,backgroundColor:'#1565d8',opacity:.45}}/>
    <View style={{position:'absolute',left:-55,bottom:-72,width:210,height:210,borderRadius:105,backgroundColor:'#0a3578',opacity:.55}}/>
    <Text style={{fontSize:31,fontWeight:'900',color:'#fff',lineHeight:37,letterSpacing:-.5,maxWidth:310}}>Kaikki mitä etsit, yhdestä paikasta.</Text>
    <Text style={{fontSize:14.5,color:'#e8eef8',marginTop:12,lineHeight:21,maxWidth:315}}>Osta ja myy tavaroita sekä löydä koteja myyntiin ja vuokralle.</Text>
    <View style={{height:60,marginTop:20,backgroundColor:'#fff',borderRadius:30,paddingLeft:16,paddingRight:6,flexDirection:'row',alignItems:'center'}}>
      <Text style={{fontSize:23,color:'#64748b',marginRight:8}}>⌕</Text>
      <TextInput style={{flex:1,fontSize:15.5,color:'#0f172a'}} value={query} onChangeText={setQuery} placeholder="Mitä etsit?" placeholderTextColor="#9aa7b8"/>
      <Pressable style={{width:48,height:48,borderRadius:24,backgroundColor:'#1677e8',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontSize:24,fontWeight:'900'}}>⌕</Text></Pressable>
    </View>
    <View style={{flexDirection:'row',gap:8,marginTop:14}}>
      {[
        ['🛡️','Turvallista','kaupankäyntiä'],
        ['💬','Helppoa','viestintää'],
        ['♡','Suosikit',''],
        ['⚑','Koko','Suomi']
      ].map(([icon,a,b])=><View key={a} style={{flex:1,minHeight:58,borderRadius:16,backgroundColor:'rgba(255,255,255,.10)',alignItems:'center',justifyContent:'center',paddingHorizontal:4}}>
        <Text style={{fontSize:17}}>{icon}</Text><Text style={{fontSize:9.5,color:'#fff',fontWeight:'800',textAlign:'center',marginTop:3}}>{a}</Text>{b?<Text style={{fontSize:9.5,color:'#fff',fontWeight:'800',textAlign:'center'}}>{b}</Text>:null}
      </View>)}
    </View>
  </View>

  <View style={{paddingHorizontal:16,paddingTop:24,paddingBottom:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
    <Text style={{fontSize:21,fontWeight:'900',color:'#0f172a'}}>Kategoriat</Text>
    <Pressable onPress={()=>setCategory('Kaikki')}><Text style={{fontSize:13,fontWeight:'800',color:'#1677e8'}}>Näytä kaikki  ›</Text></Pressable>
  </View>

  <View style={{paddingHorizontal:10,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:12}}>
    {[
      ['Autot','🚗','Autot','#eaf3ff'],
      ['Asunnot','🏠','Asunnot','#fff0e7'],
      ['Elektroniikka','📱','Elektroniikka','#f2ebff'],
      ['Koti & sisustus','🛋️','Koti','#edf9ef'],
      ['Vapaa-aika','🚲','Vapaa-aika','#eaf8f8'],
      ['Lapset ja vanhemmat','👶','Lapset ja vanhemmat','#fff8df'],
      ['Eläintarvikkeet','🐾','Eläintarvikkeet','#f6eee8'],
      ['Piha ja remontointi','🔨','Piha ja remontointi','#eaf8ef'],
      ['Antiikki ja taide','🏺','Antiikki ja taide','#f5ebff'],
      ['Muut','•••','Muut','#eff3f8']
    ].map(([label,icon,value,bg])=><Pressable key={label} onPress={()=>setCategory(value)} style={{width:'19%',alignItems:'center'}}>
      <View style={{width:64,height:64,borderRadius:19,backgroundColor:bg,alignItems:'center',justifyContent:'center',borderWidth:category===value?2:0,borderColor:'#1677e8'}}>
        <Text style={{fontSize:29,fontWeight:'800',color:'#334155'}}>{icon}</Text>
      </View>
      <Text numberOfLines={2} style={{fontSize:10.5,fontWeight:'800',color:'#1e293b',textAlign:'center',lineHeight:13,marginTop:6}}>{label}</Text>
    </Pressable>)}
  </View>

  <View style={{paddingHorizontal:16,paddingTop:27,paddingBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
    <View><Text style={{fontSize:22,fontWeight:'900',color:'#0f172a'}}>{category==='Kaikki'?'Uusimmat ilmoitukset':category}</Text><Text style={{fontSize:12,color:'#7b8798',marginTop:2}}>{filtered.length} ilmoitusta</Text></View>
    {category!=='Kaikki'?<Pressable onPress={()=>setCategory('Kaikki')}><Text style={{fontSize:13,fontWeight:'800',color:'#1677e8'}}>Näytä kaikki  ›</Text></Pressable>:<Text style={{fontSize:13,fontWeight:'800',color:'#1677e8'}}>Näytä kaikki  ›</Text>}
  </View>
  {filtered.length?<View style={s.marketList}>{filtered.slice(0,6).map(item=><View key={String(item.id)} style={s.marketGridItem}>{marketCard(item)}</View>)}</View>:<View style={s.emptyState}><Text style={s.emptyEmoji}>🔎</Text><Text style={s.emptyTitle}>Ei ilmoituksia</Text><Text style={s.emptyText}>Kokeile toista kategoriaa.</Text></View>}
</ScrollView>
:
<ScrollView contentContainerStyle={{paddingBottom:170,backgroundColor:'#f4f6f9'}} showsVerticalScrollIndicator={false}>
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
</ScrollView>)}`;

if (!homePattern.test(source)) {
  console.error('Could not find the existing home view in App.js');
  process.exit(1);
}

source = source.replace(homePattern, platformHome);
fs.writeFileSync(appPath, source);
console.log('Applied platform-specific Kaikki.fi home: iOS premium layout, Android web layout.');
