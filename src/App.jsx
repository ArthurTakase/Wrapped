import Wrapped from './Components/Wrapped'
import './scss/app.scss'
import './scss/form.scss'
import './scss/random.scss'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';
import Checkbox from './Components/Checkbox';

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    const main = useRef(null)
    const menu = useRef(null)
    const username = useRef(null)
    const year = useRef(null)
    const up_to_date = useRef(null)
    const last_air_date = useRef(null)
    const lang = useRef(null)
    const available = useRef(null)
    const watchlist = useRef(null)
    const graph = useRef(null)
    const seen = useRef(null)
    const collapse = useRef(null)
    const hideMovies = useRef(null)
    const hideShows = useRef(null)

    function toggleMenu(from) {
        const urlParams = new URLSearchParams(window.location.search)
        const username = urlParams.get('username')

        if (username == null && from != 'search_btn') {
            menu.current.classList.add('active')
            return
        }
        if (from == 'search_btn') {
            var has = menu.current.classList.contains('active')
            if (has) { menu.current.classList.remove('active') }
            else { menu.current.classList.add('active') }
            return
        }
    }

    function submit() {
        setSearchParams({
            username: username.current.value,
            lang: lang.current.value || 'fr-FR',
            year: year.current.value,
            seen: seen.current.value,
            last_air_date: last_air_date.current.value,
            available: available.current.checked,
            up_to_date: up_to_date.current.checked,
            watchlist: watchlist.current.checked,
            graph: graph.current.checked,
            collapse: collapse.current.checked,
            hideMovies: hideMovies.current.checked,
            hideShows: hideShows.current.checked,
        })

        window.location.reload()
    }

    useEffect(() => {
        toggleMenu()
        
        username.current.value = searchParams.get('username')
        lang.current.value = searchParams.get('lang')
        year.current.value = searchParams.get('year')
        seen.current.value = searchParams.get('seen')
        last_air_date.current.value = searchParams.get('last_air_date')
        available.current.checked = searchParams.get('available') == 'true'
        up_to_date.current.checked = searchParams.get('up_to_date') == 'true'
        watchlist.current.checked = searchParams.get('watchlist') == 'true'
        graph.current.checked = searchParams.get('graph') == 'true'
        collapse.current.checked = searchParams.get('collapse') == 'true'
        hideMovies.current.checked = searchParams.get('hideMovies') == 'true'
        hideShows.current.checked = searchParams.get('hideShows') == 'true'
    }, [])
    
    function isDisplayed(el) { return el.offsetParent !== null }
    
    function showRandomElement() {
        const elements = document.querySelectorAll('article')
        const displayedElements = Array.from(elements).filter(isDisplayed)

        if (displayedElements.length == 0) { return }

        const random = Math.floor(Math.random() * displayedElements.length)
        const randomElement = displayedElements[random]
        const picture = randomElement.querySelector('img').src
        const year = randomElement.querySelector('.tags').firstChild.innerHTML
        const title = randomElement.querySelector('h1').innerHTML

        document.querySelector('#random-picture').src = picture
        document.querySelector('#random-year').innerHTML = year
        document.querySelector('#random-title').innerHTML = title

        document.querySelector('#random').classList.add('active')
    }

    return (
    <div className="main" ref={main}>
        <div className="top_btns">
            <button title="Séléctionner un élément au hasard" onClick={showRandomElement}><i className='bx bx-shuffle' ></i></button>
            <button title="Afficher/masquer les favoris" onClick={() => {main.current.classList.toggle('fav')}}><i className='bx bx-heart'></i></button>
            <button title="Afficher/masquer les titres" onClick={() => {main.current.classList.toggle('no-title')}}><i className='bx bx-text' ></i></button>
            <button title="Afficher/masquer les notes" onClick={() => {main.current.classList.toggle('no-score')}}><i className='bx bxs-graduation' ></i></button>
            <button title="Agrandir/réduire les affiches" onClick={() => {main.current.classList.toggle('big-picture')}}><i className='bx bx-expand-alt' ></i></button>
            <button title="Nouvelle recherche" onClick={() => {toggleMenu("search_btn")}}><i className='bx bx-search-alt-2'></i></button>
        </div>
        <div id="random">
            <button id="random-close" onClick={() => {
                document.querySelector('#random').classList.toggle('active')
            }}><i className='bx bx-x' ></i></button>
            <img src="" alt="" id="random-picture" />
            <div id="random-title"></div>
            <div id="random-year" className="tag"></div>
        </div>
        <div className="menu-zone" ref={menu}>
            <div className='menu'>
                <div className='inputgroup'>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="Trakt username" ref={username} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="lang">Language</label>
                    <input type="text" placeholder="fr-FR" ref={lang} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="year">Year</label>
                    <input type="text" placeholder="yyyy" ref={year} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="seen">Seen</label>
                    <input type="text" placeholder="yyyy" ref={seen} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="last_air_date">Last air date</label>
                    <input type="text" placeholder="yyyy" ref={last_air_date} />
                </div>
                <div className='checkZone'>
                    <Checkbox label="Available" r={available} id="available" onChange={() => {}} />
                    <Checkbox label="Up to date" r={up_to_date} id="up_to_date" onChange={() => {}} />
                    <Checkbox label="Watchlist" r={watchlist} id="watchlist" onChange={() => {}} />
                    <Checkbox label="Graph" r={graph} id="graph" onChange={() => {}} />
                    <Checkbox label="Collaspe" r={collapse} id="collapse" onChange={() => {}} />
                    <Checkbox label="Hide Movies" r={hideMovies} id="hideMovies" onChange={() => {}} />
                    <Checkbox label="Hide Shows" r={hideShows} id="hideShows" onChange={() => {}} />
                </div>
            </div>
            <div className='submit'>
                <button onClick={submit}>Valider</button>
                <button onClick={() => {toggleMenu("search_btn")}}>Annuler</button>
            </div>
        </div>
        <Wrapped />
    </div>
    )
}
