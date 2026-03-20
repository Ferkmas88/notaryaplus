import Link from "next/link";

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contáctanos
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Estamos aquí para ayudarte. No dudes en llamarnos, escribirnos o visitarnos en nuestra oficina.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-mint-light py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Phone */}
            <div className="card text-center">
              <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Teléfonos</h3>
              <div className="space-y-2">
                <a href="tel:5026547076" className="block text-gray-700 hover:text-gold transition-colors font-medium">
                  (502) 654-7076 — Oficina
                </a>
                <a href="tel:5026441312" className="block text-gray-700 hover:text-gold transition-colors font-medium">
                  (502) 644-1312 — Cell
                </a>
                <a href="tel:5028904772" className="block text-gray-700 hover:text-gold transition-colors font-medium">
                  (502) 890-4772
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="card text-center">
              <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Correo Electrónico</h3>
              <a
                href="mailto:notaryaplus3_1@yahoo.com"
                className="text-gray-700 hover:text-gold transition-colors font-medium break-all"
              >
                notaryaplus3_1@yahoo.com
              </a>
              <p className="text-xs text-gray-500 mt-2">Respondemos en menos de 24 horas</p>
            </div>

            {/* Location */}
            <div className="card text-center">
              <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Dirección</h3>
              <p className="text-gray-700 font-medium">8514 Preston Hwy</p>
              <p className="text-gray-700 font-medium">Louisville, KY 40219</p>
              <a
                href="https://maps.google.com/?q=8514+Preston+Hwy+Louisville+KY+40219"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold text-sm mt-2 inline-block hover:underline"
              >
                Ver en Google Maps →
              </a>
            </div>
          </div>

          {/* Hours + Social + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hours */}
            <div className="card">
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Horario de Atención
              </h3>
              <div className="space-y-3">
                {[
                  { day: "Lunes", hours: "10:00 AM – 6:00 PM", open: true },
                  { day: "Martes", hours: "10:00 AM – 6:00 PM", open: true },
                  { day: "Miércoles", hours: "10:00 AM – 6:00 PM", open: true },
                  { day: "Jueves", hours: "10:00 AM – 6:00 PM", open: true },
                  { day: "Viernes", hours: "10:00 AM – 6:00 PM", open: true },
                  { day: "Sábado", hours: "10:00 AM – 5:00 PM", open: true },
                  { day: "Domingo", hours: "Cerrado", open: false },
                ].map((item) => (
                  <div key={item.day} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-gray-700">{item.day}</span>
                    <span className={`text-sm ${item.open ? "text-navy font-medium" : "text-gray-400"}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social + CTA */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Redes Sociales
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://www.facebook.com/groups/828107437233604"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Facebook</p>
                      <p className="text-xs text-gray-500">3-1 Notary A Plus</p>
                    </div>
                  </a>
                  <a
                    href="https://www.facebook.com/myrna.chacon.1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Facebook Personal</p>
                      <p className="text-xs text-gray-500">Myrna Chacón</p>
                    </div>
                  </a>
                  <a
                    href="https://www.instagram.com/myrna.chacon.1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="17.5" cy="6.5" r="1.5"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Instagram</p>
                      <p className="text-xs text-gray-500">@myrna.chacon.1</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="card bg-gold/10 border border-gold/30">
                <h3 className="text-lg font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ¿Prefieres agendar una cita?
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Selecciona el servicio, la fecha y el horario que mejor te convenga.
                </p>
                <Link href="/citas" className="btn-gold block text-center w-full">
                  Agendar Cita Online
                </Link>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md h-80 lg:h-auto min-h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143!2d-85.6521!3d38.1542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s8514+Preston+Hwy+Louisville+KY+40219!5e0!3m2!1ses!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "256px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="3-1 Notary A Plus — Ubicación"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
