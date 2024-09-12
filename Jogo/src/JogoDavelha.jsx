import { useState, useEffect } from 'react'
import './JogoDavelha.css'

function JogoDavelha() {
  const emptyBoard = Array(9).fill("")

  const [board, setBoard] = useState(emptyBoard)
  const [currentPlayer, setCurrentPlayer] = useState("X")
  const [winner, setWinner] = useState()
  const [placarX, setPlacarX] = useState(0)
  const [placarO, setPlacarO] = useState(0)

  const handleCellClick = (index) => {
    // Não deixar substituir a jogada
    if (board[index] !== "") return null

    // finalizar jogo
    if (winner) return null

    // jogadas
    setBoard(
      board.map((item, itemIndex) => itemIndex === index ? currentPlayer : item)
    )

    // trocar jogador
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  const checkWinner = () => {

    // existem 8 possibilidades de ganhar o jogo:
    const possibleWaysToWin = [
      // Horizontal
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]],

      // Vertical
      [board[0], board[3], board[6]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],

      //Diagonal
      [board[0], board[4], board[8]],
      [board[2], board[4], board[6]],
    ]

    // Verificar vencedor
    possibleWaysToWin.forEach(cells => {
      if (cells.every(cell => cell === "X")) {
        setWinner("X")
        setPlacarX(placarX++)
      }
      if (cells.every(cell => cell === "O")) {
        setWinner("O")
        setPlacarO(placarO++)
      }
    })

    checkDraw()
  }

  const checkDraw = () => {
    // ver se todos estão preenchidos 
    if (board.every(item => item !== "")) {
      setWinner("D")
    }
  }

  useEffect(checkWinner, [board])

  // Resetar o jogo
  const resetGame = () => {
    setCurrentPlayer("X")
    setBoard(emptyBoard)
    setWinner(null)
  }

  return (
    <main>
      <h1 className='title'>Jogo da velha</h1>
      <span>Placar: X {placarX} / O {placarO}</span>
      <div className={`board ${winner ? "GameOver" : ""}`}>
        {board.map((item, index) => (
          <div key={index} className={`cell ${item}`} onClick={() => handleCellClick(index)}>
            {item}
          </div>
        ))}
      </div>
      <button onClick={resetGame}>Recomeçar</button>
      {winner &&
        <footer>
          {winner === "D" ?
            <h2 className='winnerMessage'>
              <span className={winner}>Empatou!</span>
            </h2> :
            <h2 className='winnerMessage'>
              <span className={winner}>{winner} </span>
              Venceu!
            </h2>
          }
        </footer>
      }
    </main>
  )
}

export default JogoDavelha
