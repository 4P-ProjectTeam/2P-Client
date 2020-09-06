import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actionTypes from '../../store/actions';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';

import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import GroupIcon from '@material-ui/icons/Group';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import Badge from '@material-ui/core/Badge';

import Collapse from '@material-ui/core/Collapse';
import { TextField } from '@material-ui/core';
import { NaturePeopleOutlined } from '@material-ui/icons';

import cookie from 'react-cookies';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 700,
    maxHeight: 300,
    margin: theme.spacing(0, 2, 2),
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    height: 40,
    padding: theme.spacing(2, 3.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(2, 3),
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
  enter: {
    margin: '10px',
  },
  count: {
    padding: theme.spacing(0, 2, 0, 0),
  },
}));

function RoomList({
  login,
  roomName,
  isWait,
  isLocked,
  isFull,
  selectRoom,
  selected,
  roomId,
  gameCode,
}) {
  const classes = useStyles();
  const history = useHistory();
  const [password, setPassword] = React.useState('');
  const [spacing, setSpacing] = React.useState(2);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const [expanded, setExpanded] = React.useState(false);

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const joinRoomHandler = async (roomId, gameCode, password) => {
    axios({
      method: 'post',
      url: 'http://3.35.27.36:3001/rooms/joinroom',
      data: {
        roomId,
        gameCode,
        password,
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.message) {
          cookie.save('selectedRoom', roomId, { path: '/' });
          history.push('./waitingroom');
        } else {
          // when there are more than 2 ppl in the room already
          alert(res.data.error);
        }
      })
      .catch((err) => {
        alert('비밀번호가 틀렸습니다!');
      });
  };

  return (
    <Grid container direction='column' justify='space-evenly' alignItems='center'>
      <Paper className={classes.root} elevation={2}>
        <div className={classes.section1}>
          <Grid container alignItems='center'>
            <Grid>
              {isWait ? (
                <Chip label={'Waiting'} variant='outlined' color={'primary'} />
              ) : (
                <Chip label={'Playing'} color={'secondary'} />
              )}
            </Grid>
            <Grid item xs>
              {isLocked ? (
                <LockIcon style={{ fontSize: 30 }} />
              ) : (
                <LockOpenIcon style={{ fontSize: 30 }} />
              )}
              <Typography gutterBottom variant='h4'>
                {roomName}
              </Typography>
            </Grid>
            <Grid item>
              <Grid item container direction='row' justify='center' alignItems='center'>
                {isFull === 2 ? (
                  <div>
                    <Typography className={classes.count} variant='h5'>
                      <HowToRegIcon />
                      2/2
                    </Typography>
                    <Button variant='contained' color='primary' disabled>
                      입장하기
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Typography className={classes.count} variant='h5'>
                      <EmojiPeopleIcon />
                      1/2
                    </Typography>
                    {expanded ? (
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => {
                          handleExpandClick();
                          // history.push('./waitingroom')
                        }}
                      >
                        취소
                      </Button>
                    ) : (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          // 비밀번호가 있다면 구역이 확장된다
                          if (isLocked) {
                            handleExpandClick();
                          } else {
                            joinRoomHandler(roomId, gameCode, '');
                          }
                        }}
                      >
                        입장하기
                      </Button>
                    )}
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Collapse in={expanded} timeout={100} unmountOnExit>
          <Paper className={classes.paper}>
            <Grid container direction='row' justify='flex-end' alignItems='center' spacing={2}>
              <Grid item>
                <TextField
                  id='standard-password-input'
                  label='방 비밀번호를 입력하세요'
                  type='password'
                  autoComplete='current-password'
                  variant='outlined'
                  size='small'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={(e) => {
                    joinRoomHandler(roomId, gameCode, password);
                  }}
                >
                  확인
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      </Paper>
    </Grid>
  );
}

const mapReduxStateToReactProps = (state) => {
  return {
    selected: state.selectedRoom,
    waitingRoom: state.waitingRoom,
  };
};

const mapReduxDispatchToReactProps = (dispatch) => {
  return {
    selectRoom: function (roomName) {
      cookie.save('selectedRoom', roomName, { path: '/' });
    },
  };
};

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(RoomList);
