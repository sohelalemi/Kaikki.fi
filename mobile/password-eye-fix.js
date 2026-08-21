import React,{useState}from'react';
import{Pressable,StyleSheet,Text,TextInput,View}from'react-native';

const originalCreateElement=React.createElement.bind(React);

function PasswordField(props){
  const[visible,setVisible]=useState(false);
  const{style,__passwordEyePatched,...rest}=props;
  return originalCreateElement(
    View,
    {style:styles.wrap},
    originalCreateElement(TextInput,{
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
    originalCreateElement(
      Pressable,
      {onPress:()=>setVisible(v=>!v),style:styles.eye,hitSlop:10},
      originalCreateElement(Text,{style:styles.eyeText},visible?'🙈':'👁')
    )
  );
}

React.createElement=(type,props,...children)=>{
  if(type===TextInput&&props?.secureTextEntry===true&&!props?.__passwordEyePatched){
    return originalCreateElement(PasswordField,props,...children);
  }
  return originalCreateElement(type,props,...children);
};

const styles=StyleSheet.create({
  wrap:{position:'relative',justifyContent:'center',height:52,minHeight:52,maxHeight:52,width:'100%'},
  input:{height:52,minHeight:52,maxHeight:52,paddingRight:52,paddingVertical:0,textAlignVertical:'center'},
  eye:{position:'absolute',right:8,width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center'},
  eyeText:{fontSize:20},
});
