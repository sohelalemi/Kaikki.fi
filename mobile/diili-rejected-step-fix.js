import React from 'react';
import {StyleSheet,Text,View} from 'react-native';

// Rejected Diili progress:
// Only activate rejection styling after the rejection status message itself.
// This avoids leaking rejected text into an accepted Diili rendered afterwards.
const previousCreateElement=React.createElement.bind(React);
let rejectedDetail=false;
let inSteps=false;
let dotIndex=0;
let currentDot=0;

function nodeText(node){
  if(node==null||node===false)return'';
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return nodeText(node?.props?.children);
}

function isStepDot(type,props){
  if(type!==View)return false;
  const flat=StyleSheet.flatten(props?.style)||{};
  return flat.width===26&&flat.height===26&&flat.borderRadius===13;
}

function reset(){
  rejectedDetail=false;
  inSteps=false;
  dotIndex=0;
  currentDot=0;
}

React.createElement=(type,props,...children)=>{
  const text=nodeText(children).trim();

  // Reset immediately when an accepted detail starts rendering.
  if(type===Text&&(text==='Hyväksytty – odottaa maksua'||text==='Myyjä hyväksyi Diilin. Seuraava vaihe on maksu.')){
    reset();
  }

  // Use the rejection explanation as the reliable detail-level marker.
  if(type===Text&&text==='Myyjä hylkäsi Diilin.'){
    rejectedDetail=true;
    inSteps=false;
    dotIndex=0;
    currentDot=0;
  }

  if(rejectedDetail&&type===Text&&text==='Kaupan eteneminen'){
    inSteps=true;
    dotIndex=0;
    currentDot=0;
  }

  if(rejectedDetail&&inSteps&&isStepDot(type,props)){
    dotIndex+=1;
    currentDot=dotIndex;
    if(dotIndex===1){
      props={...props,style:[props?.style,{backgroundColor:'#1565d8',borderWidth:0,borderColor:'transparent'}]};
    }else if(dotIndex===2){
      props={...props,style:[props?.style,{backgroundColor:'#fee2e2',borderWidth:2,borderColor:'#dc2626'}]};
    }else{
      props={...props,style:[props?.style,{backgroundColor:'#e5e7eb',borderWidth:0,borderColor:'transparent'}]};
    }
  }

  if(rejectedDetail&&inSteps&&type===Text){
    if(currentDot===1&&text==='1'){
      children=['✓'];
      props={...props,style:[props?.style,{color:'#fff'}]};
      currentDot=0;
    }else if(currentDot===2&&text==='2'){
      children=['×'];
      props={...props,style:[props?.style,{color:'#dc2626',fontSize:16}]};
      currentDot=0;
    }else if(text==='Myyjä hyväksyy tai hylkää'){
      children=['Myyjä hylkäsi Diilin'];
      props={...props,style:[props?.style,{color:'#dc2626'}]};
    }
  }

  if(rejectedDetail&&type===Text&&text==='Sulje')reset();

  return previousCreateElement(type,props,...children);
};
