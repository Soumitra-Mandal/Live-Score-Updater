import { useState, useEffect } from "react";
import io from "socket.io-client";
import ScoreTable from "./ScoreTable";
// Initialize socket connection to the server
const socket = io("http://localhost:5000/");

const Score = () => {
  // Get the local score from localStorage and parse it as JSON
  const localScore = JSON.parse(localStorage.getItem("score"));

  // Set up state for the score
  const [score, setScore] = useState(
    localScore == null
      ? { runs: 0, wickets: 0, overs: 0, players: [] }
      : localScore
  );

  const [teamToggle, setToggle] = useState("A");
  // Function to fetch initial score data
  const fetchInitialScore = async () => {
    try {
      const response = await fetch("http://localhost:5000/update_score");
      if (response.ok) {
        const data = await response.json();
        setScore(data);
        localStorage.setItem("score", JSON.stringify(data));
      } else {
        console.error("Failed to fetch initial score data");
      }
    } catch (error) {
      console.error("Error fetching initial score data:", error);
    }
  };

  // Use useEffect to handle component mounting and unmounting
  useEffect(() => {
    // Fetch feed data from the server cache
    fetchInitialScore();
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
      socket.off("update_score");
    };
  }, []);
  const marginStyle = { margin: "20px" };

  const buttonStyle = { border: "0", backgroundColor: "green", color: "white", padding: "4px 6px", borderRadius: "10%" };
  const unselectedButtonStyle = { border: "0", backgroundColor: "grey", color: "white", padding: "4px 6px", borderRadius: "10%" };

  const handleToggle = (e) => {
    if (!e.target.id.includes(teamToggle)) {
      setToggle(teamToggle === 'A' ? 'B' : 'A');
    }
  }
  // Render the score component
  return (
    <div>
      <h1 style={marginStyle}>Score</h1>
      <span style={marginStyle}><button id="team_A" onClick={handleToggle} style={teamToggle === 'A' ? buttonStyle : unselectedButtonStyle}>RCB</button> vs <button id="team_B" onClick={handleToggle} style={teamToggle === 'B' ? buttonStyle : unselectedButtonStyle}>KKR</button></span>
      <h4 style={marginStyle}>
        {score.runs}-{score.wickets} in {score.overs} overs
      </h4>
      <ScoreTable players={score.players} />
    </div>
  );
};

export default Score;
