import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servicios de Inmigración Louisville KY | Formularios y Ciudadanía",
  description:
    "Llenado de formularios de inmigración, clases de ciudadanía, pasaporte cubano y americano, trámites consulares e interpretación en Louisville, KY. Llama al 502-654-7076.",
  keywords: [
    "inmigración louisville ky",
    "formularios inmigración louisville",
    "clases ciudadania louisville",
    "pasaporte cubano louisville",
    "tramites consulares louisville",
    "immigration forms louisville kentucky",
    "servicios inmigracion hispanos louisville",
    "DACA louisville",
  ],
  alternates: { canonical: "/inmigracion" },
};

const immigrationServices = [
  {
    title: "Llenado de Formularios de Inmigración",
    desc: "Te ayudamos a completar correctamente los formularios del USCIS (a petición del cliente). Un error en los formularios puede causar retrasos o rechazos.",
    items: [
      "Formularios de residencia (a petición del cliente)",
      "Renovación de documentos migratorios",
      "Formularios de familia",
      "Solicitudes de permiso de trabajo",
      "Revisión de formularios antes de envío",
    ],
    note: "Importante: Nuestro servicio es de asistencia en el llenado de formularios, a petición del cliente. No somos abogados de inmigración.",
  },
  {
    title: "Clases de Ciudadanía",
    desc: "Prepárate para tu examen de naturalización con nuestras clases personalizadas. Te enseñamos las 100 preguntas del examen de ciudadanía de forma clara y en español.",
    items: [
      "Las 100 preguntas del examen cívico",
      "Historia y gobierno de EE.UU.",
      "Práctica de inglés básico para el examen",
      "Simulacros de entrevista",
      "Clases individuales y grupales disponibles",
    ],
    note: null,
  },
  {
    title: "Pasaporte Cubano y Americano",
    desc: "Asistencia completa para el proceso de solicitud y renovación de pasaportes.",
    items: [
      "Solicitud de pasaporte americano (nuevo)",
      "Renovación de pasaporte americano",
      "Asistencia con pasaporte cubano",
      "Llenado de formularios DS-11 y DS-82",
      "Orientación sobre requisitos y costos",
    ],
    note: null,
  },
  {
    title: "Trámites Consulares",
    desc: "Asistencia con trámites ante consulados de Cuba, México y otros países latinoamericanos.",
    items: [
      "Poderes notariales para uso en el extranjero",
      "Apostillas y legalizaciones",
      "Cartas de autorización consular",
      "Orientación sobre trámites específicos",
      "Traducción de documentos para consulados",
    ],
    note: null,
  },
  {
    title: "Servicios de Interpretación e Inmigración",
    desc: "Apoyo con interpretación en citas de inmigración, entrevistas y trámites donde se requiera comunicación en inglés.",
    items: [
      "Interpretación en citas del USCIS",
      "Apoyo en entrevistas de residencia",
      "Interpretación en audiencias (con autorización)",
      "Traducción de documentos al inglés",
      "Apoyo general en trámites migratorios",
    ],
    note: null,
  },
];

export default function InmigracionPage() {
  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Inicio</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">Inmigración</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Servicios de Inmigración
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Te acompañamos en cada paso de tu proceso migratorio. Desde formularios hasta clases de ciudadanía,
              estamos aquí para ayudarte en español.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-10 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-6">
            {immigrationServices.map((service, i) => (
              <div key={service.title} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-navy" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{service.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {service.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
                {service.note && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                    <strong>Nota:</strong> {service.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Comenzá tu trámite migratorio hoy
          </h2>
          <p className="text-gray-300 mb-8">
            Estamos para ayudarte. Agenda una cita y te orientamos paso a paso.
          </p>
          <Link href="/citas" className="btn-gold text-base px-8 py-4">
            Agendar Cita
          </Link>
        </div>
      </section>
    </>
  );
}
