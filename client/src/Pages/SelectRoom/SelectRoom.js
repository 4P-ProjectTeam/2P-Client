import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { useHistory } from 'react-router-dom';

import { 
  Tab,
  Tabs,
  Grid,
  Fab,
  Paper,
  Button,
  Tooltip,
  Typography,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import * as actionTypes from '../../store/actions';
import RoomList from '../../Components/SelectRoom/RoomList';

import molethumbnail from '../../images/molethumbnail.png';
import bidthumbnail from '../../images/bidthumbnail.png';
import baseballthumbnail from '../../images/baseballthumbnail.png';

import moleGameDec from '../../images/moleGameDec.png';
import bidGameDec from '../../images/bidGameDec.png';
import baseballGameDec from '../../images/baseballGameDec.png';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  refresh: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(11),
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  emptyAlert: {
    width: theme.spacing(80),
    height: theme.spacing(70),
  },
  alertText: {
    margin: theme.spacing(20, 0, 10, 0),
  },
  root: {
    padding: theme.spacing(8, 0, 0, 0),
  },
  rootroot: {
    display: 'inline-block',
    padding: '20px 0px',
    width: '800px',
    height: '100px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function SelectRoom({ login, roomList, getRooms, makeRooms, isMaking }) {
  const classes = useStyles();
  const history = useHistory();
  const [currentGame, selectedGame] = React.useState(0);
  const [rooms, getRoomList] = React.useState([{}]);

  React.useEffect(() => {
    console.log(history);
    // if (!cookie.load('username')) {
    //   history.push('/');
    // } else if (!cookie.load('selectedGame')) {
    //   history.push('/selectgame');
    // } else if (cookie.load('selectedRoom')) {
    //   history.push('/waitingroom');
    // }
    
    getRooms(getRoomList);
    selectedGame(Number(cookie.load('selectedGame')));
  }, [currentGame]);

  const handleChange = (event, newValue) => {
    selectedGame(newValue);
    cookie.save('selectedGame', newValue, { path: '/' });
  };

  const leaveRoomHandler = () => {};

  const games = [
    {
      name: '두더지 게임',
      img: molethumbnail,
      dec: moleGameDec,
      color: '#00C8DE',
    }, 
    {
      name: '구슬 동자',
      img: bidthumbnail,
      dec: bidGameDec,
      color: '#000000',
    }, 
    {
      name: '숫자 야구',
      img: baseballthumbnail,
      dec: baseballGameDec,
      color: '#2D65AA'
    }, 
    ];
  
  const emptyRoomList = (
    <Grid
      container
      container
      direction='column'
      justify='space-evenly'
      alignItems='center'
      className={classes.section1}
    >
      <Paper className={classes.emptyAlert}>
        <Grid item style={{ marginTop: '-60px' }}>
          <Typography variant='h4' className={classes.alertText}>
            대기중인 방이 없습니다.
            <br />
            방을 생성해보세요
          </Typography>
        </Grid>
        <Grid container direction='row' justify='space-evenly' alignItems='center'
          style={{ marginTop: '-20px' }}>
          <Tooltip
            title='방만들기'
            aria-label='add'
            onClick={() => {
              makeRooms();
            }}
          >
            <Fab color='secondary'>
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip
            title='새로고침'
            aria-label='add'
            onClick={() => {
              getRooms(getRoomList);
            }}
          >
            <Fab color='primary'>
              <RefreshIcon />
            </Fab>
          </Tooltip>
        </Grid>
        <Button disableElevation variant="contained" 
            style={{
              width: '300px',
              height: '50px',
              marginTop: '60px'
            }}
            onClick={() => {
              history.push('/playgame')
            }}
          >
            <Typography variant='h6'>
              연습하기
            </Typography>
          </Button>
      </Paper>
    </Grid>
  );

  return (
    <div>
      <Paper className={classes.root}>
        <Tabs
          value={currentGame}
          onChange={handleChange}
          onClick={getRooms}
          indicatorColor='primary'
          textColor='primary'
          centered
        >
          <Tab label='게임 설명' />
          <Tab label='두더지 게임' />
          <Tab label='구슬 동자' />
          <Tab label='숫자 야구' />
        </Tabs>
      </Paper>
      {cookie.load('selectedGame') === '0' ? (  // 게임설명 페이지
        <Grid container direction='column' justify='space-evenly' alignItems='center'>
          <div className={classes.rootroot}>

            {
              games.map((game) => {
                return (
                  <Accordion style={{ backgroundColor: `${game.color}`, marginBottom: '10px' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      style={{
                        height: '150px',
                        width: '760px',
                        overflow: 'hidden',
                      }}
                    >
                      <img src={game.img}
                        style={{
                          width: '300px',
                        }}
                      />
                      <Typography 
                        style={{
                          color: '#fff',
                          marginTop: '25px',
                          marginLeft: '50px',
                          fontSize: '70px'
                        }}
                      >
                        {game.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{
                        // overflow: 'hidden',
                        alignItems: 'center'
                      }}>
                        <img src={game.dec} style={{
                          marginLeft: '10px',
                          width: 750,
                        }}/>
                    </AccordionDetails>
                  </Accordion>
                )
              })
            }

          </div>
        </Grid>


      ) : rooms[0] === undefined ? ( // 생성된 방이 없다
        emptyRoomList
      ) : (
        <div>
          <div className={classes.section1}>
            {rooms.map((room, idx) => (
              <RoomList
                key={idx}
                roomName={room.roomName}
                isWait={room.isWait}
                isLocked={room.isLocked}
                isFull={room.userNum}
                login={login}
                roomId={room.roomId}
                gameCode={room.gameCode}
              />
            ))}
          </div>
          <Tooltip
            title='방만들기'
            aria-label='add'
            onClick={() => {
              makeRooms();
            }}
          >
            <Fab color='secondary' className={classes.absolute}>
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip
            title='새로고침'
            aria-label='add'
            onClick={() => {
              getRooms(getRoomList);
            }}
          >
            <Fab color='primary' className={classes.refresh}>
              <RefreshIcon />
            </Fab>
          </Tooltip>
          <Button disableElevation variant="contained" 
            style={{
              position: 'fixed',
              width: '300px',
              height: '50px',
              bottom: '2%',
              left: '50%',
              marginLeft: '-150px',
            }}
            onClick={() => {
              history.push('/playgame')
            }}
          >
            <Typography variant='h6'>
              연습하기
            </Typography>
          </Button>
        </div>
      )}
    </div>
  );
}

const mapReduxStateToReactProps = (state) => {
  return {
    roomList: state.selectedRoom.roomList,
    isMaking: state.selectedRoom.isMaking,
    login: state.login,
  };
};

const mapReduxDispatchToReactProps = (dispatch) => {
  return {
    getRooms: async function (cb) {
      try {
        if (cookie.load('selectedGame') !== '0') {
          const response = await axios({
            method: 'get',
            url: 'http://3.35.27.36:3001/rooms/roomlist',
            params: {
              gameCode: cookie.load('selectedGame'),
            },
            withCredentials: true,
            params: {
              gameCode: cookie.load('selectedGame'),
            },
          });
          cb(response.data);
          dispatch({ type: 'GET_ROOMS', payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    },
    makeRooms: function () {
      dispatch({ type: 'MAKE_ROOM' });
    },
  };
};

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(SelectRoom);
