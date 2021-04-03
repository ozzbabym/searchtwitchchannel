import React from 'react'
import axios from 'axios'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import localStorage from 'localStorage'

const options = {
    headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'g2p1of5nagftjvs4fm143jr3aau7t5'
    }
}

export default function Home() {
    const [input, setInput] = React.useState( '')
    const [videos, setVideos] = React.useState('')
    const [favorites, setFavorites] = React.useState('')

    const getVideos = async () => {

        const user = await axios.get(`https://api.twitch.tv/kraken/users?login=${input}`, options)
            .then(response => response)
            .then(data => data.data.users[0]);

        if(user === undefined){
            alert('ничего не найдено')
        }else {
            await axios.get(`https://api.twitch.tv/kraken/channels/${user._id}/videos`, options)
                .then(response => response)
                .then(data => setVideos(data.data.videos));
        }
    }


    const onChangeInput = (e) => {
        setInput(e.currentTarget.value)
    }

    const searchChannel = () => {
        if(input===''){
            alert('Input empty')
        }else{
            getVideos()
        }
    }

    const addFavorite = (data) => {
        setFavorites([...favorites, data ])

    }
    if(favorites.length>0){
        localStorage.setItem('favor', JSON.stringify(favorites))
    }

  return (
    <div>
        <div >
            <div className={styles.search}>
                <span>Введите название канала</span>
                <input onChange={onChangeInput} type="text" value={input}/>
                <button onClick={searchChannel} >Найти</button>
                <Link href={'/favorites'} data={"Yo"}>Избранное</Link>
            </div>
        </div>
        <div>
            <div className={styles.videos}>
                {!videos && <div>Ничего не найдено</div>}
                {videos && videos.map((video, index) =>(
                    <div key={index}>
                    <div style={{backgroundImage: `url('${video.preview.medium}')`,backgroundSize: '100%', backgroundRepeat: 'no-repeat', width: '300px', height: '200px' }}>
                        <div className={styles.containerImage}>
                            <Link href={video.url}>{video.title}</Link>
                        </div>
                        <button onClick={() => addFavorite(video)}>добавить в избранное</button>
                    </div>

                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
