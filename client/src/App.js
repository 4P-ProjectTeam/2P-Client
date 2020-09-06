import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';
import * as actionTypes from './store/actions';
import cookie from 'react-cookies';
import { 
  Grow, 
  Paper,
  LinearProgress,
} from '@material-ui/core'

import Login from './containers/Login';
import SelectGame from './Pages/SelectGame/SelectGame';
import WaitingRoom from './Pages/WaitingRoom/WaitingRoom';
import SelectRoom from './Pages/SelectRoom/SelectRoom';
import Nav from './Components/Nav/Nav';

import MakeGame from './Components/SelectRoom/MakeGame';
import PlayGame from './Pages/PlayGame/PlayGame';
import logo from './images/logo.png'

const axios = require('axios');

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: true,
      loading: 0,
    }

    this.timer = setInterval(() => {
      if (this.state.loading === 100) {
        cookie.save('load', true, { path: '/' })
        clearInterval(this.timer)
      }
      const diff = Math.random() * 10;
      this.setState({ loading: Math.min(this.state.loading + diff, 100)})
    }, 100);
  }
  componentDidMount() {
    if (!cookie.load('username')) {
      this.props.history.push('/');
    }
  }



  render() {
    return (
      <div className='App'>
        {
          cookie.load('load')
          ? <div>
              <Nav />
              <Switch>
                <Route exact path='/'>
                  <SelectGame />
                </Route>
                <Route path='/login'>
                  <Login />
                </Route>
                <Route path='/selectroom'>
                  <SelectRoom />
                </Route>
                <Route path='/waitingroom'>
                  <WaitingRoom />
                </Route>
                <Route path='/playgame'>
                  <PlayGame />
                </Route>
              </Switch>
              <MakeGame />
            </div>
          : <div>
              <Grow 
                in={this.state.checked}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.checked ? { timeout: 2000 } : {})}
              >
                <img
                  src={logo} 
                  style={{
                    width: '30%',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </Grow>
            </div>
        }
      </div>
    );
  }
}

// redux container
function mapReduxStateToReactProps(state) {
  return {
    isLogin: state.login.isLogin,
  };
}

function mapReduxDispatchToReactProps(dispatch) {
  return {
    loginStatus: async () => {
      try {
        const response = await Mypage();
        if (response) {
          const username = response.data.nickname;
          const avatar = response.data.avatarId;
          dispatch({ type: actionTypes.LOGIN, payload: { username, avatar } });
        }
      } catch (err) {
        // 로그인되어있지 않은 상태
        console.log(err);
      }
    },
  };
}

const Mypage = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'http://3.35.27.36:3001/users/mypage',
      withCredentials: true,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(withRouter(App));
