// Lets clients detect when a new deployment has gone live (see
// useAutoReloadOnNewDeploy). Must never be cached — each poll needs to see
// whichever deployment is currently serving traffic.
export const dynamic = 'force-dynamic'

export async function GET() {
  const version =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.VERCEL_DEPLOYMENT_ID ??
    'dev'

  return Response.json({ version }, { headers: { 'Cache-Control': 'no-store' } })
}
