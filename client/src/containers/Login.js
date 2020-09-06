import Login from '../Pages/Login/Login';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';
import cookie from 'react-cookies'

const axios = require('axios')


// redux에서 store의 값이 변경될때마다 실행, store의 state값을 받음
function mapReduxStateToReactProps(state) {
  return {
    login: state.login,
  };
}

function mapReduxDispatchToReactProps(dispatch) {
  
  
  return {
    // onEmailType: (email) => dispatch({ type: actionTypes.EMAIL_INPUT, payload: email }),
    // onPasswordType: (password) => dispatch({ type: actionTypes.PASSWORD_INPUT, payload: password }),
    socialLogin: async (userId, socialId, nickname) => {
      let result = await socialSignin(userId, socialId, nickname)
      console.log('result.data.message: ', result.data.message);
      if(result.data.message) {
        let userData = await Mypage()
        cookie.save('username', userData.data.nickname, { path: '/' })
        cookie.save('avatarId', userData.data.avatarId, { path: '/' })
        window.location.reload();
      } else {
        alert(result.data.error)
      }
    }
  };
}

// LOGIN (post)
async function socialSignin(userId, socialId, nickname) {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://3.35.27.36:3001/users/signin',
      data: {
        userId: userId,
        socialId: socialId,
        nickname: nickname,
      },
      withCredentials: true,
    })
    return response
  } catch (error) {
    alert(error)
  }
}

// MYPAGE (get)
async function Mypage() {
  try {
    const response = await axios({
      method: 'get',
      url: 'http://3.35.27.36:3001/users/mypage',
      withCredentials: true,
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(Login);