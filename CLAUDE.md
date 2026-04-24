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
| `service-account.json` | `public_html/backend/service-account.json` (ya subido) |

---

## Google Calendar Integration — Service Account (en producción)

- **Cuenta de Google:** `notaryaplus31@gmail.com` (Myrna)
- **Google Cloud proyecto:** `notaryaplus-backend` (creado bajo `ferkmas88@gmail.com`, no bajo la cuenta de Myrna — funciona igual, no hay que cambiarlo)
- **Método de auth:** Service Account (JWT firmado localmente con `openssl_sign`, nunca expira — se acabó el bug de los 7 días)
- **Service Account email:** `notaryaplus-calendar@notaryaplus-backend.iam.gserviceaccount.com`
- **Archivo credenciales:** `service-account.json` (gitignored, ya subido a Hostinger en `public_html/backend/service-account.json`. Protegido por el `.htaccess` existente que bloquea todo `.json`)
- **Helper PHP:** `public/backend/gcal-auth.php` → `gcalServiceAccountToken($scope)`
- **Scope usado:** `https://www.googleapis.com/auth/calendar` (el completo — necesario para `freeBusy.query`; el scope más estrecho `calendar.events` devuelve 403 en freeBusy)

### Arquitectura: Google Calendar = única fuente de verdad

El problema histórico era que `citas.php` calculaba los slots ocupados como la **unión de `appointments.json` + Google Calendar freeBusy**. Eso causaba:
- Citas fantasma en `appointments.json` bloqueaban slots que en realidad estaban libres en Google Calendar
- Cuando Myrna cancelaba un evento en su calendario, el slot no se liberaba en la web porque el JSON seguía teniendo el registro

**Solución actual:**
- `GET /citas.php?date=X` consulta **SOLO** Google Calendar vía freeBusy. `appointments.json` **NUNCA** se lee para disponibilidad.
- `POST /citas.php` chequea conflictos **SOLO** contra Google Calendar.
- `appointments.json` sigue existiendo y se escribe como **log** para los emails de confirmación / recordatorios / admin dashboard, pero nada lo consulta para decidir si un slot está libre.
- Cuando alguien reserva por la web → se crea evento en Google Calendar (via `gcalCreateEvent`) + se escribe entrada en `appointments.json` (log).
- Cuando Myrna cancela en Google Calendar → slot se libera automáticamente en la siguiente request a la web. Cero desync posible.

### Multi-calendario (Myrna + oficina completa)

La constante `NOTARY_READ_CALENDAR_IDS` en `public/backend/citas.php` lista todos los calendarios que se leen en una sola llamada a `freeBusy.query` (la API soporta hasta 50 calendarios por llamada). La unión de eventos ocupados de todos estos calendarios es lo que bloquea slots en la web.

**Calendarios que se leen actualmente:**

| Calendar ID | Dueño | Estado Service Account |
|---|---|---|
| `notaryaplus31@gmail.com` | Myrna (primary) | ✅ Compartido "Make changes to events" |
| `2025e3f6e24a55cee2d0d08205baa9d571bbe0a93aa72157115fef122af071a4@group.calendar.google.com` | Myrna (secundario, calendario **"Negocios"** azul) | ✅ Compartido "See all event details" |
| `ale.notaryaplus@gmail.com` | Ale (secretaria) | ✅ Compartido "See all event details" |
| `cecilia1.notaryaplus@gmail.com` | Cecilia (secretaria) | ❌ **PENDIENTE — Cecilia debe compartir su calendario** |
| `danae.notaryaplus@gmail.com` | Danae (secretaria) | ✅ Compartido "See all event details" |

**NUEVOS eventos (creados desde la web) se escriben SOLO en** `notaryaplus31@gmail.com` (constante `NOTARY_CALENDAR_ID`). Los calendarios de las secretarias son read-only para nuestro backend.

