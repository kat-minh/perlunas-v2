import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";

export const runtime = "nodejs";

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
