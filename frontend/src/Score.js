import { useState, useEffect } from "react";
import io from "socket.io-client";

const Score = () => {
  // Initialize socket connection to the server
  const socket = io("http://localhost:5000/");

  // Get the local score from localStorage and parse it as JSON
  const localScore = JSON.parse(localStorage.getItem("score"));

  // Set up state for the score
  const [score, setScore] = useState(
    localScore == null
      ? { runs: 0, wickets: 0, overs: 0, players: [] }
      : localScore
  );

  // Use useEffect to handle component mounting and unmounting
  useEffect(() => {
    // Log a message when the socket connects to the server
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    // Listen for incoming messages from the server
    socket.on("update_score", (updatedScore) => {
      // Update the score state with the new score from the server
      setScore((prevScore) => {
        // Create a copy of the previous score
        const newScore = { ...prevScore };

        // Update only the properties that have changed
        Object.keys(updatedScore).forEach((key) => {
          if (prevScore[key] !== updatedScore[key]) {
            newScore[key] = updatedScore[key];
          }
        });

        // Save the new score to localStorage
        localStorage.setItem("score", JSON.stringify(newScore));

        // Return the new score
        return newScore;
      });
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("message");
    };
  }, [socket]);

  // Render the score component
  return (
    <div>
      <h1>Score</h1>
      <p>
        {score.runs}-{score.wickets} in {score.overs} overs
      </p>
    </div>
  );
};

export default Score;