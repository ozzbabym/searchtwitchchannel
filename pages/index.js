import React from 'react'
import axios from 'axios'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import localStorage from 'localStorage'
const loader = require('../img/loader.gif')


const request_options = {
    headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'g2p1of5nagftjvs4fm143jr3aau7t5'
    }
}

export default function Home() {
    const [input, setInput] = React.useState( '')
    const [videos, setVideos] = React.useState(JSON.parse(localStorage.getItem('videos')) || '')
    const [favorites, setFavorites] = React.useState(JSON.parse(localStorage.getItem('favor')) ||'')
    const [loading, setLoadind] = React.useState(false)

    //получить видео
    const getVideos = async () => {
        //получаем юзера по поиску
        setLoadind(true)
        setVideos('')
        const user = await axios.get(`https://api.twitch.tv/kraken/users?login=${input}`, request_options)
            .then(response => response)
            .then(data => data.data.users[0]);

        if(user === undefined){
            alert('ничего не найдено')
            setLoadind(false)
        }else {
            //получаем видео у юзера
            await axios.get(`https://api.twitch.tv/kraken/channels/${user._id}/videos`, request_options)
                .then(response => response)
                .then(data => setVideos(data.data.videos));
            setLoadind(false)
        }

    }


    const onChangeInput = (e) => {
        setInput(e.currentTarget.value)
    }

    const searchChannel = () => {
        if(input===''){

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

    React.useEffect(()=>{
        localStorage.setItem('videos', JSON.stringify(videos))
    },[videos])


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
            {loading && <div className={styles.loader}>
                <img src={loader} alt="loader"/>
            </div>}
            <div className={styles.videos}>
                {!loading && videos.length===0 && <div>У пользователя нет видео</div>}
                {videos && videos.map((video, index) =>(
                    <div key={index}>
                    <div style={{backgroundImage: `url('${video.preview.medium}')`,backgroundSize: '100%', backgroundRepeat: 'no-repeat', width: '300px', height: '200px' }}>
                        <div className={styles.containerImage}>
                            <Link href={video.url}><a target="_blank">{video.title}</a></Link>
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
