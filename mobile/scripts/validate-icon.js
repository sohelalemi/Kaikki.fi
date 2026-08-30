const fs=require('fs');
const path=require('path');
const p=path.join(__dirname,'..','assets','icon.png');
if(!fs.existsSync(p)) throw new Error('Missing assets/icon.png');
const b=fs.readFileSync(p);
const png=b.slice(0,8).toString('hex')==='89504e470d0a1a0a';
if(!png) throw new Error('assets/icon.png is not a valid PNG file');
console.log('Kaikki.fi icon PNG found:', b.length, 'bytes');
