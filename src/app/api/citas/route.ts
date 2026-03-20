import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";

const DATA_FILE = path.join(process.cwd(), "data", "appointments.json");

const BUSINESS_HOURS: Record<number, string[]> = {
  1: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"], // Lunes
  2: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"], // Martes
  3: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"], // Miércoles
  4: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"], // Jueves
  5: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"], // Viernes
  6: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],           // Sábado
  0: [], // Domingo — cerrado
};

const DAY_NAMES: Record<number, string> = {
  0: "Domingo", 1: "Lunes", 2: "Martes", 3: "Miércoles",
  4: "Jueves", 5: "Viernes", 6: "Sábado",
};

const SERVICE_LABELS: Record<string, string> = {
  taxes_individual: "Taxes Individuales",
  taxes_negocio: "Taxes de Negocio",
  taxes_camionero: "Trámites para Camioneros (IRP/IFTA/KYU)",
  notaria: "Notaría Pública",
  inmigracion: "Inmigración / Formularios",
  ciudadania: "Clases de Ciudadanía",
  pasaporte: "Pasaporte Cubano/Americano",
  negocios: "Registro / Estructuración de Negocios",
  itin: "Número de ITIN",
  contabilidad: "Contabilidad y Nóminas",
  traducciones: "Traducciones Profesionales",
  otro: "Otro / Consulta General",
};

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

async function readAppointments(): Promise<Appointment[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeAppointments(data: Appointment[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

async function sendConfirmationEmail(appt: Appointment) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const dateObj = new Date(appt.date + "T12:00:00");
  const dayName = DAY_NAMES[dateObj.getDay()];
  const dateStr = `${dayName}, ${dateObj.toLocaleDateString("es-US", { month: "long", day: "numeric", year: "numeric" })}`;
  const timeStr = formatTime12h(appt.time);
  const serviceLabel = SERVICE_LABELS[appt.service] || appt.service;

  const htmlContent = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: #1B3356; padding: 24px; text-align: center;">
        <h1 style="color: #C8A214; margin: 0; font-size: 22px;">3-1 Notary A Plus</h1>
        <p style="color: #C5E8D5; margin: 4px 0 0; font-size: 13px;">Business & Tax Services</p>
      </div>
      <div style="padding: 24px; background: #f9f9f9; border: 1px solid #e0e0e0;">
        <h2 style="color: #1B3356; margin-top: 0;">Nueva Cita Agendada</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #555; width: 35%;"><strong>Cliente:</strong></td><td style="padding: 8px 0;">${appt.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;"><strong>Teléfono:</strong></td><td style="padding: 8px 0;">${appt.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;"><strong>Email:</strong></td><td style="padding: 8px 0;">${appt.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;"><strong>Servicio:</strong></td><td style="padding: 8px 0; color: #C8A214; font-weight: bold;">${serviceLabel}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;"><strong>Fecha:</strong></td><td style="padding: 8px 0; font-weight: bold;">${dateStr}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;"><strong>Hora:</strong></td><td style="padding: 8px 0; font-weight: bold;">${timeStr}</td></tr>
          ${appt.notes ? `<tr><td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>Notas:</strong></td><td style="padding: 8px 0;">${appt.notes}</td></tr>` : ""}
        </table>
        <div style="margin-top: 16px; padding: 12px; background: #EAF7EF; border-left: 4px solid #C8A214; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #1B3356;">ID de Cita: <strong>${appt.id}</strong></p>
        </div>
      </div>
      <div style="background: #1B3356; padding: 16px; text-align: center;">
        <p style="color: #C5E8D5; margin: 0; font-size: 12px;">8514 Preston Hwy, Louisville, KY 40219 | (502) 654-7076</p>
      </div>
    </div>
  `;

  const contactEmail = process.env.CONTACT_EMAIL || "notaryaplus3_1@yahoo.com";

  // Email a Myrna
  await transporter.sendMail({
    from: `"3-1 Notary A Plus" <${process.env.SMTP_USER}>`,
    to: contactEmail,
    subject: `Nueva Cita: ${serviceLabel} — ${dateStr} ${timeStr}`,
    html: htmlContent,
  });

  // Confirmación al cliente (si tiene email)
  if (appt.email && appt.email.includes("@")) {
    const clientHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
        <div style="background: #1B3356; padding: 24px; text-align: center;">
          <h1 style="color: #C8A214; margin: 0; font-size: 22px;">3-1 Notary A Plus</h1>
          <p style="color: #C5E8D5; margin: 4px 0 0; font-size: 13px;">Business & Tax Services</p>
        </div>
        <div style="padding: 24px; background: #f9f9f9; border: 1px solid #e0e0e0;">
          <h2 style="color: #1B3356; margin-top: 0;">¡Tu cita ha sido confirmada!</h2>
          <p>Hola <strong>${appt.name}</strong>, tu cita ha sido agendada exitosamente.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #555; width: 35%;"><strong>Servicio:</strong></td><td style="padding: 8px 0; color: #C8A214; font-weight: bold;">${serviceLabel}</td></tr>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Fecha:</strong></td><td style="padding: 8px 0; font-weight: bold;">${dateStr}</td></tr>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Hora:</strong></td><td style="padding: 8px 0; font-weight: bold;">${timeStr}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #EAF7EF; border-radius: 8px;">
            <h3 style="color: #1B3356; margin-top: 0; font-size: 15px;">Información de la cita</h3>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Dirección:</strong> 8514 Preston Hwy, Louisville, KY 40219</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Teléfono:</strong> (502) 654-7076 / (502) 644-1312</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> notaryaplus3_1@yahoo.com</p>
          </div>
          <p style="margin-top: 16px; font-size: 13px; color: #666;">Si necesitas cancelar o reprogramar, comunícate con nosotros al menos con 24 horas de anticipación.</p>
        </div>
        <div style="background: #1B3356; padding: 16px; text-align: center;">
          <p style="color: #C5E8D5; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} 3-1 Notary A Plus — Myrna Rodríguez</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"3-1 Notary A Plus" <${process.env.SMTP_USER}>`,
      to: appt.email,
      subject: `Confirmación de Cita — ${dateStr} ${timeStr}`,
      html: clientHtml,
    });
  }
}

