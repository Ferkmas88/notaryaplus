import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Traducciones Certificadas Louisville KY | Español e Inglés",
  description:
    "Traducciones profesionales y certificadas en Louisville, KY. Títulos universitarios, certificados de nacimiento, documentos legales. Español-Inglés. Llama al 502-654-7076.",
  keywords: [
    "traducciones louisville ky",
    "traducciones certificadas louisville",
    "translation services louisville",
    "traductor espanol ingles louisville",
    "traduccion documentos legales louisville",
    "traduccion titulo universitario louisville",
    "certified translation louisville kentucky",
  ],
  alternates: { canonical: "/traducciones" },
};

const translationServices = [
  {
    title: "Traducciones Profesionales",
    desc: "Traducciones precisas y profesionales del español al inglés y del inglés al español. Nuestras traducciones son realizadas por traductoras certificadas.",
    items: [
      "Documentos personales y familiares",
      "Contratos y documentos legales",
      "Documentos médicos",
      "Cartas y comunicaciones oficiales",
      "Documentos para inmigración",
      "Manuales y materiales de negocio",
    ],
  },
  {
    title: "Títulos y Certificados Académicos",
    desc: "Traducción oficial de títulos universitarios, diplomas y certificados académicos para uso en Estados Unidos u otros países.",
    items: [
      "Títulos universitarios",
      "Diplomas de bachillerato",
      "Certificados de cursos y capacitaciones",
      "Transcripciones académicas",
      "Certificación de equivalencias",
    ],
  },
  {
    title: "Certificación de Notas Académicas",
    desc: "Traducción y certificación de historial académico (notas/calificaciones) para reconocimiento en instituciones educativas de EE.UU.",
    items: [
      "Record académico completo",
      "Notas de educación primaria y secundaria",
      "Notas universitarias y postgrado",
      "Formato estándar americano",
      "Certificación de autenticidad",
    ],
  },
  {
    title: "Certificados de Nacimiento y Documentos Vitales",
    desc: "Traducción certificada de documentos del estado civil para trámites de inmigración, consulados y uso legal.",
    items: [
      "Actas de nacimiento",
      "Actas de matrimonio",
      "Actas de divorcio",
      "Actas de defunción",
      "Documentos de identidad",
    ],
  },
];

export default function TraduccionesPage() {
  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Inicio</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">Traducciones</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Traducciones Profesionales
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Traducciones precisas y certificadas de documentos personales, académicos y legales. Español ↔ Inglés.
              Reconocidas por consulados, universidades y entidades gubernamentales.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: "🎯", title: "Precisión Garantizada", desc: "Cada traducción es revisada por un profesional antes de entregarse." },
              { icon: "⚡", title: "Entrega Rápida", desc: "La mayoría de documentos listos en 24-48 horas hábiles." },
              { icon: "✅", title: "Traducción Certificada", desc: "Incluye carta de certificación del traductor cuando se requiere." },
            ].map((item) => (
              <div key={item.title} className="card text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {translationServices.map((service, i) => (
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

          <div className="mt-8 bg-white border border-mint rounded-2xl p-6">
            <h3 className="text-lg font-bold text-navy mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¿Cómo funciona el proceso?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { step: "1", text: "Trae o envía tu documento original" },
                { step: "2", text: "Evaluamos y cotizamos tu traducción" },
                { step: "3", text: "Realizamos la traducción profesional" },
                { step: "4", text: "Entregamos la traducción certificada" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-navy text-gold rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <p className="text-sm text-gray-700 pt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Necesitas una traducción?
          </h2>
          <p className="text-gray-300 mb-8">
            Agenda tu cita o contáctanos directamente. Entrega rápida y precios accesibles.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="btn-gold text-base px-8 py-4">
              Agendar Cita
            </Link>
            <a href="tel:5026547076" className="btn-outline-white text-base px-8 py-4">
              Llamar Ahora
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
