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
            {isES ? "Última actualización: 13 de Abril, 2026" : "Last updated: April 13, 2026"}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
          {isES ? (
            <>
              <p>
                3-1 Notary A Plus ("nosotros"), operando <strong>notaryaplus.com</strong>, respeta tu privacidad.
                Esta política explica qué información recopilamos y cómo la usamos.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">1. Información que Recopilamos</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Datos del formulario de contacto:</strong> Nombre, correo electrónico, teléfono y tu mensaje.</li>
                <li><strong>Información de citas:</strong> Servicio solicitado (notaría, impuestos, inmigración, traducciones), fecha y hora preferida.</li>
                <li><strong>Datos técnicos:</strong> Navegador, ubicación aproximada, tipo de dispositivo (recopilados automáticamente por seguridad).</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">2. Cómo Usamos tu Información</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Responder consultas y agendar citas</li>
                <li>Brindar los servicios de notaría, impuestos, inmigración o traducciones</li>
                <li>Enviar confirmaciones de cita por email, teléfono o WhatsApp</li>
                <li>Cumplir con obligaciones legales federales de EE.UU., del estado de Kentucky, y requisitos del IRS y USCIS</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">3. Compartir Información</h2>
              <p><strong>NO</strong> vendemos, rentamos ni intercambiamos tu información personal. Solo compartimos datos con:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Autoridades legales o gubernamentales cuando la ley lo requiera</li>
                <li>Proveedores de servicio estrictamente necesarios (hosting, envío de email)</li>
                <li>Instituciones financieras únicamente para procesar declaraciones de impuestos cuando lo solicites</li>
              </ul>
              <p>Nunca compartimos tus datos con anunciantes ni plataformas de marketing.</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">4. Cookies y Rastreo</h2>
              <p>
                Este sitio <strong>NO</strong> usa cookies de rastreo, Google Analytics, Meta Pixel ni cookies
                publicitarias. Solo usamos cookies técnicas esenciales para el funcionamiento del sitio.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">5. Retención de Datos</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mensajes del formulario: hasta 2 años</li>
                <li>Documentos de impuestos: 7 años según requisitos del IRS</li>
                <li>Expedientes de casos de inmigración: según lineamientos del USCIS</li>
                <li>Registros notariales: según los Estatutos Revisados de Kentucky (KRS 423)</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">6. Tus Derechos</h2>
              <p>Puedes solicitar en cualquier momento acceso, corrección o eliminación de tu información personal (sujeto a los requisitos legales de retención anteriores).</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">7. Seguridad</h2>
              <p>
                Usamos cifrado HTTPS y encabezados de seguridad estándar de la industria. No almacenamos
                información de tarjetas de crédito en nuestro sitio.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">8. Privacidad de Menores</h2>
              <p>Este sitio no está dirigido a menores de 13 años.</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">9. Contacto</h2>
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
                This policy explains what information we collect and how we use it.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Contact Form Data:</strong> Name, email, phone number, and the message you send us.</li>
                <li><strong>Appointment Information:</strong> Service requested (notary, taxes, immigration, translations), preferred date and time.</li>
                <li><strong>Technical Data:</strong> Browser, approximate location, device type (collected automatically for security).</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Respond to inquiries and schedule appointments</li>
                <li>Provide notary, tax, immigration, or translation services</li>
                <li>Send appointment confirmations via email, phone, or WhatsApp</li>
                <li>Comply with U.S. federal law, Kentucky state law, IRS and USCIS requirements</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">3. Information Sharing</h2>
              <p>We do <strong>NOT</strong> sell, rent, or trade your personal information. We may share data only with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Legal or government authorities when required by law</li>
                <li>Service providers strictly necessary to operate (hosting, email delivery)</li>
                <li>Financial institutions only to process tax filings when you request that service</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">4. Cookies and Tracking</h2>
              <p>
                This website does <strong>NOT</strong> use tracking cookies, Google Analytics, Meta Pixel, or
                advertising cookies. We only use essential technical cookies required for the site to function.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">5. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contact form submissions: up to 2 years</li>
                <li>Tax documents: 7 years per IRS requirements</li>
                <li>Immigration case files: per USCIS guidelines</li>
                <li>Notary journal entries: per Kentucky Revised Statutes (KRS 423)</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">6. Your Rights</h2>
              <p>You may request access, correction, or deletion of your personal information (subject to legal retention requirements above).</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">7. Security</h2>
              <p>
                We use HTTPS encryption and industry-standard security headers. We do not store credit card
                information on our website.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">8. Children's Privacy</h2>
              <p>This site is not directed to children under 13.</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">9. Contact</h2>
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
