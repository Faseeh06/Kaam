import webpush from "web-push";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function configureVapid() {
  const subject = process.env.VAPID_SUBJECT;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!subject || !pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  return true;
}

type WebhookRecord = {
  id?: string;
  user_id?: string;
  message?: string;
};

export async function POST(request: Request) {
  const headerSecret =
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
  if (!process.env.PUSH_WEBHOOK_SECRET || headerSecret !== process.env.PUSH_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!configureVapid()) {
    return NextResponse.json({ error: "VAPID not configured" }, { status: 503 });
  }

  let payload: { record?: WebhookRecord; type?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const record = payload.record;
  if (!record?.user_id || !record?.message) {
    return NextResponse.json({ error: "Missing record fields" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: subs, error } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", record.user_id);

  if (error) {
    console.error("push_subscriptions select:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!subs?.length) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Kaam";
  const pushPayload = JSON.stringify({
    title: appName + " - Notification",
    body: record.message,
    tag: "notif-" + (record.id || "unknown"),
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        pushPayload,
        { TTL: 86400 },
      );
      sent++;
    } catch (e: unknown) {
      const status =
        e && typeof e === "object" && "statusCode" in e
          ? (e as { statusCode?: number }).statusCode
          : undefined;
      if (status === 410 || status === 404) {
        await admin.from("push_subscriptions").delete().eq("id", sub.id);
      } else {
        console.error("webpush.sendNotification:", e);
      }
    }
  }

  return NextResponse.json({ ok: true, sent });
}
