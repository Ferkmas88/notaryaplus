"use client";

import { useLang } from "@/contexts/LangContext";

export default function PrivacyPage() {
  const { lang } = useLang();
  const isES = lang === "es";

  return (
    <main className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {isES ? "Política de Privacidad" : "Privacy Policy"}
          </h1>
          <p className="text-sm text-gray-500">
            {isES ? "Última actualización: 17 de Abril, 2026" : "Last updated: April 17, 2026"}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
          {isES ? (
            <>
              <p>
                3-1 Notary A Plus ("nosotros"), operando <strong>notaryaplus.com</strong>, respeta tu privacidad.
                Esta política explica qué información recopilamos, cómo la usamos y con quién la compartimos.
              </p>

              <section id="upl" className="bg-mint-light border-l-4 border-gold rounded-r-xl p-5 my-6 not-prose">
                <h2 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Aviso legal — No somos abogados
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  3-1 Notary A Plus ofrece servicios de notarización (notary public) y preparación de documentos.
                  <strong> NO somos abogados y NO brindamos asesoría legal.</strong> El término "Notario Público"
                  en Estados Unidos se refiere a un "notary public" y NO tiene el mismo significado que en
                  Latinoamérica, donde un "notario" es un abogado con licencia. Para asesoría legal, consulte
                  con un abogado autorizado en Kentucky.
                </p>
              </section>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">1. Quiénes Somos</h2>
              <p>
                3-1 Notary A Plus es un negocio familiar operado por <strong>Myrna Rodríguez</strong> en Louisville,
                Kentucky. Dirección: 8514 Preston Hwy, Louisville, KY 40219. Email:{" "}
                <a href="mailto:notaryaplus31@gmail.com" className="text-gold hover:underline">notaryaplus31@gmail.com</a>.
                Teléfono: (502) 654-7076.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">2. Información que Recopilamos</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Datos de contacto:</strong> nombre, email, teléfono (cuando reservas una cita o usas el chat).</li>
                <li><strong>Información de la cita:</strong> servicio solicitado, fecha y hora preferida, notas opcionales.</li>
                <li><strong>Conversaciones del chat:</strong> los mensajes que envías a nuestro asistente de chat.</li>
                <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo (registrados automáticamente por el servidor web por razones de seguridad).</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">3. Cómo Usamos tu Información</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Responder consultas y agendar citas</li>
                <li>Brindar los servicios de notaría, impuestos, inmigración o traducciones</li>
                <li>Enviar confirmaciones y recordatorios de cita por email y SMS</li>
                <li>Cumplir con obligaciones legales federales, del estado de Kentucky, requisitos del IRS y USCIS</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">4. Con Quién Compartimos tu Información</h2>
              <p>
                <strong>NO</strong> vendemos, rentamos ni intercambiamos tu información personal con anunciantes o plataformas de marketing.
                Usamos los siguientes proveedores de servicio (procesadores de datos) estrictamente necesarios para operar el sitio y
                atenderte:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Google (Google Workspace / Google Calendar):</strong> agendamiento de citas y envío de emails operativos (cuenta notaryaplus31@gmail.com).</li>
                <li><strong>Hostinger:</strong> hosting del sitio web y servidor SMTP para envío de emails de confirmación (smtp.hostinger.com). Almacena logs técnicos y el registro de citas creadas desde la web.</li>
                <li><strong>Railway:</strong> hosting del asistente de chat (bot) que responde en el widget de la esquina inferior derecha del sitio.</li>
                <li><strong>Meta (WhatsApp Business):</strong> cuando nos contactas por WhatsApp, la conversación pasa por la infraestructura de Meta.</li>
                <li><strong>Anthropic:</strong> procesamiento del contenido de los mensajes del chat mediante su modelo de IA para generar las respuestas del asistente.</li>
              </ul>
              <p>
                También podríamos compartir información con autoridades legales o gubernamentales cuando la ley lo requiera, o con
                instituciones financieras únicamente para procesar declaraciones de impuestos cuando lo solicites.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">5. Retención de Datos</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Citas pasadas y datos de contacto de reservas: hasta 1 año</li>
                <li>Logs técnicos del servidor: hasta 90 días</li>
                <li>Conversaciones del chat: según la retención de Anthropic (procesador IA)</li>
                <li>Documentos de impuestos: 7 años según requisitos del IRS</li>
                <li>Expedientes de casos de inmigración: según lineamientos del USCIS</li>
                <li>Registros notariales: según los Estatutos Revisados de Kentucky (KRS 423)</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">6. Tus Derechos</h2>
              <p>
                Puedes solicitar en cualquier momento acceso, rectificación o eliminación de tu información personal (sujeto a los
                requisitos legales de retención). Escríbenos a{" "}
                <a href="mailto:notaryaplus31@gmail.com" className="text-gold hover:underline">notaryaplus31@gmail.com</a>.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">7. Cookies</h2>
              <p>
                Este sitio <strong>NO</strong> usa cookies de rastreo, Google Analytics, Meta Pixel ni cookies publicitarias.
                Usamos únicamente almacenamiento local del navegador (localStorage) para guardar tu preferencia de idioma
                (ES/EN) y el identificador de sesión del chat, de modo que tu conversación con el asistente persista entre recargas.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">8. Privacidad de Menores</h2>
              <p>Este sitio no está dirigido a menores de 13 años y no recopilamos conscientemente datos de menores.</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">9. Cambios a esta Política</h2>
              <p>
                Cualquier cambio importante a esta política será publicado en esta misma página con la fecha de
                "Última actualización" arriba.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">10. Contacto</h2>
              <address className="not-italic">
                <strong>3-1 Notary A Plus</strong><br />
                8514 Preston Hwy, Louisville, KY 40219<br />
                Email: <a href="mailto:notaryaplus31@gmail.com" className="text-gold hover:underline">notaryaplus31@gmail.com</a><br />
                Teléfono: (502) 654-7076
              </address>
            </>
          ) : (
            <>
              <p>
                3-1 Notary A Plus ("we", "us"), operating <strong>notaryaplus.com</strong>, respects your privacy.
                This policy explains what information we collect, how we use it, and who we share it with.
              </p>

              <section id="upl" className="bg-mint-light border-l-4 border-gold rounded-r-xl p-5 my-6 not-prose">
                <h2 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Legal notice — We are not attorneys
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  3-1 Notary A Plus provides notary public and document preparation services.
                  <strong> We are NOT attorneys and do NOT provide legal advice.</strong> The term "Notario Público"
                  in the United States refers to a notary public and does not have the same meaning as in Latin American
                  countries, where a "notario" is a licensed attorney. For legal advice, consult a licensed Kentucky attorney.
                </p>
              </section>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">1. Who We Are</h2>
              <p>
                3-1 Notary A Plus is a family business operated by <strong>Myrna Rodríguez</strong> in Louisville,
                Kentucky. Address: 8514 Preston Hwy, Louisville, KY 40219. Email:{" "}
                <a href="mailto:notaryaplus31@gmail.com" className="text-gold hover:underline">notaryaplus31@gmail.com</a>.
                Phone: (502) 654-7076.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Contact data:</strong> name, email, phone number (when you book an appointment or use the chat).</li>
                <li><strong>Appointment information:</strong> service requested, preferred date and time, optional notes.</li>
                <li><strong>Chat conversations:</strong> the messages you send to our chat assistant.</li>
                <li><strong>Technical data:</strong> IP address, browser, operating system (automatically logged by the web server for security).</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Respond to inquiries and schedule appointments</li>
                <li>Provide notary, tax, immigration, or translation services</li>
                <li>Send appointment confirmations and reminders via email and SMS</li>
                <li>Comply with U.S. federal law, Kentucky state law, IRS and USCIS requirements</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">4. Who We Share Your Information With</h2>
              <p>
                We do <strong>NOT</strong> sell, rent, or trade your personal information with advertisers or marketing platforms.
                We use the following service providers (data processors) strictly necessary to operate the site and serve you:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Google (Google Workspace / Google Calendar):</strong> appointment scheduling and operational emails (account notaryaplus31@gmail.com).</li>
                <li><strong>Hostinger:</strong> website hosting and SMTP server for confirmation emails (smtp.hostinger.com). Stores technical logs and records of appointments booked through the website.</li>
                <li><strong>Railway:</strong> hosting for the chat assistant (bot) that replies from the widget in the bottom-right corner of the site.</li>
                <li><strong>Meta (WhatsApp Business):</strong> when you reach out through WhatsApp, the conversation goes through Meta's infrastructure.</li>
                <li><strong>Anthropic:</strong> AI processing of chat messages to generate the assistant's replies.</li>
              </ul>
              <p>
                We may also share data with legal or government authorities when required by law, or with financial institutions
                only to process tax filings when you request that service.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">5. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Past appointments and booking contact data: up to 1 year</li>
                <li>Server technical logs: up to 90 days</li>
                <li>Chat conversations: per Anthropic's retention (AI processor)</li>
                <li>Tax documents: 7 years per IRS requirements</li>
                <li>Immigration case files: per USCIS guidelines</li>
                <li>Notary journal entries: per Kentucky Revised Statutes (KRS 423)</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">6. Your Rights</h2>
              <p>
                You may request access, correction, or deletion of your personal information at any time (subject to legal
                retention requirements). Contact us at{" "}
                <a href="mailto:notaryaplus31@gmail.com" className="text-gold hover:underline">notaryaplus31@gmail.com</a>.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">7. Cookies</h2>
              <p>
                This website does <strong>NOT</strong> use tracking cookies, Google Analytics, Meta Pixel, or advertising cookies.
                We only use browser localStorage to save your language preference (ES/EN) and a chat session id so your
                conversation with the assistant persists across page reloads.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">8. Children's Privacy</h2>
              <p>This site is not directed to children under 13 and we do not knowingly collect data from minors.</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">9. Changes to this Policy</h2>
              <p>
                Any material change to this policy will be posted on this same page with the "Last updated" date above.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">10. Contact</h2>
              <address className="not-italic">
                <strong>3-1 Notary A Plus</strong><br />
                8514 Preston Hwy, Louisville, KY 40219<br />
                Email: <a href="mailto:notaryaplus31@gmail.com" className="text-gold hover:underline">notaryaplus31@gmail.com</a><br />
                Phone: (502) 654-7076
              </address>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
