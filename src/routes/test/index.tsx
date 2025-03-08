import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import TableTennisLoader from '../../components/loaders/TableTennisLoader'

export const Route = createFileRoute('/test/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }} className='bg-gray-300'>
            <h2>Hello /test/!</h2>
            <div style={{ margin: '20px' }} className=''>
                <TableTennisLoader />
            </div>
        </div>
    )
}
