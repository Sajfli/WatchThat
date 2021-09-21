import { useState, useEffect } from 'react'
import Player from '../Components/Player'

import ky from 'ky'

const Home = () => {

    const [ video, setVideo ] = useState({})

    useEffect(() => {

        (async () => {

            try {
                const res = await ky.get('/api/v1/video/random').json()

                if(res.video)
                    setVideo(res.video)


            } catch(err) {
                console.log('blad')
            }

        })()


    }, [])

    return(
        <div>

            <Player video={video} />

        </div>
    )

}

export default Home