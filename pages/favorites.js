import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import localStorage from 'localStorage'
import React from 'react'


export default function favorites(props) {
    const [items, setItems] = React.useState('')


    const deleteVideo = (data) => {
        setItems(items.filter(item => item._id !== data._id))
    }

    React.useEffect(()=>{
        setItems(JSON.parse(localStorage.getItem('favor')))
    },[localStorage])

    React.useEffect(()=>{
        localStorage.setItem('favor', JSON.stringify(items))
    },[items])

    return (
        <div>
            <div className={styles.header}>
                <Link href={'/'}>Back</Link>
                <h3>Избранное</h3>
            </div>
            <div className={styles.videos}>
                {items.length===0 && <div>Список пуст</div>}
                {items && items.map((video, index) =>(
                    <div key={index}>
                        <div style={{backgroundImage: `url('${video.preview.medium}')`,backgroundSize: '100%', backgroundRepeat: 'no-repeat', width: '300px', height: '200px' }}>
                            <div className={styles.containerImage}>
                                <Link href={video.url}>{video.title}</Link>
                            </div>
                            <button onClick={() => deleteVideo(video)}>Удалить из избранного</button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}
