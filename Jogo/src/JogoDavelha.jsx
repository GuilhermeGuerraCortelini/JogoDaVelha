import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './JogoDavelha.css';

function JogoDavelha() {
  // Criar um tabuleiro vaziu
  const emptyBoard = Array(9).fill("");

  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [botDifficulty, setBotDifficulty] = useState("Fácil");

  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    D: 0, // Empates
  });

  // Storage
  useEffect(() => {
    const savedGame = localStorage.getItem('gameState');
    if (savedGame) {
      const { board, currentPlayer, winner, scores, botDifficulty } = JSON.parse(savedGame);
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setWinner(winner);
      setScores(scores);
      setBotDifficulty(botDifficulty);
    }
  }, []); //apenas uma vez

  useEffect(() => {
    const gameState = { board, currentPlayer, winner, scores, botDifficulty };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [board, currentPlayer, winner, scores, botDifficulty]);

  const handleCellClick = (index) => {
    // Não permitir jogada se a célula não estiver vazia, se houver um vencedor, ou se for a vez do bot
    if (board[index] !== "" || winner || currentPlayer === "O") return;

    // Atualizar a jogada do jogador
    const newBoard = board.map((item, itemIndex) => itemIndex === index ? currentPlayer : item);
    setBoard(newBoard);

    // Verifica se há um vencedor após a jogada do jogador
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;  // Interrompe o fluxo se houver vencedor
    }

    setCurrentPlayer("O"); // Define a vez do bot
  };

  const botPlay = () => {
    // Se houver um vencedor, o bot não joga
    if (winner) return;

    let index;

    // Jogo aleatório
    const emptyIndices = board.map((value, idx) => value === "" ? idx : null).filter(idx => idx !== null);
    index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    if (index !== undefined) {
      const newBoard = board.map((item, itemIndex) => itemIndex === index ? "O" : item);
      setBoard(newBoard);

      // Verifica se há um vencedor após a jogada do bot
      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        return;  // Interrompe se o bot vencer
      }

      setCurrentPlayer("X");
    }
  };

  useEffect(() => {
    if (currentPlayer === "O" && !winner) {
      setTimeout(() => botPlay(), 500); // Delay para o bot jogar
    }
  }, [currentPlayer, winner]);

  useEffect(() => {
    if (winner) {
      setScores(prevScores => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
      }));
      setCurrentPlayer("X");
    }
  }, [winner]);

  const checkWinner = (newBoard) => {
    const possibleWaysToWin = [
      [newBoard[0], newBoard[1], newBoard[2]],
      [newBoard[3], newBoard[4], newBoard[5]],
      [newBoard[6], newBoard[7], newBoard[8]],
      [newBoard[0], newBoard[3], newBoard[6]],
      [newBoard[1], newBoard[4], newBoard[7]],
      [newBoard[2], newBoard[5], newBoard[8]],
      [newBoard[0], newBoard[4], newBoard[8]],
      [newBoard[2], newBoard[4], newBoard[6]],
    ];

    for (const cells of possibleWaysToWin) {
      if (cells.every(cell => cell === "X")) {
        return "X";
      }
      if (cells.every(cell => cell === "O")) {
        return "O";
      }
    }

    if (newBoard.every(item => item !== "")) {
      return "D"; // Empate
    }

    return null; // Sem vencedor ainda
  };

  // Resetar o Jogo
  const resetGame = () => {
    setBoard(emptyBoard);
    setWinner(null);
    setCurrentPlayer("X");
  };

  // Zerar o placar
  const zerar = () => {
    setScores({
      X: 0,
      O: 0,
      D: 0,
    });
  };

  return (
    <main className='container'>
      <h1 className='text-center'>Jogo da Velha</h1>

      <div className='text-center mb-4'>
        <h4>Placar</h4>
        X: {scores.X} | O: {scores.O} | Empates: {scores.D}
        <br />
        <div className='d-flex justify-content-center mt-2'>
          <button className='btn btn-danger mx-2' onClick={zerar}>Zerar</button>
          <button className='btn btn-primary mx-2' onClick={resetGame}>Recomeçar</button>
        </div>
      </div>

      <div className={`board ${winner ? "GameOver" : ""}`}>
        {board.map((item, index) => (
          <div
            key={index}
            className={`cell ${item} d-flex justify-content-center align-items-center border rounded m-1`}
            onClick={() => handleCellClick(index)}
            style={{ width: '240px', height: '200px', cursor: 'pointer', fontSize: '24px', textAlign: 'center' }}
          >
            {item}
          </div>
        ))}
      </div>

      {winner && (
        <footer className='text-center mt-4'>
          <h2 className='winnerMessage'>
            {winner === "D" ? (
              <span className='text-warning'>Empatou!</span>
            ) : (
              <>
                <span className={winner}>{winner} </span> Venceu!
              </>
            )}
          </h2>
        </footer>
      )}
    </main>
  );
}

export default JogoDavelha;
