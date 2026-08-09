import {useEffect} from 'react';
import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {supabase} from './supabase';

Notifications.setNotificationHandler({
  handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:true})
});

async function registerToken(userId){
  if(Platform.OS==='web')return;
  if(Platform.OS==='android'){
    await Notifications.setNotificationChannelAsync('default',{name:'Kaikki.fi',importance:Notifications.AndroidImportance.HIGH,vibrationPattern:[0,250,250,250]});
  }
  const existing=await Notifications.getPermissionsAsync();
  let status=existing.status;
  if(status!=='granted')status=(await Notifications.requestPermissionsAsync()).status;
  if(status!=='granted')return;
  const projectId=Constants?.expoConfig?.extra?.eas?.projectId??Constants?.easConfig?.projectId;
  if(!projectId)return;
  const token=(await Notifications.getExpoPushTokenAsync({projectId})).data;
  if(!token)return;
  await supabase.from('push_tokens').upsert({user_id:userId,token,platform:Platform.OS,updated_at:new Date().toISOString()},{onConflict:'user_id,token'});
}

export default function PushRegistrar(){
  useEffect(()=>{
    let authSub;
    supabase.auth.getSession().then(({data})=>{if(data.session?.user?.id)registerToken(data.session.user.id).catch(()=>{})});
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>{if(session?.user?.id)registerToken(session.user.id).catch(()=>{})});
    authSub=data.subscription;
    return()=>authSub?.unsubscribe();
  },[]);
  return null;
}
