import Link from "next/link";

const notaryServices = [
  {
    title: "Notario Público Certificado",
    desc: "Certificación y autenticación de documentos legales ante la ley. Myrna Rodríguez es Notario Público certificado en el estado de Kentucky.",
    items: [
      "Autenticación de firmas",
      "Certificación de documentos",
      "Juramentos y declaraciones juradas",
      "Poderes notariales (Power of Attorney)",
      "Contratos y acuerdos",
      "Documentos para trámites gubernamentales",
    ],
  },
  {
    title: "Intérprete Certificada",
    desc: "Servicios de interpretación profesional para trámites legales, médicos, laborales y personales. Interpretación en inglés y español.",
    items: [
      "Interpretación en citas médicas",
      "Interpretación en trámites legales",
      "Interpretación en reuniones de trabajo",
      "Interpretación de contratos",
      "Apoyo en audiencias judiciales (con autorización)",
    ],
  },
  {
    title: "Documentos Consulares",
    desc: "Asistencia con documentos que requieren autenticación notarial para uso en consulados y embajadas.",
    items: [
      "Apostillas y legalizaciones",
      "Documentos para consulados",
      "Poderes para trámites en el extranjero",
      "Cartas de autorización",
      "Declaraciones notariales",
    ],
  },
];

export default function NotariaPage() {
  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Inicio</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">Notaría</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Notaría Pública
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Notario Público e Intérprete Certificada al servicio de la comunidad en Louisville, KY. Autenticamos
              tus documentos con la validez legal que necesitas.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-mint mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Documentos con validez legal garantizada
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Un documento notariado tiene plena validez legal en Estados Unidos y puede ser reconocido
                  internacionalmente. Nuestros servicios de notaría son rápidos, confiables y completamente en español.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {notaryServices.map((service, i) => (
              <div key={service.title} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-navy" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{service.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gold/10 border border-gold/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¿Qué traer para su cita?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Identificación válida (ID, pasaporte o licencia de conducir)",
                "Los documentos originales que desea notarizar",
                "NO firme los documentos antes de la cita",
                "Si requiere testigos, puede traerlos con ID válida",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Necesitas un documento notariado
          </h2>
          <p className="text-gray-300 mb-8">
            Agenda tu cita hoy. Proceso rápido y profesional, completamente en español.
          </p>
          <Link href="/citas" className="btn-gold text-base px-8 py-4">
            Agendar Cita
          </Link>
        </div>
      </section>
    </>
  );
}
