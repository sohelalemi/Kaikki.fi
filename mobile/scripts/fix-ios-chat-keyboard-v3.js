const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');

// Remove any earlier experimental keyboard patches if this script is run on an already-patched tree.
src = src.replace(
  "import{ActivityIndicator,Alert,FlatList,Image,Keyboard,Linking,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';",
  "import{ActivityIndicator,Alert,FlatList,Image,Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';"
);
src = src.replace(
  "const[messages,setMessages]=useState([]),[notifications,setNotifications]=useState([]),[reservations,setReservations]=useState([]),[chat,setChat]=useState(null),[messageText,setMessageText]=useState(''),[keyboardHeight,setKeyboardHeight]=useState(0);",
  "const[messages,setMessages]=useState([]),[notifications,setNotifications]=useState([]),[reservations,setReservations]=useState([]),[chat,setChat]=useState(null),[messageText,setMessageText]=useState('');"
);
src = src.replace(/\n useEffect\(\(\)=>\{const showEvent=Platform\.OS==='ios'\?'keyboardWillShow':'keyboardDidShow';const hideEvent=Platform\.OS==='ios'\?'keyboardWillHide':'keyboardDidHide';const showSub=Keyboard\.addListener\(showEvent,e=>setKeyboardHeight\(e\?\.endCoordinates\?\.height\|\|0\)\);const hideSub=Keyboard\.addListener\(hideEvent,\(\)=>setKeyboardHeight\(0\)\);return\(\)=>\{showSub\.remove\(\);hideSub\.remove\(\)\}\},\[\]\);/, '');

const oldBlock = `{tab==='messages'&&<View style={{flex:1}}>{chat?<><View style={s.form}><Pressable onPress={()=>setChat(null)}><Text style={s.link}>← Keskustelut</Text></Pressable><Text style={s.cardTitle}>{chat.listing_title}</Text></View><FlatList data={conversationMessages} keyExtractor={x=>String(x.id)} contentContainerStyle={s.list} renderItem={({item})=><View style={s.infoBox}><Text>{item.body}</Text></View>}/><View style={s.compose}><TextInput style={[s.input,{flex:1}]} value={messageText} onChangeText={setMessageText}/><Pressable style={s.primarySmall} onPress={sendMessage}><Text style={s.primaryText}>Lähetä</Text></Pressable></View></>:<FlatList data={messages} keyExtractor={x=>String(x.id)} contentContainerStyle={s.list} ListHeaderComponent={<Text style={s.title}>Viestit</Text>} renderItem={({item})=><Pressable style={s.infoBox} onPress={()=>setChat({recipient_id:item.sender_id===session.user.id?item.recipient_id:item.sender_id,listing_id:item.listing_id,listing_title:item.listing_title})}><Text style={s.cardTitle}>{item.listing_title}</Text><Text>{item.body}</Text></Pressable>}/>}</View>}`;

const newBlock = `{tab==='messages'&&<View style={{flex:1}}>{chat?<FlatList data={conversationMessages} keyExtractor={x=>String(x.id)} style={{flex:1}} contentContainerStyle={[s.list,{flexGrow:1,paddingBottom:14}]} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets={true} ListHeaderComponent={<View style={{paddingBottom:6}}><Pressable onPress={()=>setChat(null)}><Text style={s.link}>← Keskustelut</Text></Pressable><Text style={s.cardTitle}>{chat.listing_title}</Text></View>} ListFooterComponentStyle={{marginTop:'auto'}} ListFooterComponent={<View style={s.composeInline}><TextInput style={[s.input,{flex:1}]} value={messageText} onChangeText={setMessageText} placeholder="Kirjoita viesti…" returnKeyType="send" onSubmitEditing={sendMessage}/><Pressable style={s.primarySmall} onPress={sendMessage}><Text style={s.primaryText}>Lähetä</Text></Pressable></View>} renderItem={({item})=><View style={s.infoBox}><Text>{item.body}</Text></View>}/>:<FlatList data={messages} keyExtractor={x=>String(x.id)} contentContainerStyle={s.list} ListHeaderComponent={<Text style={s.title}>Viestit</Text>} renderItem={({item})=><Pressable style={s.infoBox} onPress={()=>setChat({recipient_id:item.sender_id===session.user.id?item.recipient_id:item.sender_id,listing_id:item.listing_id,listing_title:item.listing_title})}><Text style={s.cardTitle}>{item.listing_title}</Text><Text>{item.body}</Text></Pressable>}/>}</View>}`;

if (src.includes(oldBlock)) {
  src = src.replace(oldBlock, newBlock);
} else if (!src.includes('automaticallyAdjustKeyboardInsets={true}')) {
  throw new Error('Chat screen source did not match the expected stable version; refusing to modify App.js.');
}

const oldStyle = "compose:{position:'absolute',left:0,right:0,bottom:56,padding:10,backgroundColor:'#fff',flexDirection:'row',gap:8}";
const newStyle = "compose:{position:'absolute',left:0,right:0,bottom:56,padding:10,backgroundColor:'#fff',flexDirection:'row',gap:8},composeInline:{padding:10,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',gap:8,borderTopWidth:1,borderTopColor:'#e5e7eb',marginHorizontal:-14,marginBottom:-14,paddingHorizontal:14,paddingBottom:14}";
if (src.includes(oldStyle) && !src.includes('composeInline:')) src = src.replace(oldStyle, newStyle);

if (!src.includes('automaticallyAdjustKeyboardInsets={true}') || !src.includes('composeInline:')) {
  throw new Error('Safe chat patch verification failed.');
}
if (src.includes('Keyboard.addListener') || src.includes('keyboardHeight>0')) {
  throw new Error('Legacy keyboard listener patch is still present.');
}

fs.writeFileSync(appPath, src);
console.log('Applied stable iOS chat layout using FlatList keyboard insets; no keyboard event listeners.');
