import { useState } from 'react'
import ky from 'ky'
import isURL from 'validator/lib/isURL'

import Player from 'Components/Player'
import { TextInput } from 'Components/Inputs'

import style from './Watch.module.scss'


const Watch = () => {

    const [ video, setVideo ] = useState({})
    const [ search, setSearch ] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()

        if(isURL(search)) {

            try {

                const res = await ky.get(`/api/v1/video/extract?url=${encodeURIComponent(search)}`).json()

                console.log(res)

                if(!res.url) throw Error('no_url')

                let _video = {}

                _video.url = Array.isArray(res.url) ? res.url : [res.url]
                _video.indirect = res.indirect ? true : false

                if(res.title) _video.title = res.title

                setVideo(_video)

            } catch(err) {
                console.log(err)
            }

        } else {
            console.log('invalid url')
        }
    }

    return(
        <div>

            <div className={style.playerBox}>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        width='100%' height='40px'
                        className={style.input}
                        placeholder='Type video URL'

                        value={search}
                        onChange={({target: {value}}) => setSearch(value)}
                    />
                </form>

                <Player video={video} />
            </div>

        </div>
    )

}

export default Watch