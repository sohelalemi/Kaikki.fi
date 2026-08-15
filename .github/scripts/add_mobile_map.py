from pathlib import Path
p=Path('mobile/App.js')
s=p.read_text()

old="import{StatusBar}from'expo-status-bar';\n"
new="import{StatusBar}from'expo-status-bar';\nimport MapView,{Marker}from'react-native-maps';\nimport * as Location from'expo-location';\n"
if old not in s: raise SystemExit('status import not found')
s=s.replace(old,new,1)

old="const[title,setTitle]=useState(''),[price,setPrice]=useState(''),[city,setCity]=useState('Lahti'),[sellCategory,setSellCategory]=useState('Elektroniikka'),[description,setDescription]=useState(''),[listingExtra,setListingExtra]=useState({}),[listingPhotos,setListingPhotos]=useState([]),[publishing,setPublishing]=useState(false);"
new=old[:-1]+",[listingLocation,setListingLocation]=useState({latitude:60.9827,longitude:25.6615});"
if old not in s: raise SystemExit('listing state not found')
s=s.replace(old,new,1)

marker="async function chooseListingPhotos(){try{const a=await pickListingImages(8);if(a.length)setListingPhotos(a)}catch(e){Alert.alert('Kuva',e.message)}}\n"
funcs="async function chooseListingPhotos(){try{const a=await pickListingImages(8);if(a.length)setListingPhotos(a)}catch(e){Alert.alert('Kuva',e.message)}}\n async function locateAddress(){const address=String(listingExtra.address||'').trim();if(!address)return Alert.alert('Osoite','Kirjoita ensin osoite.');try{const results=await Location.geocodeAsync(`${address}, ${city||'Suomi'}`);if(!results.length)return Alert.alert('Kartta','Osoitetta ei löytynyt.');const {latitude,longitude}=results[0];setListingLocation({latitude,longitude})}catch(e){Alert.alert('Kartta',e.message)}}\n async function useCurrentLocation(){try{const{status}=await Location.requestForegroundPermissionsAsync();if(status!=='granted')return Alert.alert('Sijainti','Sijaintilupaa ei myönnetty.');const pos=await Location.getCurrentPositionAsync({});setListingLocation({latitude:pos.coords.latitude,longitude:pos.coords.longitude})}catch(e){Alert.alert('Sijainti',e.message)}}\n"
if marker not in s: raise SystemExit('photo function not found')
s=s.replace(marker,funcs,1)

old="extra:listingExtra,image_urls});"
new="extra:listingExtra,image_urls,latitude:listingLocation.latitude,longitude:listingLocation.longitude});"
if old not in s: raise SystemExit('insert payload not found')
s=s.replace(old,new,1)

old="{extraFields(sellCategory,listingExtra,setListingExtra)}<TextInput style={[s.input,{height:110}]} multiline value={description} onChangeText={setDescription} placeholder=\"Kuvaus\"/>"
new="{extraFields(sellCategory,listingExtra,setListingExtra)}<View style={s.mapSection}><Text style={s.fieldLabel}>Sijainti kartalla</Text><View style={s.mapActions}><Pressable style={s.secondary} onPress={locateAddress}><Text>📍 Näytä osoite kartalla</Text></Pressable><Pressable style={s.secondary} onPress={useCurrentLocation}><Text>◎ Nykyinen sijainti</Text></Pressable></View><MapView style={s.listingMap} region={{...listingLocation,latitudeDelta:0.02,longitudeDelta:0.02}} onPress={e=>setListingLocation(e.nativeEvent.coordinate)}><Marker coordinate={listingLocation} draggable onDragEnd={e=>setListingLocation(e.nativeEvent.coordinate)}/></MapView><Text style={s.mapHint}>Voit siirtää punaista merkkiä tai napauttaa karttaa.</Text></View><TextInput style={[s.input,{height:110}]} multiline value={description} onChangeText={setDescription} placeholder=\"Kuvaus\"/>"
if old not in s: raise SystemExit('sell fields block not found')
s=s.replace(old,new,1)

old="avatarHint:{fontSize:12,color:'#64748b'},danger:"
new="avatarHint:{fontSize:12,color:'#64748b'},mapSection:{gap:10},mapActions:{flexDirection:'row',gap:8},listingMap:{width:'100%',height:220,borderRadius:18,overflow:'hidden'},mapHint:{fontSize:12,color:'#64748b'},danger:"
if old not in s: raise SystemExit('style anchor not found')
s=s.replace(old,new,1)

p.write_text(s)
