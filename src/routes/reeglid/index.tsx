import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import LauatenniseReeglid from './-components/rules'

export const Route = createFileRoute('/reeglid/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LauatenniseReeglid/>
  )
}
