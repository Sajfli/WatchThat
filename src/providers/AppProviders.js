import { AuthProvider } from 'hooks/useAuth'
import { LocalisationProvider } from 'hooks/useLocalisation';
import { BrowserRouter } from 'react-router-dom'


const AppProviders = ({children}) => {
    return(
        <BrowserRouter>
            <LocalisationProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </LocalisationProvider>
        </BrowserRouter>
    )
}

export default AppProviders