export const fetchData = async (setIsLoading, setAccessToken, accessToken, setTracks, setOffset, setHasMore) => {
    try {
        setIsLoading(true);

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`,
        });

        const tokenData = await tokenResponse.json();
        setAccessToken(tokenData.access_token);

        const tracksResponse = await fetch('https://api.spotify.com/v1/search?q=coding&market=us&type=track&limit=20', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        });
        const tracksData = await tracksResponse.json();
        setTracks(tracksData.tracks.items);
        setOffset(tracksData.tracks.offset + 20);
        setHasMore(tracksData.tracks.offset + 20 < tracksData.tracks.total);
        setIsLoading(false);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

