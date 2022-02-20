import { AuthProvider } from 'hooks/useAuth'
import { AuthModalProvider } from 'hooks/useAuthModal'
import { LocalisationProvider } from 'hooks/useLocalisation'
import { BrowserRouter } from 'react-router-dom'

const AppProviders = ({ children }) => {
    return (
        <BrowserRouter>
            <LocalisationProvider>
                <AuthProvider>
                    <AuthModalProvider>{children}</AuthModalProvider>
                </AuthProvider>
            </LocalisationProvider>
        </BrowserRouter>
    )
}

AppProviders.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AppProviders
