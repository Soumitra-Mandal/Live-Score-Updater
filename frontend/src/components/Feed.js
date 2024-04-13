import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid'
import './feed.css';
import io from "socket.io-client";
import FeedItem from './FeedItem';
// Initialize socket connection to the server
const socket = io("http://localhost:5000/");

const Feed = () => {
    // Get the local score from localStorage and parse it as JSON
    const localFeeds = JSON.parse(localStorage.getItem("feeds"));
    const [feeds, setFeeds] = useState(localFeeds == null ? { feed: [] } : localFeeds);
    const feedLayout = feeds["feed"].map((feedItem) => <FeedItem item={feedItem} key={uuid()} />);

    // Function to fetch initial feed data
    const fetchInitialfeed = async () => {
        try {
            const response = await fetch("http://localhost:5000/live_feed");
            if (response.ok) {
                const data = await response.json();
                setFeeds(data);
                localStorage.setItem("feeds", JSON.stringify(data));
            } else {
                console.error("Failed to fetch initial feed data");
            }
        } catch (error) {
            console.error("Error fetching initial feed data:", error);
        }
    };

    // Use useEffect to handle component mounting and unmounting
    useEffect(() => {
        // Fetch feed data from the server cache
        fetchInitialfeed();
        // Log a message when the socket connects to the server
        socket.on("connect", () => {
            console.log("Connected to server");
        });
        // Listen for incoming messages from the server
        socket.on("update_feed", (updatedFeeds) => {
            // Update the feed state with the new feed from the server
            setFeeds((prevFeeds) => {
                // Update Feed
                //const newFeeds = prevFeeds["feed"].concat(updatedFeeds["feed"]);
                const newFeeds = { feed: [] }
                newFeeds["feed"] = prevFeeds["feed"].concat(updatedFeeds["feed"]);
                // Save the new feed to localStorage
                localStorage.setItem("feeds", JSON.stringify(newFeeds));

                // Return the new feed
                return newFeeds;
            });
        });

        // Clean up event listener when component unmounts
        return () => {
            socket.off("update_feed");
        };
    }, []);
    return (
        <div id="score-feed">
            <h1>Feed</h1>
            <div id="feed-container">
                {feedLayout}
            </div>
        </div>
    )
}

export default Feed;