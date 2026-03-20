import Link from "next/link";

const allServices = [
  {
    href: "/taxes",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    title: "Taxes",
    items: [
      "Taxes Individuales",
      "Taxes de Corporación",
      "Taxes de Negocios",
      "Taxes de Venta",
      "Taxes Locales",
      "IRP · IFTA · KYU (Camioneros)",
    ],
  },
  {
    href: "/notaria",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
    title: "Notaría Pública",
    items: [
      "Notario Público Certificado",
      "Autenticación de Documentos",
      "Contratos y Poderes Notariales",
      "Interpretación Oficial",
      "Certificación de Firmas",
    ],
  },
  {
    href: "/inmigracion",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    title: "Inmigración",
    items: [
      "Llenado de Formularios de Inmigración",
      "Clases de Ciudadanía",
      "Pasaporte Cubano/Americano",
      "Trámites Consulares",
      "Servicios de Interpretación",
      "Renovación de Documentos",
    ],
  },
  {
    href: "/negocios",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
    title: "Negocios",
    items: [
      "Registro de Negocios",
      "Estructuración Empresarial",
      "Contabilidad y Nóminas",
      "Número de ITIN",
      "Licencias y Permisos",
    ],
  },
  {
    href: "/traducciones",
    color: "bg-teal-50 border-teal-200",
    iconBg: "bg-teal-100",
    title: "Traducciones",
    items: [
      "Traducciones Profesionales",
      "Certificación de Notas",
      "Títulos Universitarios",
      "Certificados de Nacimiento",
      "Documentos Legales",
    ],
  },
];

export default function ServiciosPage() {
  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Todos Nuestros Servicios
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Soluciones profesionales para individuos, familias y negocios en Louisville, KY
          </p>
        </div>
      </section>

      <section className="bg-mint-light py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((s) => (
              <Link key={s.title} href={s.href} className="group">
                <div className={`card border ${s.color} h-full group-hover:-translate-y-1 transition-transform`}>
                  <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {s.title}
                  </h3>
                  <ul className="space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-gold font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver detalle
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-gray-300 mb-8">
            Contáctanos directamente. Estamos aquí para ayudarte con cualquier trámite.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="btn-gold">Agendar Cita</Link>
            <Link href="/contacto" className="btn-outline-white">Contactarnos</Link>
          </div>
        </div>
      </section>
    </>
  );
}
