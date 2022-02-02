import { AuthProvider } from 'hooks/useAuth'
import { LocalisationProvider } from 'hooks/useLocalisation';
import { SocketProvider } from 'hooks/useSocket';
import { BrowserRouter } from 'react-router-dom'


const AppProviders = ({children}) => {
    return(
        <BrowserRouter>
            <LocalisationProvider>
                <AuthProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </AuthProvider>
            </LocalisationProvider>
        </BrowserRouter>
    )
}

export default AppProviders