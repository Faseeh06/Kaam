export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white mb-3">You are offline</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Kaam could not reach the network. Reconnect to continue syncing your latest data.
        </p>
      </div>
    </main>
  );
}
