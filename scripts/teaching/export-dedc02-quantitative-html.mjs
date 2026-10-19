import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const input=path.join(root,'teaching/courses/dedc02/08-quantitative-analysis/index.html');
const output=path.resolve(process.argv[2] || 'dist/dedc02-topic8-standalone.html');
let html=await readFile(input,'utf8');
const mime=p=>p.endsWith('.woff2')?'font/woff2':p.endsWith('.woff')?'font/woff':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.png')?'image/png':'application/octet-stream';
async function embedCss(css,assetPath) {
  const matches=[...css.matchAll(/url\(([^)]+)\)/g)];
  for(const match of matches){const src=match[1].replace(/^['"]|['"]$/g,'');if(/^(data:|https?:|#)/.test(src))continue;const target=src.startsWith('/')?path.join(root,src):path.resolve(path.dirname(assetPath),src);const bytes=await readFile(target);css=css.replace(match[0],`url(data:${mime(target)};base64,${bytes.toString('base64')})`);}
  return css;
}
const moduleCache=new Map();
async function embedModule(file) {
  if(moduleCache.has(file))return moduleCache.get(file);
  let text=await readFile(file,'utf8');
  const imports=[...text.matchAll(/from\s*["'](\.[^"']+)["']/g)];
  for(const m of imports){const dep=await embedModule(path.resolve(path.dirname(file),m[1]));text=text.replace(m[0],`from"data:text/javascript;base64,${Buffer.from(dep).toString('base64')}"`);}
  const sideEffects=[...text.matchAll(/\bimport\s*["'](\.[^"']+)["']/g)];
  for(const m of sideEffects){const dep=await embedModule(path.resolve(path.dirname(file),m[1]));text=text.replace(m[0],`import"data:text/javascript;base64,${Buffer.from(dep).toString('base64')}"`);}
  moduleCache.set(file,text);return text;
}
for(const m of [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]){
 const src=m[0].match(/href="([^"]+)"/)?.[1];if(!src||!src.startsWith('/'))continue;
 const target=path.join(root,src);const css=await embedCss(await readFile(target,'utf8'),target);html=html.replace(m[0],`<style>${css}</style>`);
}
for(const m of [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)]){
 const script=await embedModule(path.join(root,m[1]));html=html.replace(m[0],`<script type="module">${script.replace(/<\/script/gi,'<\\/script')}</script>`);
}
for(const m of [...html.matchAll(/<img\b[^>]*src="(\/[^"\s]+)"[^>]*>/g)]) {
 const bytes=await readFile(path.join(root,m[1]));
 html=html.replace(m[0],m[0].replace(`src="${m[1]}"`,`src="data:${mime(m[1])};base64,${bytes.toString('base64')}"`));
}
html=html.replace(/href="(\/teaching\/[^"#]*)"/g,(_,href)=>`href="https://apriljzhang.com${href}"`);
await mkdir(path.dirname(output),{recursive:true});await writeFile(output,html);
console.log(`Standalone HTML saved: ${output} (${Buffer.byteLength(html)} bytes)`);
