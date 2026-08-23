import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const BLUE = '#4F7CF7';
const BG = '#F6F8FC';

const categories = [
  ['Asunnot', 'home-outline'],
  ['Autot', 'car-outline'],
  ['Elektroniikka', 'phone-portrait-outline'],
  ['Koti ja sisustus', 'bed-outline'],
  ['Vapaa-aika', 'bicycle-outline'],
  ['Vaatteet', 'shirt-outline'],
  ['Lapset ja vanhemmat', 'happy-outline'],
  ['Eläintarvikkeet', 'paw-outline'],
  ['Piha ja remontointi', 'hammer-outline'],
  ['Antiikki ja taide', 'color-palette-outline'],
];

const sampleListings = [
  { id: 1, title: 'BMW 320d 2018', price: '15 900 €', city: 'Lahti', category: 'Autot' },
  { id: 2, title: 'iPhone 15 Pro 256 GB', price: '750 €', city: 'Helsinki', category: 'Elektroniikka' },
  { id: 3, title: '2h + k, 51 m²', price: '129 000 €', city: 'Espoo', category: 'Asunnot' },
  { id: 4, title: 'Kulmasohva', price: '320 €', city: 'Vantaa', category: 'Koti ja sisustus' },
];

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>Kaikki.fi</Text>
        <Text style={styles.tagline}>Osta · myy · löydä</Text>
      </View>
      <Pressable style={styles.iconButton} onPress={() => Alert.alert('Ilmoitukset', 'Ei uusia ilmoituksia.') }>
        <Ionicons name="notifications-outline" size={22} color="#27324A" />
      </Pressable>
    </View>
  );
}

function HomeScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => sampleListings.filter(x => x.title.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Kaikki mitä etsit, yhdestä paikasta.</Text>
        <Text style={styles.heroText}>Osta ja myy tavaroita sekä löydä koteja myyntiin ja vuokralle.</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#7E879C" />
          <TextInput value={query} onChangeText={setQuery} placeholder="Mitä etsit?" style={styles.searchInput} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Kategoriat</Text>
      <View style={styles.grid}>
        {categories.map(([name, icon]) => (
          <Pressable key={name} style={styles.categoryCard} onPress={() => Alert.alert(name, 'Kategorian ilmoitukset avataan tässä.') }>
            <Ionicons name={icon} size={25} color={BLUE} />
            <Text style={styles.categoryText}>{name}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Suositut ilmoitukset</Text>
      {filtered.map(item => <ListingCard key={item.id} item={item} />)}
    </ScrollView>
  );
}

function ListingCard({ item }) {
  const [fav, setFav] = useState(false);
  return (
    <Pressable style={styles.listingCard} onPress={() => Alert.alert(item.title, `${item.price}\n${item.city}`)}>
      <View style={styles.listingImage}><Ionicons name="image-outline" size={34} color="#A8B1C7" /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingPrice}>{item.price}</Text>
        <Text style={styles.muted}>{item.city} · {item.category}</Text>
      </View>
      <Pressable onPress={() => setFav(v => !v)} hitSlop={10}>
        <Ionicons name={fav ? 'heart' : 'heart-outline'} size={24} color={fav ? '#E34F6F' : '#8D96AA'} />
      </Pressable>
    </Pressable>
  );
}

function MessagesScreen() {
  return <CenterCard icon="chatbubble-ellipses-outline" title="Viestit" text="Keskustelut ostajien ja myyjien kanssa näkyvät tässä." />;
}

function SellScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Lisää ilmoitus</Text>
      <Text style={styles.mutedBlock}>Uuden ilmoituksen lomake rakennetaan tähän iPhone-versioon erillisenä ja turvallisena näkymänä.</Text>
      {['Otsikko', 'Hinta', 'Sijainti', 'Kuvaus'].map(label => <TextInput key={label} placeholder={label} style={styles.field} />)}
      <Pressable style={styles.primaryButton} onPress={() => Alert.alert('Tallennettu luonnoksena', 'Julkaisu liitetään seuraavassa vaiheessa Supabaseen.') }>
        <Text style={styles.primaryButtonText}>Tallenna luonnos</Text>
      </Pressable>
    </ScrollView>
  );
}

function FavoritesScreen() {
  return <CenterCard icon="heart-outline" title="Suosikit" text="Tallentamasi ilmoitukset näkyvät tässä." />;
}

