import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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
          'Move 第' + move + '步' :
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

  // ===========================
  function formatDate(date) {
    return date.toLocaleDateString();
  }
  
  function Avatar(props) {
    return (
      <img 
        className="Avatar"
        src={props.user.avatarUrl}
        alt={props.user.name} 
      />
    );
  }
  function CommentInfo(props) {
    return (
      <div>
        <div className="Comment-text">
          {props.info.text}
        </div>
        <div className="Comment-date">
          {formatDate(props.info.date)}
        </div>
      </div>
    )
  }
  function UserInfo(props) {
    return (
      <div className="UserInfo">
        <Avatar user={props.user} />
        <div className="UserInfo-name">
          {props.user.name}
        </div>
      </div>
    );
  }
  
  function Comment(props) {
    return (
      <div className="Comment">
        <UserInfo user={props.author} />
        <CommentInfo info={props.info}  />
      </div>
    );
  }
  
  const comment = {
    info:{
      date: new Date(),
      text: 'I hope you enjoy learning React!',
     },
    author: {
      name: 'Hello Kitty',
      avatarUrl: 'http://placekitten.com/g/64/64'
    }
  };
  class IllegalButton extends React.Component{
    constructor(props) {
      super();
      this.i = 0;
    }
    changeText () {
      this.props.text = 'a' + this.i;
      this.i += 1;
    }
      render() {
        return (
          <div>
            <button onClick={() => {this.changeText()}}>changeText</button>
            <div>
              {this.props.text}
            </div>
          </div>
        )
      }
    }
  ReactDOM.render(
    <Comment
      info = {comment.info}
      author={comment.author} />,
    document.getElementById('comment')
  );
  ReactDOM.render(
    <IllegalButton text="hello world!!" />,
    document.getElementById('illegal')
  );

  //====================
  const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
  };
  
  function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
  
  function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
  }
  
  function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
      return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
  }
  
  function BoilingVerdict(props) {
    if (props.celsius >= 100) {
      return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
  }
  
  class TemperatureInput extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(e) {
      this.props.onTemperatureChange(e.target.value);
    }
  
    render() {
      const temperature = this.props.temperature;
      const scale = this.props.scale;
      return (
        <fieldset>
          <legend>Enter temperature in {scaleNames[scale]}:</legend>
          <input value={temperature}
                 onChange={this.handleChange} />
        </fieldset>
      );
    }
  }
  
  class Calculator extends React.Component {
    constructor(props) {
      super(props);
      this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
      this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
      this.state = {temperature: '', scale: 'c'};
    }
  
    handleCelsiusChange(temperature) {
      this.setState({scale: 'c', temperature});
    }
  
    handleFahrenheitChange(temperature) {
      this.setState({scale: 'f', temperature});
    }
  
    render() {
      const scale = this.state.scale;
      const temperature = this.state.temperature;
      const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
      const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
  
      return (
        <div>
          <TemperatureInput
            scale="c"
            temperature={celsius}
            onTemperatureChange={this.handleCelsiusChange} />
          <TemperatureInput
            scale="f"
            temperature={fahrenheit}
            onTemperatureChange={this.handleFahrenheitChange} />
          <BoilingVerdict
            celsius={parseFloat(celsius)} />
        </div>
      );
    }
  }
  
  ReactDOM.render(
    <Calculator />,
    document.getElementById('temptrue')
  );

  //=======================
  class SearchBar extends React.Component{
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
          <input value={this.props.value} onChange={this.props.onChange} />
        </div>
      )
    }
  }
  class TableTd extends React.Component{
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="shopping-table-td">
          {this.props.value}
        </div>
      )
    }
  }
  class TableTr extends React.Component{
    constructor(props) {
      super(props);
    }
    render() {
      let data = this.props.title.map((val) => {
        return (
          <TableTd value={val} />
        )
      });
      return (
        <div>
          {data}
        </div>
      )
    }
  }
  class TableTitle extends React.Component{
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
          <TableTr title={this.props.title} />
        </div>
      )
    }
  }
  class ProductTable extends React.Component{
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
         <TableTitle title={this.props.title} />
        </div>
      )
    }
  }
  class FilterableProductTable  extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: '',
      }
      this.handleValueChange = this.handleValueChange.bind(this);
      this.title = ['Name', 'Price'];
    }
    handleValueChange(value) {
      this.setState({
        value: value
      });
    }
    render() {
      return (
        <div className="shoppingList">
          <SearchBar value={this.state.value} onChange={this.handleValueChange} />
          <ProductTable title={this.title} />
        </div>
      )
    }
  }
  ReactDOM.render(
    <FilterableProductTable />,
    document.getElementById('shopping')
  );

