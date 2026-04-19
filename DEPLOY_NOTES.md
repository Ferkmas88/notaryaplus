# DEPLOY NOTES — SEO + GA4 + Cookie Consent

Cambios técnicos de esta rama/commit. Antes de mergear a `master` hay pasos manuales que solo Fernando puede hacer (cuentas Google, DNS en Hostinger, secrets en GitHub).

---

## 0 — Pre-flight: borrar archivos estáticos obsoletos

Había un `public/sitemap.xml` y un `public/robots.txt` hechos a mano. Los reemplazamos con `src/app/sitemap.ts` y `src/app/robots.ts` (Next 14 genera `/sitemap.xml` y `/robots.txt` dinámicamente en build). Si ambos coexisten, Next puede warnar o pisar uno sobre otro — más limpio borrar los viejos:

```bash
git rm public/sitemap.xml public/robots.txt
```

(No se pudieron borrar automáticamente desde Cowork por permisos del sandbox — se deja como paso manual.)

---

## 1 — Google Analytics 4

### 1.1 Crear la property
1. `analytics.google.com` logueado con **`ferkmas88@gmail.com`**.
2. Admin → Create Account → "Digital AM" → Create Property → "NotaryaPlus".
3. Web stream → URL `https://notaryaplus.com` → nombre "NotaryaPlus Web".
4. Copiar el **Measurement ID** (formato `G-XXXXXXXXXX`).

### 1.2 Cargarlo como secret de GitHub
1. GitHub → repo `notaryaplus` → Settings → Secrets and variables → Actions.
2. New repository secret.
3. Name: `NEXT_PUBLIC_GA_ID`
4. Value: el `G-XXXXXXXXXX` del paso anterior.

Esto es necesario porque el sitio es static export: `NEXT_PUBLIC_*` se inlinea en build-time. El workflow ya está modificado (`.github/workflows/deploy.yml`) para pasar este secret al `npm run build`. Si el secret no existe, el componente `<GoogleAnalytics />` no monta nada (safe default, no rompe el sitio).

### 1.3 Opcional — probarlo local
```bash
cp .env.local.example .env.local
# editar .env.local y pegar NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
npm run dev
```
Aceptar el banner en el navegador, abrir DevTools → Network → filtrar `collect?v=2` — tienen que verse hits a `google-analytics.com`.

---

## 2 — Google Search Console

### 2.1 Crear la Domain property
1. `search.google.com/search-console` con **`ferkmas88@gmail.com`**.
2. Add property → elegir **Domain** (NO "URL prefix") → escribir `notaryaplus.com`.
3. Google devuelve un TXT tipo `google-site-verification=abc123XYZ...`.

### 2.2 Agregar el TXT en Hostinger
1. `hpanel.hostinger.com` → Domains → `notaryaplus.com` → DNS / Nameservers → Manage DNS records.
2. Add record:
   - Type: **TXT**
   - Name: `@` (apex)
   - Value: pegar el `google-site-verification=...` completo tal cual
   - TTL: 3600
3. Save. Esperar 5–15 min (puede tardar hasta 24h).
4. Volver a GSC → Verify.

No reemplaces ningún TXT existente (SPF/DMARC). Esto es un TXT adicional.

### 2.3 Submit del sitemap
Después de mergear este branch y que GitHub Actions deployee:
1. GSC → Sitemaps → Add a new sitemap → `sitemap.xml` → Submit.
2. En 1–3 días aparece reporte de URLs descubiertas / indexadas.

### 2.4 Forzar indexación de páginas clave
GSC → URL Inspection, pegar uno por uno y "Request indexing" (cupo diario ~10–12):
- `https://notaryaplus.com/`
- `https://notaryaplus.com/taxes/`
- `https://notaryaplus.com/notaria/`
- `https://notaryaplus.com/inmigracion/`
- `https://notaryaplus.com/servicios/`
- `https://notaryaplus.com/citas/`

### 2.5 Conectar GA4 ↔ GSC
- GSC → Settings → Associations → Google Analytics → Associate → elegir la property GA4.
- GA4 → Admin → Property → Product Links → Search Console Links → Link.

Cruce de datos: en GA4 vas a ver qué queries de Google trajeron tráfico a qué página.

---

## 3 — Testing local antes de merge

```bash
npm ci
npm run dev
```

Checklist manual en `http://localhost:3000`:

- [ ] Banner de cookies aparece al fondo en la primera visita.
- [ ] "Aceptar todas" lo oculta y guarda `np_consent_v1` en localStorage con `analytics: true, marketing: true, updatedAt: <ISO>`.
- [ ] "Solo necesarias" lo oculta y guarda con `analytics: false, marketing: false`.
- [ ] "Personalizar" muestra los 3 checkboxes; "Necesarias" bloqueado en ON.
- [ ] En una segunda recarga con consent guardado, el banner NO aparece.
- [ ] Toggle de idioma (navbar) cambia el texto del banner entre ES/EN.
- [ ] `/sitemap.xml` devuelve XML con las 12 rutas.
- [ ] `/robots.txt` devuelve con `Disallow: /backend/` y `/api/`.
- [ ] DevTools Console: cero errores de CSP.
- [ ] Con `NEXT_PUBLIC_GA_ID` seteado en `.env.local` y tras aceptar cookies: Network muestra hits a `google-analytics.com/g/collect`.
- [ ] Con analytics rechazado: ningún script de `googletagmanager.com` carga.

```bash
npm run build
```
Tiene que terminar sin errores. En `out/` debe haber `sitemap.xml` y `robots.txt` generados.

---

## 4 — Merge y deploy

1. Revisar `git diff` una vez más.
2. Commit + push a `master`.
3. GitHub Actions corre `build` + FTP deploy a Hostinger (~3 min).
4. Verificar en prod:
   - `https://notaryaplus.com/sitemap.xml` OK
   - `https://notaryaplus.com/robots.txt` OK
   - Banner de cookies aparece
   - DevTools → Network → ver headers del HTML: `Content-Security-Policy` incluye `googletagmanager.com`

---

## 5 — Privacy policy

Falta agregar sección "Cookies y tecnologías de seguimiento" a `/privacy`. Ya está documentado en el plan del vault, pero no se tocó en esta rama para mantener el scope acotado. Pendiente en `00 - Tareas Pendientes.md`.

---

## Resumen de archivos tocados en esta rama

Nuevos:
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/consent.ts`
- `src/components/ConsentProvider.tsx`
- `src/components/CookieBanner.tsx`
- `src/components/GoogleAnalytics.tsx`
- `DEPLOY_NOTES.md` (este archivo)

Modificados:
- `src/app/layout.tsx` — wire del `<ConsentProvider>`, `<CookieBanner />`, `<GoogleAnalytics />`
- `public/.htaccess` — CSP whitelistea GA4 + GTM
- `.env.local.example` — agrega `NEXT_PUBLIC_GA_ID`
- `.github/workflows/deploy.yml` — pasa el secret al step de build

Pendientes de borrar manualmente:
- `public/sitemap.xml` (reemplazado por dinámico)
- `public/robots.txt` (reemplazado por dinámico)
