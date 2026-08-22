import React,{useEffect,useState}from'react';
import{Alert,Linking,Modal,Pressable,ScrollView,StyleSheet,Switch,Text,TextInput,View}from'react-native';
import AsyncStorage from'@react-native-async-storage/async-storage';
import{supabase}from'./src/supabase';

const h=React.createElement.bind(React);

function nodeText(node){
  if(node==null||node===false)return'';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}

const langs=['Suomi','English','فارسی','Русский'];
const themes=['Järjestelmän mukaan','Vaalea','Tumma'];

function Choice({title,items,value,onPick,onClose}){
  return h(Modal,{transparent:true,visible:true,animationType:'fade',onRequestClose:onClose},
    h(Pressable,{style:styles.overlay,onPress:onClose},
      h(View,{style:styles.choice},
        h(Text,{style:styles.choiceTitle},title),
        ...items.map(x=>h(Pressable,{key:x,style:styles.choiceRow,onPress:()=>{onPick(x);onClose();}},
          h(Text,{style:[styles.choiceText,x===value&&styles.selected]},x),
          h(Text,{style:styles.check},x===value?'✓':'')
        ))
      )
    )
  );
}

function FormModal({title,children,onClose}){
  return h(Modal,{transparent:true,visible:true,animationType:'fade',onRequestClose:onClose},
    h(View,{style:styles.overlay},
      h(View,{style:styles.formBox},
        h(View,{style:styles.formHead},h(Text,{style:styles.choiceTitle},title),h(Pressable,{onPress:onClose},h(Text,{style:styles.closeText},'×'))),
        children
      )
    )
  );
}

function InfoModal({title,text,onClose}){
  return h(Modal,{visible:true,animationType:'slide',onRequestClose:onClose},
    h(View,{style:styles.page},
      h(View,{style:styles.header},
        h(Pressable,{onPress:onClose,style:styles.back},h(Text,{style:styles.backText},'‹')),
        h(Text,{style:styles.title},title),h(View,{style:styles.back})
      ),
      h(ScrollView,{contentContainerStyle:styles.legalContent},h(Text,{style:styles.legalText},text))
    )
  );
}