// GET: retorna slots ya reservados para una fecha
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const appointments = await readAppointments();
  const bookedTimes = appointments
    .filter((a) => a.date === date)
    .map((a) => a.time);

  const dateObj = new Date(date + "T12:00:00");
  const dayOfWeek = dateObj.getDay();
  const availableSlots = BUSINESS_HOURS[dayOfWeek] || [];

  return NextResponse.json({ bookedTimes, availableSlots });
}

// POST: crear una cita
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    phone?: string;
    email?: string;
    service?: string;
    date?: string;
    time?: string;
    notes?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { name, phone, email, service, date, time, notes = "" } = body;

  // Validación básica
  if (!name || !phone || !service || !date || !time) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: nombre, teléfono, servicio, fecha y hora." },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Formato de fecha inválido" }, { status: 400 });
  }

  // Verificar que no es domingo y la hora es válida
  const dateObj = new Date(date + "T12:00:00");
  const dayOfWeek = dateObj.getDay();
  const allowedSlots = BUSINESS_HOURS[dayOfWeek] || [];

  if (allowedSlots.length === 0) {
    return NextResponse.json({ error: "No hay servicio ese día (domingo)" }, { status: 400 });
  }

  if (!allowedSlots.includes(time)) {
    return NextResponse.json({ error: "Hora fuera del horario de atención" }, { status: 400 });
  }

  // Verificar conflicto de cita
  const appointments = await readAppointments();
  const conflict = appointments.find((a) => a.date === date && a.time === time);

  if (conflict) {
    return NextResponse.json(
      { error: "Ese horario ya está ocupado. Por favor selecciona otra hora." },
      { status: 409 }
    );
  }

  // Crear nueva cita
  const newAppt: Appointment = {
    id: `CIT-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    email: (email || "").trim(),
    service,
    date,
    time,
    notes: notes.trim(),
    createdAt: new Date().toISOString(),
  };

  appointments.push(newAppt);
  await writeAppointments(appointments);

  // Enviar emails (no bloquear la respuesta si falla)
  try {
    await sendConfirmationEmail(newAppt);
  } catch (emailError) {
    console.error("Error enviando email:", emailError);
  }

  return NextResponse.json({ success: true, id: newAppt.id }, { status: 201 });
}
