import React, { Component } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

import cookie from 'react-cookies'
const axios = require('axios')

  const userSignup = async (username, nickname, password) => {
    let result = await requestSignup(username, nickname, password)
    if(result.data.message) {
      cookie.save('username', nickname, { path: '/' })
      cookie.save('avatarId', 0, { path: '/' })
      window.location.reload();
    }
  }

  const requestSignup = async (userId, nickname, password) => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://3.35.27.36:3001/users/signup',
        data: {
          userId: userId,
          nickname: nickname,
          password: password,
        },
        withCredentials: true,
      })
      response.data.error
      ? alert(response.data.error)
      : alert(`환영합니다 ${nickname}님`)
      return response
    } catch (error) {
      console.log(error)
    }
  }



  const useStyles = makeStyles((theme) => ({
    rootButton: {
      width: 200
    }
  }))


  const Signup = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [username, inputUsername] = React.useState('');
    const [nickname, inputNickname] = React.useState('');
    const [password, inputPassword] = React.useState('');


    return (
      <div style={{ marginTop: '15px' }}>
        <Button variant='outlined' color='primary' className={classes.rootButton} onClick={() => setOpen(true)}>
          Sign Up to 2P!
        </Button>
        <Dialog
          open={open}
          // onClose={() => setOpen(true)}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Sign Up</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter your desired username and password</DialogContentText>
            <TextField
              value={username}
              onChange={(e) => inputUsername(e.target.value)}
              autoFocus
              margin='dense'
              id='name'
              label='Username'
              type='text'
              fullWidth
            />
            <TextField
              value={nickname}
              onChange={(e) => inputNickname(e.target.value)}
              autoFocus
              margin='dense'
              id='name'
              label='nickname'
              type='text'
              fullWidth
            />
            <TextField
              value={password}
              onChange={(e) => inputPassword(e.target.value)}
              autoFocus
              margin='dense'
              id='name'
              label='Password'
              type='password'
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                userSignup(username, nickname, password);
                // signup 성공시 history.push('/selectGame') 이동하게 콜백 넘겨주기
                // 실패시 콜백으로 3.35.27.36:3000 창과 함께 실패했습니다 모달 창 띄워주기
              }}
              color='primary'
            >
              Sign up & log in
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


export default Signup;
