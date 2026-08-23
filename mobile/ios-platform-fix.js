import{Platform,StyleSheet}from'react-native';

if(Platform.OS==='ios'){
  const originalCreate=StyleSheet.create.bind(StyleSheet);
  StyleSheet.create=(styles)=>{
    const next={...styles};
    if(next.bottom)next.bottom={...next.bottom,bottom:0,height:88,paddingBottom:18};
    if(next.compose)next.compose={...next.compose,bottom:88};
    if(next.detail)next.detail={...next.detail,paddingBottom:130};
    if(next.form)next.form={...next.form,paddingBottom:130};
    if(next.profilePage)next.profilePage={...next.profilePage,paddingBottom:130};
    if(next.list)next.list={...next.list,paddingBottom:130};
    if(next.marketList)next.marketList={...next.marketList,paddingBottom:130};
    if(next.auth)next.auth={...next.auth,paddingTop:28,paddingBottom:28};
    return originalCreate(next);
  };
}
