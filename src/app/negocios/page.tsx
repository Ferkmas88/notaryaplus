import Link from "next/link";

const businessServices = [
  {
    title: "Registro y Estructuración de Negocios",
    desc: "Te ayudamos a constituir tu negocio de forma legal y correcta en Kentucky. Elegimos juntos la estructura más conveniente para ti.",
    items: [
      "LLC (Limited Liability Company)",
      "Sole Proprietorship",
      "Corporation (C-Corp / S-Corp)",
      "Partnership",
      "Registro con el estado de Kentucky",
      "Obtención del EIN (Tax ID del negocio)",
    ],
    docs: ["Identificación válida", "Nombre del negocio deseado", "Dirección del negocio", "Socios (si aplica)"],
  },
  {
    title: "Contabilidad y Nóminas",
    desc: "Mantén tus finanzas en orden y cumple con todas las obligaciones fiscales de tu pequeña empresa.",
    items: [
      "Contabilidad mensual/trimestral",
      "Nóminas de pago (Payroll)",
      "Reportes financieros",
      "Conciliaciones bancarias",
      "Preparación para declaración de taxes",
      "Registros de gastos e ingresos",
    ],
    docs: [],
  },
  {
    title: "Número de ITIN",
    desc: "¿No tienes número de Seguro Social? El ITIN te permite cumplir con tus obligaciones fiscales y acceder a beneficios.",
    items: [
      "Aplicación inicial de ITIN (W-7)",
      "Renovación de ITIN vencido",
      "ITIN para dependientes",
      "Preparación y envío de formularios",
      "Seguimiento de la solicitud",
    ],
    docs: [
      "Pasaporte original o certificado de nacimiento con foto",
      "Formulario W-7 completado",
      "Declaración de taxes del año corriente",
    ],
  },
  {
    title: "Licencias y Permisos",
    desc: "Obtén todas las licencias necesarias para operar tu negocio legalmente en Louisville y Kentucky.",
    items: [
      "Licencia de negocio de Louisville",
      "Permisos estatales de Kentucky",
      "Registro de Sales Tax",
      "Licencias de industrias específicas",
      "Renovaciones anuales",
    ],
    docs: [],
  },
];

export default function NegociosPage() {
  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Inicio</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">Negocios</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Servicios para Negocios
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Todo lo que necesitas para iniciar, registrar y mantener tu negocio en orden. Asesoría completa en español
              para emprendedores y pequeñas empresas en Louisville, KY.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-10 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-6">
            {businessServices.map((service, i) => (
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
                  {service.docs.length > 0 && (
                    <div className="bg-mint-light rounded-xl p-4 border border-mint">
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

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Listo para iniciar tu negocio?
          </h2>
          <p className="text-gray-300 mb-8">
            Te acompañamos desde el primer paso. Agenda una consulta sin costo.
          </p>
          <Link href="/citas" className="btn-gold text-base px-8 py-4">
            Agendar Consulta
          </Link>
        </div>
      </section>
    </>
  );
}
