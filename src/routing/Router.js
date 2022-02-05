import {
    Switch,
    Route,
    Redirect
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

            <Route math="*">
                <Redirect to="/" />
            </Route>

        </Switch>

    </div>

    )
}

export default Router