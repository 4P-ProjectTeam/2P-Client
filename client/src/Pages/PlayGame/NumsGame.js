import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import Gameover from '../../Components/PlayGame/Gameover';
import MoleScoreCard from '../../Components/PlayGame/MoleScoreCard';
import UserCard from '../../Components/PlayGame/userCard/UserCard';
import RivalCard from '../../Components/PlayGame/userCard/RivalCard';
import MobileUserCard from '../../Components/PlayGame/userCard/mobileUser';
import Emoji from '../../Components/PlayGame/Emoji';

import { Grid, Typography, Tooltip, Fab, Button, Paper, GridList, GridListTile, GridListTileBar, Input } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { isDeleteExpression } from 'typescript';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { KeyPad } from './keyPad';

import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import socketio from 'socket.io-client';
let socket;


const styles = (theme) => ({
  Paper: {
    backgroundColor: 'white',
    background: '#00babd',
  },
  root: {
    padding: theme.spacing(2, 4, 4, 4),
    backgroundColor: 'white',
    height: '100%',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(13),
    marginLeft: '10px',
  },
  pos: {
    color: '#000',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    font: '5px',
  },
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  rootroot: {
    position: 'fixed',
    right: '1%',
    bottom: '100px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 200,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

class NumsGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: '',
      myScore: 0,
      opponentScore: 0,
      opponentUsername: '',
      width: document.body.clientWidth / 4,
      height: document.body.clientWidth / 2,
      currentMole: 0,
      clickedNums: 0,
      count: '대기',
      rivalCount: '대기',

      resultPad: [],

      RivalNums: [
        {number: '1234', result: '1S1B'},
        {number: '1234', result: '1S1B'},
        {number: '1234', result: '1S1B'},
      ],
      myNums: [
        {number: '1234', result: '1S1B'},
        {number: '1234', result: '1S1B'},
        {number: '1234', result: '1S1B'},
      ],

      board: true,
      myTurn: true,
      wrongInput: false,

      // emoji
      open: false,
      showEmojis: false,
      isActive: false,

      // userData
      userName: '',
      rivalName: '',
      userAvatar: 0,
      rivalAvatar: 0,

      warning: 0,
      warningRival: 0,

      canvasHeight: 0,
    };
    this.canvas = null;
    this.ctx = null;
    this.stageWidth = null;
    this.stageHeight = null;

    this.clicked = true;
    this.radius = this.state.width / 12;

    this.cursorX = null;
    this.cursorY = null;
    this.cursorEnter = false;
    this.cursorClick = false;

    this.out = false;
    this.result = false;

    

    let gifImages = [];

    this.tileData = [];

    this.props.gifEmoji.map((item) => {
      this.tileData.push({ img: item });
    });

    // this.numPad = [];
    // for (let i = 0; i < 14; i++) {
    //   this.numPad.push(new KeyPad(this.state.width, this.state.height, this.state.width / 10, i));
    // }
  }

  componentDidMount() {
    socket = socketio.connect('http://localhost:3006');
    (() => {
      socket.emit('joinRoom', {
        username: cookie.load('username'),
        room: cookie.load('selectedRoom'),
        avatarId: cookie.load('avatarId'),
      });
    })();

    
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    // 화면크기 재설정 이벤트
    this.resize();
    window.requestAnimationFrame(this.animate.bind(this));

    window.addEventListener('resize', this.resize.bind(this), false);

    // 마우스 클릭이벤트
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.state.myTurn) this.mousePressed(e.layerX, e.layerY);
    }, false);

    this.canvas.addEventListener('mouseup', (e) => {}, false);

    // 마우스 움직임
    this.canvas.addEventListener('mousemove', (e) => {
      this.cursorEnter = true;
      this.cursorX = e.layerX;
      this.cursorY = e.layerY;
    });

    this.canvas.addEventListener('mouseleave', (e) => {
      this.cursorEnter = false;
    });

    // 유저데이터 가져오기
    socket.on('loadUsers', (data) => {
      for(let key in data){
        if(data[key].username === cookie.load('username')){
          this.setState({ 
            userAvatar: this.props.avatarImg[data[key].avatarId],
            userName: data[key].username
          })
          this.userAvatarId = data[key].avatarId  // 아바타아이디 백업
        } else { 
          this.setState({
            rivalAvatar: this.props.avatarImg[data[key].avatarId],
            rivalName: data[key].username
          })
          this.rivalAvatarId = data[key].avatarId   // 아바타아이디 백업
        }
      }
    })

    // 서버에서 오는 결과
    socket.on('res', (data) => {
      // 본인의 입력결과
      if (data.username === cookie.load('username')) {
        if (data.num === '----') this.setState({ warning: this.state.warning + 1 });

        this.setState({ board: false });
        let input = { number: data.num, result: data.res };
        this.setState({ myNums: [...this.state.myNums, input] });
        this.result = data.num;
      } 
      // 라이벌의 입력결과
      else {
        if (data.num === '----') this.setState({ warningRival: this.state.warningRival + 1 });

        this.setState({ board: false });
        let input = { number: data.num, result: data.res };
        this.setState({ RivalNums: [...this.state.RivalNums, input] });
        this.result = data.num;
      }
    });

    socket.on('turn', (username) => {
      if (username === cookie.load('username')) {
        //본인 차례
        this.turnChange(true);
      } else {
        //상대방 차례
        this.turnChange(false);
        if(!this.state.rivalName || this.state.rivalName === 'COMPUTER') {
          let ranNum = Math.floor(Math.random()*4)
          setTimeout(() => {
            this.computerInput()
          }, 10000 + (ranNum * 4000))
        }
      }
    });

    socket.on('stop', () => {
      console.log('stop');
      clearInterval(this.timer);
      setTimeout(() => {
        clearInterval(this.timer);
      }, 1);
    });

    socket.on('end', (winner) => {
      if (winner === null || winner === 'COMPUTER') {
        this.setState({ winner: 'Computer' });
      } else {
        this.setState({ winner: winner });
      }
      socket.disconnect();
    });

    socket.on('connectError', () => {
      // this.socket.disconnect();
      alert('잘못된 접근입니다, 뒤로가기를 눌러주세요');
    })

    socket.on('getEmoji', (data) => {
      this.activeRivalEmoji(JSON.parse(data));
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this), false);
    this.numPad = [];
    socket.disconnect();
  }

  eraseAll() {
    this.state.resultPad.map((item) => {
      if (item === 0) item = 10;
      this.numPad[item].removed();
    });
    this.setState({ resultPad: [] });
  }

  mousePressed(mouseX, mouseY) {
    for (let i = 0; i < this.numPad.length; i++) {
      // 키 패드 클릭
      let clickedMole = this.numPad[i].clicked(
        mouseX,
        mouseY,
        i,
        this.state.resultPad.length === 4
      );

      if (clickedMole || clickedMole === 0) {
        if (this.state.resultPad.includes(clickedMole) === false) {
          // 하나의 입력된 숫자를 제거
          if (clickedMole === 11) {
            let del = [...this.state.resultPad];
            let deleted = del.pop();
            if (typeof deleted === 'number') {
              if (deleted === 0) deleted = 10;
              this.numPad[deleted].removed();
              this.setState({ resultPad: [...del] });
            }
          }
          // 모든 입력된 숫자를 제거
          else if (clickedMole === 12) {
            this.eraseAll();
          }
          // 입력된 값들을 서버로 전송
          else if (clickedMole === 13) {
            if (this.state.resultPad.length === 4) {
              let result = '';
              this.state.resultPad.map((item) => {
                result = result + String(item);
              });
              // 서버로 전송
              socket.emit('submit', {
                username: cookie.load('username'),
                room: cookie.load('selectedRoom'),
                arr: result.split('').map((i) => {
                  return parseInt(i);
                }),
              });
              // 입력된 버튼 초기화
              this.eraseAll();
              // 현황판을 끈다
              this.setState({ board: false });
            } else if (clickedMole !== 4 && !this.state.wrongInput) {
              this.setState({ 
                board: false,
                wrongInput: true,
              });
              this.result = '네자리를 입력하세요';
            }
          }

          // 입력된 숫자를 화면에 출력
          else if (this.state.resultPad.length !== 4) {
            this.setState({ resultPad: [...this.state.resultPad, clickedMole] });
          }
        }
      }
    }
  }

  defineRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // 처리된 결과값
  inputResult() {
    if (this.result.length > 4) {
      this.ctx.font = `700 ${this.state.width / 10}px san serif`;
      this.ctx.fillText(`${this.result}`, this.state.width / 10, this.state.height / 3.5);
    } else {
      this.ctx.font = `900 ${this.state.width / 4}px san serif`;
      this.ctx.fillText(`${this.result}`, this.state.width / 4.5, this.state.height / 3);
    }
    setTimeout(() => {
      this.setState({ 
        board: true,
        wrongInput: false,
      });
      this.result = ''
    }, 2000);
  }

  // 일정 시간 후에 현황판 출력
  printBoard() {
    
    // 유저가 입력한 게임결과 출력
    this.state.myNums.map((item, index) => {
      this.ctx.font = `700 ${this.state.width / 12}px san serif`;
      this.ctx.fillText(
        `${item.number}`,
        this.state.width / 1.9,
        this.state.height / 8 + (this.state.height / 13) * index
      );

      this.ctx.font = `300 ${this.state.width / 15}px san serif`;
      this.ctx.fillText(
        `${item.result}`,
        this.state.width / 1.4,
        this.state.height / 8 + (this.state.height / 13) * index
      );
    });

    // 상대방이 입력한 게임결과 출력
    this.state.RivalNums.map((item, index) => {
      this.ctx.font = `700 ${this.state.width / 12}px san serif`;
      this.ctx.fillText(
        `${item.number}`,
        this.state.width / 7,
        this.state.height / 8 + (this.state.height / 13) * index
      );

      this.ctx.font = `300 ${this.state.width / 15}px san serif`;
      this.ctx.fillText(
        `${item.result}`,
        this.state.width / 3,
        this.state.height / 8 + (this.state.height / 13) * index
      );
    });
  }

  // 화면그리기
  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // this.numPad의 모든 요소를 각자의 위치에 생성
    for (let i = 0; i < this.numPad.length; i++) {
      this.numPad[i].draw(this.ctx, this.canvas.width, this.canvas.height, i);
    }

    this.ctx.fillStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.shadowColor = '#c9c9c9';
    this.ctx.shadowBlur = this.canvas.width/40;
    this.ctx.fillRect(
      this.state.width / 12,
      this.state.height / 15,
      this.state.width / 1.2,
      this.state.height / 2.5
    );

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#000';
    
    if (this.state.board) {
      this.printBoard();
    } else {
      // 채점결과출력
      this.inputResult();
    }

    // 입력된 숫자 출력
    this.state.resultPad.map((num, index) => {
      let x = this.state.width / 6.5 + (this.state.width / 7) * index;
      let y = this.state.height / 1.8;
 
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill();

      this.ctx.shadowBlur = 0;
      // 텍스트
      this.ctx.fillStyle = '#000';
      this.ctx.font = `${this.radius * 1.5}px serif`;
      this.ctx.fillText(`${num}`, x - this.radius / 2.7, y + this.radius / 2.7);
    });
  }

  // 화면크기 재설정 함수
  resize() {
    
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientWidth;

    let mobileUserCardHeight = document.querySelector('#mobileUser') ? document.querySelector('#mobileUser').clientHeight : 0;

    if (document.body.clientWidth > 650) {
      this.canvas.width = Math.floor(this.stageWidth / 3.5);
      this.canvas.height = Math.floor(this.stageWidth / 2);
    } else if (window.innerHeight - mobileUserCardHeight < Math.floor(this.stageWidth * 1.4)) {
      // 캔버스가 커서 userCard와 겹치는 경우
      console.log('겹친다')
      this.canvas.height = window.innerHeight - mobileUserCardHeight * 1.4;
      this.canvas.width = this.canvas.height / 1.8
    } else {
      // this.canvas.width = Math.floor(this.stageWidth * 0.8);
      this.canvas.width = Math.floor(this.stageWidth * 0.8);
      this.canvas.height = Math.floor(this.stageWidth * 1.4);
    }

    this.numPad = [];
    for (let i = 0; i < 14; i++) {
      this.numPad.push(new KeyPad(this.canvas.width, this.canvas.height, this.canvas.width / 10, i));
    }
    
    this.setState({ width: this.canvas.width, height: this.canvas.height });
    this.setState({canvasHeight : document.querySelector('#numsgame').clientHeight})
  }

  turnChange(isMyturn) {
    this.setState({ myTurn: isMyturn });
    this.countdown(isMyturn);
  }

  countdown(t) {
    // 이전 카운트다운을 취소, 초기화
    clearInterval(this.timer);
    this.setState({ count: 60 });

    // 카운트다운 시작
    this.timer = setInterval(() => {
      this.setState({ count: this.state.count - 1 });
      if (this.state.count === 0) {
        if (t) socket.emit('endTurn');
        this.setState({ count: '대기' })
        clearInterval(this.timer);
      }
    }, 1000);
  }

  activeEmoji(gif) {
    this.setState({ userAvatar: gif });
    socket.emit('sendEmoji', JSON.stringify(gif));

    setTimeout(() => {
      this.setState({ userAvatar: this.props.avatarImg[this.userAvatarId], isActive: !this.state.isActive });
    }, 2500);
  }

  activeRivalEmoji(gif) {
    this.setState({ rivalAvatar: gif });
    setTimeout(() => {
      this.setState({ rivalAvatar: this.props.avatarImg[this.rivalAvatarId] });
    }, 2500);
  }

  openEmojiList() {
    this.setState({ showEmojis: !this.state.showEmojis });
  };

  computerModeStart() {
    socket.emit('joinRoom',  {
      username: 'COMPUTER', 
      room: this.state.userName, 
      avatarId: 12,
    })
  }

  computerInput() {
    let logs = this.state.myNums.concat(this.state.RivalNums)
    let arr = this.computerLogic(logs)
    let ranNum = Math.floor(Math.random() * arr.length);
    let input = String(arr[ranNum]).split('').map((num) => Number(num))

    socket.emit('submit', {
      username: 'COMPUTER',
      room: cookie.load('username'),
      arr: input,
    });
  }

  computerLogic(logs) {
    let answer = [];
    for(let i = 999; i < 9876; i++) { //모두 탐색
      let num = String(i);
      //중복숫자 제외 ex 1123
      if(num.charAt(0) === num.charAt(1) || num.charAt(0) === num.charAt(2) || num.charAt(0) === num.charAt(3) || 
          num.charAt(1) === num.charAt(2) || num.charAt(1) === num.charAt(3) || num.charAt(2) === num.charAt(3)) continue;
      let flag = true;
      for (let j = 0; j < logs.length; j++) {
        if (logs[j].number === '----') continue;
        let cur = logs[j].number;
        let strike
        let ball
        if(logs[j].result !== 'OUT') {
          strike = Number(logs[j].result[0]);
          ball = Number(logs[j].result[2]);
        } 
        else {
          strike = 0;
          ball = 0;
        }
        //strike
        let countStrike = 0;
        for (let k = 0; k < 4; k++) {
          if (num.charAt(k) === cur.charAt(k)) countStrike++;
        }
        if (countStrike !== strike) {
          flag = false;
          break;
        } 
        //ball
        let countBall = 0;
        for (let k = 0; k < 4; k++) {
          if (num.indexOf(cur.charAt(k)) !== -1) countBall++;
        }
        if (countBall - countStrike !== ball) {
          flag = false;
          break;
        }
      }
      if(flag) answer.push(i);
    }
    return answer;
  }

  
  render() {
    const { classes } = this.props;
    let style = {
      position: 'fixed',
      width: '90vw',
      height: '60vw',
      top: '50%',
      right: '50%',
      marginTop: `-30vw`,
      marginRight: `-45vw`,
    }
    let mobileStyle = {
      position: 'fixed',
      width: '90vw',
      height: this.state.height,
      top: '5vh',
      right: '50%',
      marginRight: `-45vw`,
    }

    return (
      <Grid container direction='row' justify='space-evenly' alignItems='center' 
        id='numsgame'
        style={(document.body.clientWidth > 650 ? style : mobileStyle)}
      >
        {this.state.winner !== '' 
          ? this.state.rivalName === 'COMPUTER'
            ? <Gameover winner={this.state.winner} isComputer={true}/>
            : <Gameover winner={this.state.winner} />
          : null}

        {document.body.clientWidth > 650 ? (
          <Grid item>
            <RivalCard 
              width={this.state.width}
              username={this.state.rivalName} 
              theNumber={this.state.myTurn ? '대기' : this.state.count}
              avatar={this.state.rivalAvatar}
              computerModeStart={this.computerModeStart.bind(this)}
              myTurn={this.state.myTurn}
              yellowCard={this.state.warningRival}
            />
          </Grid>
        ) : null }

        <Paper
          id='paper'
          style={{
            width: this.state.width,
            height: this.state.height,
            borderRadius: `${this.state.width/10}px`,
            // marginTop: '10vh',
          }}
        >
          <canvas id='canvas' />
          <MobileUserCard 
            myTurn={this.state.myTurn}
            rivalName={this.state.rivalName}
            rivalAvatar={this.state.rivalAvatar}
            theNumber={this.state.count}
            warningAlert={this.state.wrongInput}
            userAvatar={this.state.userAvatar}
            userName={cookie.load('username')}
            computerModeStart={this.computerModeStart.bind(this)}
          />
        </Paper>

        {document.body.clientWidth > 650 ? (
          <Grid item>
            <UserCard 
              width={this.state.width} 
              userAvatar={this.state.userAvatar} 
              userName={cookie.load('username')}
              theNumber={this.state.myTurn ? this.state.count : '대기'} 
              myTurn={this.state.myTurn}
              warningAlert={this.state.wrongInput}
              yellowCard={this.state.warning}
            />
          </Grid>
        ) : null }

        


        {document.body.clientWidth > 650 ? (
          <Emoji 
            openEmojiList={this.openEmojiList.bind(this)} 
            showEmojis={this.state.showEmojis}
            activeEmoji={this.activeEmoji.bind(this)}
            tileData={this.tileData}
          />
        ) : null }
      </Grid>
    );
  }
}

NumsGame.propsTypes = {
  classes: PropTypes.object.isRequired,
};

const mapReduxStateToReactProps = (state) => {
  return {
    gifEmoji: state.currentGame.gif,
    avatarImg: state.login.avatar,
  };
};

export default connect(mapReduxStateToReactProps)(withStyles(styles)(NumsGame));
