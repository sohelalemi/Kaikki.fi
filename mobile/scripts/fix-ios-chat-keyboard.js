const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');

const oldImport = "import{ActivityIndicator,Alert,FlatList,Image,Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';";
const newImport = "import{ActivityIndicator,Alert,FlatList,Image,KeyboardAvoidingView,Linking,Platform,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';";

if (src.includes(oldImport)) {
  src = src.replace(oldImport, newImport);
}

const oldChatStart = "{tab==='messages'&&<View style={{flex:1}}>{chat?<><View style={s.form}>";
const newChatStart = "{tab==='messages'&&<View style={{flex:1}}>{chat?<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={0}><View style={s.form}>";

if (src.includes(oldChatStart)) {
  src = src.replace(oldChatStart, newChatStart);
}

const oldConversationList = "<FlatList data={conversationMessages} keyExtractor={x=>String(x.id)} contentContainerStyle={s.list}";
const newConversationList = "<FlatList data={conversationMessages} keyExtractor={x=>String(x.id)} contentContainerStyle={s.list} keyboardShouldPersistTaps=\"handled\" keyboardDismissMode=\"interactive\"";

if (src.includes(oldConversationList)) {
  src = src.replace(oldConversationList, newConversationList);
}

const oldChatEnd = "</Pressable></View></>:<FlatList data={messages}";
const newChatEnd = "</Pressable></View></KeyboardAvoidingView>:<FlatList data={messages}";

if (src.includes(oldChatEnd)) {
  src = src.replace(oldChatEnd, newChatEnd);
}

if (!src.includes('KeyboardAvoidingView') || !src.includes('keyboardDismissMode=\"interactive\"')) {
  throw new Error('iOS chat keyboard patch could not be applied safely.');
}

fs.writeFileSync(appPath, src);
console.log('Fixed iOS chat composer so it stays visible above the keyboard.');
