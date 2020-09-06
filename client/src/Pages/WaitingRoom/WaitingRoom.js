import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import io from 'socket.io-client';

import Users from '../../Components/WaitingRoom/Users/Users';
import Chat from '../../Components/WaitingRoom/Chat/Chat';
import Input from '../../Components/WaitingRoom/Input/Input';
import ReadyProgress from '../../Components/WaitingRoom/ReadyProgress';
import { useHistory } from 'react-router-dom';
import cookie from 'react-cookies';

import './WaitingRoom.css';
let socket = io.connect('http://3.35.27.36:3002');

const WaitingRoom = (props) => {
  const { roomUsers, chat } = props.waitingRoom;
  const bothPlayersReady = roomUsers.filter((user) => user.userInfo.isReady).length === 2;
  // const history = useHistory();

  useEffect(() => {
    // if (!cookie.load('username')) {
    //   history.push('/');
    // } else if (!cookie.load('selectedRoom')) {
    //   history.push('/selectroom');
    // } else 
    if (!props.waitingRoom.joinedRoom) {
      props.enterChatroom(
        cookie.load('selectedRoom'),
        cookie.load('username'),
        cookie.load('avatarId'),
        false,
        cookie.load('selectedGame')
      );
      return () => {
        props.leaveRoomHandler();
      };
    } else {
      socket.removeAllListeners();
    }
  }, []);

  return (
    <div>
      {bothPlayersReady ? <ReadyProgress /> : null}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '70px' }}>
        {roomUsers.map((user, idx) => {
          return <Users key={idx} user={user} readyHandler={props.readyHandler} />;
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='container'>
          <Chat chat={chat} />
          <Input sendChat={props.chatHandler} username={cookie.load('username')} />
        </div>
      </div>
    </div>
  );
};

const socketSubscribe = (dispatch) => {
  socket.on('systemMessage', (data) => {
    dispatch({ type: actionTypes.CHAT_LOG, payload: data });
  });
  socket.on('loadUsers', (data) => {
    dispatch({ type: actionTypes.LOAD_USER, payload: data });
  });
  socket.on('receiveMessage', (data) => {
    dispatch({ type: actionTypes.CHAT_LOG, payload: data });
  });
  socket.on('readyState', (data) => {
    dispatch({ type: actionTypes.READY, payload: data });
  });
  socket.on('deleteRoom', () => {
    cookie.remove('selectedRoom', { path: '/' });
    socket.emit('leave');
    socket.removeAllListeners();
    alert('호스트가 방에서 나갔습니다');
    setTimeout(() => window.location.replace('http://http://project-2p.s3-website.ap-northeast-2.amazonaws.com/selectRoom'), 2000);
  });
};

const mapReduxStateToReactProps = (state) => {
  return {
    waitingRoom: state.waitingRoom,
    login: state.login,
    currentGame: state.currentGame,
  };
};

const mapReduxDispatchToReactProps = (dispatch) => {
  socketSubscribe(dispatch);
  return {
    readyHandler: (username) => {
      socket.emit('ready', username);
      dispatch({ type: actionTypes.READY, payload: username });
    },
    chatHandler: (msg, username) => {
      socket.emit('sendMessage', msg, username);
      dispatch({ type: actionTypes.CHAT_LOG, payload: msg });
    },
    enterChatroom: (roomname, username, avatar, isReady, gameCode) => {
      const userInfo = { username, avatar, isReady };
      const room = { gameCode, roomId: roomname };
      socket.emit('joinRoom', { userInfo, room });
      dispatch({ type: 'JOINED_ROOM' });
    },
    leaveRoomHandler: () => {
      socket.emit('leave');
      socket.removeAllListeners();
      setTimeout(() => dispatch({ type: actionTypes.LEAVE_ROOM }), 500);
    },
  };
};
export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(WaitingRoom);
