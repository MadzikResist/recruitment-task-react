import Navbar from "../navbar/Navbar";
import './simpleVirtualizedStyle.css'
import loading from '../../assets/loading.gif'
import {useCallback, useEffect, useRef, useState} from "react";
import {convertMsToSec} from "../../utils/convertMsToSec";
import {fetchData}  from '../../utils/api';
import {updateRecords} from "../../utils/updateRecords";
const Simple = () => {
    const observer = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState("");
    const [tracks, setTracks] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        fetchData(setIsLoading, setAccessToken, accessToken, setTracks, setOffset, setHasMore);
        updateRecords(setTracks);
        // eslint-disable-next-line
    }, []);
    
    const loadMore = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`https://api.spotify.com/v1/search?q=coding&market=us&type=track&limit=20&offset=${offset}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            const tracks = await response.json();
            setTracks((prevState) => [...prevState, ...tracks.tracks.items]);
            setOffset(tracks.tracks.offset+20)
            setHasMore(tracks.tracks.offset+20 < tracks.tracks.total)
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const lastTrackElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            });
            if (node) observer.current.observe(node);
        },
        // eslint-disable-next-line
        [hasMore, offset, isLoading],
    );

    return(
        <div className="container">
            <Navbar simpleVersion={true} />
            <div className="elementsWrapper">
                    {!!tracks.length && (
                        tracks.map(dataObj => {
                            return (
                                <div className="oneElement" key={dataObj.id} ref={lastTrackElementRef}>
                                    <div className="playSongInformation">
                                        <div className="play" style={{ backgroundImage: `url(${dataObj.album.images[0].url})`}}></div>
                                        <div className="songInformation">
                                            <div className="title">{dataObj.name}</div>
                                            <div className="artist">{dataObj.artists[0].name}</div>
                                        </div>
                                    </div>
                                    <div className="songTime">{convertMsToSec(dataObj.duration_ms)}</div>
                                </div>
                            )
                        })
                    )}
                {isLoading && (
                    <img src={loading} alt="Loading..." style={{width: '50px'}}/>
                )}
            </div>
        </div>
    )
}
export default Simple