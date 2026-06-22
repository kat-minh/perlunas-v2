import { NextResponse } from "next/server";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { API_BASE_URL } from "@/lib/api";

export const runtime = "nodejs";

/**
 * Best-effort forward of an arrival-card lead to the Perlunas CMS at
 * `${API_BASE_URL}/api/messages` (the public POST endpoint). The CMS expects
 * {name, email, phone, subject, message}; we map the richer arrival-card fields
 * into a single readable message. Never throws — failures are logged only so a
 * CMS outage can't break the user-facing submit.
 */
async function postToCms(lead: Omit<LeadInput, "company">): Promise<void> {
  const lines = [
    lead.destination && `Điểm đến: ${lead.destination}`,
    lead.service && `Dịch vụ: ${lead.service}`,
    (lead.month || lead.year) &&
      `Thời gian: ${[lead.month, lead.year].filter(Boolean).join(" ")}`,
    lead.days && `Thời lượng: ${lead.days}`,
    lead.groupSize && `Số người: ${lead.groupSize}`,
    lead.budget && `Ngân sách: ${lead.budget}`,
    lead.channel && `Kênh liên hệ: ${lead.channel}`,
    lead.source && `Biết qua: ${lead.source}`,
    lead.newsletter && `Đăng ký nhận tin: ${lead.newsletter}`,
    lead.message && `Ghi chú: ${lead.message}`,
  ].filter(Boolean);

  const body = {
    name: lead.name,
    email: lead.email || "",
    phone: lead.phone,
    subject: lead.service ? `Đăng ký tư vấn — ${lead.service}` : "Đăng ký tư vấn",
    message: lines.join("\n") || "Khách để lại thông tin liên hệ.",
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);
  } catch (err) {
    console.error("[lead] failed to forward to CMS (best-effort):", err);
  }
}

/**
 * Receives an arrival-card lead, validates it, and forwards it to a Google
 * Sheets Apps Script Web App. If no webhook is configured (e.g. local dev),
 * it logs and still returns success so the front-end UX can be exercised.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Honeypot tripped — pretend success, drop silently.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { company: _omit, ...lead } = parsed.data;
  const record = {
    ...lead,
    submittedAt: new Date().toISOString(),
    source: "landing",
    secret: process.env.LEAD_WEBHOOK_SECRET ?? "",
  };

  // Best-effort: forward the lead to the Perlunas CMS (/api/messages). This must
  // never fail the user — if the CMS is down we log and carry on.
  void postToCms(lead);

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    console.info("[lead] no webhook configured — captured lead:", record);
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      // Apps Script can be slow on cold start.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`sheet responded ${res.status}`);
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[lead] failed to forward to sheet:", err);
    // Don't lose the lead in logs even if the sheet is down.
    console.info("[lead] unsent lead:", record);
    return NextResponse.json(
      { ok: false, error: "forward_failed" },
      { status: 502 },
    );
  }
}
