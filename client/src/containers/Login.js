import Login from '../Pages/Login/Login';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

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
      if(result.data.message) {
        let userData = await Mypage()
        let username = userData.data.nickname
        let avatar = userData.data.avatarId
        dispatch({ type: actionTypes.LOGIN, payload: { username, avatar } })
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
      url: 'http://localhost:3001/users/signin',
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
      url: 'http://localhost:3001/users/mypage',
      withCredentials: true,
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(Login);