import Link from "next/link";

const services = [
  {
    href: "/taxes",
    icon: (
      <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Taxes",
    desc: "Taxes individuales y de corporación, taxes de negocios, venta y locales. Agente certificada y aceptada por el IRS.",
  },
  {
    href: "/notaria",
    icon: (
      <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Notaría Pública",
    desc: "Notario Público certificado. Autenticación de documentos, contratos, poderes notariales e interpretación.",
  },
  {
    href: "/inmigracion",
    icon: (
      <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Inmigración",
    desc: "Formularios de inmigración, clases de ciudadanía, pasaportes y trámites consulares.",
  },
  {
    href: "/negocios",
    icon: (
      <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Negocios",
    desc: "Registro y estructuración de negocios, contabilidad, nóminas, número de ITIN y licencias.",
  },
  {
    href: "/traducciones",
    icon: (
      <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: "Traducciones",
    desc: "Traducciones profesionales certificadas: títulos, notas académicas, certificados de nacimiento y más.",
  },
  {
    href: "/taxes",
    icon: (
      <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "Camioneros",
    desc: "Trámites especializados para camioneros: IRP, IFTA, KYU y registro de vehículos comerciales.",
  },
];

const stats = [
  { value: "15+", label: "Años de Experiencia" },
  { value: "IRS", label: "Agente Certificada" },
  { value: "100%", label: "Bilingüe" },
  { value: "24h", label: "Respuesta Rápida" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 600" className="w-full h-full">
            <circle cx="700" cy="100" r="300" fill="#C8A214" />
            <circle cx="100" cy="500" r="200" fill="#C5E8D5" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              <span className="text-gold text-sm font-medium">Agente Certificada y Aceptada por el IRS</span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              3-1 Notary A Plus
              <span className="block text-gold mt-2">Business & Tax Services</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              <span className="text-gold font-semibold">15 años</span> sirviendo a nuestra comunidad con dedicación y
              profesionalismo. Taxes, Notaría, Inmigración y más.
            </p>
            <p className="text-gray-400 mb-10">
              8514 Preston Hwy, Louisville, KY 40219 &nbsp;·&nbsp; Myrna Rodríguez
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/citas" className="btn-gold text-base">
                Agendar Cita Gratis
              </Link>
              <Link href="/servicios" className="btn-outline-white text-base">
                Ver Todos los Servicios
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-4xl font-bold text-gold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-mint-light py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">
              Ofrecemos una amplia gama de servicios profesionales para individuos, familias y negocios.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group">
                <div className="card h-full group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="service-icon">{s.icon}</div>
                  <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {s.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="text-gold font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver más
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Myrna */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-gold/10 text-gold font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
                Sobre Nosotros
              </div>
              <h2 className="section-title">Myrna Rodríguez</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Con más de <strong>15 años de experiencia</strong>, Myrna Rodríguez es una profesional certificada y aceptada
                por el IRS, dedicada a brindar servicios de alta calidad a la comunidad hispana de Louisville, Kentucky.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Su amplia experiencia abarca taxes individuales y de negocios, servicios notariales, trámites de
                inmigración, registro de empresas, traducciones profesionales y mucho más. Hablamos su idioma y
                entendemos sus necesidades.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Agente Certificada y Aceptada por el IRS",
                  "Notario Público Certificado",
                  "Intérprete Certificada",
                  "15+ años sirviendo a Louisville, KY",
                  "Atención bilingüe (Español e Inglés)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/citas" className="btn-gold inline-block">
                Agendar una Consulta
              </Link>
            </div>
            <div className="relative">
              <div className="bg-mint rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy/10 rounded-full translate-y-6 -translate-x-6"></div>
                <div className="relative text-center">
                  <div
                    className="w-32 h-32 bg-navy rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl"
                  >
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3
                    className="text-2xl font-bold text-navy mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Myrna Rodríguez
                  </h3>
                  <p className="text-gold font-semibold mb-1">Agente Certificada por el IRS</p>
                  <p className="text-gray-600 text-sm mb-6">Notario Público · Intérprete Certificada</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-navy" style={{ fontFamily: "'Playfair Display', serif" }}>15+</div>
                      <div className="text-xs text-gray-500">Años de Exp.</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-gold" style={{ fontFamily: "'Playfair Display', serif" }}>IRS</div>
                      <div className="text-xs text-gray-500">Certificada</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-navy">Horario:</span> Lun–Vie 10am–6pm · Sáb 10am–5pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ¿Listo para comenzar?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Agenda tu cita hoy mismo. Atención personalizada en español. Sin costo de consulta.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="btn-gold text-base px-8 py-4">
              Agendar Cita Ahora
            </Link>
            <a href="tel:5026547076" className="btn-outline-white text-base px-8 py-4">
              Llamar: (502) 654-7076
            </a>
          </div>
        </div>
      </section>

      {/* Map strip */}
      <section className="h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.4!2d-85.6521!3d38.1542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s8514+Preston+Hwy+Louisville+KY+40219!5e0!3m2!1ses!2sus!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación 3-1 Notary A Plus"
        ></iframe>
      </section>
    </>
  );
}
