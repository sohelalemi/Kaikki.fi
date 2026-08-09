import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './src/supabase';

const categories = ['Kaikki','Autot','Asunnot','Elektroniikka','Koti','Vaatteet','Työt','Palvelut'];

export default function App(){
  const [session,setSession]=useState(null);
  const [loading,setLoading]=useState(true);
  const [listings,setListings]=useState([]);
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('Kaikki');
  const [authMode,setAuthMode]=useState('login');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [tab,setTab]=useState('home');

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setSession(data.session)).finally(()=>setLoading(false));
    const {data:sub}=supabase.auth.onAuthStateChange((_event,s)=>setSession(s));
    return ()=>sub.subscription.unsubscribe();
  },[]);

  useEffect(()=>{loadListings()},[]);

  async function loadListings(){
    const {data,error}=await supabase.from('listings').select('*').order('created_at',{ascending:false}).limit(60);
    if(error){Alert.alert('Virhe',error.message);return}
    setListings(data||[]);
  }

  async function submitAuth(){
    if(!email||password.length<6)return Alert.alert('Tarkista tiedot','Anna sähköposti ja vähintään 6 merkin salasana.');
    const result=authMode==='login'
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password});
    if(result.error)Alert.alert('Virhe',result.error.message);
    else if(authMode==='signup'&&!result.data.session)Alert.alert('Tili luotu','Vahvista sähköpostiosoite.');
  }

  const filtered=useMemo(()=>listings.filter(x=>{
    const q=query.trim().toLowerCase();
    return (category==='Kaikki'||x.category===category)&&(!q||String(x.title||'').toLowerCase().includes(q)||String(x.city||'').toLowerCase().includes(q));
  }),[listings,query,category]);

  if(loading)return <SafeAreaView style={styles.center}><ActivityIndicator size="large"/><Text>Ladataan Kaikki.fi...</Text></SafeAreaView>;

  if(!session)return <SafeAreaView style={styles.auth}><StatusBar style="auto"/><Text style={styles.logo}>Kaikki.fi</Text><Text style={styles.title}>{authMode==='login'?'Kirjaudu sisään':'Luo tili'}</Text><TextInput style={styles.input} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="Sähköposti"/><TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholder="Salasana"/><Pressable style={styles.primary} onPress={submitAuth}><Text style={styles.primaryText}>{authMode==='login'?'Kirjaudu':'Luo tili'}</Text></Pressable><Pressable onPress={()=>setAuthMode(authMode==='login'?'signup':'login')}><Text style={styles.link}>{authMode==='login'?'Ei tiliä? Luo tili':'Onko sinulla tili? Kirjaudu'}</Text></Pressable></SafeAreaView>;

  return <SafeAreaView style={styles.container}><StatusBar style="auto"/>
    <View style={styles.header}><Text style={styles.logo}>Kaikki.fi</Text><Pressable onPress={()=>setTab('profile')}><Text style={styles.account}>Oma tili</Text></Pressable></View>
    {tab==='home'&&<><View style={styles.searchBox}><TextInput style={styles.searchInput} value={query} onChangeText={setQuery} placeholder="Mitä etsit?"/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{categories.map(c=><Pressable key={c} onPress={()=>setCategory(c)} style={[styles.chip,category===c&&styles.chipActive]}><Text style={category===c?styles.chipTextActive:styles.chipText}>{c}</Text></Pressable>)}</ScrollView><FlatList data={filtered} keyExtractor={x=>String(x.id)} refreshing={false} onRefresh={loadListings} contentContainerStyle={styles.list} renderItem={({item})=><View style={styles.card}><View style={styles.placeholder}><Text style={styles.placeholderText}>{item.category==='Autot'?'🚗':item.category==='Asunnot'?'🏠':item.category==='Elektroniikka'?'📱':'📦'}</Text></View><View style={styles.cardBody}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.price}>{Number(item.price||0).toLocaleString('fi-FI')} €</Text><Text style={styles.meta}>{item.city||''} · {item.category||''}</Text><View style={styles.row}><Pressable style={styles.secondary} onPress={()=>Alert.alert('Viesti','Viestinäkymä yhdistetään seuraavaksi tähän ilmoitukseen.')}><Text>💬 Viesti</Text></Pressable><Pressable style={styles.primarySmall} onPress={()=>Alert.alert('Varaus','Varaus lisätään seuraavassa vaiheessa.')}><Text style={styles.primaryText}>Varaa</Text></Pressable></View></View></View>}/></>}
    {tab==='profile'&&<View style={styles.profile}><Text style={styles.title}>Oma tili</Text><Text>{session.user.email}</Text><Pressable style={styles.secondaryWide} onPress={()=>Alert.alert('Tulossa','Profiilikuva, omat ilmoitukset, viestit ja asetukset yhdistetään tähän.') }><Text>Profiili ja asetukset</Text></Pressable><Pressable style={styles.danger} onPress={()=>supabase.auth.signOut()}><Text style={styles.dangerText}>Kirjaudu ulos</Text></Pressable></View>}
    <View style={styles.bottom}><Pressable onPress={()=>setTab('home')}><Text style={tab==='home'?styles.navActive:styles.nav}>🏠 Koti</Text></Pressable><Pressable onPress={()=>Alert.alert('Myy','Uuden ilmoituksen lomake lisätään mobiiliin seuraavaksi.')}><Text style={styles.nav}>＋ Myy</Text></Pressable><Pressable onPress={()=>setTab('profile')}><Text style={tab==='profile'?styles.navActive:styles.nav}>👤 Tili</Text></Pressable></View>
  </SafeAreaView>;
}

