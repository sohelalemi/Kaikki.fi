const fs=require('fs');
const path=require('path');

function fail(msg){console.error(`✗ ${msg}`);process.exitCode=1}
function ok(msg){console.log(`✓ ${msg}`)}

const root=path.resolve(__dirname,'..');
const appPath=path.join(root,'app.json');
const easPath=path.join(root,'eas.json');
const pkgPath=path.join(root,'package.json');

for(const p of [appPath,easPath,pkgPath]){
  if(!fs.existsSync(p)) fail(`Missing ${path.basename(p)}`); else ok(`${path.basename(p)} found`);
}

if(!fs.existsSync(appPath)||!fs.existsSync(easPath))process.exit(1);
const app=JSON.parse(fs.readFileSync(appPath,'utf8')).expo||{};
const eas=JSON.parse(fs.readFileSync(easPath,'utf8'));

if(!app.ios?.bundleIdentifier)fail('ios.bundleIdentifier is missing');else ok(`iOS bundle: ${app.ios.bundleIdentifier}`);
if(!app.ios?.buildNumber)fail('ios.buildNumber is missing');else ok(`iOS build number: ${app.ios.buildNumber}`);
if(!app.plugins?.includes('expo-notifications'))fail('expo-notifications plugin is missing');else ok('Notifications plugin configured');
if(!app.plugins?.includes('expo-image-picker'))fail('expo-image-picker plugin is missing');else ok('Image picker plugin configured');
if(!app.plugins?.includes('expo-location'))fail('expo-location plugin is missing');else ok('Location plugin configured');
if(!eas.build?.preview)fail('EAS preview profile is missing');else ok('EAS preview profile configured');
if(!eas.build?.production)fail('EAS production profile is missing');else ok('EAS production profile configured');

const projectId=app.extra?.eas?.projectId;
if(projectId)ok(`EAS projectId configured: ${projectId}`);
else console.warn('! EAS projectId not configured yet. Run `npx eas-cli init` after signing in to Expo/EAS; this is required for remote push notifications and cloud builds.');

if(!process.env.EXPO_PUBLIC_SUPABASE_URL)console.warn('! EXPO_PUBLIC_SUPABASE_URL is not set in this shell.');
if(!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)console.warn('! EXPO_PUBLIC_SUPABASE_ANON_KEY is not set in this shell.');

if(!process.exitCode)console.log('\nPreflight passed for local configuration. Account-linked EAS/Apple steps may still remain.');
