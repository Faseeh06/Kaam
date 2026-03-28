"use client";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

export async function ensureNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  if (Notification.permission === "default") {
    return Notification.requestPermission();
  }

  return Notification.permission;
}

export async function ensureNotificationServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const existing = await navigator.serviceWorker.getRegistration();
  if (existing) return existing;

  return navigator.serviceWorker.register("/sw.js");
}

export async function hasActivePushSubscription(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch {
    return false;
  }
}

/** Registers Web Push (VAPID) and saves the subscription to the server. No-op if misconfigured or denied. */
export async function syncPushSubscriptionToServer(): Promise<void> {
  if (typeof window === "undefined") return;
  const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapid) return;

  const permission = await ensureNotificationPermission();
  if (permission !== "granted") return;

  const registration = await ensureNotificationServiceWorker();
  if (!registration) return;

  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid),
      });
    } catch {
      return;
    }
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return;

  try {
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      }),
    });
  } catch {
    // ignore network errors
  }
}

export async function showDesktopNotification(title: string, body: string, tag?: string): Promise<boolean> {
  const permission = await ensureNotificationPermission();
  if (permission !== "granted") return false;

  try {
    const registration = await ensureNotificationServiceWorker();
    if (registration) {
      await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon: "/apple-icon.png",
        badge: "/icon-dark-32x32.png",
        tag: tag || `notif-${Date.now()}`,
      });
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const n = new Notification(title, { body, icon: "/apple-icon.png" });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return true;
  } catch {
    return false;
  }
}
