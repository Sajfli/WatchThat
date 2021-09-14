import {
    Switch,
    Route
} from 'react-router-dom'

import { Home } from '../Views'

const Router = () => {
    return(

    <div className='View'>

        <Switch>

            <Route exact path='/'>
                <Home />
            </Route>

        </Switch>

    </div>

    )
}

export default Router