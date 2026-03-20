import Link from "next/link";

const taxServices = [
  {
    title: "Taxes Individuales",
    desc: "Preparación de declaraciones de impuestos para individuos y familias. Maximizamos tu reembolso y aseguramos el cumplimiento con el IRS.",
    items: [
      "Federal y Estatal",
      "Residentes y No Residentes",
      "Múltiples fuentes de ingreso",
      "Deducciones maximizadas",
      "Representación ante el IRS",
    ],
    docs: ["W-2, 1099s", "ID o pasaporte", "Número de Seguro Social o ITIN", "Comprobantes de deducciones"],
  },
  {
    title: "Taxes de Corporación y Negocios",
    desc: "Declaraciones de impuestos para LLC, corporations, sole proprietorships y partnerships. Cumplimiento total con las regulaciones federales y estatales.",
    items: [
      "LLC, Corp, S-Corp, Partnership",
      "Taxes de Nómina (Payroll)",
      "Taxes Estimados Trimestrales",
      "Planificación Fiscal",
      "Resolución de problemas con el IRS",
    ],
    docs: ["EIN del negocio", "Estados financieros del año", "Registros de gastos", "Extractos bancarios"],
  },
  {
    title: "Taxes de Venta y Locales",
    desc: "Manejo de impuestos sobre ventas y impuestos locales para negocios que operan en Kentucky y otros estados.",
    items: [
      "Sales Tax de Kentucky",
      "Taxes de la Ciudad de Louisville",
      "Reporte y declaración mensual/trimestral",
      "Registro de Sales Tax",
    ],
    docs: [],
  },
  {
    title: "Trámites para Camioneros (IRP, IFTA, KYU)",
    desc: "Servicios especializados para propietarios de vehículos comerciales y camioneros independientes.",
    items: [
      "IRP — International Registration Plan",
      "IFTA — International Fuel Tax Agreement",
      "KYU — Kentucky Unified Carrier Registration",
      "Renovaciones anuales",
      "Nuevos registros y transferencias",
    ],
    docs: ["Título del vehículo", "DOT Number", "Registros de millaje por estado", "Registros de combustible"],
  },
];

export default function TaxesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Inicio</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">Taxes</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Servicios de Taxes
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Agente certificada y aceptada por el IRS. 15 años de experiencia preparando taxes individuales, corporativos
              y trámites especializados para camioneros.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-mint-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start shadow-sm border border-mint">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¿Por qué elegirnos para tus taxes?
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Myrna Rodríguez es una agente certificada y aceptada por el IRS con más de 15 años de experiencia.
                Preparamos tus impuestos con precisión, maximizamos tu reembolso y te representamos ante el IRS si
                es necesario. Atención completamente en español.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                Certificada por el IRS
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                15+ años de experiencia
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                Atención en español
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services detail */}
      <section className="bg-mint-light pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-8">
            {taxServices.map((service, i) => (
              <div key={service.title} className="card">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-navy" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{service.desc}</p>
                    <ul className="space-y-2">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {service.docs.length > 0 && (
                    <div className="bg-mint-light rounded-xl p-4">
                      <h4 className="font-semibold text-navy mb-3 text-sm">Documentos Necesarios:</h4>
                      <ul className="space-y-2">
                        {service.docs.map((doc) => (
                          <li key={doc} className="text-sm text-gray-600 flex items-start gap-2">
                            <svg className="w-3 h-3 text-navy mt-1 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Listo para hacer tus taxes?
          </h2>
          <p className="text-gray-300 mb-8">
            Agenda tu cita hoy. Te ayudamos a maximizar tu reembolso y cumplir con todos los requisitos del IRS.
          </p>
          <Link href="/citas" className="btn-gold text-base px-8 py-4">
            Agendar Cita Ahora
          </Link>
        </div>
      </section>
    </>
  );
}
