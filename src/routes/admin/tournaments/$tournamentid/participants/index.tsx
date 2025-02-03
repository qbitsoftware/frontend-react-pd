import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/tournaments/$tournamentid/participants/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div></div>
  )
}

