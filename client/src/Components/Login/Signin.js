import React, { Component } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import cookie from 'react-cookies'

import { Button, TextField, InputAdornment } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';


const axios = require('axios')

class Signin extends Component {
  state = {
    username: '',
    password: '',
  };

  componentWillMount() {
    let username = cookie.load('username')
    if (username) {
      if(!username.includes('Guest')){
        this.props.history.goBack();
      }
    }
  }

  signin = async () => {
    let result = await this.Login(this.state.username, this.state.password)
    if(result.data.message) {
      let userData = await this.Mypage()
      cookie.save('username', userData.data.nickname, { path: '/' })
      cookie.save('avatarId', userData.data.avatarId, { path: '/' })
      window.location.reload();
    } else {
      alert(result.data.error)
    }
  }


  // LOGIN (post)
  Login = async(userId, password, nickname) => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://3.35.27.36:3001/users/signin',
        data: {
          userId: userId,
          password: password,
          nickname: nickname
        },
        withCredentials: true,
      })
      return response
    } catch (error) {
      console.log(error)
    }
  }

  // MYPAGE (get)
  Mypage = async() => {
    try {
      const response = await axios({
        method: 'get',
        url: 'http://3.35.27.36:3001/users/mypage',
        withCredentials: true,
      })
      return response
    } catch (error) {
      return error
    }
  }


  render() {
    return (
      <form>
        <div>
          <TextField
            id='input-with-icon-textfield'
            label='Username'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            value={this.state.username}
            onChange={(e) => this.setState({ username: e.target.value })}
          />
        </div>
        <div>
          <TextField
            id='input-with-icon-textfield'
            label='Password'
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            type='password'
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            onKeyDown={(e) => { if(e.keyCode === 13) this.signin() }}
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={ () => this.signin() }
          >
            Sign In
          </Button>
        </div>
      </form>
    );
  }
}

export default withRouter(Signin);
