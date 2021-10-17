import { useState } from 'react'
import ky from 'ky'

// utils
import isURL from 'validator/lib/isURL'

// hooks
import useLocalisation from 'utils/hooks/useLocalisation'

// UI components
import Player from 'Components/Player'
import { TextInput } from 'Components/Inputs'

// style
import style from './Watch.module.scss'


const Watch = () => {

    const l = useLocalisation()

    // video data
    const [ video, setVideo ] = useState({})
    // text input value
    const [ search, setSearch ] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()

        if(isURL(search)) {

            try {

                // get video file from url
                const res = await ky.get(`/api/v1/video/extract?url=${encodeURIComponent(search)}`).json()

                // if no url
                if(!res.url) throw Error('no_url')

                let _video = {}

                // video url
                _video.url = Array.isArray(res.url) ? res.url : [res.url]
                // can we use video url or iframe instead
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
                        placeholder={l('typeVideoUrl')}

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