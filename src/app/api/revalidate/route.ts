import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand ISR webhook. The CMS backend calls this after any content mutation
 * so changes appear on the site immediately instead of waiting out the 5-minute
 * ISR window. revalidatePath("/", "layout") purges every page under the root
 * layout — i.e. the whole site — so each one re-runs its CMS fetches on the
 * next request.
 *
 * Auth: a shared secret in the `secret` query param must match REVALIDATE_SECRET.
 * Accepts GET too so it's easy to trigger/test from a browser.
 */
export const dynamic = "force-dynamic";

function handle(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: true });
}

export async function POST(req: Request) {
  return handle(req);
}

export async function GET(req: Request) {
  return handle(req);
}
