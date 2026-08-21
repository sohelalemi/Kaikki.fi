import React,{useState}from'react';
import{Pressable,StyleSheet,Text,TextInput,View}from'react-native';

function PasswordField(props){
  const[visible,setVisible]=useState(false);
  const{style,__passwordEyePatched,...rest}=props;
  return React.createElement(
    View,
    {style:styles.wrap},
    React.createElement(TextInput,{
      ...rest,
      __passwordEyePatched:true,
      style:[style,styles.input],
      secureTextEntry:!visible,
      autoCapitalize:'none',
      autoCorrect:false,
      textContentType:'password',
      multiline:false,
      numberOfLines:1,
      scrollEnabled:true,
    }),
    React.createElement(
      Pressable,
      {onPress:()=>setVisible(v=>!v),style:styles.eye,hitSlop:12},
      React.createElement(Text,{style:styles.eyeText},visible?'🙈':'👁️')
    )
  );
}

function wrapFactory(runtime,key){
  const original=runtime?.[key];
  if(typeof original!=='function')return;
  runtime[key]=(type,props,...rest)=>{
    if(type===TextInput&&props?.secureTextEntry===true&&!props?.__passwordEyePatched){
      return original(PasswordField,props,...rest);
    }
    return original(type,props,...rest);
  };
}

// Expo/React 19 compiles JSX through react/jsx-runtime, not always through
// React.createElement. Patch both runtimes so the login password field is
// reliably replaced with our field that has an eye button.
try{
  const runtime=require('react/jsx-runtime');
  wrapFactory(runtime,'jsx');
  wrapFactory(runtime,'jsxs');
}catch(e){}
try{
  const devRuntime=require('react/jsx-dev-runtime');
  wrapFactory(devRuntime,'jsxDEV');
}catch(e){}

// Fallback for classic JSX transforms.
const originalCreateElement=React.createElement.bind(React);
React.createElement=(type,props,...children)=>{
  if(type===TextInput&&props?.secureTextEntry===true&&!props?.__passwordEyePatched){
    return originalCreateElement(PasswordField,props,...children);
  }
  return originalCreateElement(type,props,...children);
};

const styles=StyleSheet.create({
  wrap:{position:'relative',justifyContent:'center',height:52,minHeight:52,maxHeight:52,width:'100%'},
  input:{height:52,minHeight:52,maxHeight:52,paddingRight:58,paddingVertical:0,textAlignVertical:'center'},
  eye:{position:'absolute',right:8,top:7,width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center',zIndex:10,elevation:10},
  eyeText:{fontSize:20,lineHeight:24},
});
