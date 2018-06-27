import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// class Square extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       value: null,
//     };
//   }
//     render() {
//       return (
//         <button className="square" onClick={() => this.props.onClick()}>
//           {this.props.value}
//         </button>
//       );
//     }
//   }
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      <a href="#" className={props.value}></a>
    </button>
  );
}
  class Board extends React.Component {
    constructor() {
      super();
      this.lines1 = [];
      this.lines2 = [];
      this.lines3 = [];
    }
    renderSquare(i) {
      let win = this.props.winlines.indexOf(i) !== -1 ? 'win': '';
      return (
        <Square 
          key={i}
          value={this.props.squares[i] + ' ' + win}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
    render() {
      let lines = {
        lines1: [],
        lines2: [],
        lines3: [],
      }
      let z = 0;
      for(let i = 0; i<= 2; i++) {
        for (let j = 0; j <= 2; j++) {
          lines['lines' + (i + 1)].push(this.renderSquare(z));
          z+=1;
        }
      }
      Object.keys(lines).forEach((val, key) => {
        this[val] = lines[val];
      });
      return (
        <div>
          <div className="board-row">
           {this.lines1}
          </div>
          <div className="board-row">
            {this.lines2}
          </div>
          <div className="board-row">
            {this.lines3}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor() {
      super();
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }
    handleClick(i) {
      // const history = [...this.state.history];
      // const current = history[history.length - 1]; //取最后一位也就是最新的棋谱
      // const squares = [...current.squares];
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = [...current.squares];
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'cha' : 'yuan';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) ? false : true,
      });
    }
    prevAct() {
      let step = this.state.stepNumber === 0 ? 0 : this.state.stepNumber - 1;
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) ? false : true,
      });
    }
    nextAct() {
      let num = this.state.stepNumber;
      let step = num === this.state.history.length - 1 ? this.state.history.length - 1 : num + 1;
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) ? false : true,
      });
    }
    resetAct() {
      this.setState({
        stepNumber: 0,
        xIsNext: true,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const result = calculateWinner(current.squares);
      const winlines = result ? result.lines : [];
      const moves = history.map((step, move) => {
        const desc = move ?
          'Move #' + move :
          'Game start';
        const currentAct = move === this.state.stepNumber ? 'currentAct' : ''; 
        return (
          <li key={move}>
            <label className={currentAct} href="#" onClick={() => this.jumpTo(move)}>{desc}</label>
          </li>
        );
      });
      let status;
      if (result) {
        status = 'Winner: ' + (result.winner === 'cha' ? '黑棋' : '白棋');
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? '黑棋' : '白棋');
      }
      return (
        <div className="game">
          <h1 className="game-title">三子棋游戏，邀请你的小伙伴一起来玩吧~</h1>
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winlines = {winlines}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div className="operate">
              <button onClick={(i) => this.prevAct()}>上一步</button>
              <button onClick={(i) => this.resetAct()}>刷新</button>
              <button onClick={(i) => this.nextAct()}>下一步</button>
            </div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner:squares[a],
          lines: lines[i],
        };
      }
    }
    return null;
  }
  