function SettingsPressable({originalProps}){
  const[open,setOpen]=useState(false);
  const[notifications,setNotifications]=useState(true);
  const[messages,setMessages]=useState(true);
  const[reservations,setReservations]=useState(true);
  const[deals,setDeals]=useState(true);
  const[searches,setSearches]=useState(true);
  const[location,setLocation]=useState(true);
  const[phone,setPhone]=useState(false);
  const[city,setCity]=useState(true);
  const[online,setOnline]=useState(false);
  const[language,setLanguage]=useState('Suomi');
  const[theme,setTheme]=useState('Järjestelmän mukaan');
  const[choice,setChoice]=useState(null);
  const[dialog,setDialog]=useState(null);
  const[newPassword,setNewPassword]=useState('');
  const[confirmPassword,setConfirmPassword]=useState('');
  const[accountName,setAccountName]=useState('');
  const[accountPhone,setAccountPhone]=useState('');
  const[accountCity,setAccountCity]=useState('');
  const[saving,setSaving]=useState(false);

  useEffect(()=>{
    const keys=['notifications','messages','reservations','deals','searches','location','phone','city','online','language','theme'];
    AsyncStorage.multiGet(keys.map(k=>'kaikki.settings.'+k)).then(rows=>{
      const o=Object.fromEntries(rows.map(([k,v])=>[k.replace('kaikki.settings.',''),v]));
      if(o.notifications!==null)setNotifications(o.notifications==='true');
      if(o.messages!==null)setMessages(o.messages==='true');
      if(o.reservations!==null)setReservations(o.reservations==='true');
      if(o.deals!==null)setDeals(o.deals==='true');
      if(o.searches!==null)setSearches(o.searches==='true');
      if(o.location!==null)setLocation(o.location==='true');
      if(o.phone!==null)setPhone(o.phone==='true');
      if(o.city!==null)setCity(o.city==='true');
      if(o.online!==null)setOnline(o.online==='true');
      if(o.language)setLanguage(o.language);
      if(o.theme)setTheme(o.theme);
    }).catch(()=>{});
  },[]);

  const save=(k,setter)=>(v)=>{setter(v);AsyncStorage.setItem('kaikki.settings.'+k,String(v)).catch(()=>{});};
  const toggle=(title,sub,value,onChange)=>h(View,{style:styles.row},h(View,{style:styles.rowCopy},h(Text,{style:styles.rowTitle},title),sub?h(Text,{style:styles.rowSub},sub):null),h(Switch,{value,onValueChange:onChange}));
  const link=(title,sub,onPress)=>h(Pressable,{style:styles.linkRow,onPress},h(View,{style:styles.rowCopy},h(Text,{style:styles.rowTitle},title),sub?h(Text,{style:styles.rowSub},sub):null),h(Text,{style:styles.arrow},'›'));
  const div=()=>h(View,{style:styles.divider});

  async function openAccountEditor(){
    const{data}=await supabase.auth.getUser();
    const m=data?.user?.user_metadata||{};
    setAccountName(m.full_name||m.name||'');setAccountPhone(m.phone||'');setAccountCity(m.city||'');setDialog('account');
  }

  async function saveAccount(){
    setSaving(true);
    const{error}=await supabase.auth.updateUser({data:{full_name:accountName.trim(),phone:accountPhone.trim(),city:accountCity.trim()}});
    setSaving(false);
    if(error)return Alert.alert('Virhe',error.message);
    setDialog(null);Alert.alert('Tallennettu','Tilin tiedot päivitettiin.');
  }

  async function changePassword(){
    if(newPassword.length<8)return Alert.alert('Salasana','Salasanan pitää olla vähintään 8 merkkiä.');
    if(newPassword!==confirmPassword)return Alert.alert('Salasana','Salasanat eivät täsmää.');
    setSaving(true);
    const{error}=await supabase.auth.updateUser({password:newPassword});
    setSaving(false);
    if(error)return Alert.alert('Virhe',error.message);
    setNewPassword('');setConfirmPassword('');setDialog(null);Alert.alert('Valmis','Salasana vaihdettiin.');
  }

  function logoutAll(){
    Alert.alert('Kirjaudu ulos kaikilta laitteilta','Tämä katkaisee kaikki aktiiviset kirjautumiset.',[
      {text:'Peruuta',style:'cancel'},
      {text:'Kirjaudu ulos',style:'destructive',onPress:async()=>{const{error}=await supabase.auth.signOut({scope:'global'});if(error)Alert.alert('Virhe',error.message);else setOpen(false);}}
    ]);
  }

  function deleteAccount(){
    Alert.alert('Poista tili','Tämä poistaa Kaikki.fi-tilisi pysyvästi. Toimintoa ei voi perua.',[
      {text:'Peruuta',style:'cancel'},
      {text:'Poista pysyvästi',style:'destructive',onPress:async()=>{
        setSaving(true);
        const{error}=await supabase.functions.invoke('delete-account',{body:{confirm:true}});
        setSaving(false);
        if(error)return Alert.alert('Virhe','Tilin poistaminen epäonnistui: '+error.message);
        await supabase.auth.signOut();setOpen(false);Alert.alert('Tili poistettu','Tilisi on poistettu.');
      }}
    ]);
  }

  const terms='KAIKKI.FI – KÄYTTÖEHDOT\n\nKaikki.fi on ilmoitus- ja kaupankäyntipalvelu. Käyttäjä vastaa julkaisemansa ilmoituksen, kuvien, hinnan ja muiden tietojen oikeellisuudesta. Laittomien, harhaanjohtavien tai toisten oikeuksia loukkaavien sisältöjen julkaiseminen on kielletty.\n\nKäyttäjien tulee toimia asiallisesti ja turvallisesti. Kaikki.fi voi poistaa ehtojen vastaisia ilmoituksia tai rajoittaa tiliä väärinkäytöstilanteissa. Kaupan osapuolet vastaavat lähtökohtaisesti keskinäisestä kaupasta, ellei erikseen käytetä Kaikki Diili -palvelua.\n\nEhtoja voidaan päivittää palvelun kehittyessä. Olennaisista muutoksista ilmoitetaan palvelussa ennen niiden voimaantuloa.';
  const privacy='KAIKKI.FI – TIETOSUOJASELOSTE\n\nKaikki.fi käsittelee tilin käyttämiseen tarvittavia tietoja, kuten sähköpostiosoitetta sekä käyttäjän vapaaehtoisesti lisäämiä nimi-, puhelin- ja kaupunkitietoja. Palvelu käsittelee myös ilmoitus-, viesti-, suosikki- ja varaustietoja palvelun toimittamiseksi.\n\nKameraa, mikrofonia ja sijaintia käytetään vain käyttäjän myöntämien käyttöoikeuksien mukaisesti. Näitä lupia voi hallita Androidin asetuksista.\n\nTietoja ei tule näyttää muille enempää kuin palvelun toiminta edellyttää ja käyttäjän omat yksityisyysvalinnat sallivat. Käyttäjä voi pyytää tilinsä poistamista suoraan sovelluksen asetuksista.\n\nEnnen julkista tuotantoversiota selosteeseen lisätään rekisterinpitäjän täydet yhteystiedot, säilytysajat ja muut GDPR:n edellyttämät yksityiskohdat.';

  return h(React.Fragment,null,
    h(Pressable,{...originalProps,onPress:()=>setOpen(true),__kaikkiSettingsPatched:true},originalProps.children),
    h(Modal,{visible:open,animationType:'slide',onRequestClose:()=>setOpen(false)},
      h(View,{style:styles.page},
        h(View,{style:styles.header},h(Pressable,{onPress:()=>setOpen(false),style:styles.back},h(Text,{style:styles.backText},'‹')),h(Text,{style:styles.title},'Asetukset'),h(View,{style:styles.back})),
        h(ScrollView,{contentContainerStyle:styles.content},
          h(Text,{style:styles.sectionTitle},'Kaikki.fi'),
          h(View,{style:styles.card},toggle('Ilmoitukset',notifications?'Käytössä':'Pois käytöstä',notifications,save('notifications',setNotifications)),div(),link('Kieli',language,()=>setChoice('language')),div(),link('Teema',theme,()=>setChoice('theme'))),
          h(Text,{style:styles.sectionTitle},'Ilmoitukset'),
          h(View,{style:styles.card},toggle('Viestit','Uudet viestit',messages,save('messages',setMessages)),div(),toggle('Varaukset','Varausten muutokset',reservations,save('reservations',setReservations)),div(),toggle('Kaikki Diili','Diilin tapahtumat',deals,save('deals',setDeals)),div(),toggle('Hakuvahdit','Tallennettujen hakujen osumat',searches,save('searches',setSearches))),
          h(Text,{style:styles.sectionTitle},'Yksityisyys'),
          h(View,{style:styles.card},toggle('Sijainti','Käytä sijaintia sovelluksessa',location,save('location',setLocation)),div(),toggle('Näytä puhelinnumero','Muille käyttäjille',phone,save('phone',setPhone)),div(),toggle('Näytä kaupunki','Profiilissa ja ilmoituksissa',city,save('city',setCity)),div(),toggle('Online-tila','Näytä milloin olet paikalla',online,save('online',setOnline))),
          h(Text,{style:styles.sectionTitle},'Turvallisuus ja tili'),
          h(View,{style:styles.card},link('Vaihda salasana','Päivitä tilisi salasana',()=>setDialog('password')),div(),link('Kirjaudu ulos kaikilta laitteilta','Suojaa tiliäsi',logoutAll),div(),link('Muokkaa tiliä','Nimi, puhelin ja kaupunki',openAccountEditor),div(),link('Poista tili','Poista tili ja omat tiedot',deleteAccount)),
          h(Text,{style:styles.sectionTitle},'Puhelimen asetukset'),h(View,{style:styles.card},link('Sovellusluvat','Kamera, mikrofoni, sijainti ja ilmoitukset',()=>Linking.openSettings().catch(()=>{}))),
          h(Text,{style:styles.sectionTitle},'Tietoja'),
          h(View,{style:styles.card},link('Tietoja sovelluksesta','Kaikki.fi',()=>setDialog('about')),div(),link('Käyttöehdot','Palvelun käyttöehdot',()=>setDialog('terms')),div(),link('Tietosuojaseloste','Miten tietojasi käsitellään',()=>setDialog('privacy')))
        )
      )
    ),
    choice==='language'?h(Choice,{title:'Kieli',items:langs,value:language,onPick:v=>{setLanguage(v);AsyncStorage.setItem('kaikki.settings.language',v).catch(()=>{});},onClose:()=>setChoice(null)}):null,
    choice==='theme'?h(Choice,{title:'Teema',items:themes,value:theme,onPick:v=>{setTheme(v);AsyncStorage.setItem('kaikki.settings.theme',v).catch(()=>{});},onClose:()=>setChoice(null)}):null,
    dialog==='password'?h(FormModal,{title:'Vaihda salasana',onClose:()=>setDialog(null)},h(TextInput,{style:styles.input,secureTextEntry:true,placeholder:'Uusi salasana',value:newPassword,onChangeText:setNewPassword}),h(TextInput,{style:styles.input,secureTextEntry:true,placeholder:'Uusi salasana uudelleen',value:confirmPassword,onChangeText:setConfirmPassword}),h(Pressable,{style:styles.primary,onPress:changePassword,disabled:saving},h(Text,{style:styles.primaryText},saving?'Tallennetaan...':'Vaihda salasana'))):null,
    dialog==='account'?h(FormModal,{title:'Muokkaa tiliä',onClose:()=>setDialog(null)},h(TextInput,{style:styles.input,placeholder:'Nimi',value:accountName,onChangeText:setAccountName}),h(TextInput,{style:styles.input,placeholder:'Puhelinnumero',keyboardType:'phone-pad',value:accountPhone,onChangeText:setAccountPhone}),h(TextInput,{style:styles.input,placeholder:'Kaupunki',value:accountCity,onChangeText:setAccountCity}),h(Pressable,{style:styles.primary,onPress:saveAccount,disabled:saving},h(Text,{style:styles.primaryText},saving?'Tallennetaan...':'Tallenna'))):null,
    dialog==='about'?h(InfoModal,{title:'Tietoja sovelluksesta',text:'Kaikki.fi\n\nOsta, myy ja löydä.\n\nKaikki.fi on Suomessa kehitteillä oleva ilmoitus- ja kaupankäyntipalvelu. Tavoitteena on tehdä tavaroiden, asuntojen, ajoneuvojen ja palveluiden löytämisestä helppoa ja turvallista.',onClose:()=>setDialog(null)}):null,
    dialog==='terms'?h(InfoModal,{title:'Käyttöehdot',text:terms,onClose:()=>setDialog(null)}):null,
    dialog==='privacy'?h(InfoModal,{title:'Tietosuojaseloste',text:privacy,onClose:()=>setDialog(null)}):null
  );
}

