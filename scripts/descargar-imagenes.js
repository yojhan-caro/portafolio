/**
 * Descarga desde el cPanel todas las imágenes y videos que usa el portafolio
 * y los guarda en src/uploads/ (misma estructura que wp-content/uploads).
 * Si tienes "sharp" instalado (npm install), además crea versiones .webp
 * livianas (máx. 1800 px) que el build usa automáticamente.
 *
 *   npm run imagenes
 *
 * Hazlo ANTES de que cierren el cPanel del instituto.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROYECTOS } from '../src/data/proyectos.js';
import { SITIO } from '../src/data/sitio.js';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = SITIO.respaldoImagenes || 'https://yofuruya.laboratoriodiseno.cl/wp-content/';

const rutas = new Set();
for (const p of PROYECTOS) {
  [p.portada, p.fondo, p.video, ...(p.galeria || [])].filter(Boolean).forEach(r => rutas.add(r));
}

let sharp = null;
try { sharp = (await import('sharp')).default; } catch { console.log('· sharp no está instalado: se descargan los originales sin optimizar.'); }

let ok = 0, fail = 0, ahorro = 0;
for (const rel of rutas) {
  const dest = path.join(DIR, 'src', rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    if (!fs.existsSync(dest)) {
      const res = await fetch(BASE + rel);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    }
    ok++;
    if (sharp && /\.(png|jpe?g)$/i.test(rel)) {
      const webp = dest.replace(/\.(png|jpe?g)$/i, '.webp');
      if (!fs.existsSync(webp)) {
        await sharp(dest).resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(webp);
        ahorro += fs.statSync(dest).size - fs.statSync(webp).size;
      }
    }
    console.log('✓', rel);
  } catch (e) {
    fail++;
    console.log('✗', rel, '—', e.message);
  }
}
console.log(`\n${ok} archivos listos, ${fail} con error.` + (ahorro ? ` Las versiones .webp pesan ${(ahorro / 1048576).toFixed(1)} MB menos.` : ''));
console.log('Ahora corre:  npm run build');
