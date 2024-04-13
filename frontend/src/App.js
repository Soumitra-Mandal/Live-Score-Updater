import "./App.css";
import Score from "./components/Score";
import Feed from "./components/Feed";

function App() {
  return (
    <div className="App">
      <Score/>
      <hr style={{border:"0.1px solid #ddd"}}/>
      <Feed/>
    </div>
  );
}

export default App;
