import "../scss/movie.scss"
import {  useRef } from "react"
import { WrappedData } from "./Wrapped"

function getShowData(comp, res, type, data, sort) {
    if (type != "show") return comp

    if (sort.watchlist) {
        comp.up_to_date = false
        comp.total_seen = 0
        comp.total_episodes = res?.number_of_episodes || 0
        return comp
    }

    const season = res?.last_episode_to_air?.season_number
    const season_seen = data?.seasons?.at(-1).number
    comp.last_air_date = res?.last_episode_to_air?.air_date.substring(0, 4)
    if (sort.last_air_date && sort.last_air_date != comp.last_air_date) return null
    comp.title += season == 1 || sort.last_air_date == null ? "" : ` (S${season_seen})`
    comp.is_last_season = season == season_seen
    comp.total_seen = data?.seasons?.at(-1).episodes.length
    comp.total_episodes = comp.is_last_season ? res?.last_episode_to_air?.episode_number : 0
    for (let i = 0; i < res.seasons.length; i++)
        if (res.seasons[i].season_number == season_seen)
            comp.total_episodes = comp.total_episodes === 0 ? res.seasons[i].episode_count : comp.total_episodes
    comp.up_to_date = comp.is_last_season && comp.total_seen >= comp.total_episodes
    if (sort.up_to_date && sort.up_to_date != comp.up_to_date) return null

    return comp
}

function getGeneralData(comp, res, type, data, sort) {
    if (sort.seen && data?.last_watched_at?.split("-")[0] != sort.seen) return null
    comp.title = type == "movie" ? res.title : res.name
    comp.date = type == "movie" ? res.release_date : res.first_air_date
    comp.year = (type == "movie" ? res.release_date : res.first_air_date).split("-")[0];
    if (res.releases) {
        const releaseCountry = res?.releases.countries.find(country => country.iso_3166_1 === sort.region);
        if (releaseCountry) comp.year = releaseCountry.release_date.split("-")[0];
    }
    if (sort.year && sort.year != comp.year) return null
    comp.available = new Date(comp.date) < new Date()
    if (sort.available && sort.available != comp.available) return null
    if (comp.year == "") comp.year = "N.C."
    comp.poster = res.poster_path
    comp.up_to_date = true
    comp.last_air_date = comp.year
    comp.genres = res.genres.map(genre => genre.name)

    return comp
}

function exportData(comp, type, data, res, rating, sort, id) {
    comp.genres.forEach(genre => {
        WrappedData.genres[genre] = (WrappedData.genres[genre] || 0) + 1
    })

    try {
        if (type == "movie") {
            WrappedData.movies_by_score[rating].push(id)
            if (sort.seen == comp.year) WrappedData.movies_by_score_this_year[rating].push(id)
        } else {
            WrappedData.shows_by_score[rating].push(id)
            if (sort.seen == comp.year) WrappedData.shows_by_score_this_year[rating].push(id)
        }
    } catch (e) { console.log(rating) }

    res.credits.cast.forEach(actor => {
        const database = actor.gender == 1 ? WrappedData.actresses : WrappedData.actors
        if (database[actor.id] == undefined) database[actor.id] = { count: 1, data: actor }
        else database[actor.id].count += 1
    })

    function borneMovie(wrapped, first_date, last_date) {
        if (wrapped.data === null || new Date(first_date) > new Date(last_date)) {
            wrapped.data = {...res, personal_score: rating}
            wrapped.date = data.last_watched_at
        }
    }

    if (type == "movie") {
        borneMovie(WrappedData.first_movie, WrappedData.first_movie.date, data?.last_watched_at)
        borneMovie(WrappedData.last_movie, data?.last_watched_at, WrappedData.last_movie.date)
        WrappedData.total_movies += 1
        WrappedData.total_time_movies += res.runtime
    } else {
        if (WrappedData.first_show.data === null) WrappedData.first_show.date = new Date()
        const all_episodes = data?.seasons?.flatMap(season => season.episodes) || []

        all_episodes.forEach(episode => {
            const date = episode.last_watched_at

            // Episodes Data
            if (new Date(date) > new Date(sort.seen)) {
                WrappedData.total_episodes += 1
                WrappedData.total_time_shows += res?.last_episode_to_air?.runtime || 0
            }

            // First Show
            if (new Date(date) < new Date(WrappedData.first_show.date) && new Date(date) > new Date(sort.seen)) {
                WrappedData.first_show.data = {...res, personal_score: rating}
                WrappedData.first_show.date = date
            }
        })

        // Last Show
        if (WrappedData.last_show.data === null ||
            new Date(WrappedData.last_show.date) < new Date(data.last_watched_at))
        {
            WrappedData.last_show.data = {...res, personal_score: rating}
            WrappedData.last_show.date = data.last_watched_at
        }
        // total shows
        WrappedData.total_shows += 1
    }
}

export default function Content({ data, type, sort, rating, res, id }) {
    const card = useRef(null)
    let comp = {}

    if (res == undefined) return <></>

    comp = getGeneralData(comp, res, type, data, sort)
    if (comp == null) return <></>

    comp = getShowData(comp, res, type, data, sort)
    if (comp == null) return <></>

    exportData(comp, type, data, res, rating, sort, id)

    return (
        <article className="movie" ref={card}>
            {rating != undefined ? <div className="rating">{rating}</div> : <></>}
            {comp.poster == undefined ? <></> : <img src={`https://image.tmdb.org/t/p/w500${comp.poster}`} loading="lazy" alt={comp.title} />}
            <div className={`data ${comp.poster != undefined ? "" : "title"}`}>
                <h1>{comp.title}</h1>
                <div className="tags">
                    <div className="tag" title="Release date">{comp.year}{comp.last_air_date == null || comp.last_air_date == comp.year ? "" : `-${comp.last_air_date}`}</div>
                    {type == "show" ? <div className="tag" title="Status">{comp.up_to_date ? "Up to date" : `Not up to date (${comp.total_seen}/${comp.total_episodes})`}</div> : <></> }
                    <div className="tag icon" title="Hide show/movie" onClick={() => {
                        card.current.style.display = "none"
                    }}><i className='bx bx-trash' ></i></div>
                    <div className="tag icon" title="Add/remove favorite" onClick={() => {
                        if (card.current.classList.contains("favorite")) card.current.classList.remove("favorite")
                        else card.current.classList.add("favorite")
                    }}><i className='bx bx-heart'></i></div>
                </div>
            </div>
        </article>
    )
}