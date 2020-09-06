import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import cookie from 'react-cookies';

import Mypage from './Mypage';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  withStyles,
  Modal,
  Grid,
} from '@material-ui/core';

import { ArrowBack, ContactSupport, Menu } from '@material-ui/icons';

const axios = require('axios');

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    width: '100%',
    zIndex: 6,
  },
  menuButton: {
    position: 'fixed',
    right: '30px',
    top: '15px',
  },
  title: {
    flexGrow: 1,
  },
  gobackButton: {
    position: 'fixed',
    left: '20px',
    top: '10px',
  },
});

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 90 && e.ctrlKey) {
        this.props.history.push('/');
      }
      if (e.keyCode === 88 && e.ctrlKey) {
        this.props.history.push('/selectgame');
      }
      if (e.keyCode === 67 && e.ctrlKey) {
        this.props.history.push('/selectroom');
      }
      if (e.keyCode === 86 && e.ctrlKey) {
        this.props.history.push('/waitingroom');
      }
      if (e.keyCode === 66 && e.ctrlKey) {
        this.props.history.push('/playgame');
      }
    });
  }

  signout = async () => {
    await this.logout();
    cookie.remove('username', { path: '/' });
    cookie.remove('avatarId', { path: '/' });
    cookie.remove('selectedGame', { path: '/' });
    cookie.remove('selectedRoom', { path: '/' });
    cookie.remove('load', { path: '/' })
    window.location.reload();
  };

  logout = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://3.35.27.36:3001/users/signout',
        withCredentials: true,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  getData = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'http://3.35.27.36:3001/users/mypage',
        withCredentials: true,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  handleOpenClose = () => {
    this.setState({ open: !this.state.open });
  };

  leaveRoomHandler = async () => {
    axios({
      method: 'post',
      url: 'http://3.35.27.36:3001/rooms/leaveroom',
      data: {
        roomId: cookie.load('selectedRoom'),
        gameCode: cookie.load('selectedGame'),
        username: cookie.load('username'),
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.message) {
          cookie.remove('selectedRoom', { path: '/' });
          this.props.history.push('./selectroom');
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  clickGoback = () => {
    let location = this.props.history.location.pathname;
    if (location === '/selectroom') {
      this.props.history.push('/');
      cookie.remove('selectedGame', { path: '/' });
    } else if (location === '/waitingroom') {
      this.leaveRoomHandler();
      this.props.history.push('/selectroom');
      cookie.remove('selectedRoom', { path: '/' });
    } else if (location === '/playgame') {
      this.props.history.goBack();
      cookie.remove('isPlaying', { path: '/' });
    } else if (location === '/login') {
      this.props.history.goBack()
    }
  };

  render() {
    const { classes, history } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position='static'>
          {
          // 뒤로가기 버튼만 보이는 경우
          ['/playgame', '/waitingroom'].includes(history.location.pathname)
          ? (
            <Toolbar>
              <IconButton
                color='inherit'
                className={classes.gobackButton}
                onClick={() => this.clickGoback()}
              >
                <ArrowBack />
              </IconButton>
            </Toolbar>
          ) : (
            <Toolbar>
              {/* 메인화면 뒤로가기 없음 */}
              { history.location.pathname !== '/' 
              ? (
                <IconButton
                  color='inherit'
                  className={classes.gobackButton}
                  onClick={() => this.clickGoback()}
                >
                  <ArrowBack />
                </IconButton>
              ) : null }

              {/* 게스트 로그인시 Login버튼 / 유저 로그인시 Mypage,Login버튼*/}
              {
                !cookie.load('username') || cookie.load('username').includes('Guest')
                ? (
                  <Button
                    color='inherit'
                    className={classes.menuButton}
                    onClick={() => {
                      history.push('/login');
                    }}
                  >
                    Login
                  </Button>
                ) : (
                  <div className={classes.menuButton}>
                    <Button
                      color='inherit'
                      onClick={async () => {
                        this.resData = await this.getData();
                        this.handleOpenClose();
                      }}
                    >
                      Mypage
                    </Button>
                    <Button
                      color='inherit'
                      onClick={() => {
                        this.signout();
                      }}
                    >
                      Logout
                    </Button>
                    <Modal open={this.state.open} onClose={this.handleOpenClose}>
                      <Mypage userData={this.resData} />
                    </Modal>
                  </div>
                )
              }
            </Toolbar>
          )}
        </AppBar>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Nav));
