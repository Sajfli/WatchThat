import {
    Switch,
    Route
} from 'react-router-dom'

import { Watch, Home } from '../Views'

const Router = () => {
    return(

    <div className='View'>

        <Switch>

            <Route exact path='/'>
                <Home />
            </Route>

            <Route exact path={['/room/:id', '/room*']}>
                <Watch />
            </Route>

        </Switch>

    </div>

    )
}

export default Router