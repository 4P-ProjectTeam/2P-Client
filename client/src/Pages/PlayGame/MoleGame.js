import React, { Component } from 'react';
import { connect } from 'react-redux';
import socketio from 'socket.io-client';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import Gameover from '../../Components/PlayGame/Gameover';
import MoleScoreCard from '../../Components/PlayGame/MoleScoreCard';
import UserCard from '../../Components/PlayGame/userCard/UserCard'
import RivalCard from '../../Components/PlayGame/userCard/RivalCard'
import Emoji from '../../Components/PlayGame/Emoji';

import { Paper, Grid, Modal } from '@material-ui/core';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { withStyles } from '@material-ui/core/styles';
import { isDeleteExpression } from 'typescript';

import { Mole } from './mole';
import hemmer from '../../images/hemmer.png';
import clicked from '../../images/clicked.png';

const styles = (theme) => ({
  Paper: {
    backgroundColor: 'white',
    margin: theme.spacing(3, 3),
    background: '#00babd',
  },
  root: {
    width: theme.spacing(25),
    padding: theme.spacing(4),
    backgroundColor: 'white',
    borderRadius: '30px',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(13),
    marginLeft: '10px',
  },
  pos: {
    color: '#000',
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
});

let moles = [];
let moleTimer;

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    padding: '2px',
    position: 'absolute',
    backgroundColor: 'white',
    border: '2px solid #000',
  };
}

let modalStyle = getModalStyle()

const body = (
  <div style={modalStyle}>
    <p>
      게임 중 화면크기 변경은<br />
      오류를 발생시킬 수 있습니다.
    </p>
  </div>
);

class MoleGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: '',
      myScore: 0,
      opponentScore: 0,
      opponentUsername: '',
      width: document.body.clientWidth > 750 ? document.body.clientWidth / 3.5 : document.body.clientWidth / 2,
      height: document.body.clientWidth > 750 ? document.body.clientWidth / 3.5 : document.body.clientWidth / 2,
      currentMole: 0,

      // emoji
      userAvatar: '',
      rivalAvatar: '',
      showEmojis: false,
      isActive: false,

      open: false,
      gameHeight: 0,
      gameWidth: 0,
    };
    this.canvas = null;
    this.ctx = null;
    this.stageWidth = null;
    this.stageHeight = null;

    this.clicked = true;

    this.cursorX = null;
    this.cursorY = null;
    this.cursorEnter = false;
    this.cursorClick = false;

    this.gifCount = 0;

    // socket connection endpoint
    this.socket = socketio.connect('http://localhost:3009');

    for (let i = 0; i < 16; i++) {
      moles.push(new Mole(this.state.width, this.state.height, 15, i));
    }

    this.tileData = [];
    this.props.gifEmoji.map((item) => {
      this.tileData.push({ img: item });
    });

    this.style = {
      canvas: {
        width: this.state.width,
        height: this.state.height,
        borderRadius: `${this.state.width/6}px`,
        border: `${this.state.width/11}px solid #06cdd4`,
        cursor: 'none',
      }
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  resizeAlert = () => {
    if (this.state.open === false) {
      this.handleOpen()

      setTimeout(() => {
        this.handleClose();
      }, 1000)
    }
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.hemmer = document.getElementById('hemmer');
    this.clickedCursor = document.getElementById('clicked');

    this.resize();
    window.requestAnimationFrame(this.animate.bind(this));

    this.setState({ canvasHeight: document.querySelector('#molegame').clientHeight})
    this.setState({ canvasWidth: document.querySelector('#molegame').clientWidth})

    // 화면크기 재설정 이벤트
    window.addEventListener('resize', () => {
      // this.resize
      this.resizeAlert()
    }, false);

    this.canvas.addEventListener('mousedown', (e) => {
        this.mousePressed(e.layerX, e.layerY);
        this.cursorClick = true;
      }, false);

    this.canvas.addEventListener('mouseup', (e) => {
        this.cursorClick = false;
      }, false);

    this.canvas.addEventListener('mousemove', (e) => {
      this.cursorEnter = true;
      this.cursorX = e.layerX;
      this.cursorY = e.layerY;
    });

    this.canvas.addEventListener('mouseleave', (e) => {
      this.cursorEnter = false;
    });

    // socket connection
    this.socket.emit(
      'gameStart',
      cookie.load('username'),
      cookie.load('selectedRoom'),
      cookie.load('avatarId')
    );

    this.socket.on('generateMole', (index) => {
      this.setState({ currentMole: this.state.currentMole + 1 });
      moles[index].generateMole();
    });

    this.socket.on('updateScore', (data) => {
      moles[data.index].hideMole();
      const [player1, player2] = Object.keys(data.score);
      if (player1 === cookie.load('username')) {
        this.setState({ myScore: data.score[player1], opponentScore: data.score[player2] });
      } else {
        this.setState({ myScore: data.score[player2], opponentScore: data.score[player1] });
      }
    });

    this.socket.on('gameover', (data) => {
      // data = username
      this.setState({ winner: data });
    });

    this.socket.on('init', ([usernames, currentMole, score, avatarIds]) => {
      const opponentUsername = usernames.filter((username) => cookie.load('username') !== username);
      const players = Object.keys(score);
      let myScore, opponentScore;
      players.forEach((player) => {
        if (player === cookie.load('username')) {
          myScore = score[player];
        } else {
          opponentScore = score[player];
        }
      });
      this.setState({
        opponentUsername,
        currentMole,
        myScore,
        opponentScore,
        userAvatar: this.props.avatar[avatarIds[cookie.load('username')]],
        rivalAvatar: this.props.avatar[avatarIds[opponentUsername]],
      });
    });

    this.socket.on('opponentGif', (gif) => {
      this.activeRivalEmoji(gif);
    });
  }

  componentWillUnmount() {
    moles = [];
    window.addEventListener('resize', () => {
      this.resize()
      this.resizeAlert()
    }, false);

    if(cookie.load('selectedRoom') === undefined) {
      this.socket.emit('leaveComputerMode')
      clearInterval(moleTimer);
    }
    this.socket.disconnect();
  }

  mousePressed(mouseX, mouseY) {
    for (let i = 0; i < moles.length; i++) {
      let clickedMole = moles[i].clicked(mouseX, mouseY, i, this.ctx);
      if (clickedMole && this.state.opponentUsername[0] !== 'COMPUTER') {
        const data = {
          gameRoomId: cookie.load('selectedRoom'),
          currentMole: this.state.currentMole,
          username: cookie.load('username'),
          index: clickedMole,
        };
        this.socket.emit('moleClick', data);
      } else if (clickedMole && this.state.opponentUsername[0] === 'COMPUTER') {
        moles[clickedMole].hideMole();
        this.setState({ myScore: this.state.myScore + 1});
      }
    }
  }


  // 화면그리기
  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // moles의 모든 요소를 각자의 위치에 생성
    for (let i = 0; i < moles.length; i++) {
      moles[i].draw(this.ctx, this.canvas.width, this.canvas.height, this.gifCount);
    }

    // 마우스가 canvas에 들어온 경우 망치이미지 생성
    if (this.cursorEnter) {
      let size = this.stageWidth/20
      if (this.cursorClick) {
        this.ctx.drawImage(this.clickedCursor, this.cursorX - size/7, this.cursorY - size/2, size, size);
      } else {
        this.ctx.drawImage(this.hemmer, this.cursorX - size/7, this.cursorY - size/2, size, size);
      }
    }
  }

  // 화면크기 재설정 함수
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = Math.floor(document.body.clientWidth > 750 ? this.stageWidth / 3.5 : this.stageWidth / 2);
    this.canvas.height = Math.floor(document.body.clientWidth > 750 ? this.stageWidth / 3.5 : this.stageWidth / 2);

    this.setState({ width: this.canvas.width, height: this.canvas.height });
  }


  activeEmoji(gif) {
    if (!this.state.isActive) {
      this.setState({
        showEmojis: !this.state.showEmojis,
        isActive: !this.state.isActive,
      });
      const avatarBeforeChange = this.state.userAvatar;
      const data = { gameRoomId: cookie.load('selectedRoom'), gif };
      this.socket.emit('activateGif', data);
      this.setState({ userAvatar: gif });
      // this.socket.emit('sendEmoji', (JSON.stringify(gif)));
  
      setTimeout(() => {
        this.setState({
          userAvatar: avatarBeforeChange,
          isActive: !this.state.isActive,
        });
      }, 2500);
    }
  }

  activeRivalEmoji(gif) {
    const avatarBeforeChange = this.state.rivalAvatar;

    this.setState({ rivalAvatar: gif });
    setTimeout(() => {
      this.setState({ rivalAvatar: avatarBeforeChange });
    }, 2500);
  }


  openEmojiList() {
    this.setState({ showEmojis: !this.state.showEmojis });
  };

  // 컴퓨터모드 실행
  computerModeStart() {
    this.socket.emit(
      'gameStart',
      cookie.load('username'),
      cookie.load('selectedRoom'),
      12,
      'COMPUTER',
    );
    this.computerRandomMole()
  }

  // moles배열에서 주어진 인덱스의 mole이 나옴
  computerRandomMole() {
    let count = 0;
    moleTimer = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * 16);
      let randomTime = Math.floor(Math.random() * 3);
      moles[randomIndex].showMole();

      setTimeout(() => {
        try {
          count ++
          let missed = moles[randomIndex].hideMole()
          if(missed) this.setState({opponentScore : this.state.opponentScore + 1})
          if (count === 11) {
            clearInterval(moleTimer);
            this.gameover()
          }
        } catch (err) {
          console.log(err)
        }
      }, 500 + (randomTime * 300));
    }, 3000);
  }

  gameover() {
    if (this.state.myScore > this.state.opponentScore) this.setState({winner: cookie.load('username')})
    else this.setState({winner: 'Computer'})
  }
 
  render() {
    const { classes, avatar } = this.props;

    return (
      <Grid id='molegame' container direction='row' justify='space-evenly' alignItems='center' 
        style={{ 
          position: 'fixed',
          width: '90vw',
          height: this.state.height * 1.4,
          top: '50%',
          right: '50%',
          // marginTop: '-20vw',
          // marginRight: '-45vw',
          marginTop: `-${this.state.canvasHeight / 2}px`,
          marginRight: `-45vw`,
        }}
      >
        {this.state.winner !== '' ? (
          this.state.opponentUsername === 'COMPUTER'
            ) ? (
              <Gameover winner={this.state.winner} isComputer={true}/>
            ) : (
              <Gameover winner={this.state.winner} />
          ) : (
            null
        )}

        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
        
        <Grid item>
          <RivalCard 
            width={this.state.width}
            username={this.state.opponentUsername} 
            theNumber={this.state.opponentScore}
            avatar={this.state.rivalAvatar}
            computerModeStart={this.computerModeStart.bind(this)}
          />
        </Grid>

        <Paper id='paper' style={this.style.canvas} className={classes.Paper}>
          <canvas id='canvas' />
          <img id='hemmer' src={hemmer} style={{ width: '40px', display: 'none' }} />
          <img id='clicked' src={clicked} style={{ width: '40px', display: 'none' }} />
        </Paper>

        <Grid item>
          <UserCard 
            width={this.state.width} 
            userAvatar={this.state.userAvatar} 
            theNumber={this.state.myScore} 
          />
        </Grid>

        <Emoji 
          openEmojiList={this.openEmojiList.bind(this)} 
          showEmojis={this.state.showEmojis}
          activeEmoji={this.activeEmoji.bind(this)}
          tileData={this.tileData}
        />
      </Grid>
    );
  }
}

MoleGame.propsTypes = {
  classes: PropTypes.object.isRequired,
};

const mapReduxStateToReactProps = (state) => {
  return {
    avatar: state.login.avatar,
    gifEmoji: state.currentGame.gif,
  };
};
export default connect(mapReduxStateToReactProps)(withStyles(styles)(MoleGame));
