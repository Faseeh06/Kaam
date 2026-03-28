import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PushSubscriptionBody = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function POST(request: Request) {
  let body: PushSubscriptionBody;
  try {
    body = (await request.json()) as PushSubscriptionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body?.endpoint ||
    typeof body.endpoint !== "string" ||
    !body.keys?.p256dh ||
    !body.keys?.auth
  ) {
    return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userAgent = request.headers.get("user-agent") ?? undefined;

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
      user_agent: userAgent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    console.error("push_subscriptions upsert:", error);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
