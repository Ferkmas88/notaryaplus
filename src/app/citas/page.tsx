"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function getMinDate(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

type Step = "service" | "datetime" | "info" | "success";

export default function CitasPage() {
  const { lang } = useLang();
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

  const SERVICES = [
    { value: "taxes_individual", label: t("citas.svc.taxes_individual", lang) },
    { value: "taxes_negocio", label: t("citas.svc.taxes_negocio", lang) },
    { value: "taxes_camionero", label: t("citas.svc.taxes_camionero", lang) },
    { value: "notaria", label: t("citas.svc.notaria", lang) },
    { value: "inmigracion", label: t("citas.svc.inmigracion", lang) },
    { value: "ciudadania", label: t("citas.svc.ciudadania", lang) },
    { value: "pasaporte", label: t("citas.svc.pasaporte", lang) },
    { value: "negocios", label: t("citas.svc.negocios", lang) },
    { value: "itin", label: t("citas.svc.itin", lang) },
    { value: "contabilidad", label: t("citas.svc.contabilidad", lang) },
    { value: "traducciones", label: t("citas.svc.traducciones", lang) },
    { value: "otro", label: t("citas.svc.otro", lang) },
  ];

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
        let slots = data.availableSlots || [];
        // Si es hoy, filtrar horas que ya pasaron
        const today = new Date().toISOString().split("T")[0];
        if (date === today) {
          const nowHour = new Date().getHours();
          slots = slots.filter((s: string) => parseInt(s.split(":")[0]) > nowHour);
        }
        setAvailableSlots(slots);
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
        setError(data.error || t("citas.error.generic", lang));
        if (res.status === 409) {
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
      setError(t("citas.error.connection", lang));
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
            {t("citas.success.title", lang)}
          </h1>
          <p className="text-gray-700 mb-2">
            {t("citas.success.desc", lang)}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {t("citas.success.id", lang)} <strong className="text-navy">{successId}</strong>
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-mint text-left mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t("citas.summary.service", lang)}:</span>
                <span className="font-medium text-navy">{selectedService?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("citas.summary.date", lang)}:</span>
                <span className="font-medium">{new Date(date + "T12:00:00").toLocaleDateString("es-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("citas.summary.time", lang)}:</span>
                <span className="font-medium">{formatTime12h(time)}</span>
              </div>
            </div>
          </div>
          <div className="bg-navy/5 rounded-xl p-4 text-sm text-gray-700 text-left mb-6">
            <p className="font-semibold text-navy mb-1">{t("citas.success.reminder.title", lang)}</p>
            <p>8514 Preston Hwy, Louisville, KY 40219</p>
            <p>(502) 654-7076 | (502) 644-1312</p>
            <p className="text-xs text-gray-500 mt-2">{t("citas.success.cancel", lang)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((selectedService?.label || "Cita") + " — 3-1 Notary A Plus")}&dates=${date.replace(/-/g, "")}T${time.replace(":", "")}00/${date.replace(/-/g, "")}T${String(parseInt(time.split(":")[0]) + 1).padStart(2, "0")}${time.split(":")[1]}00&details=${encodeURIComponent("Cita en 3-1 Notary A Plus\nServicio: " + (selectedService?.label || "") + "\nID: " + successId + "\nTeléfono: (502) 654-7076")}&location=${encodeURIComponent("8514 Preston Hwy, Louisville, KY 40219")}&ctz=America/Kentucky/Louisville`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-navy text-navy font-semibold px-6 py-3 rounded-full text-sm hover:bg-navy hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t("citas.success.addcalendar", lang)}
            </a>
            <a href="/" className="btn-gold inline-block px-6 py-3">
              {t("citas.success.back", lang)}
            </a>
          </div>
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
            {t("citas.hero.title", lang)}
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            {t("citas.hero.desc", lang)}
          </p>
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {(["service", "datetime", "info"] as Step[]).map((s, i) => {
              const labels = [t("citas.step1.label", lang), t("citas.step2.label", lang), t("citas.step3.label", lang)];
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
                {t("citas.step1.title", lang)}
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
                {t("citas.step2.back", lang)}
              </button>

              <div className="bg-mint/50 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span className="text-sm font-medium text-navy">{selectedService?.label}</span>
              </div>

              <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("citas.step2.title", lang)}
              </h2>

              {(service === "taxes_negocio" || service === "negocios") && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {lang === "es" ? "Calendario de disponibilidad" : "Availability Calendar"}
                  </label>
                  <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                    <iframe
                      src="https://calendar.google.com/calendar/embed?src=2025e3f6e24a55cee2d0d08205baa9d571bbe0a93aa72157115fef122af071a4%40group.calendar.google.com&ctz=America%2FKentucky%2FLouisville"
                      className="w-full"
                      style={{ border: 0, height: "400px" }}
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t("citas.date.label", lang)}</label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                />
                {isDayOff && (
                  <p className="text-red-600 text-sm mt-2">
                    {t("citas.sunday.msg", lang)}
                  </p>
                )}
                {date && !isDayOff && (
                  <p className="text-xs text-gray-500 mt-1">
                    Horario: {new Date(date + "T12:00:00").getDay() === 6 ? t("citas.schedule.sat", lang) : t("citas.schedule.weekday", lang)}
                  </p>
                )}
              </div>

              {date && !isDayOff && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">{t("citas.time.label", lang)}</label>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                      {t("citas.loading", lang)}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-500">{t("citas.no.slots", lang)}</p>
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
                {t("citas.continue", lang)}
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
                {t("citas.step3.back", lang)}
              </button>

              {/* Summary */}
              <div className="bg-navy rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{t("citas.summary.service", lang)}</p>
                    <p className="text-white font-medium text-xs leading-tight">{selectedService?.label}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{t("citas.summary.date", lang)}</p>
                    <p className="text-white font-medium text-xs">
                      {new Date(date + "T12:00:00").toLocaleDateString("es-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{t("citas.summary.time", lang)}</p>
                    <p className="text-gold font-bold text-sm">{formatTime12h(time)}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("citas.step3.title", lang)}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("citas.name.label", lang)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("citas.name.placeholder", lang)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("citas.phone.label", lang)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("citas.phone.placeholder", lang)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("citas.email.label", lang)} <span className="text-gray-400 font-normal">{t("citas.email.optional", lang)}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("citas.email.placeholder", lang)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("citas.notes.label", lang)} <span className="text-gray-400 font-normal">{t("citas.notes.optional", lang)}</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("citas.notes.placeholder", lang)}
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
                      {t("citas.submitting", lang)}
                    </>
                  ) : (
                    t("citas.submit", lang)
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  {t("citas.legal", lang)}
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
              <h3 className="font-semibold text-navy mb-1">{t("citas.strip.nocost.title", lang)}</h3>
              <p className="text-sm text-gray-600">{t("citas.strip.nocost.desc", lang)}</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🌎</div>
              <h3 className="font-semibold text-navy mb-1">{t("citas.strip.spanish.title", lang)}</h3>
              <p className="text-sm text-gray-600">{t("citas.strip.spanish.desc", lang)}</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold text-navy mb-1">{t("citas.strip.location.title", lang)}</h3>
              <p className="text-sm text-gray-600">{t("citas.strip.location.desc", lang)}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