**Cómo una secretaria comparte su calendario con el Service Account:**
1. `calendar.google.com` logueada con su propia cuenta
2. My calendars → hover sobre su calendario → 3 puntitos → Settings and sharing
3. Share with specific people or groups → Add people and groups
4. Pegar: `notaryaplus-calendar@notaryaplus-backend.iam.gserviceaccount.com`
5. Permiso: **"See all event details"**
6. Send

El error 404 en events.list/freeBusy para un calendario específico significa "no compartido con este caller". Si se comparte, pasa a 200 automáticamente sin tocar código ni redeploy.

### Nota sobre el calendario "Negocios"

El ID `2025e3f6...@group.calendar.google.com` estaba mal etiquetado como "legacy group calendar" en el código, pero en realidad **ES** el calendario azul "Negocios" que Myrna usa como calendario compartido de toda la oficina. Se estaba leyendo correctamente desde el principio.

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
| `cecilia` | `Cecilia2025!` | `cecilia1.notaryaplus@gmail.com` |

El admin panel sigue pasando `adminRefreshToken` en las requests a `citas.php` pero se ignora silenciosamente (Service Account sustituye todo).

---

## Recordatorios automáticos

Cron job en Hostinger hPanel → Cron Jobs:
```
0 9 * * * curl -s "https://notaryaplus.com/backend/recordatorio.php?token=notary_reminder_2025_secret"
```

Nota: `recordatorio.php` sigue leyendo de `appointments.json` para decidir a quién mandar email de recordatorio. Como `appointments.json` ya no es fuente de verdad de disponibilidad pero SÍ es el log de citas creadas por la web, esto funciona correctamente: solo manda recordatorios a clientes que reservaron online (donde tenemos email). Las citas que Myrna crea a mano en Google Calendar NO reciben recordatorio automático por este sistema — Google Calendar tiene sus propias notificaciones nativas.

---

## Emails

- Myrna: `notaryaplus3_1@yahoo.com` + `notaryaplus31@gmail.com`
- SMTP: `smtp.hostinger.com:465` (credenciales en `google-config.php`)

---

## Deploy

Automático. Cualquier push a `master` dispara GitHub Actions:
1. `npm ci && npm run build` → genera `out/`
2. FTP upload de `out/` → `public_html/` en Hostinger

Secrets en GitHub: `FTP_USERNAME`, `FTP_PASSWORD`

⚠️ **Nota sobre `appointments.json`:** el deploy por FTP-Deploy-Action **no sobreescribe** el `appointments.json` del servidor con el local (porque usa un state file que marca los archivos no modificados como "unchanged"). Esto significa que el archivo del servidor puede divergir del local — eso está OK porque es un log que PHP escribe en runtime.

---

## Google Reviews

- Rating: 4.2 ⭐ · 87 reseñas
- Link directo para dejar reseña: `https://g.page/r/CUOfHKzZzu4UEBM/review`

---

## Bot de WhatsApp (Railway)

- **URL pública:** `https://web-production-c32f8.up.railway.app`
- **Identidad:** responde `{"status":"ok","bot":"NotaryaPlus"}` en la raíz
- **Estado:** corriendo, confirmado vivo el 2026-04-13
- **Código fuente:** UBICACIÓN DESCONOCIDA POR AHORA — el usuario tiene que decir dónde está (GitHub? carpeta local?) para poder modificarlo o integrarlo con la web

**Plan de integración pendiente:**
- Agregar botón flotante de WhatsApp en el layout del sitio (abajo-derecha, verde brand WhatsApp, fixed position) que linkee a `wa.me/<número-del-bot>` cuando tengamos el número definitivo.
- Se había empezado a hablar de crear un bot nuevo con `whatsapp-web.js` + Railway, pero como YA existe uno, se descarta esa opción. Integrar sobre el existente.

---

## Pendientes

### Bloqueante — esperando al usuario

- [ ] **Cecilia comparte su calendario** con `notaryaplus-calendar@notaryaplus-backend.iam.gserviceaccount.com` ("See all event details"). Sin esto, sus citas (ej. Brenda Mendoza 12pm y Erika Lopez 4:30pm) son invisibles para la web y crean huecos falsos.
- [ ] **Usuario sube el código fuente del bot de Railway** (GitHub repo URL o path local). Sin esto no se puede modificar ni integrar con el sitio.

