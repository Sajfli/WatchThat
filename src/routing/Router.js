import {
    Switch,
    Route
} from 'react-router-dom'

import { Watch } from '../Views'

const Router = () => {
    return(

    <div className='View'>

        <Switch>

            <Route exact path='/'>
                <Watch />
            </Route>

        </Switch>

    </div>

    )
}

export default Router