import React,{useState}from'react';
import{Modal,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,View}from'react-native';

const originalCreateElement=React.createElement.bind(React);
const restored=[
  ['🔎','Hakuvahdit','Tallenna haut ja seuraa uusia ilmoituksia'],
  ['★','Arvostelut','Saamasi ja antamasi arvostelut'],
  ['👥','Seuraajat','Profiiliasi seuraavat käyttäjät'],
  ['🔒','Yksityisyys','Hallitse näkyviä tietojasi'],
  ['💬','Asiakastuki','Ohjeet ja palvelutuki']
];

function nodeText(node){if(node==null||node===false)return'';if(typeof node==='string'||typeof node==='number')return String(node);if(Array.isArray(node))return node.map(nodeText).join(' ');return nodeText(node?.props?.children)}
function isProfileMenu(type,props){if(type!==View||props?.__restoredProfileSections)return false;const text=nodeText(props?.children);return text.includes('Omat ilmoitukset')&&text.includes('Suosikit')&&text.includes('Varaukset')}
function content(label){
 if(label==='Hakuvahdit')return 'Täällä voit hallita tallennettuja hakujasi ja seurata uusia ilmoituksia.';
 if(label==='Arvostelut')return 'Täällä näkyvät saamasi ja antamasi arvostelut.';
 if(label==='Seuraajat')return 'Täällä näet profiiliasi seuraavat käyttäjät.';
 if(label==='Yksityisyys')return 'Yksityisyysasetukset löytyvät myös Asetukset-valikosta.';
 return 'Kaikki.fi asiakastuki auttaa ilmoituksiin, käyttäjiin ja Kaikki Diiliin liittyvissä asioissa.';
}
function RestoredRow({icon,label,sub}){const[open,setOpen]=useState(false);return originalCreateElement(React.Fragment,null,
 originalCreateElement(Pressable,{onPress:()=>setOpen(true),style:styles.row},
  originalCreateElement(Text,{style:styles.icon},icon),
  originalCreateElement(View,{style:{flex:1}},originalCreateElement(Text,{style:styles.label},label),originalCreateElement(Text,{style:styles.sub},sub)),
  originalCreateElement(Text,{style:styles.arrow},'›')
 ),
 originalCreateElement(Modal,{visible:open,animationType:'slide',onRequestClose:()=>setOpen(false)},
  originalCreateElement(SafeAreaView,{style:styles.page},
   originalCreateElement(View,{style:styles.header},originalCreateElement(Pressable,{onPress:()=>setOpen(false),style:styles.back},originalCreateElement(Text,{style:styles.backText},'‹')),originalCreateElement(Text,{style:styles.title},label),originalCreateElement(View,{style:{width:44}})),
   originalCreateElement(ScrollView,{contentContainerStyle:styles.content},originalCreateElement(Text,{style:styles.info},content(label)))
  )
 )
)}
function patch(original,type,props,key){const p=props||{};if(isProfileMenu(type,p)){const children=Array.isArray(p.children)?p.children:[p.children].filter(Boolean);const text=nodeText(children);const missing=restored.filter(([,label])=>!text.includes(label));if(missing.length){return original(View,{...p,__restoredProfileSections:true,children:[...children,...missing.map(([icon,label,sub])=>original(RestoredRow,{icon,label,sub},`restored-${label}`))]},key)}}return original(type,p,key)}
try{const runtime=require('react/jsx-runtime');const oj=runtime.jsx,os=runtime.jsxs;if(typeof oj==='function')runtime.jsx=(t,p,k)=>patch(oj,t,p,k);if(typeof os==='function')runtime.jsxs=(t,p,k)=>patch(os,t,p,k)}catch{}
React.createElement=(type,props,...children)=>patch(originalCreateElement,type,{...(props||{}),children:children.length<=1?children[0]:children},undefined);

const styles=StyleSheet.create({row:{minHeight:78,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#e5e7eb',paddingHorizontal:22,flexDirection:'row',alignItems:'center',gap:18},icon:{fontSize:24,width:34,textAlign:'center'},label:{fontSize:17,fontWeight:'800',color:'#111827'},sub:{fontSize:12,color:'#64748b',marginTop:3},arrow:{fontSize:34,color:'#b8c0cc'},page:{flex:1,backgroundColor:'#f7f8fa'},header:{height:64,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#e5e7eb'},back:{width:44,height:44,alignItems:'center',justifyContent:'center'},backText:{fontSize:38,color:'#1565d8',lineHeight:40},title:{fontSize:21,fontWeight:'900',color:'#111827'},content:{padding:20},info:{fontSize:16,color:'#475569',lineHeight:24,backgroundColor:'#fff',borderRadius:16,padding:18,borderWidth:1,borderColor:'#e5e7eb'}});
