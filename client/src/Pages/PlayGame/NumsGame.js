import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import Gameover from '../../Components/PlayGame/Gameover';
import MoleScoreCard from '../../Components/PlayGame/MoleScoreCard';

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
    margin: theme.spacing(3, 3),
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
      count: 60,

      resultPad: [],

      RivalNums: [],
      myNums: [],

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

    this.numPad = [];

    let gifImages = [];

    this.tileData = [];

    this.props.gifEmoji.map((item) => {
      this.tileData.push({ img: item });
    });

    for (let i = 0; i < 14; i++) {
      this.numPad.push(new KeyPad(this.state.width, this.state.height, this.state.width / 10, i));
    }
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

    // 마우스 클릭이벤트
    this.canvas.addEventListener(
      'mousedown',
      (e) => {
        if (this.state.myTurn) {
          this.mousePressed(e.layerX, e.layerY);
        }
      },
      false
    );

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
      console.log(data)
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
      console.log(data)
      // 본인의 입력결과
      if (data.username === cookie.load('username')) {
        if (data.num === '----') this.setState({ warning: this.state.warning + 1 });

        this.setState({ board: false });
        let input = { number: data.num, result: data.res };
        this.setState({ myNums: [...this.state.myNums, input] });
        this.result = true;
        this.inputResult();
      } 
      // 라이벌의 입력결과
      else {
        if (data.num === '----') this.setState({ warningRival: this.state.warningRival + 1 });

        this.setState({ board: false });
        let input = { number: data.num, result: data.res };
        this.setState({ RivalNums: [...this.state.RivalNums, input] });
        this.out = true;
        this.inputResult();
      }
    });

    socket.on('turn', (username) => {
      console.log('username: ', username);
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
            } else {
              this.setState({ wrongInput: true });
              setTimeout(() => this.setState({ wrongInput: false }), 2000);
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

  createDate(number, strike, ball, out) {
    return { number, strike, ball, out };
  }

  // 상대방의 데이터 출력
  getRivalData = async (input) => {
    if (input.number === '----') this.setState({ warningRival: this.state.warningRival + 1 });

    await this.setState({ board: false });
    await this.setState({ RivalNums: [...this.state.RivalNums, input] });
    this.out = true;
    this.inputResult();
  };

  // 유저의 데이터 출력
  getMyData = async (input) => {
    if (input.number === '----') this.setState({ warning: this.state.warning + 1 });

    await this.setState({ board: false });
    await this.setState({ myNums: [...this.state.myNums, input] });
    this.result = true;
    this.inputResult();
  };

  // 처리된 결과값
  inputResult() {
    if (this.result) {
      let text = this.state.myNums[this.state.myNums.length - 1].result;
      this.ctx.fillText(`${text}`, this.state.width / 4.5, this.state.height / 3);
      setTimeout(async () => {
        await this.setState({ board: true });
        this.result = false;
      }, 2000);
    }
    if (this.out) {
      let text = this.state.RivalNums[this.state.RivalNums.length - 1].result;
      this.ctx.fillText(`${text}`, this.state.width / 4.5, this.state.height / 3);
      setTimeout(async () => {
        await this.setState({ board: true });
        this.out = false;
      }, 2000);
    }
  }

  // 일정 시간 후에 현황판 출력
  printBoard() {
    // 유저가 입력한 게임결과 출력
    this.state.myNums.map((item, index) => {
      this.ctx.font = `700 ${this.radius * 0.9}px san serif`;
      this.ctx.fillText(
        `${item.number}`,
        this.state.width / 1.8,
        this.state.height / 8 + (this.state.height / 13) * index
      );

      this.ctx.font = `300 ${this.radius * 0.6}px san serif`;
      this.ctx.fillText(
        `${item.result}`,
        this.state.width / 1.4,
        this.state.height / 8 + (this.state.height / 13) * index
      );
    });

    // 상대방이 입력한 게임결과 출력
    this.state.RivalNums.map((item, index) => {
      this.ctx.font = `700 ${this.radius * 0.9}px san serif`;
      this.ctx.fillText(
        `${item.number}`,
        this.state.width / 7,
        this.state.height / 8 + (this.state.height / 13) * index
      );

      this.ctx.font = `300 ${this.radius * 0.6}px san serif`;
      this.ctx.fillText(
        `${item.result}`,
        this.state.width / 3.3,
        this.state.height / 8 + (this.state.height / 13) * index
      );
    });
  }

  // 화면그리기
  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

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
    this.ctx.font = `900 ${this.radius * 3}px san serif`;

    // 채점결과출력
    this.inputResult();

    if (this.state.board) {
      this.printBoard();
    }

    // 클릭된 숫자 출력
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
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = Math.floor(this.stageWidth / 4);
    this.canvas.height = Math.floor(this.stageWidth / 2.4);

    this.setState({ width: this.canvas.width, height: this.canvas.height });
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

    return (
      <Grid container direction='row' justify='space-evenly' alignItems='center'>
        {this.state.winner !== '' 
          ? this.state.rivalName === 'COMPUTER'
            ? <Gameover winner={this.state.winner} isComputer={true}/>
            : <Gameover winner={this.state.winner} />
          : null}

        <Grid item>
          <Paper
            className={classes.root}
            style={{
              marginLeft: '40px',
              borderRadius: `${this.state.width/10}px`,
              width: `${this.state.width / 2}px`,
              height: `${this.state.width / 1.1}px`,
              boxShadow: `0px 0px 20px 0px ${this.state.myTurn ? '#d6d6d6' : '#0067c2'}`,
            }}
          >
            <Typography 
              className={classes.pos} 
              style={{
                fontSize: `${this.state.width/6}px`
              }}
            >
              {this.state.myTurn ? '대기' : this.state.count}
            </Typography>
            <Grid container direction='column' justify='center' alignItems='center'>
              {
                !this.state.rivalName
                ? <Button color="secondary" 
                    disableElevation 
                    style={{
                      width: `${this.state.width / 2}px`,
                      height: `${this.state.width / 2}px`,
                    }} 
                    variant="outlined" 
                    onClick={() => {
                      console.log('clicked')
                      this.computerModeStart();
                  }}>
                    <Typography style={{ 
                      fontSize: `${this.state.width/15}px`
                    }}>
                      컴퓨터<br/>대결시작
                    </Typography>
                  </Button>
                : <>
                    <img 
                      src={this.state.rivalAvatar} 
                      style={{
                        width: this.state.width/2,
                        height: this.state.width/2.2,
                      }}
                    ></img>
                    <Typography 
                      className={classes.pos} 
                      style={{
                        fontSize: `${this.state.width/15}px`,
                        overflow: 'hidden',
                      }}
                    >
                      {this.state.rivalName}
                    </Typography>
                  </>
              }
              
              {this.state.warningRival === 1 ? (
                <div
                  style={{
                    backgroundColor: 'yellow',
                    width: `${document.body.clientWidth/80}px`,
                    height: `${document.body.clientWidth/50}px`,
                    border: `${document.body.clientWidth/400}px solid #000`,
                  }}
                />
              ) : this.state.warningRival === 2 ? (
                <div
                  style={{
                    backgroundColor: 'red',
                    width: `${document.body.clientWidth/80}px`,
                    height: `${document.body.clientWidth/50}px`,
                    border: `${document.body.clientWidth/400}px solid #000`,
                  }}
                />
              ) : null}
            </Grid>
          </Paper>
        </Grid>

        <Paper
          id='paper'
          style={{
            width: this.state.width,
            height: this.state.height,
            borderRadius: `${this.state.width/10}px`,
          }}
          className={classes.Paper}
        >
          <canvas id='canvas' />
        </Paper>

        <Grid item>
          <Paper
            className={classes.root}
            style={{
              marginRight: '40px',
              borderRadius: `${this.state.width/10}px`,
              width: `${this.state.width / 2}px`,
              height: `${this.state.width / 1.1}px`,
              boxShadow: `0px 0px 20px 0px ${
                this.state.wrongInput ? '#ff5c5c' : this.state.myTurn ? '#0067c2' : '#d6d6d6'
              }`,
            }}
          >
            {this.state.wrongInput ? (
              <Typography 
                className={classes.pos} 
                style={{
                  fontSize: `${this.state.width/10}px`
                }}
              >
                4자리를
                <br />
                입력하세요
              </Typography>
            ) : (
              <Typography 
              className={classes.pos} 
              style={{
                fontSize: `${this.state.width/6}px`
              }}
            >
                {this.state.myTurn ? this.state.count : '대기'}
              </Typography>
            )}
            <Grid container direction='column' justify='center' alignItems='center'>
              <img 
                src={this.state.userAvatar} 
                style={{
                  width: this.state.width/2,
                  height: this.state.width/2.2,
                }}
              ></img>
              <Typography 
                className={classes.pos} 
                style={{
                  fontSize: `${this.state.width/15}px`,
                  width: this.state.width/2.5,
                }}
              >
                {this.state.userName}
              </Typography>
              {this.state.warning === 1 ? (
                <div
                  style={{
                    backgroundColor: 'yellow',
                    width: `${document.body.clientWidth/80}px`,
                    height: `${document.body.clientWidth/50}px`,
                    border: `${document.body.clientWidth/400}px solid #000`,
                  }}
                />
              ) : this.state.warning === 2 ? (
                <div
                  style={{
                    backgroundColor: 'red',
                    width: `${document.body.clientWidth/80}px`,
                    height: `${document.body.clientWidth/50}px`,
                    border: `${document.body.clientWidth/400}px solid #000`,
                  }}
                />
              ) : null}
            </Grid>
          </Paper>
        </Grid>
        <Tooltip
          title='이모티콘'
          aria-label='add'
          onClick={() => this.setState({ showEmojis: !this.state.showEmojis })}
        >
          <Fab color='secondary' className={this.props.classes.absolute}>
            <EmojiEmotionsIcon />
          </Fab>
        </Tooltip>

        <div className={classes.rootroot}>
          {this.state.showEmojis ? (
            <GridList cellHeight={180} className={classes.gridList}>
              {this.tileData.map((tile) => (
                <GridListTile
                  key={tile.img}
                  style={{ height: '100px' }}
                  onClick={() => {
                    if (this.state.isActive === false) {
                      this.activeEmoji(tile.img);
                      this.setState({
                        showEmojis: !this.state.showEmojis,
                        isActive: !this.state.isActive,
                      });
                    }
                  }}
                >
                  <img src={tile.img} alt={tile.title} style={{ width: '70px', height: '70px' }} />
                </GridListTile>
              ))}
            </GridList>
          ) : null}
        </div>
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
