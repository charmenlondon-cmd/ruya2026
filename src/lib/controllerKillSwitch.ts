// Lets the admin panel force every open /controller tab, on any device,
// to immediately stop running — used when the controller URL was shared
// widely during testing and there's no way to know what's still open
// somewhere. Sent as a Realtime Broadcast (no DB table needed). This only
// reaches tabs that are currently connected; a tab that's fully suspended
// (e.g. backgrounded long enough for the browser to kill its websocket)
// won't see it until it reconnects, but by definition no one is actively
// playing on a suspended tab at that moment either.
export function controllerKillChannelName(): string {
  return 'controller-kill-switch'
}
