const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'App.js');
let source = fs.readFileSync(appPath, 'utf8');

const replacements = [
  ["['Vapaa-aika','🚲','Palvelut','#eaf8f8']", "['Vapaa-aika','🚲','Vapaa-aika','#eaf8f8']"],
  ["['Lapset ja vanhemmat','👶','Kaikki','#fff8df']", "['Lapset ja vanhemmat','👶','Lapset ja vanhemmat','#fff8df']"],
  ["['Eläintarvikkeet','🐾','Kaikki','#f6eee8']", "['Eläintarvikkeet','🐾','Eläintarvikkeet','#f6eee8']"],
  ["['Piha ja remontointi','🔨','Kaikki','#eaf8ef']", "['Piha ja remontointi','🔨','Piha ja remontointi','#eaf8ef']"],
  ["['Antiikki ja taide','🏺','Kaikki','#f5ebff']", "['Antiikki ja taide','🏺','Antiikki ja taide','#f5ebff']"]
];

for (const [from, to] of replacements) source = source.replace(from, to);

fs.writeFileSync(appPath, source);
console.log('Fixed iOS category actions so every visible category selects its own category.');
require('./fix-ios-home-polish.js');
