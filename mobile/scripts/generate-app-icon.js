const fs=require('fs');
const path=require('path');
const zlib=require('zlib');

const W=1024,H=1024;
const rgb=Buffer.alloc(W*H*3,255);
const blue=[24,113,245];
function setPixel(x,y,c){if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*3;rgb[i]=c[0];rgb[i+1]=c[1];rgb[i+2]=c[2];}
function rect(x,y,w,h,c){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)setPixel(xx,yy,c);}
function poly(points,c){let minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1]))));let maxY=Math.min(H-1,Math.ceil(Math.max(...points.map(p=>p[1]))));for(let y=minY;y<=maxY;y++){const xs=[];for(let i=0,j=points.length-1;i<points.length;j=i++){const [xi,yi]=points[i],[xj,yj]=points[j];if((yi>y)!==(yj>y)){xs.push(xi+(y-yi)*(xj-xi)/(yj-yi));}}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2){for(let x=Math.ceil(xs[k]);x<=Math.floor(xs[k+1]);x++)setPixel(x,y,c);}}}
function circle(cx,cy,r,c){for(let y=cy-r;y<=cy+r;y++){const dy=y-cy;const dx=Math.floor(Math.sqrt(Math.max(0,r*r-dy*dy)));for(let x=cx-dx;x<=cx+dx;x++)setPixel(x,y,c);}}

// Bold geometric K centered on a white square.
rect(250,210,150,600,blue);
poly([[400,500],[670,210],[855,210],[535,535]],blue);
poly([[440,520],[575,430],[835,810],[650,810]],blue);
circle(815,760,55,blue);

const rows=[];
for(let y=0;y<H;y++){const row=Buffer.alloc(1+W*3);row[0]=0;rgb.copy(row,1,y*W*3,(y+1)*W*3);rows.push(row);}
function crc32(buf){let c=0xffffffff;for(const b of buf){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type);const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([len,t,data,crc]);}
const sig=Buffer.from([137,80,78,71,13,10,26,10]);
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);ihdr[8]=8;ihdr[9]=2;ihdr[10]=0;ihdr[11]=0;ihdr[12]=0;
const png=Buffer.concat([sig,chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(Buffer.concat(rows),{level:9})),chunk('IEND',Buffer.alloc(0))]);
const out=path.join(__dirname,'..','assets','icon.png');
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,png);
console.log('Generated RGB 1024x1024 Kaikki.fi app icon:',png.length,'bytes');
