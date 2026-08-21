import React,{useRef,useState}from'react';
import{Animated,Dimensions,Modal,PanResponder,Pressable,StyleSheet,Text,View,Image}from'react-native';

const originalCreateElement=React.createElement.bind(React);
const {width:SCREEN_W,height:SCREEN_H}=Dimensions.get('window');

function distance(touches){
  if(!touches||touches.length<2)return 0;
  const a=touches[0],b=touches[1];
  const dx=a.pageX-b.pageX,dy=a.pageY-b.pageY;
  return Math.sqrt(dx*dx+dy*dy);
}

function isDetailImageProps(props){
  if(!props||props.__listingZoomPatched)return false;
  const flat=StyleSheet.flatten(props.style)||{};
  return flat.width===350&&flat.height===300;
}

function ZoomableListingImage(props){
  const[open,setOpen]=useState(false);
  const scale=useRef(new Animated.Value(1)).current;
  const currentScale=useRef(1);
  const pinchStart=useRef(0);
  const pinchBase=useRef(1);
  const lastTap=useRef(0);

  const reset=()=>{
    currentScale.current=1;
    Animated.spring(scale,{toValue:1,useNativeDriver:true}).start();
  };

  const panResponder=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onMoveShouldSetPanResponder:(e)=>e.nativeEvent.touches?.length>=2,
    onPanResponderGrant:(e)=>{
      const d=distance(e.nativeEvent.touches);
      if(d>0){pinchStart.current=d;pinchBase.current=currentScale.current;}
    },
    onPanResponderMove:(e)=>{
      const d=distance(e.nativeEvent.touches);
      if(d>0&&pinchStart.current>0){
        let next=pinchBase.current*(d/pinchStart.current);
        next=Math.max(1,Math.min(5,next));
        currentScale.current=next;
        scale.setValue(next);
      }
    },
    onPanResponderRelease:()=>{
      pinchStart.current=0;
      if(currentScale.current<1.03)reset();
    },
  })).current;

  function close(){
    currentScale.current=1;
    scale.setValue(1);
    setOpen(false);
  }

  function doubleTapZoom(){
    const now=Date.now();
    if(now-lastTap.current<300){
      const next=currentScale.current>1?1:2.5;
      currentScale.current=next;
      Animated.spring(scale,{toValue:next,useNativeDriver:true}).start();
    }
    lastTap.current=now;
  }

  return originalCreateElement(
    React.Fragment,
    null,
    originalCreateElement(
      Pressable,
      {onPress:()=>setOpen(true)},
      originalCreateElement(Image,{...props,__listingZoomPatched:true})
    ),
    originalCreateElement(
      Modal,
      {visible:open,transparent:false,animationType:'fade',onRequestClose:close,statusBarTranslucent:true},
      originalCreateElement(
        View,
        {style:styles.overlay},
        originalCreateElement(
          Pressable,
          {style:styles.zoomArea,onPress:doubleTapZoom,...panResponder.panHandlers},
          originalCreateElement(Animated.Image,{
            source:props.source,
            resizeMode:'contain',
            style:[styles.fullImage,{transform:[{scale}]}],
          })
        ),
        originalCreateElement(
          Pressable,
          {onPress:close,style:styles.close,hitSlop:12},
          originalCreateElement(Text,{style:styles.closeText},'×')
        ),
        originalCreateElement(Text,{style:styles.hint},'Zoomaa kahdella sormella · kaksoisnapauta')
      )
    )
  );
}

function maybeWrap(type,props,children,creator){
  if(type===Image&&isDetailImageProps(props)){
    return originalCreateElement(ZoomableListingImage,{...props,__listingZoomPatched:true},...(children||[]));
  }
  return creator();
}

// Classic JSX transform.
React.createElement=(type,props,...children)=>maybeWrap(type,props,children,()=>originalCreateElement(type,props,...children));

// Expo / React 19 commonly uses the automatic JSX runtime instead of
// React.createElement. Patch that runtime too so the detail image is wrapped
// reliably in release APK builds.
try{
  const runtime=require('react/jsx-runtime');
  const originalJsx=runtime.jsx;
  const originalJsxs=runtime.jsxs;
  if(typeof originalJsx==='function'){
    runtime.jsx=(type,props,key)=>{
      if(type===Image&&isDetailImageProps(props))return originalJsx(ZoomableListingImage,{...props,__listingZoomPatched:true},key);
      return originalJsx(type,props,key);
    };
  }
  if(typeof originalJsxs==='function'){
    runtime.jsxs=(type,props,key)=>{
      if(type===Image&&isDetailImageProps(props))return originalJsxs(ZoomableListingImage,{...props,__listingZoomPatched:true},key);
      return originalJsxs(type,props,key);
    };
  }
}catch(e){
  console.warn('image zoom jsx runtime patch',e?.message||e);
}

const styles=StyleSheet.create({
  overlay:{flex:1,backgroundColor:'#000',alignItems:'center',justifyContent:'center'},
  zoomArea:{width:SCREEN_W,height:SCREEN_H,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  fullImage:{width:SCREEN_W,height:SCREEN_H},
  close:{position:'absolute',top:38,right:18,width:46,height:46,borderRadius:23,backgroundColor:'rgba(0,0,0,.55)',alignItems:'center',justifyContent:'center',zIndex:20},
  closeText:{color:'#fff',fontSize:36,lineHeight:40,fontWeight:'400'},
  hint:{position:'absolute',bottom:32,color:'#fff',fontSize:13,backgroundColor:'rgba(0,0,0,.55)',paddingHorizontal:12,paddingVertical:7,borderRadius:14},
});
