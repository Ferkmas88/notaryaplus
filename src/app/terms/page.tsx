"use client";

import { useLang } from "@/contexts/LangContext";

export default function TermsPage() {
  const { lang } = useLang();
  const isES = lang === "es";

  return (
    <main className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {isES ? "Términos de Servicio" : "Terms of Service"}
          </h1>
          <p className="text-sm text-gray-500">
            {isES ? "Última actualización: 13 de Abril, 2026" : "Last updated: April 13, 2026"}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
          {isES ? (
            <>
              <p>
                Al usar <strong>notaryaplus.com</strong> y los servicios de 3-1 Notary A Plus, aceptas estos
                Términos.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">1. Servicios Ofrecidos</h2>
              <p>
                Brindamos servicios de notario público, preparación de impuestos, asistencia con formas de
                inmigración y traducciones de documentos en Louisville, Kentucky.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">2. No Somos Asesores Legales</h2>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded">
                <p>
                  3-1 Notary A Plus <strong>no es un bufete de abogados</strong> y no ofrece asesoría legal.
                  Nuestros servicios incluyen llenar formularios y notarizar documentos, pero no podemos dar
                  consejo legal. Para asesoría legal, consulta a un abogado con licencia.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">3. Responsabilidades del Cliente</h2>
              <p>
                Aceptas proporcionar información precisa y completa. Eres responsable de la veracidad de
                cualquier documento que firmes. Proporcionar información falsa puede resultar en sanciones
                penales bajo ley federal y estatal.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">4. Tarifas y Pago</h2>
              <p>
                Todas las tarifas se informan antes del servicio. Las tarifas de notario siguen el máximo
                permitido por ley de Kentucky. Las tarifas de impuestos y traducciones se cotizan por caso.
                El pago se debe al momento del servicio salvo acuerdo contrario.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">5. Citas y Cancelaciones</h2>
              <p>
                Las citas se agendan por teléfono, WhatsApp o formulario de contacto. Las cancelaciones deben
                hacerse con al menos 24 horas de anticipación.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">6. Limitación de Responsabilidad</h2>
              <p>
                Nuestra responsabilidad se limita al monto pagado por el servicio específico. No somos
                responsables por demoras causadas por agencias gubernamentales (IRS, USCIS, cortes).
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">7. Ley Aplicable</h2>
              <p>
                Estos Términos se rigen por las leyes de la Mancomunidad de Kentucky, Estados Unidos.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">8. Contacto</h2>
              <address className="not-italic">
                Email: <a href="mailto:notaryaplus31@gmail.com" className="text-gold hover:underline">notaryaplus31@gmail.com</a><br />
                Teléfono: (502) 654-7076
              </address>
            </>
          ) : (
            <>
              <p>
                By using <strong>notaryaplus.com</strong> and the services of 3-1 Notary A Plus, you agree to
                these Terms.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">1. Services Offered</h2>
              <p>
                We provide notary public services, tax preparation, immigration form assistance, and document
                translations in Louisville, Kentucky.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">2. Not Legal Advice</h2>
              <div className="bg-gold/10 border-l-4 border-gold p-4 rounded">
                <p>
                  3-1 Notary A Plus is <strong>not a law firm</strong> and does not provide legal advice. Our
                  services include filling out forms and notarizing documents, but we cannot advise on legal
                  strategy. For legal advice, consult a licensed attorney.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">3. Client Responsibilities</h2>
              <p>
                You agree to provide accurate, complete information. You are responsible for the truthfulness
                of any document you sign. Providing false information may result in criminal penalties under
                federal and state law.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">4. Fees and Payment</h2>
              <p>
                All fees are disclosed before service. Notary fees follow the maximum allowed by Kentucky law.
                Tax preparation and translation fees are quoted per case. Payment is due at time of service
                unless otherwise agreed.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">5. Appointments and Cancellations</h2>
              <p>
                Appointments can be scheduled by phone, WhatsApp, or the contact form. Cancellations should
                be made at least 24 hours in advance.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">6. Limitation of Liability</h2>
              <p>
                Our liability is limited to the amount paid for the specific service. We are not liable for
                delays caused by government agencies (IRS, USCIS, courts).
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">7. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the Commonwealth of Kentucky, United States.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-3">8. Contact</h2>
              <address className="not-italic">
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
