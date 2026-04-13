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

- **Cuenta:** `notaryaplus31@gmail.com`
- **Google Cloud proyecto:** `notaryaplus-backend`
- **Método de auth:** Service Account (JWT firmado localmente, no expira)
- **Archivo credenciales:** `service-account.json` (gitignored, subir manual a Hostinger
  en `/home/<usuario>/` o en `public_html/backend/` — el `.htaccess` bloquea `.json` ahí)
- **Helper PHP:** `public/backend/gcal-auth.php` → `gcalServiceAccountToken($scope)`
- **Scopes usados:** `https://www.googleapis.com/auth/calendar.events`

### Cómo está cableado

- `citas.php` → `gcalAccessToken()` delega a `gcalServiceAccountToken()` → no usa refresh tokens.
- El panel admin sigue pasando `adminRefreshToken` en el request pero se ignora silenciosamente.
- `google-config.php` ya no necesita `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN`.
  Solo mantiene `GOOGLE_CALENDAR_ID` + credenciales SMTP.

### Rotar la credencial del Service Account (solo si se filtra)

1. Google Cloud Console → IAM & Admin → Service Accounts → el service account → Keys.
2. Revoke la key vieja.
3. Add Key → Create new key → JSON → descargar.
4. Subir el nuevo `service-account.json` a Hostinger reemplazando el viejo.

---

## Panel Admin

URL: `https://notaryaplus.com/backend/admin/`

| Usuario | Password | Calendario |
|---------|----------|-----------|
| `myrna` | `Myrna2025!` | `notaryaplus31@gmail.com` |
| `cecilia` | `Cecilia2025!` | `cecilia1notaryaplus@gmail.com` (pendiente OAuth) |

---

## Recordatorios automáticos

Cron job en Hostinger hPanel → Cron Jobs:
```
0 9 * * * curl -s "https://notaryaplus.com/backend/recordatorio.php?token=notary_reminder_2025_secret"
```

---

## Emails

- Myrna: `notaryaplus3_1@yahoo.com` + `notaryaplus31@gmail.com`
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

- [ ] Conectar Google Calendar de Cecilia (compartir su calendario con el mismo Service Account — cero código)
- [ ] Configurar cron job de recordatorios en Hostinger
- [ ] Subir `admin-config.php` a Hostinger si no está
- [ ] Reactivar booking online en `src/app/citas/page.tsx` (actualmente deshabilitado)
