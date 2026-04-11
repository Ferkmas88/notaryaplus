# notaryaplus.com — Contexto del Proyecto

Sitio web completo para **3-1 Notary A Plus** (Myrna Rodríguez, Louisville KY).

---

## Stack

- **Framework:** Next.js 14 con `output: 'export'` (HTML estático)
- **Estilos:** Tailwind CSS — colores: navy `#1B3356`, gold `#C8A214`, mint `#C5E8D5`
- **Backend citas:** PHP en `public/backend/citas.php` (corre en Hostinger)
- **Deploy:** GitHub Actions → FTP a Hostinger automático en cada push a `master`
- **Hosting:** Hostinger shared hosting `145.223.77.154` → `public_html/`
- **Dominio:** notaryaplus.com

## Idiomas

Bilingüe ES/EN. Español por defecto. Toggle en Navbar.
- Contexto: `src/contexts/LangContext.tsx`
- Traducciones: `src/lib/i18n.ts`

---

## Archivos que NO están en el repo (subir manualmente a Hostinger)

Estos archivos tienen credenciales y están en `.gitignore`:

| Archivo local | Destino en Hostinger |
|--------------|----------------------|
| `public/backend/google-config.php` | `public_html/backend/google-config.php` |
| `public/backend/admin/admin-config.php` | `public_html/backend/admin/admin-config.php` |

---

## Google Calendar Integration

- **Cuenta:** `notaryaplus26@gmail.com`
- **Google Cloud proyecto:** `vmjoyeria`
- **Client ID:** `804772779096-3d9hlcllb1s3tsodkhf84nef1285u5co.apps.googleusercontent.com`
- **Archivo config:** `public/backend/google-config.php` (gitignored)

### ⚠️ PROBLEMA CONOCIDO — Token expira cada 7 días

La app OAuth está en modo **Testing**. Solución pendiente el lunes:

**Fix rápido:** Google Cloud Console → OAuth consent screen → **Publish App**
Después regenerar refresh token con `auth.php` y subir `google-config.php` nuevo.

**Fix permanente:** Migrar a Service Account (no expira nunca).

### Regenerar refresh token cuando expira:
1. Subir `public/backend/auth.php` a Hostinger (tiene placeholders, editar con credenciales)
2. Abrir `https://notaryaplus.com/backend/auth.php` con `notaryaplus26@gmail.com`
3. Copiar REFRESH TOKEN
4. Actualizar `public/backend/google-config.php` con el nuevo token
5. Subir `google-config.php` a Hostinger
6. **Borrar** `auth.php` del servidor

---

## Panel Admin

URL: `https://notaryaplus.com/backend/admin/`

| Usuario | Password | Calendario |
|---------|----------|-----------|
| `myrna` | `Myrna2025!` | `notaryaplus26@gmail.com` |
| `cecilia` | `Cecilia2025!` | `cecilia1notaryaplus@gmail.com` (pendiente OAuth) |

---

## Recordatorios automáticos

Cron job en Hostinger hPanel → Cron Jobs:
```
0 9 * * * curl -s "https://notaryaplus.com/backend/recordatorio.php?token=notary_reminder_2025_secret"
```

---

## Emails

- Myrna: `notaryaplus3_1@yahoo.com` + `notaryaplus26@gmail.com`
- SMTP: `smtp.hostinger.com:465` (credenciales en `citas.php`)

---

## Deploy

Automático. Cualquier push a `master` dispara GitHub Actions:
1. `npm ci && npm run build` → genera `out/`
2. FTP upload de `out/` → `public_html/` en Hostinger

Secrets en GitHub: `FTP_USERNAME`, `FTP_PASSWORD`

---

## Google Reviews

- Rating: 4.2 ⭐ · 87 reseñas
- Link directo para dejar reseña: `https://g.page/r/CUOfHKzZzu4UEBM/review`

---

## Pendientes

- [ ] Publicar OAuth app (Testing → Production) para que el token no expire
- [ ] Regenerar refresh token después de publicar
- [ ] Conectar Google Calendar de Cecilia (necesita su refresh token)
- [ ] Configurar cron job de recordatorios en Hostinger
- [ ] Subir `admin-config.php` a Hostinger si no está
