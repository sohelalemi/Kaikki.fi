import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const BLUE = '#4F7CF7';
const DARK = '#27324A';
const MUTED = '#8791A6';
const BG = '#F6F8FC';
const WHITE = '#FFFFFF';

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
  { id: 5, title: 'Lasten polkupyörä', price: '85 €', city: 'Tampere', category: 'Lapset ja vanhemmat' },
  { id: 6, title: 'Puutarhapöytä ja 4 tuolia', price: '140 €', city: 'Turku', category: 'Piha ja remontointi' },
];

function AppHeader({ title = 'Kaikki.fi', onBack, onBell = true }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.roundButton}>
            <Ionicons name="chevron-back" size={23} color={DARK} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.headerCenter}>
        <Text style={styles.brand}>{title}</Text>
        {title === 'Kaikki.fi' ? <Text style={styles.tagline}>Osta · myy · löydä</Text> : null}
      </View>
      <View style={styles.headerSideRight}>
        {onBell ? (
          <Pressable style={styles.roundButton} onPress={() => Alert.alert('Ilmoitukset', 'Ei uusia ilmoituksia.') }>
            <Ionicons name="notifications-outline" size={22} color={DARK} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function ListingCard({ item, favorites, toggleFavorite }) {
  const fav = favorites.includes(item.id);
  return (
    <Pressable style={styles.listingCard} onPress={() => Alert.alert(item.title, `${item.price}\n${item.city}\n${item.category}`)}>
      <View style={styles.listingImage}>
        <Ionicons name="image-outline" size={34} color="#A7B0C5" />
      </View>
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingPrice}>{item.price}</Text>
        <Text style={styles.muted}>{item.city} · {item.category}</Text>
      </View>
      <Pressable hitSlop={10} onPress={() => toggleFavorite(item.id)}>
        <Ionicons name={fav ? 'heart' : 'heart-outline'} size={25} color={fav ? '#E34F6F' : '#9099AC'} />
      </Pressable>
    </Pressable>
  );
}

function HomeScreen({ favorites, toggleFavorite }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Kaikki');
  const filtered = useMemo(() => {
    return sampleListings.filter(item => {
      const q = item.title.toLowerCase().includes(query.trim().toLowerCase());
      const c = category === 'Kaikki' || item.category === category;
      return q && c;
    });
  }, [query, category]);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Kaikki mitä etsit, yhdestä paikasta.</Text>
        <Text style={styles.heroText}>Osta ja myy tavaroita sekä löydä koteja myyntiin ja vuokralle.</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#7E879C" />
          <TextInput value={query} onChangeText={setQuery} placeholder="Mitä etsit?" placeholderTextColor="#9AA3B5" style={styles.searchInput} />
        </View>
        <Pressable style={styles.locationChip} onPress={() => Alert.alert('Sijainti', 'Koko Suomi') }>
          <Ionicons name="location-outline" size={18} color="#E2E9FF" />
          <Text style={styles.locationText}>Koko Suomi</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Kategoriat</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalChips}>
        <Pressable onPress={() => setCategory('Kaikki')} style={[styles.categoryChip, category === 'Kaikki' && styles.categoryChipActive]}>
          <Ionicons name="apps-outline" size={18} color={category === 'Kaikki' ? WHITE : BLUE} />
          <Text style={[styles.categoryChipText, category === 'Kaikki' && styles.categoryChipTextActive]}>Kaikki</Text>
        </Pressable>
        {categories.map(([name, icon]) => (
          <Pressable key={name} onPress={() => setCategory(name)} style={[styles.categoryChip, category === name && styles.categoryChipActive]}>
            <Ionicons name={icon} size={18} color={category === name ? WHITE : BLUE} />
            <Text style={[styles.categoryChipText, category === name && styles.categoryChipTextActive]}>{name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Ilmoitukset</Text>
        <Text style={styles.sectionCount}>{filtered.length} kpl</Text>
      </View>
      {filtered.length ? filtered.map(item => (
        <ListingCard key={item.id} item={item} favorites={favorites} toggleFavorite={toggleFavorite} />
      )) : (
        <View style={styles.emptyCard}>
          <Ionicons name="search-outline" size={40} color="#A7B0C5" />
          <Text style={styles.emptyTitle}>Ei tuloksia</Text>
          <Text style={styles.emptyText}>Kokeile toista hakusanaa tai kategoriaa.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function FavoritesScreen({ favorites, toggleFavorite }) {
  const items = sampleListings.filter(x => favorites.includes(x.id));
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Suosikit</Text>
      {items.length ? items.map(item => (
        <ListingCard key={item.id} item={item} favorites={favorites} toggleFavorite={toggleFavorite} />
      )) : (
        <View style={styles.emptyCard}>
          <Ionicons name="heart-outline" size={42} color={BLUE} />
          <Text style={styles.emptyTitle}>Ei suosikkeja vielä</Text>
          <Text style={styles.emptyText}>Paina sydäntä ilmoituksessa tallentaaksesi sen tänne.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function SellScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Valitse kategoria');

  const save = () => {
    if (!title.trim()) {
      Alert.alert('Puuttuva tieto', 'Lisää ilmoituksen otsikko.');
      return;
    }
    Alert.alert('Luonnos tallennettu', 'Ilmoitus on tallennettu iPhone-version luonnokseksi. Julkaisu liitetään Supabaseen seuraavassa vaiheessa.');
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.pageTitle}>Lisää ilmoitus</Text>
      <Pressable style={styles.photoBox} onPress={() => Alert.alert('Kuvat', 'Kuvien valinta liitetään seuraavassa vaiheessa.') }>
        <Ionicons name="camera-outline" size={34} color={BLUE} />
        <Text style={styles.photoTitle}>Lisää kuvia</Text>
        <Text style={styles.muted}>Enintään 10 kuvaa</Text>
      </Pressable>
      <TextInput value={title} onChangeText={setTitle} placeholder="Otsikko" style={styles.field} />
      <Pressable style={styles.selectField} onPress={() => {
        const next = category === 'Valitse kategoria' ? 'Autot' : category === 'Autot' ? 'Elektroniikka' : category === 'Elektroniikka' ? 'Asunnot' : 'Valitse kategoria';
        setCategory(next);
      }}>
        <Text style={category === 'Valitse kategoria' ? styles.placeholderText : styles.selectText}>{category}</Text>
        <Ionicons name="chevron-down" size={20} color={MUTED} />
      </Pressable>
      <TextInput value={price} onChangeText={setPrice} placeholder="Hinta €" keyboardType="decimal-pad" style={styles.field} />
      <TextInput value={location} onChangeText={setLocation} placeholder="Sijainti" style={styles.field} />
      <TextInput value={description} onChangeText={setDescription} placeholder="Kuvaus" multiline textAlignVertical="top" style={[styles.field, styles.textArea]} />
      <Pressable style={styles.primaryButton} onPress={save}>
        <Text style={styles.primaryButtonText}>Tallenna luonnos</Text>
      </Pressable>
    </ScrollView>
  );
}

function MessagesScreen() {
  const threads = [
    ['BMW 320d 2018', 'Onko auto vielä myynnissä?', '10:42'],
    ['iPhone 15 Pro', 'Voinko noutaa tänään?', 'Eilen'],
  ];
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Viestit</Text>
      {threads.map(([title, text, time]) => (
        <Pressable key={title} style={styles.threadRow} onPress={() => Alert.alert(title, 'Keskustelu avataan tässä näkymässä.') }>
          <View style={styles.threadAvatar}><Ionicons name="person-outline" size={24} color={BLUE} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.threadTitle}>{title}</Text>
            <Text style={styles.muted} numberOfLines={1}>{text}</Text>
          </View>
          <Text style={styles.threadTime}>{time}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function DealScreen({ onBack }) {
  const steps = [
    ['Pyyn­tö', 'Diili lähetetty myyjälle'],
    ['Hyväksyntä', 'Myyjä hyväksyy tai hylkää'],
    ['Maksu', 'Maksu vahvistetaan'],
    ['Toimitus', 'Myyjä toimittaa tuotteen'],
    ['Valmis', 'Ostaja vahvistaa vastaanoton'],
  ];
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <AppHeader title="Kaikki Diili" onBack={onBack} onBell={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dealHero}>
          <Ionicons name="shield-checkmark-outline" size={30} color={BLUE} />
          <View style={{ flex: 1 }}>
            <Text style={styles.dealTitle}>Turvallisempi kaupankäynti</Text>
            <Text style={styles.muted}>Ostot, myynnit ja maksut vaiheittain.</Text>
          </View>
        </View>
        <View style={styles.dealProduct}>
          <View style={styles.listingImage}><Ionicons name="car-outline" size={34} color="#A7B0C5" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listingTitle}>BMW 320d 2018</Text>
            <Text style={styles.listingPrice}>15 900 €</Text>
            <Text style={styles.muted}>Ilmoitus #4</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Kaupan eteneminen</Text>
        {steps.map(([title, text], index) => (
          <View key={title} style={styles.stepRow}>
            <View style={[styles.stepCircle, index < 2 && styles.stepCircleDone]}>
              <Text style={[styles.stepNumber, index < 2 && { color: WHITE }]}>{index < 2 ? '✓' : index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{title}</Text>
              <Text style={styles.muted}>{text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsScreen({ onBack }) {
  const [messages, setMessages] = useState(true);
  const [reservations, setReservations] = useState(true);
  const [sales, setSales] = useState(true);
  const [bugReports, setBugReports] = useState(true);
  const [theme, setTheme] = useState('Vaalea');

  const toggleRow = (title, text, value, setter) => (
    <View style={styles.settingRow}>
      <View style={{ flex: 1 }}><Text style={styles.settingTitle}>{title}</Text><Text style={styles.muted}>{text}</Text></View>
      <Switch value={value} onValueChange={setter} trackColor={{ true: '#8EA9FA' }} thumbColor={value ? BLUE : '#F0F1F4'} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <AppHeader title="Asetukset" onBack={onBack} onBell={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Ulkoasu</Text>
        <View style={styles.themeRow}>
          {['Laitteen teema', 'Vaalea', 'Tumma'].map(item => (
            <Pressable key={item} onPress={() => setTheme(item)} style={[styles.themeCard, theme === item && styles.themeCardActive]}>
              <Ionicons name={item === 'Tumma' ? 'moon-outline' : item === 'Vaalea' ? 'sunny-outline' : 'contrast-outline'} size={24} color={theme === item ? BLUE : MUTED} />
              <Text style={styles.themeTitle}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Ilmoitusasetukset</Text>
        <View style={styles.settingsCard}>
          {toggleRow('Viestit', 'Uudet viestit ja vastaukset', messages, setMessages)}
          {toggleRow('Varaukset', 'Varauksen tila ja muutokset', reservations, setReservations)}
          {toggleRow('Ilmoitukset ja myynti', 'Omiin ilmoituksiin liittyvät tapahtumat', sales, setSales)}
        </View>
        <Text style={styles.sectionTitle}>Tuki ja tietosuoja</Text>
        <View style={styles.settingsCard}>
          {toggleRow('Vikaraportin lähetys', 'Auttaa löytämään teknisiä ongelmia ilman profiilitietoja', bugReports, setBugReports)}
          {['Asiakaspalvelu', 'Käyttöehdot', 'Tietosuojakäytäntö', 'Evästeasetukset'].map(item => (
            <Pressable key={item} style={styles.linkRow} onPress={() => Alert.alert(item, `${item} avataan tähän näkymään.`)}>
              <Text style={styles.settingTitle}>{item}</Text><Text style={styles.linkText}>Avaa</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SupportScreen({ onBack }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <AppHeader title="Asiakastuki" onBack={onBack} onBell={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.supportLabel}>Kaikki.fi tukikeskus</Text>
        <Pressable style={styles.supportCard} onPress={() => Alert.alert('Miten Kaikki Diili toimii?', '1. Ostaja lähettää Diili-pyynnön.\n2. Myyjä hyväksyy tai hylkää pyynnön.\n3. Hyväksytyn Diilin jälkeen siirrytään maksuun.\n4. Myyjä toimittaa tuotteen.\n5. Ostaja vahvistaa vastaanoton ja kauppa valmistuu.') }>
          <Text style={styles.supportTitle}>Miten Kaikki Diili toimii?</Text>
          <Text style={styles.supportText}>Ostaja lähettää pyynnön, myyjä hyväksyy sen ja kauppa etenee vaiheittain.</Text>
          <Text style={styles.openText}>Avaa ›</Text>
        </Pressable>
        <Pressable style={styles.supportCard} onPress={() => Alert.alert('Ilmoituksen tai käyttäjän ongelma', 'Tallenna ilmoituksen numero, ota tarvittaessa kuvakaappaus ja kuvaile ongelma mahdollisimman tarkasti. Älä lähetä rahaa sovelluksen ulkopuolella, jos epäilet väärinkäytöstä.') }>
          <Text style={styles.supportTitle}>Ilmoituksen tai käyttäjän ongelma</Text>
          <Text style={styles.supportText}>Katso ohjeet ennen yhteydenottoa.</Text>
          <Text style={styles.openText}>Avaa ›</Text>
        </Pressable>
        <TextInput placeholder="Aihe" style={styles.field} />
        <TextInput placeholder="Kuvaile ongelma" multiline textAlignVertical="top" style={[styles.field, styles.textArea]} />
        <Pressable style={styles.primaryButton} onPress={() => Alert.alert('Tukipyyntö', 'Tukipyynnön lähetys liitetään palvelimeen seuraavassa vaiheessa.') }>
          <Text style={styles.primaryButtonText}>Lähetä</Text>
        </Pressable>
        <Text style={styles.sectionTitle}>Viimeisimmät tukipyynnöt</Text>
        <Text style={styles.muted}>Ei tukipyyntöjä vielä.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileScreen({ openPage }) {
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

  const onPress = name => {
    if (name === 'Kaikki Diili') return openPage('deal');
    if (name === 'Asetukset') return openPage('settings');
    if (name === 'Asiakastuki') return openPage('support');
    if (name === 'Yksityisyys') return Alert.alert('Yksityisyys', 'Tietosuoja, estolista ja tilin yksityisyysasetukset tulevat tähän näkymään.');
    if (name === 'Hakuvahdit') return Alert.alert('Hakuvahdit', 'Tallennetut haut ja ilmoitukset uusista osumista näkyvät tässä.');
    Alert.alert(name, `${name}-näkymä avataan tässä.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Oma</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Ionicons name="person" size={30} color="#71809E" /></View>
        <View style={{ flex: 1 }}><Text style={styles.profileName}>Kaikki-käyttäjä</Text><Text style={styles.muted}>iPhone-versio</Text></View>
        <Pressable onPress={() => Alert.alert('Profiili', 'Profiilin muokkaus lisätään seuraavassa vaiheessa.') }>
          <Ionicons name="create-outline" size={22} color={BLUE} />
        </Pressable>
      </View>
      <View style={styles.menuCard}>
        {items.map(([name, icon], idx) => (
          <Pressable key={name} style={[styles.menuRow, idx < items.length - 1 && styles.menuDivider]} onPress={() => onPress(name)}>
            <Ionicons name={icon} size={22} color={name === 'Kaikki Diili' ? BLUE : '#7D879D'} />
            <Text style={styles.menuText}>{name}</Text>
            <Ionicons name="chevron-forward" size={18} color="#B1B8C8" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [tab, setTab] = useState('home');
  const [page, setPage] = useState(null);
  const [favorites, setFavorites] = useState([2]);

  const toggleFavorite = id => {
    setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  };

  if (page === 'deal') return <DealScreen onBack={() => setPage(null)} />;
  if (page === 'settings') return <SettingsScreen onBack={() => setPage(null)} />;
  if (page === 'support') return <SupportScreen onBack={() => setPage(null)} />;

  const tabs = [
    ['home', 'Etusivu', 'home-outline'],
    ['favorites', 'Suosikit', 'heart-outline'],
    ['sell', 'Uusi', 'add'],
    ['messages', 'Viesti', 'mail-outline'],
    ['profile', 'Oma', 'person-outline'],
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <AppHeader />
      <View style={styles.screen}>
        {tab === 'home' && <HomeScreen favorites={favorites} toggleFavorite={toggleFavorite} />}
        {tab === 'favorites' && <FavoritesScreen favorites={favorites} toggleFavorite={toggleFavorite} />}
        {tab === 'sell' && <SellScreen />}
        {tab === 'messages' && <MessagesScreen />}
        {tab === 'profile' && <ProfileScreen openPage={setPage} />}
      </View>
      <View style={styles.tabBar}>
        {tabs.map(([key, label, icon]) => {
          const active = tab === key;
          const sell = key === 'sell';
          return (
            <Pressable key={key} style={styles.tabItem} onPress={() => setTab(key)}>
              <View style={sell ? styles.sellCircle : styles.normalTabIcon}>
                <Ionicons name={icon} size={sell ? 30 : 22} color={sell ? WHITE : active ? BLUE : '#8892A6'} />
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },
  screen: { flex: 1, backgroundColor: BG },
  header: { minHeight: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#EEF1F6', backgroundColor: WHITE },
  headerSide: { width: 44, alignItems: 'flex-start' },
  headerSideRight: { width: 44, alignItems: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center' },
  brand: { fontSize: 27, fontWeight: '800', color: '#426FE8' },
  tagline: { color: MUTED, fontSize: 12, marginTop: -1 },
  roundButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F6FA', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 34 },
  hero: { backgroundColor: '#315DCB', borderRadius: 23, padding: 20, marginBottom: 18 },
  heroTitle: { color: WHITE, fontSize: 27, fontWeight: '800', lineHeight: 33 },
  heroText: { color: '#DDE7FF', marginTop: 8, lineHeight: 20 },
  searchBox: { marginTop: 18, backgroundColor: WHITE, borderRadius: 15, paddingHorizontal: 14, height: 52, flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, marginLeft: 9, fontSize: 16, color: DARK },
  locationChip: { alignSelf: 'flex-start', marginTop: 13, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999 },
  locationText: { color: '#E2E9FF', fontWeight: '700' },
  sectionTitle: { fontSize: 21, fontWeight: '800', color: DARK, marginVertical: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionCount: { color: MUTED, fontWeight: '700' },
  horizontalChips: { gap: 8, paddingBottom: 8 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: WHITE, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: '#E6EAF2' },
  categoryChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  categoryChipText: { color: DARK, fontWeight: '700' },
  categoryChipTextActive: { color: WHITE },
  listingCard: { backgroundColor: WHITE, borderRadius: 17, marginBottom: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#EDF0F5' },
  listingImage: { width: 76, height: 70, borderRadius: 13, backgroundColor: '#F1F3F8', alignItems: 'center', justifyContent: 'center' },
  listingInfo: { flex: 1 },
  listingTitle: { fontWeight: '800', color: '#2E384E', fontSize: 16 },
  listingPrice: { color: BLUE, fontWeight: '800', fontSize: 18, marginVertical: 4 },
  muted: { color: MUTED, fontSize: 13, lineHeight: 18 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: DARK, marginBottom: 16 },
  emptyCard: { backgroundColor: WHITE, borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#E9EDF4' },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: DARK, marginTop: 10 },
  emptyText: { color: MUTED, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  photoBox: { height: 140, backgroundColor: WHITE, borderRadius: 18, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C8D5F7', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  photoTitle: { color: DARK, fontWeight: '800', marginTop: 5 },
  field: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E5E9F1', borderRadius: 14, minHeight: 52, paddingHorizontal: 14, marginBottom: 10, fontSize: 16, color: DARK },
  textArea: { height: 120, paddingTop: 14 },
  selectField: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E5E9F1', borderRadius: 14, height: 52, paddingHorizontal: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placeholderText: { color: '#9AA3B5', fontSize: 16 },
  selectText: { color: DARK, fontSize: 16 },
  primaryButton: { height: 54, borderRadius: 15, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryButtonText: { color: WHITE, fontWeight: '800', fontSize: 16 },
  threadRow: { backgroundColor: WHITE, padding: 13, borderRadius: 16, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#EDF0F5' },
  threadAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center' },
  threadTitle: { fontWeight: '800', color: DARK, marginBottom: 3 },
  threadTime: { color: MUTED, fontSize: 12 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: WHITE, padding: 16, borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: '#EDF0F5' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E9EDF5', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 18, fontWeight: '800', color: DARK },
  menuCard: { backgroundColor: WHITE, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#EDF0F5' },
  menuRow: { minHeight: 59, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: '#EFF2F6' },
  menuText: { flex: 1, fontWeight: '700', color: '#3B455A', fontSize: 16 },
  dealHero: { backgroundColor: WHITE, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E9EDF4', marginBottom: 12 },
  dealTitle: { fontSize: 17, fontWeight: '800', color: DARK, marginBottom: 2 },
  dealProduct: { backgroundColor: WHITE, borderRadius: 18, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E9EDF4' },
  stepRow: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 72 },
  stepCircle: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#C7CFDF', alignItems: 'center', justifyContent: 'center' },
  stepCircleDone: { backgroundColor: BLUE, borderColor: BLUE },
  stepNumber: { color: '#8993A6', fontWeight: '800' },
  stepTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 2 },
  themeRow: { flexDirection: 'row', gap: 9 },
  themeCard: { flex: 1, minHeight: 92, backgroundColor: WHITE, borderRadius: 16, borderWidth: 1, borderColor: '#E6EAF2', alignItems: 'center', justifyContent: 'center', padding: 8 },
  themeCardActive: { borderColor: BLUE, borderWidth: 2 },
  themeTitle: { color: DARK, fontWeight: '700', marginTop: 7, textAlign: 'center', fontSize: 12 },
  settingsCard: { backgroundColor: WHITE, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#E9EDF4' },
  settingRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EFF2F6' },
  settingTitle: { color: DARK, fontWeight: '800', fontSize: 15 },
  linkRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EFF2F6' },
  linkText: { color: BLUE, fontWeight: '800' },
  supportLabel: { color: MUTED, marginBottom: 10 },
  supportCard: { backgroundColor: WHITE, borderRadius: 18, padding: 17, marginBottom: 12, borderWidth: 1, borderColor: '#E9EDF4' },
  supportTitle: { color: DARK, fontWeight: '800', fontSize: 18 },
  supportText: { color: MUTED, lineHeight: 20, marginTop: 6 },
  openText: { color: BLUE, fontWeight: '800', marginTop: 10 },
  tabBar: { height: 76, flexDirection: 'row', backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#E9EDF4', paddingBottom: 7 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  normalTabIcon: { height: 26, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 11, color: '#8A93A6', fontWeight: '600' },
  tabLabelActive: { color: BLUE },
  sellCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginTop: -21, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
});