const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#f7f8fa'},center:{flex:1,alignItems:'center',justifyContent:'center',gap:12},auth:{flex:1,justifyContent:'center',padding:24,gap:14},header:{paddingHorizontal:20,paddingVertical:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff'},logo:{fontSize:28,fontWeight:'900',color:'#1565d8'},title:{fontSize:28,fontWeight:'800'},account:{color:'#1565d8',fontWeight:'700'},input:{backgroundColor:'#fff',borderWidth:1,borderColor:'#d8dde5',borderRadius:12,padding:14},primary:{backgroundColor:'#1565d8',borderRadius:12,padding:15,alignItems:'center'},primarySmall:{backgroundColor:'#1565d8',borderRadius:10,paddingHorizontal:18,paddingVertical:11},primaryText:{color:'#fff',fontWeight:'800'},link:{textAlign:'center',color:'#1565d8',fontWeight:'700',padding:8},searchBox:{padding:16,backgroundColor:'#fff'},searchInput:{borderWidth:1,borderColor:'#d8dde5',borderRadius:14,padding:13,backgroundColor:'#fff'},chips:{paddingHorizontal:14,paddingBottom:12,gap:8,backgroundColor:'#fff'},chip:{paddingHorizontal:14,paddingVertical:9,borderRadius:999,borderWidth:1,borderColor:'#dbe2ea',backgroundColor:'#fff'},chipActive:{backgroundColor:'#1565d8',borderColor:'#1565d8'},chipText:{color:'#334155'},chipTextActive:{color:'#fff',fontWeight:'700'},list:{padding:14,gap:14,paddingBottom:90},card:{backgroundColor:'#fff',borderRadius:16,overflow:'hidden',borderWidth:1,borderColor:'#e5e7eb'},placeholder:{height:150,backgroundColor:'#eef2f6',alignItems:'center',justifyContent:'center'},placeholderText:{fontSize:54},cardBody:{padding:14,gap:6},cardTitle:{fontWeight:'800',fontSize:18},price:{fontSize:21,fontWeight:'900'},meta:{color:'#64748b'},row:{flexDirection:'row',gap:10,marginTop:8},secondary:{flex:1,backgroundColor:'#eef4ff',borderRadius:10,padding:11,alignItems:'center'},profile:{padding:24,gap:16},secondaryWide:{backgroundColor:'#eef4ff',borderRadius:12,padding:15,alignItems:'center'},danger:{borderWidth:1,borderColor:'#fecaca',borderRadius:12,padding:15,alignItems:'center'},dangerText:{color:'#dc2626',fontWeight:'800'},bottom:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#e5e7eb',paddingVertical:14,flexDirection:'row',justifyContent:'space-around'},nav:{color:'#64748b',fontWeight:'700'},navActive:{color:'#1565d8',fontWeight:'900'}});
