import "./scoreTable.css";

const ScoreTable = ({ players }) => {
  const rows = players.map((player) => (
    <tr key={player.position}>
      <td>
        {player.name}
        {!player.isDismissed && "*"}
      </td>
      <td>{player.runs}</td>
      <td>{player.balls}</td>
      <td>{player.fours}</td>
      <td>{player.sixes}</td>
    </tr>
  ));

  return (
    <table id="score-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Runs</th>
          <th>Balls</th>
          <th>4s</th>
          <th>6s</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default ScoreTable;
