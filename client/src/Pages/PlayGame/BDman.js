import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Gameover from '../../Components/PlayGame/Gameover';
import UserCard from '../../Components/PlayGame/userCard/UserCard'
import RivalCard from '../../Components/PlayGame/userCard/RivalCard'
import Emoji from '../../Components/PlayGame/Emoji';

import { Paper, Typography, Tooltip, Fab, Grid, GridList, GridListTile, Button } from '@material-ui/core';

import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { withStyles } from '@material-ui/core/styles';
import { Block } from './BDBlock';
import { RivalBlock } from './BDRivalBlock';
import { Bullet } from './Bullet';
import cookie from 'react-cookies';
import socketio from 'socket.io-client';
let socket;

const styles = (theme) => ({
  Paper: {
    backgroundColor: 'black',
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    margin: theme.spacing(3, 3),
  },
  root: {
    padding: theme.spacing(4, 4, 2, 4),
    backgroundColor: 'transparent',
    border: '2px solid #636363',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(13),
    marginLeft: '10px',
  },
  magazine: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
  },
  pos: {
    color: '#fff',
  },
  reloadText: {
    color: '#fff',
    marginRight: '40px',
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

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Math.floor(document.body.clientWidth / 3.5),
      height: Math.floor(document.body.clientHeight / 1.2),

      canvasHeight: 0,
      canvasWidth: 0,

      // score
      myScore: 100,
      rivalScore: 100,

      // bullet
      bullet: 10,
      isReload: false,

      // winner
      winner: '',

      // emoji action
      showEmojis: false,
      isActive: false,

      // userInfo
      userName: '',
      rivalName: '',
      userAvatar: 0,
      rivalAvatar: 0,

      //game start
      gameStart: false,
    };
    //초기화
    this.canvas = null;
    this.ctx = null;
    this.stageWidth = null;
    this.stageHeight = null;

    // Block
    this.blockSizeX = this.state.width / 10;
    this.blockSizeY = this.state.height / 20;
    this.blockPosX = this.state.width / 2 - this.blockSizeX / 2;
    this.blockPosY = this.state.height - this.blockSizeY * 2.5 ;
    this.blockPosInitX = this.state.width / 2 - this.blockSizeX / 2;
    // Rival Block
    this.RivalSizeX = this.state.width / 10;
    this.RivalSizeY = this.state.height / 20;
    this.RivalPosX = this.state.width / 2 - this.RivalSizeX / 2;
    this.RivalPosY = this.RivalSizeY * 1.5;
    this.RivalPosInitX = this.state.width / 2 - this.RivalSizeX / 2;

    // Bullet
    this.BulletRadius = this.state.width / 40;
    this.BulletSpeed = this.state.width / 100;
    this.bullets = [];
    this.RivalBullets = [];
    this.aim = 0;
    this.moveY = 0;

    // mouse
    this.mousePos = 0;
    this.mouseX = 0;
    this.mouseY = 0;

    // Rival mouse
    this.RivalShotX = 0;
    this.RivalShotY = 0;

    // pre data
    this.preMousePos = 0;

    // mouse aim
    this.aim = 0;

    // get emoji
    this.tileData = [];
    this.props.gifEmoji.map((item) => {
      this.tileData.push({ img: item });
    });

    // gif frame
    this.frame = 0;

    // computer
    this.computer = {
      avatarId: 'https://image.flaticon.com/icons/svg/603/603506.svg',
      username: 'COMPUTER',
    }

    // computer block collision (0: 좌측, 1: 우측)
    this.blockCollision = -1;

    // computer magazine
    this.computerMag = 10;
  }

  computerModeStart() {
    socket.emit('computerMode');
    this.setState({
      rivalAvatar: this.computer.avatarId,
      rivalName: this.computer.username
    });
    setTimeout(() => {
      this.moveComputerBlock();
      this.shotComputerBlock();
    }, 3000);
  }

  moveComputerBlock() {
    let ranDistance = Math.floor(Math.random()*3)
    let ranDirection
    if(this.blockCollision !== -1){
      this.move(ranDistance, this.blockCollision)
      this.blockCollision = -1
    }
    else {
      ranDirection = Math.floor(Math.random()*2)
      this.move(ranDistance, ranDirection)
    }
  }

  move(dis, dir) {
    setTimeout(() => {
      if (dir === 0) this.RivalPosX += this.blockSizeX
      else if (dir === 1) this.RivalPosX -= this.blockSizeX
      
      dis -= 1
      if (dis !== -1) this.move(dis, dir)
      else if (dis === -1) this.moveComputerBlock()
    }, 200)
  }

  shotComputerBlock() {
    let shotDir = [-1, 0, 1];
    let angle = Math.floor(Math.random()*3)
    let num = Math.floor(Math.random()*6)


    if(this.computerMag - num < 0){
      setTimeout(() => {
        this.computerMag = 10;
        this.shotComputerBlock();
      }, 2000);
    } else {
      this.computerMag -= num
      this.shot(shotDir[angle], num)
    }
  }

  shot(ang, num) {
    setTimeout(() => {
      this.rivalShot(ang)
      num -= 1
      if (num !== -1) this.shot(ang, num);
      else if (num === -1) {
        setTimeout(() => {
          this.shotComputerBlock()
        }, 700)
      }
    }, 200)
  }

  rivalShot(e) {
    if (e === 1) {
      // right (this.aim === 1)
      this.RivalMoveX = this.BulletSpeed * -1;
      this.RivalMoveY = this.BulletSpeed;
    } else if (e === 0) {
      // center (this.aim === 0)
      this.RivalMoveX = 0;
      this.RivalMoveY = this.BulletSpeed * 2;
    } else if (e === -1) {
      // left (this.aim === -1)
      this.RivalMoveX = this.BulletSpeed;
      this.RivalMoveY = this.BulletSpeed;
    }
    let bullet = new Bullet(
      this.state.width,
      this.state.height,
      this.BulletRadius,
      this.RivalMoveX,
      this.RivalMoveY,
      this.RivalPosX,
      this.RivalPosY + this.RivalSizeY,
      this.RivalSizeX
    );
    this.RivalBullets.push(bullet);
  }


  componentDidMount() {
    socket = socketio.connect('http://localhost:3005');

    (() => {
      socket.emit('joinRoom', {
        username: cookie.load('username'),
        room: cookie.load('selectedRoom'),
        avatarId: cookie.load('avatarId'),
      });
    })();

    this.setState({ canvasHeight: document.querySelector('#bdman').clientHeight})
    this.setState({ canvasWidth: document.querySelector('#bdman').clientWidth})
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.block = new Block(
      this.blockSizeX,
      this.blockSizeY,
      this.blockPosX,
      this.blockPosY,
      this.state.width,
      this.state.height
    );
    this.Rivalblock = new RivalBlock(
      this.RivalSizeX,
      this.RivalSizeY,
      this.RivalPosX,
      this.RivalPosY,
      this.state.width,
      this.state.height
    );

    this.resize();
    window.requestAnimationFrame(this.animate.bind(this));

    // 블록 이동
    document.addEventListener('keydown', this.keydown, true);

    // Rival shot (mirror)
    socket.on('rivalShot', (e) => this.rivalShot(e));

    socket.on('moveLeft', () => {
      this.RivalPosX += this.blockSizeX;
    });
    socket.on('moveRight', () => {
      this.RivalPosX -= this.blockSizeX;
    });
    socket.on('hit', (res) => {
      this.setState({ myScore: res });
    });
    socket.on('start', (isStarted) => {
      if (isStarted) {
        this.setState({ gameStart: true });
      }
    });
    socket.on('end', (winner) => {
      this.setState({ winner: winner });
    });
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

    socket.on('connectError', () => {
      // socket.disconnect();
      alert('잘못된 접근입니다, 뒤로가기를 눌러주세요');
    });
    socket.on('getEmoji', (data) => {
      this.activeRivalEmoji(JSON.parse(data));
    });

    // 발사
    this.canvas.addEventListener('mousedown', (e) => {

      // 재장전
      this.reload = setInterval(() => {
        this.setState({ bullet: Math.min(10, this.state.bullet + 2)})
      }, 500)

      if (this.state.bullet > 0 && !this.state.isReload && this.state.gameStart) {
        let bullet = new Bullet(
          this.state.width,
          this.state.height,
          this.BulletRadius,
          this.moveX,
          this.moveY,
          this.blockPosX,
          this.blockPosY,
          this.blockSizeX
        );
        this.bullets.push(bullet);
        socket.emit('shot', this.aim);
        this.setState({ bullet: this.state.bullet - 1 });
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      clearInterval(this.reload)
    })

    // 조준
    this.canvas.addEventListener('mousemove', (e) => {
      let moveRight = e.layerX + this.state.width / 15;
      let moveLeft = e.layerX - this.state.width / 15;

      // 처리할 연산 줄이기
      if (moveRight < this.preMousePos || moveLeft > this.preMousePos) {
        this.mouseX = e.layerX;
        this.mouseY = e.layerY;
        this.angle = this.calc();
        // 왼쪽 조준
        if (this.angle > -40 && this.angle < 60) {
          this.moveX = this.BulletSpeed * -1;
          this.moveY = this.BulletSpeed;
          this.aim = -1;
        }
        // 중앙 조준
        else if (this.angle >= 60 && this.angle <= 120) {
          this.moveX = 0;
          this.moveY = this.BulletSpeed * 2;
          this.aim = 0;
        }
        // 오른쪽 조준
        else if ((this.angle > 120 && this.angle < 180) || this.angle < -140) {
          this.moveX = this.BulletSpeed;
          this.moveY = this.BulletSpeed;
          this.aim = 1;
        }
        this.preMousePos = e.layerX;
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown, true);
    socket.disconnect();
  }

  keydown = (e) => {
    if (e.keyCode === 65) {
      // 왼쪽
      socket.emit('moveLeft');
      this.blockPosX -= this.blockSizeX;
      // this.RivalPosX -= this.blockSizeX;
    } else if (e.keyCode === 68) {
      // 오른쪽
      socket.emit('moveRight');
      this.blockPosX += this.blockSizeX;
      // this.RivalPosX += this.blockSizeX;
    } 
  }


  calc() {
    // 발사각 측정
    let BulletX = this.blockPosX + this.blockSizeX / 2;
    let BulletY = this.state.height - 40;
    let width = BulletX - this.mouseX;
    let height = BulletY - this.mouseY;
    let angle = Math.floor((Math.atan2(height, width) * 180) / Math.PI);
    return angle;
  }

  // 화면크기 재설정 함수
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
    
    this.canvas.width = Math.floor(this.stageWidth / 3.5);
    this.canvas.height = Math.floor(this.stageHeight / 1.2);

    this.setState({ width: this.canvas.width, height: this.canvas.height });
  }

  makeBullet(ctx) {
    ctx.fillStyle = '#ffff8c';
    for (let i = 0; i < this.state.bullet; i++) {
      ctx.beginPath();
      ctx.rect(i * this.state.width / 10, this.state.height, this.state.width / 11, -this.blockSizeY / 4);
      ctx.fill();
    }
  }

  // 애니메이션 생성
  animate(t) {
    // 블록의 윈도우 충돌 핸들링
    if (this.blockPosX < 0) {
      this.blockPosX = 0;
    } else if (this.blockPosX > this.state.width - this.blockSizeX) {
      this.blockPosX = this.state.width - this.blockSizeX;
    }
    if (this.RivalPosX < 0) {
      this.RivalPosX = 0;
      this.blockCollision = 0;
    } else if (this.RivalPosX > this.state.width - this.RivalSizeX) {
      this.RivalPosX = this.state.width - this.RivalSizeX;
      this.blockCollision = 1;
    }
    window.requestAnimationFrame(this.animate.bind(this));

    // block draw clear
    this.ctx.clearRect(this.blockPosX, this.blockPosY, this.blockSizeX, this.blockSizeY);
    // RivalBlock draw clear
    this.ctx.clearRect(this.RivalPosX, this.RivalPosY, this.RivalSizeX, this.RivalSizeY);

    // guideline
    this.ctx.lineWidth = this.blockSizeX / 1.5;
    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.moveTo(this.blockPosX + this.blockSizeX / 2, this.blockPosY + this.moveY);
    this.ctx.lineTo(
      this.blockPosX + this.blockSizeX / 2 + this.moveX * 7,
      this.blockPosY - this.blockSizeY + Math.abs(this.moveX * 2)
    );
    this.ctx.stroke();

    this.block.draw(this.ctx, this.blockPosX, this.blockPosY);
    this.Rivalblock.draw(this.ctx, this.RivalPosX, this.RivalPosY);

    this.ctx.fillStyle = '#fff'
    
    if (this.state.gameStart && Math.floor(this.state.width/this.frame) !== 5) {
      this.ctx.font = `${ this.state.width/5 + this.state.width/this.frame }px sanseif`
      this.ctx.fillText(
        'Start!', 
        this.state.width/3.8 - this.state.width/this.frame, 
        this.state.height/2
      )
      this.frame += 0.5
      
    } else if (Math.floor(this.state.width/this.frame) !== 5) {
      this.ctx.font = `${this.state.width/5}px sanseif`
      this.ctx.fillText('Ready', this.state.width/3.8, this.state.height/2.1)
      this.ctx.font = `${this.state.width/20}px sanseif`
      this.ctx.fillText('방향키 - A, D  |  발사 - 화면 클릭', this.state.width/5.5, this.state.height/1.8)
      this.ctx.font = `${this.state.width/20}px sanseif`
      this.ctx.fillText('화면을 길게 눌러 재장전', this.state.width/4, this.state.height/1.6)
    }

    // magazine
    if (this.state.bullet !== 0) {
      this.makeBullet(this.ctx)
    } else {
      this.ctx.fillStyle = '#a1a1a1';
      this.ctx.font = `${this.state.width / 18}px sanseif`
      this.ctx.fillText('화면을 길게 눌러 재장전하세요', this.state.width / 5.5, this.state.height / 2)
    }

    
    // 총알
    let response;
    if (this.bullets.length !== 0) {
      for (let i = 0; i < this.bullets.length; i++) {
        response = this.bullets[i].drawMyBullet(
          this.ctx,
          this.state.width,
          this.state.height,
          this.RivalPosX,
          this.RivalPosY,
          this.RivalSizeX,
          this.RivalSizeY
        );
        if (response) {
          this.bullets.splice(i, 1);
          if (response.result) {
            this.setState({ rivalScore: this.state.rivalScore - 10 });
            if (this.state.rivalName !== 'COMPUTER') {
              socket.emit('score', this.state.rivalScore);
            } else if (this.state.rivalName === 'COMPUTER' && this.state.rivalScore === 0){
              this.setState({ winner: `${this.state.userName}`})
            }
          }
        }
      }
    }
    if (this.RivalBullets.length !== 0) {
      for (let i = 0; i < this.RivalBullets.length; i++) {
        response = this.RivalBullets[i].drawRivalBullet(
          this.ctx,
          this.state.width,
          this.state.height,
          this.blockPosX,
          this.blockPosY,
          this.blockSizeX,
          this.blockSizeY
        );
        if (response) {
          this.RivalBullets.splice(i, 1);
          if (response.result && this.state.rivalName === 'COMPUTER') {
            this.setState({ myScore: this.state.myScore - 10 });
            if(this.state.myScore === 0){
              this.setState({ winner: 'Computer'})
            }
          }
        }
      }
    }

    // 잔상 남기는 구역설정
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.state.width, this.state.height);
  }

  

  activeEmoji(gif) {
    this.setState({ userAvatar: gif });
    socket.emit('sendEmoji', JSON.stringify(gif));

    setTimeout(() => {
      this.setState({ 
        userAvatar: this.props.avatarImg[this.userAvatarId], 
        isActive: !this.state.isActive 
      });
    }, 2500);
  }

  activeRivalEmoji(gif) {
    this.setState({ rivalAvatar: gif });
    setTimeout(() => {
      this.setState({ 
        rivalAvatar: this.props.avatarImg[this.rivalAvatarId], 
      });
    }, 2500);
  }

  openEmojiList() {
    this.setState({ showEmojis: !this.state.showEmojis });
  };

  render() {
    const { classes, avatarImg } = this.props;

    return (
      <Grid container direction='row' justify='space-evenly' alignItems='center' id='bdman'
        style={{
          position: 'fixed',
          width: '80vw',
          height: this.state.height * 1.1,
          top: '50%',
          right: '50%',
          marginTop: `-${this.state.canvasHeight / 2}px`,
          marginRight: `-45vw`,
        }}
      >
        {this.state.winner !== '' ? 
          this.state.rivalName === 'COMPUTER' ? (
            <Gameover winner={this.state.winner} isComputer={true}/>
          ) : (
            <Gameover winner={this.state.winner} />
          ) : 
          null
        }

        <Button style={{
          position: 'fixed',
          top: '2%',
          right: '2%',
        }}>
          <ExitToAppIcon style={{ color: '#fff', fontSize: '3vw' }}/>
        </Button>

        <Grid item>
          <RivalCard 
            width={this.state.width}
            username={this.state.rivalName} 
            theNumber={this.state.rivalScore}
            avatar={this.state.rivalAvatar}
            computerModeStart={this.computerModeStart.bind(this)}
            cardTheme={'black'}
          />
        </Grid>

        <Grid item>
          <Paper
            id='paper'
            style={{
              width: this.state.width,
              height: this.state.height,
              border: '0.3vw solid #fff',
              // boxShadow: '0px 0px 200px 0px #616161',
            }}
            // className={classes.Paper}
          >
            <canvas id='canvas' />
          </Paper>
          
        </Grid>


        <Grid item>
          <UserCard 
            width={this.state.width} 
            userAvatar={this.state.userAvatar} 
            theNumber={this.state.myScore} 
            warningAlert={this.state.bullet === 0}
            cardTheme={'black'}
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
Game.propsTypes = {
  classes: PropTypes.object.isRequired,
};

const mapReduxStateToReactProps = (state) => {
  return {
    gifEmoji: state.currentGame.gif,
    avatarImg: state.login.avatar,
  };
};
export default connect(mapReduxStateToReactProps)(withStyles(styles)(Game));
