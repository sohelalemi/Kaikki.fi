import React,{useEffect,useRef,useState}from'react';
import{Animated,Dimensions,Modal,PanResponder,Pressable,StyleSheet,Text,View,Image,ScrollView}from'react-native';

const originalCreateElement=React.createElement.bind(React);
const {width:SCREEN_W,height:SCREEN_H}=Dimensions.get('window');

const mountedGallery=[];
let currentDetailGallery=[];

function sourceUri(source){return source&&typeof source==='object'?String(source.uri||''):''}
function addGallerySource(source){const uri=sourceUri(source);if(!uri)return;const found=mountedGallery.find(x=>x.uri===uri);if(found){found.count+=1;return}mountedGallery.push({uri,source,count:1})}
function removeGallerySource(source){const uri=sourceUri(source);if(!uri)return;const i=mountedGallery.findIndex(x=>x.uri===uri);if(i<0)return;mountedGallery[i].count-=1;if(mountedGallery[i].count<=0)mountedGallery.splice(i,1)}
function gallerySnapshot(){return currentDetailGallery.length?currentDetailGallery.slice():mountedGallery.map(x=>x.source)}

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

function collectDetailSources(children){
  const arr=React.Children.toArray(children);
  const sources=[];
  for(const child of arr){
    if(!child||!child.props)continue;
    if(child.type===ZoomableListingImage&&child.props.source){sources.push(child.props.source);continue;}
    if(child.type===Image&&isDetailImageProps(child.props)&&child.props.source){sources.push(child.props.source);}
  }
  return sources;
}

function rememberGalleryFromScroll(type,props){
  if(type!==ScrollView||!props?.horizontal)return;
  const sources=collectDetailSources(props.children);
  if(sources.length){currentDetailGallery=sources;}
}

function ZoomableListingImage(props){
  const[open,setOpen]=useState(false);
  const[gallery,setGallery]=useState([]);
  const[index,setIndex]=useState(0);
  const scale=useRef(new Animated.Value(1)).current;
  const currentScale=useRef(1);
  const pinchStart=useRef(0);
  const pinchBase=useRef(1);
  const lastTap=useRef(0);

  useEffect(()=>{
    addGallerySource(props.source);
    return()=>removeGallerySource(props.source);
  },[sourceUri(props.source)]);

  const reset=()=>{
    currentScale.current=1;
    Animated.spring(scale,{toValue:1,useNativeDriver:true}).start();
  };

  function movePhoto(direction){
    if(currentScale.current>1.05)return;
    setIndex(i=>{
      const next=i+direction;
      if(next<0||next>=gallery.length)return i;
      currentScale.current=1;
      scale.setValue(1);
      return next;
    });
  }

  const panResponder=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onMoveShouldSetPanResponder:()=>true,
    onPanResponderGrant:(e)=>{
      const touches=e.nativeEvent.touches||[];
      const d=distance(touches);
      if(d>0){pinchStart.current=d;pinchBase.current=currentScale.current;}
    },
    onPanResponderMove:(e)=>{
      const touches=e.nativeEvent.touches||[];
      const d=distance(touches);
      if(d>0&&pinchStart.current>0){
        let next=pinchBase.current*(d/pinchStart.current);
        next=Math.max(1,Math.min(5,next));
        currentScale.current=next;
        scale.setValue(next);
      }
    },
    onPanResponderRelease:(e,g)=>{
      if(currentScale.current<=1.05){
        const dx=g.dx||0,dy=g.dy||0;
        if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){
          movePhoto(dx<0?1:-1);
        }
      }
      pinchStart.current=0;
      if(currentScale.current<1.03)reset();
    },
    onPanResponderTerminate:()=>{pinchStart.current=0;},
  })).current;

  function openViewer(){
    const list=gallerySnapshot();
    const uri=sourceUri(props.source);
    let start=list.findIndex(s=>sourceUri(s)===uri);
    if(start<0){start=0;list.unshift(props.source)}
    setGallery(list);
    setIndex(start);
    currentScale.current=1;
    scale.setValue(1);
    setOpen(true);
  }

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

  const currentSource=gallery[index]||props.source;

  return originalCreateElement(
    React.Fragment,
    null,
    originalCreateElement(
      Pressable,
      {onPress:openViewer},
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
            source:currentSource,
            resizeMode:'contain',
            style:[styles.fullImage,{transform:[{scale}]}],
          })
        ),
        gallery.length>1?originalCreateElement(Text,{style:styles.counter},`${index+1}/${gallery.length}`):null,
        index>0?originalCreateElement(Pressable,{style:[styles.arrow,styles.leftArrow],onPress:()=>movePhoto(-1)},originalCreateElement(Text,{style:styles.arrowText},'‹')):null,
        index<gallery.length-1?originalCreateElement(Pressable,{style:[styles.arrow,styles.rightArrow],onPress:()=>movePhoto(1)},originalCreateElement(Text,{style:styles.arrowText},'›')):null,
        originalCreateElement(
          Pressable,
          {onPress:close,style:styles.close,hitSlop:12},
          originalCreateElement(Text,{style:styles.closeText},'×')
        ),
        originalCreateElement(Text,{style:styles.hint},gallery.length>1?'Pyyhkäise vasemmalle tai oikealle · zoomaa kahdella sormella':'Zoomaa kahdella sormella · kaksoisnapauta')
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

React.createElement=(type,props,...children)=>{
  rememberGalleryFromScroll(type,{...props,children});
  return maybeWrap(type,props,children,()=>originalCreateElement(type,props,...children));
};

try{
  const runtime=require('react/jsx-runtime');
  const originalJsx=runtime.jsx;
  const originalJsxs=runtime.jsxs;
  if(typeof originalJsx==='function'){
    runtime.jsx=(type,props,key)=>{
      rememberGalleryFromScroll(type,props);
      if(type===Image&&isDetailImageProps(props))return originalJsx(ZoomableListingImage,{...props,__listingZoomPatched:true},key);
      return originalJsx(type,props,key);
    };
  }
  if(typeof originalJsxs==='function'){
    runtime.jsxs=(type,props,key)=>{
      rememberGalleryFromScroll(type,props);
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
  close:{position:'absolute',top:38,right:18,width:46,height:46,borderRadius:23,backgroundColor:'rgba(0,0,0,.55)',alignItems:'center',justifyContent:'center',zIndex:20,elevation:20},
  closeText:{color:'#fff',fontSize:36,lineHeight:40,fontWeight:'400'},
  counter:{position:'absolute',top:48,alignSelf:'center',color:'#fff',fontSize:14,fontWeight:'800',backgroundColor:'rgba(0,0,0,.5)',paddingHorizontal:10,paddingVertical:5,borderRadius:14,zIndex:20,elevation:20},
  arrow:{position:'absolute',top:'46%',width:48,height:64,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.45)',borderRadius:24,zIndex:30,elevation:30},
  leftArrow:{left:8},
  rightArrow:{right:8},
  arrowText:{color:'#fff',fontSize:45,lineHeight:48,fontWeight:'300'},
  hint:{position:'absolute',bottom:32,color:'#fff',fontSize:13,backgroundColor:'rgba(0,0,0,.55)',paddingHorizontal:12,paddingVertical:7,borderRadius:14},
});
