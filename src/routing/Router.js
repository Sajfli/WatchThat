import WatchProviders from 'providers/WatchProviders'
import { Routes, Route, Navigate } from 'react-router-dom'

import { Watch, Home } from '../Views'

const Router = () => {
    return (
        <Routes>
            <Route index path="/" element={<Home />} />

            <Route
                path={'/room/:id/'}
                element={
                    <WatchProviders>
                        <Watch />
                    </WatchProviders>
                }
            />

            <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    )
}

export default Router
