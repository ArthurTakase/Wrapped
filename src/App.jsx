import Grid from './Components/Grid'
import Menu from './Components/Menu'
import RandomElement from './Components/RandomElement'
import './scss/app.scss'
import './scss/form.scss'
import './scss/random.scss'
import './scss/wrapped.scss'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';
import Contest from './Components/Contest'

export const allRef = {}

export function toggleMenu() {
    allRef.menu.current.classList.toggle('active')
    document.querySelector('#random').classList.remove('active')
}

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    allRef.main = useRef(null)
    allRef.menu = useRef(null)
    allRef.username = useRef(null)
    allRef.year = useRef(null)
    allRef.up_to_date = useRef(null)
    allRef.last_air_date = useRef(null)
    allRef.lang = useRef(null)
    allRef.available = useRef(null)
    allRef.watchlist = useRef(null)
    allRef.seen = useRef(null)
    allRef.hideMovies = useRef(null)
    allRef.hideShows = useRef(null)
    allRef.random = useRef(null)
    allRef.randomTitle = useRef(null)
    allRef.randomYear = useRef(null)
    allRef.randomPoster = useRef(null)
    allRef.region = useRef(null)
    allRef.grid = useRef(null)
    allRef.contest = useRef(null)
    allRef.launchContest = null

    useEffect(() => {        
        allRef.username.current.value = searchParams.get('username')
        allRef.lang.current.value = searchParams.get('lang')
        allRef.year.current.value = searchParams.get('year')
        allRef.seen.current.value = searchParams.get('seen')
        allRef.last_air_date.current.value = searchParams.get('last_air_date')
        allRef.available.current.checked = searchParams.get('available') == 'true'
        allRef.up_to_date.current.checked = searchParams.get('up_to_date') == 'true'
        allRef.watchlist.current.checked = searchParams.get('watchlist') == 'true'
        allRef.hideMovies.current.checked = searchParams.get('hideMovies') == 'true'
        allRef.hideShows.current.checked = searchParams.get('hideShows') == 'true'
        allRef.region.current.value = searchParams.get('region')

        if (allRef.username.current.value == '') toggleMenu()
    }, [])

    return (
    <div className="main" ref={allRef.main}>
        <div className="top_btns">
            <button title="New request" onClick={() => { allRef.menu.current.classList.toggle('active') }}><i className='bx bx-search-alt-2'></i></button>
        </div>
        <Contest allRef={allRef}/>
        <RandomElement />
        <Menu setSearchParams={setSearchParams}/>
        <Grid />
    </div>
    )
}
