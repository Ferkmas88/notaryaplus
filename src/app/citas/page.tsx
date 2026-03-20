"use client";

import { useState, useEffect } from "react";

const SERVICES = [
  { value: "taxes_individual", label: "Taxes Individuales" },
  { value: "taxes_negocio", label: "Taxes de Negocio / Corporación" },
  { value: "taxes_camionero", label: "Trámites para Camioneros (IRP/IFTA/KYU)" },
  { value: "notaria", label: "Notaría Pública" },
  { value: "inmigracion", label: "Inmigración / Formularios" },
  { value: "ciudadania", label: "Clases de Ciudadanía" },
  { value: "pasaporte", label: "Pasaporte Cubano/Americano" },
  { value: "negocios", label: "Registro / Estructuración de Negocios" },
  { value: "itin", label: "Número de ITIN" },
  { value: "contabilidad", label: "Contabilidad y Nóminas" },
  { value: "traducciones", label: "Traducciones Profesionales" },
  { value: "otro", label: "Otro / Consulta General" },
];

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function getTodayStr(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

type Step = "service" | "datetime" | "info" | "success";

export default function CitasPage() {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");

  useEffect(() => {
    if (!date) return;

    const dayOfWeek = new Date(date + "T12:00:00").getDay();
    if (dayOfWeek === 0) {
      setAvailableSlots([]);
      setBookedSlots([]);
      return;
    }

    setLoadingSlots(true);
    setTime("");
    fetch(`/backend/citas.php?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
        setBookedSlots(data.bookedTimes || []);
      })
      .catch(() => {
        setAvailableSlots([]);
        setBookedSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/backend/citas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, service, date, time, notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al agendar la cita. Intenta nuevamente.");
        if (res.status === 409) {
          // Slot taken — refresh slots
          const refreshRes = await fetch(`/backend/citas.php?date=${date}`);
          const refreshData = await refreshRes.json();
          setBookedSlots(refreshData.bookedTimes || []);
          setTime("");
        }
      } else {
        setSuccessId(data.id);
        setStep("success");
      }
    } catch {
      setError("Error de conexión. Verifica tu internet e intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedService = SERVICES.find((s) => s.value === service);
  const isDayOff = date ? new Date(date + "T12:00:00").getDay() === 0 : false;

  if (step === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-mint-light px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¡Cita Agendada!
          </h1>
          <p className="text-gray-700 mb-2">
            Tu cita fue registrada exitosamente. Recibirás una confirmación por email.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            ID de cita: <strong className="text-navy">{successId}</strong>
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-mint text-left mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Servicio:</span>
                <span className="font-medium text-navy">{selectedService?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-medium">{new Date(date + "T12:00:00").toLocaleDateString("es-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hora:</span>
                <span className="font-medium">{formatTime12h(time)}</span>
              </div>
            </div>
          </div>
          <div className="bg-navy/5 rounded-xl p-4 text-sm text-gray-700 text-left mb-6">
            <p className="font-semibold text-navy mb-1">Recordatorio:</p>
            <p>8514 Preston Hwy, Louisville, KY 40219</p>
            <p>(502) 654-7076 | (502) 644-1312</p>
            <p className="text-xs text-gray-500 mt-2">Si necesitas cancelar o cambiar tu cita, llámanos con al menos 24 horas de anticipación.</p>
          </div>
          <a href="/" className="btn-gold inline-block">
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Agenda tu Cita
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Selecciona el servicio, la fecha y la hora disponible. Sin costo de consulta.
          </p>
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {(["service", "datetime", "info"] as Step[]).map((s, i) => {
              const labels = ["Servicio", "Fecha y Hora", "Tus Datos"];
              const stepIndex = ["service", "datetime", "info"].indexOf(step);
              const isCompleted = i < stepIndex;
              const isActive = step === s;
              return (
                <div key={s} className="flex items-center gap-2">
                  {i > 0 && <div className={`w-8 h-0.5 ${isCompleted ? "bg-gold" : "bg-gray-600"}`}></div>}
                  <div className={`flex items-center gap-2 ${isActive ? "" : ""}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${isCompleted ? "bg-gold text-white" : isActive ? "bg-white text-navy" : "bg-navy-light text-gray-400 border border-gray-600"}`}>
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    <span className={`text-sm hidden sm:block ${isActive ? "text-white font-medium" : "text-gray-400"}`}>
                      {labels[i]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-12">
        <div className="max-w-2xl mx-auto px-4">

          {/* Step 1: Service */}
          {step === "service" && (
            <div className="card">
              <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¿Qué servicio necesitas?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { setService(s.value); setStep("datetime"); }}
                    className={`text-left p-4 rounded-xl border-2 transition-all text-sm font-medium
                      ${service === s.value
                        ? "border-gold bg-gold/10 text-navy"
                        : "border-gray-200 bg-white hover:border-gold hover:bg-gold/5 text-gray-700"
                      }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === "datetime" && (
            <div className="card">
              <button
                onClick={() => setStep("service")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy mb-4 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Cambiar servicio
              </button>

              <div className="bg-mint/50 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span className="text-sm font-medium text-navy">{selectedService?.label}</span>
              </div>

              <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Selecciona Fecha y Hora
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                />
                {isDayOff && (
                  <p className="text-red-600 text-sm mt-2">
                    No atendemos los domingos. Por favor selecciona otro día.
                  </p>
                )}
                {date && !isDayOff && (
                  <p className="text-xs text-gray-500 mt-1">
                    Horario: {new Date(date + "T12:00:00").getDay() === 6 ? "10:00 AM – 5:00 PM" : "10:00 AM – 6:00 PM"}
                  </p>
                )}
              </div>

              {date && !isDayOff && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Hora disponible</label>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                      Cargando horarios...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay horarios disponibles para este día.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = time === slot;
                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setTime(slot)}
                            className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all
                              ${isBooked
                                ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                                : isSelected
                                  ? "border-gold bg-gold text-white shadow-md"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gold hover:bg-gold/5"
                              }`}
                          >
                            {formatTime12h(slot)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep("info")}
                disabled={!date || !time || isDayOff}
                className="w-full btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 3: Personal Info */}
          {step === "info" && (
            <div className="card">
              <button
                onClick={() => setStep("datetime")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy mb-4 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Cambiar horario
              </button>

              {/* Summary */}
              <div className="bg-navy rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Servicio</p>
                    <p className="text-white font-medium text-xs leading-tight">{selectedService?.label}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Fecha</p>
                    <p className="text-white font-medium text-xs">
                      {new Date(date + "T12:00:00").toLocaleDateString("es-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Hora</p>
                    <p className="text-gold font-bold text-sm">{formatTime12h(time)}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tus Datos
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(502) 000-0000"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Correo electrónico <span className="text-gray-400 font-normal">(opcional, para confirmación)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@email.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Notas adicionales <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="¿Hay algo importante que debamos saber antes de tu cita?"
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700 resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-gold py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Agendando...
                    </>
                  ) : (
                    "Confirmar Cita"
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  Al agendar tu cita aceptas ser contactado por 3-1 Notary A Plus para confirmar o reprogramar si es necesario.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Info strip */}
      <section className="bg-white py-10 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold text-navy mb-1">Sin Costos Ocultos</h3>
              <p className="text-sm text-gray-600">La consulta inicial no tiene costo. Solo pagas por el servicio.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🌎</div>
              <h3 className="font-semibold text-navy mb-1">Atención en Español</h3>
              <p className="text-sm text-gray-600">Todo el proceso de principio a fin en tu idioma.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold text-navy mb-1">Fácil de Llegar</h3>
              <p className="text-sm text-gray-600">8514 Preston Hwy, Louisville, KY 40219. Estacionamiento disponible.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
