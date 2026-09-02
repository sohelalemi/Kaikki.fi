const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');

const oldImport = "import{ActivityIndicator,Alert,FlatList,Image,Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';";
const newImport = "import{ActivityIndicator,Alert,FlatList,Image,Keyboard,Linking,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';";
if (src.includes(oldImport)) src = src.replace(oldImport, newImport);

const oldState = "const[messages,setMessages]=useState([]),[notifications,setNotifications]=useState([]),[reservations,setReservations]=useState([]),[chat,setChat]=useState(null),[messageText,setMessageText]=useState('');";
const newState = "const[messages,setMessages]=useState([]),[notifications,setNotifications]=useState([]),[reservations,setReservations]=useState([]),[chat,setChat]=useState(null),[messageText,setMessageText]=useState(''),[keyboardHeight,setKeyboardHeight]=useState(0);";
if (src.includes(oldState)) src = src.replace(oldState, newState);

const effectAnchor = "useEffect(()=>{if(session&&tab==='messages')loadMessages()},[session,tab]);";
const keyboardEffect = `${effectAnchor}\n useEffect(()=>{const showEvent=Platform.OS==='ios'?'keyboardWillShow':'keyboardDidShow';const hideEvent=Platform.OS==='ios'?'keyboardWillHide':'keyboardDidHide';const showSub=Keyboard.addListener(showEvent,e=>setKeyboardHeight(e?.endCoordinates?.height||0));const hideSub=Keyboard.addListener(hideEvent,()=>setKeyboardHeight(0));return()=>{showSub.remove();hideSub.remove()}},[]);`;
if (src.includes(effectAnchor) && !src.includes("keyboardWillShow")) src = src.replace(effectAnchor, keyboardEffect);

const oldCompose = "<View style={s.compose}><TextInput style={[s.input,{flex:1}]} value={messageText} onChangeText={setMessageText}/>";
const newCompose = "<View style={[s.compose,keyboardHeight>0&&{bottom:keyboardHeight}]}><TextInput style={[s.input,{flex:1}]} value={messageText} onChangeText={setMessageText} placeholder=\"Kirjoita viesti…\" returnKeyType=\"send\" onSubmitEditing={sendMessage}/>";
if (src.includes(oldCompose)) src = src.replace(oldCompose, newCompose);

if (!src.includes('Keyboard.addListener') || !src.includes('keyboardHeight>0')) {
  throw new Error('Safe iOS chat keyboard patch could not be applied.');
}

fs.writeFileSync(appPath, src);
console.log('Applied safe chat keyboard handling.');