function ProfileScreen() {
  const items = [
    ['Omat ilmoitukset', 'list-outline'],
    ['Hakuvahdit', 'search-outline'],
    ['Suosikit', 'heart-outline'],
    ['Varaukset', 'cube-outline'],
    ['Arvostelut', 'star-outline'],
    ['Seuraajat', 'people-outline'],
    ['Kaikki Diili', 'shield-checkmark-outline'],
    ['Asetukset', 'settings-outline'],
    ['Yksityisyys', 'diamond-outline'],
    ['Asiakastuki', 'call-outline'],
  ];
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Oma</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Ionicons name="person" size={28} color="#71809E" /></View>
        <View><Text style={styles.profileName}>Kaikki-käyttäjä</Text><Text style={styles.muted}>iPhone-versio</Text></View>
      </View>
      <View style={styles.menuCard}>
        {items.map(([name, icon], idx) => (
          <Pressable key={name} style={[styles.menuRow, idx < items.length - 1 && styles.menuDivider]} onPress={() => openProfileItem(name)}>
            <Ionicons name={icon} size={22} color={name === 'Kaikki Diili' ? BLUE : '#7D879D'} />
            <Text style={styles.menuText}>{name}</Text>
            <Ionicons name="chevron-forward" size={18} color="#B1B8C8" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function openProfileItem(name) {
  if (name === 'Kaikki Diili') {
    Alert.alert('Kaikki Diili', '1. Pyyntö\n2. Hyväksyntä\n3. Maksu\n4. Toimitus\n5. Valmis');
    return;
  }
  if (name === 'Asiakastuki') {
    Alert.alert('Asiakastuki', 'Ohjeet, ilmoituksen tai käyttäjän ongelma ja tukipyynnöt tulevat tähän näkymään.');
    return;
  }
  Alert.alert(name, `${name}-näkymä rakennetaan tähän ilman että Android-versioon kosketaan.`);
}

function CenterCard({ icon, title, text }) {
  return (
    <View style={styles.centerWrap}>
      <View style={styles.centerCard}>
        <Ionicons name={icon} size={42} color={BLUE} />
        <Text style={styles.centerTitle}>{title}</Text>
        <Text style={styles.centerText}>{text}</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState('home');
  const tabs = [
    ['home', 'Etusivu', 'home-outline'],
    ['favorites', 'Suosikit', 'heart-outline'],
    ['sell', 'Uusi', 'add-circle-outline'],
    ['messages', 'Viesti', 'mail-outline'],
    ['profile', 'Oma', 'person-outline'],
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <Header />
      <View style={styles.screen}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'favorites' && <FavoritesScreen />}
        {tab === 'sell' && <SellScreen />}
        {tab === 'messages' && <MessagesScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </View>
      <View style={styles.tabBar}>
        {tabs.map(([key, label, icon]) => {
          const active = tab === key;
          const sell = key === 'sell';
          return (
            <Pressable key={key} style={styles.tabItem} onPress={() => setTab(key)}>
              <View style={sell ? styles.sellCircle : null}>
                <Ionicons name={sell ? 'add' : icon} size={sell ? 30 : 22} color={sell ? '#fff' : active ? BLUE : '#8892A6'} />
              </View>
              <Text style={[styles.tabLabel, active && { color: BLUE }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  screen: { flex: 1, backgroundColor: BG },
  header: { height: 66, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#EEF1F6', backgroundColor: '#fff' },
  brand: { fontSize: 28, fontWeight: '800', color: '#426FE8' },
  tagline: { color: '#8A93A6', marginTop: -2 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F6FA', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 30 },
  hero: { backgroundColor: '#315DCB', borderRadius: 22, padding: 20, marginBottom: 20 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 32 },
  heroText: { color: '#DDE7FF', marginTop: 8, lineHeight: 20 },
  searchBox: { marginTop: 18, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, height: 50, flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, marginLeft: 9, fontSize: 16 },
  sectionTitle: { fontSize: 21, fontWeight: '800', color: '#27324A', marginVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { width: '48.5%', minHeight: 86, borderRadius: 16, backgroundColor: '#fff', padding: 14, borderWidth: 1, borderColor: '#EDF0F5', justifyContent: 'space-between' },
  categoryText: { fontWeight: '700', color: '#303A50', marginTop: 9 },
  listingCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#EDF0F5' },
  listingImage: { width: 76, height: 68, borderRadius: 12, backgroundColor: '#F1F3F8', alignItems: 'center', justifyContent: 'center' },
  listingTitle: { fontWeight: '800', color: '#2E384E', fontSize: 16 },
  listingPrice: { color: BLUE, fontWeight: '800', fontSize: 18, marginVertical: 4 },
  muted: { color: '#8A93A5', fontSize: 13 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#27324A', marginBottom: 16 },
  mutedBlock: { color: '#7F899C', lineHeight: 21, marginBottom: 16 },
  field: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E9F1', borderRadius: 14, height: 52, paddingHorizontal: 14, marginBottom: 10, fontSize: 16 },
  primaryButton: { height: 52, borderRadius: 14, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 16, borderRadius: 18, marginBottom: 14 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#E9EDF5', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 18, fontWeight: '800', color: '#303A50' },
  menuCard: { backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#EDF0F5' },
  menuRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: '#EFF2F6' },
  menuText: { flex: 1, fontWeight: '700', color: '#3B455A', fontSize: 16 },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  centerCard: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#E9EDF4' },
  centerTitle: { fontSize: 24, fontWeight: '800', color: '#303A50', marginTop: 12 },
  centerText: { color: '#7F899C', textAlign: 'center', marginTop: 8, lineHeight: 21 },
  tabBar: { height: 72, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E9EDF4', paddingBottom: 6 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabLabel: { fontSize: 11, color: '#8A93A6', fontWeight: '600' },
  sellCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginTop: -20, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 7, shadowOffset: { width: 0, height: 3 } },
});
