import React from 'react';
import {StyleSheet,Text,View} from 'react-native';

// Correct the Kaikki Diili progress indicator in the mobile detail sheet.
// When a deal is accepted, Pyyntö + Hyväksyntä are complete and Maksu is active.
const originalCreateElement=React.createElement.bind(React);
let acceptedDetail=false;
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

React.createElement=(type,props,...children)=>{
  const text=nodeText(children).trim();

  if(type===Text&&text==='Hyväksytty – odottaa maksua'){
    acceptedDetail=true;
    inSteps=false;
    dotIndex=0;
    currentDot=0;
  }
  if(acceptedDetail&&type===Text&&text==='Kaupan eteneminen'){
    inSteps=true;
    dotIndex=0;
    currentDot=0;
  }

  if(acceptedDetail&&inSteps&&isStepDot(type,props)){
    dotIndex+=1;
    currentDot=dotIndex;
    let extra=null;
    if(dotIndex===2)extra={backgroundColor:'#1565d8',borderWidth:0,borderColor:'transparent'};
    if(dotIndex===3)extra={backgroundColor:'#dbeafe',borderWidth:2,borderColor:'#1565d8'};
    if(extra)props={...props,style:[props?.style,extra]};
    if(dotIndex>=5){acceptedDetail=false;inSteps=false;}
  }

  if(acceptedDetail&&inSteps&&type===Text){
    if(currentDot===2&&text==='2'){
      children=['✓'];
      props={...props,style:[props?.style,{color:'#fff'}]};
      currentDot=0;
    }else if(currentDot===3&&text==='3'){
      props={...props,style:[props?.style,{color:'#1565d8'}]};
      currentDot=0;
    }
  }

  return originalCreateElement(type,props,...children);
};
