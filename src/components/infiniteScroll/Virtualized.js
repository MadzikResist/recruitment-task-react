import Navbar from "../navbar/Navbar";
import {AutoSizer, InfiniteLoader, List} from "react-virtualized";
import {useEffect, useState} from "react";
import loading from '../../assets/loading.gif'
import {convertMsToSec} from "../../utils/convertMsToSec";
import {throttle} from "../../utils/throttle";
import './simpleVirtualizedStyle.css'
import 'react-virtualized/styles.css';
import { fetchData }  from '../../utils/api';
import { updateRecords } from "../../utils/updateRecords";
const Virtualized = () => {
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

    const throttledLoadMore = throttle(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=coding&market=us&type=track&limit=20&offset=${offset}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const tracks = await response.json();
            setTracks((prevState) => [...prevState, ...tracks.tracks.items]);
            setOffset(tracks.tracks.offset + 20);
            setHasMore(tracks.tracks.offset + 20 < tracks.tracks.total);
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 1000);

    const loadMore = () => {
        throttledLoadMore();
    };

    const rowCount = hasMore ? tracks.length + 1 : tracks.length;
    const loadMoreRows = isLoading ? () => {} : loadMore;
    const isRowLoaded = ({index}) => !hasMore || index < tracks.length;
    const rowRenderer = ({index, key, style}) => {
        if (!isRowLoaded({index})) {
            return <img key={key} src={loading} alt="Loading..." style={{width: '50px'}}/>
        } else {
            const dataObj = tracks[index]
            return (
                <div className="oneElementV" key={dataObj.id} style={style}>
                    <div className="elementVWrapper">
                        <div className="playSongInformation">
                            <div className="play" style={{backgroundImage: `url(${dataObj.album.images[0].url})`}}/>
                            <div className="songInformation">
                                <div className="title">{dataObj.name}</div>
                                <div className="artist">{dataObj.artists[0].name}</div>
                            </div>
                        </div>
                        <div className="songTime">{convertMsToSec(dataObj.duration_ms)}</div>
                    </div>
                </div>
            )
        }
    };

    return (
        <div className="container containerVirtualized" style={{overflowY: 'hidden'}}>
            <Navbar simpleVersion={false}/>
            <div style={{height: '100vh', width: '100%'}} >
                <AutoSizer>{({height, width }) => (
                    <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={loadMoreRows}
                        rowCount={rowCount}
                        threshold={10}
                    >
                        {({onRowsRendered, registerChild}) => (
                            <List
                                ref={registerChild}
                                onRowsRendered={onRowsRendered}
                                rowRenderer={rowRenderer}
                                height={height}
                                width={width}
                                rowHeight={100}
                                rowCount={rowCount}
                            />
                        )}
                    </InfiniteLoader>
                )}
                </AutoSizer>
            </div>
        </div>

    )
}
export default Virtualized