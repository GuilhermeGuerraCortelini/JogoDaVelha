import { useState, useEffect } from 'react';
import './JogoDavelha.css';

function JogoDavelha() {
  const emptyBoard = Array(9).fill("");

  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);

  // Estados para o placar
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    D: 0, // Empates
  });

  const handleCellClick = (index) => {
    // Não deixar substituir a jogada
    if (board[index] !== "" || winner) return;

    // Atualizar a jogada
    setBoard(board.map((item, itemIndex) => itemIndex === index ? currentPlayer : item));

    // Trocar jogador
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const checkWinner = () => {
    const possibleWaysToWin = [
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]],
      [board[0], board[3], board[6]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],
      [board[0], board[4], board[8]],
      [board[2], board[4], board[6]],
    ];

    for (const cells of possibleWaysToWin) {
      if (cells.every(cell => cell === "X")) {
        setWinner("X");
        return;
      }
      if (cells.every(cell => cell === "O")) {
        setWinner("O");
        return;
      }
    }

    if (board.every(item => item !== "")) {
      setWinner("D");
    }
  };

  useEffect(() => {
    checkWinner();
  }, [board]);

  useEffect(() => {
    if (winner) {
      setScores(prevScores => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
      }));
    }
  }, [winner]);

  const resetGame = () => {
    setCurrentPlayer("X");
    setBoard(emptyBoard);
    setWinner(null);
  };

  return (
    <main>
      <h1 className='title'>Jogo da Velha</h1>

      <div className='scoreboard'>
        <h2>Placar</h2>
        X: {scores.X} |
        O: {scores.O} |
        Empates: {scores.D}
      </div>

      <div className={`board ${winner ? "GameOver" : ""}`}>
        {board.map((item, index) => (
          <div
            key={index}
            className={`cell ${item}`}
            onClick={() => handleCellClick(index)}
          >
            {item}
          </div>
        ))}
      </div>

      {winner && (
        <footer>
          <h2 className='winnerMessage'>
            {winner === "D" ? (
              <span className={winner}>Empatou!</span>
            ) : (
              <>
                <span className={winner}>{winner}</span> Venceu!
              </>
            )}
          </h2>
        </footer>
      )}
      <button onClick={resetGame}>Recomeçar</button>
    </main>
  );
}

export default JogoDavelha;
