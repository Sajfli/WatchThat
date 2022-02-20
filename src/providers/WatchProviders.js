import { SocketProvider } from 'hooks/useSocket'
import { PorterProvider } from 'hooks/usePorter'

const WatchProviders = ({ children }) => {
    return (
        <SocketProvider>
            <PorterProvider>{children}</PorterProvider>
        </SocketProvider>
    )
}

WatchProviders.propTypes = {
    children: PropTypes.node.isRequired,
}

export default WatchProviders