function shouldPatch(type,props){if(type!==Pressable||props?.__kaikkiSettingsPatched)return false;const text=nodeText(props?.children).trim();return text.includes('Asetukset')&&text.includes('›');}
try{const runtime=require('react/jsx-runtime');const oj=runtime.jsx;const os=runtime.jsxs;const wrap=(o,t,p,k)=>shouldPatch(t,p)?o(SettingsPressable,{originalProps:p},k):o(t,p,k);if(typeof oj==='function')runtime.jsx=(t,p,k)=>wrap(oj,t,p,k);if(typeof os==='function')runtime.jsxs=(t,p,k)=>wrap(os,t,p,k);}catch(e){console.warn('settings screen patch',e?.message||e);}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:'#f7f8fa',paddingTop:36},header:{height:62,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,borderBottomWidth:1,borderBottomColor:'#e5e7eb'},back:{width:46,height:46,alignItems:'center',justifyContent:'center'},backText:{fontSize:38,lineHeight:40,color:'#1565d8'},title:{fontSize:21,fontWeight:'900',color:'#111827'},content:{padding:16,paddingBottom:60},sectionTitle:{fontSize:14,fontWeight:'800',color:'#64748b',marginTop:18,marginBottom:8,marginLeft:4},card:{backgroundColor:'#fff',borderRadius:16,overflow:'hidden',borderWidth:1,borderColor:'#e8ebef'},row:{minHeight:70,flexDirection:'row',alignItems:'center',paddingHorizontal:16},linkRow:{minHeight:70,flexDirection:'row',alignItems:'center',paddingHorizontal:16},rowCopy:{flex:1},rowTitle:{fontSize:16.5,fontWeight:'700',color:'#111827'},rowSub:{fontSize:13,color:'#64748b',marginTop:3},divider:{height:1,backgroundColor:'#eceff3',marginLeft:16},arrow:{fontSize:31,color:'#b7bcc5'},overlay:{flex:1,backgroundColor:'rgba(0,0,0,.35)',justifyContent:'center',padding:28},choice:{backgroundColor:'#fff',borderRadius:18,paddingVertical:10},choiceTitle:{fontSize:20,fontWeight:'900',padding:18,color:'#111827'},choiceRow:{minHeight:56,flexDirection:'row',alignItems:'center',paddingHorizontal:20,borderTopWidth:1,borderTopColor:'#eef0f3'},choiceText:{flex:1,fontSize:17,color:'#111827'},selected:{fontWeight:'800',color:'#1565d8'},check:{fontSize:20,color:'#1565d8'},formBox:{backgroundColor:'#fff',borderRadius:18,padding:18,gap:12},formHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},closeText:{fontSize:30,color:'#64748b'},input:{borderWidth:1,borderColor:'#d8dde5',borderRadius:12,padding:14,fontSize:16},primary:{backgroundColor:'#1565d8',borderRadius:12,padding:14,alignItems:'center'},primaryText:{color:'#fff',fontWeight:'800'},legalContent:{padding:22,paddingBottom:60},legalText:{fontSize:15.5,lineHeight:24,color:'#334155'}
});