### Diseño (local, esperando aprobación)

- [ ] Cambios de diseño pedidos en el Hero de la homepage:
  - Hacer visible el nombre "Myrna Rodríguez" en la primera pantalla (hoy está enterrado al final de la línea de dirección)
  - Agregar botones grandes de teléfono clicables en el hero (`tel:5026547076`, `tel:5026441312`) — hoy los teléfonos no aparecen hasta el CTA banner al final
  - Agrandar los stats ("15+ / IRS / 100% / 24h") de `text-4xl` a `text-5xl md:text-6xl`
  - Agregar botón flotante de WhatsApp después de integrar el bot de Railway
- [ ] Se pidió hacer esto "en local" primero para ver antes de deploy
- [ ] NO se ha tocado código de diseño todavía — está todo en planeación

### Operacionales

- [ ] Limpiar el typo `ale.notaryaplus@gmIaL.com` ("gmial") en la lista "Shared with" del calendario Negocios y del primary de Myrna, y re-agregar con `ale.notaryaplus@gmail.com` bien escrito
- [ ] Reactivar booking online en `/citas` — **YA HECHO** en esta sesión
- [ ] Configurar cron job de recordatorios en Hostinger — probablemente ya está, verificar

---

## Qué necesito del usuario la próxima vez para continuar

Para que avancemos rápido cuando retomemos, necesito una o varias de estas cosas:

### Para terminar Google Calendar (prioridad alta)
- **Confirmación de que Cecilia compartió su calendario** con el Service Account. Avisa con "listo cecilia" y yo verifico en vivo. Sin esto, quedan huecos en los slots de la web.

### Para el bot de WhatsApp
Una de estas tres (con la primera basta):
- **URL del repo de GitHub** del bot en Railway, ej: `https://github.com/ferkmas88/notaryaplus-bot`
- **Path local** del código del bot en tu máquina, ej: `C:\Users\Fer\Desktop\notary-bot\`
- **Acceso Railway**: hacer `railway login` + `railway link <proyecto>` y yo bajo el código

### Para diseño (opcional)
- **Screenshot** de cómo se ve la homepage hoy (para comparar antes/después)
- **Referencia visual** de algún sitio que te guste como base (opcional)
- **Confirmación de los 3 cambios** (Myrna nombre, teléfonos visibles, stats más grandes) — si apruebas los empiezo cuando retomes

---

## Decisiones arquitecturales tomadas hoy

1. **Service Account > OAuth publicado**: evitamos el proceso de "verification" de Google (privacy policy pública, video demo, revisión de semanas) migrando a Service Account. Patrón oficial para backend-to-backend, nunca expira.
2. **Single source of truth > Dual source**: `appointments.json` ya no se consulta para disponibilidad. Google Calendar gana siempre. Evita bugs de sync.
3. **Fallback OAuth temporal**: `citas.php` tiene fallback al OAuth viejo si el JSON del SA no se encuentra. Permitió hacer deploy antes de que el JSON estuviera en Hostinger sin romper producción. Ahora que el JSON está en el servidor, el fallback nunca se activa, pero se deja por seguridad.
4. **Multi-calendar con graceful degradation**: si un calendario en `NOTARY_READ_CALENDAR_IDS` está mal configurado (no compartido, wrong ID, etc.), el código loggea el error vía `error_log` y sigue adelante con los demás. Un calendario roto NO rompe el sistema completo.
5. **Bot nuevo vs. existente**: se decidió **usar el bot que ya existe** en Railway (`web-production-c32f8.up.railway.app`) en vez de crear uno nuevo con `whatsapp-web.js`.


## Token efficiency rules
## Approach
- Read existing files before writing. Don't re-read unless changed.
- Thorough in reasoning, concise in output.
- Skip files over 100KB unless required.
- No sycophantic openers or closing fluff.
- No emojis or em-dashes.
- Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading code or docs before asserting.
