import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';

import Grid from '@material-ui/core/Grid';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CancelIcon from '@material-ui/icons/Cancel';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import cookie from 'react-cookies';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    // width: 300,
  },
  button: {
    margin: theme.spacing(2, 2, 0, 0),
  },
  closeButton: {
    margin: theme.spacing(10, 5),
  },
}));

function MakeGame({ isMaking, makeRoomsClose }) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [selectedGame, setGame] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [roomName, setRoomname] = React.useState('');

  React.useEffect(() => {
    setOpen(isMaking);
  });

  const handleClose = () => {
    setOpen(false);
  };

  const makeRoom = (selectedGame, roomName, password) => {
    try {
      axios({
        method: 'post',
        url: 'http://3.35.27.36:3001/rooms/makeroom',
        data: {
          gameCode: cookie.load('selectedGame'),
          roomName: roomName,
          password: password,
          username: cookie.load('username'),
        },
      }).then((res) => {
        cookie.save('selectedRoom', res.data.roomId, { path: '/' });
        history.push('waitingroom');
        alert('성공적으로 생성되었습니다');
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          <Grid item container direction='row' justify='center' alignItems='center'>
            <Grid item xs>
              <h2 id='transition-modal-title'>방만들기</h2>
            </Grid>
            <Grid>
              <IconButton
                onClick={() => {
                  setGame('');
                  makeRoomsClose();
                }}
              >
                <CancelIcon />
              </IconButton>
            </Grid>
          </Grid>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='age-native-helper'>Game</InputLabel>
            <NativeSelect
              value={selectedGame ? selectedGame : cookie.load('selectedGame')}
              onChange={(e) => setGame(e.target.value)}
            >
              <option aria-label='None' value='' />
              <option value={1}>두더지게임</option>
              <option value={2}>구슬동자</option>
              <option value={3}>숫자야구</option>
            </NativeSelect>
          </FormControl>
          <div>
            <TextField
              id='standard-basic'
              label='Room name'
              onChange={(e) => setRoomname(e.target.value)}
            />
          </div>
          <div>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
              <Input
                type='text'
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position='end'>
                    {password ? <LockIcon /> : <LockOpenIcon />}
                  </InputAdornment>
                }
              />
              <FormHelperText>비밀방을 생성할 때 입력해주세요</FormHelperText>
            </FormControl>
          </div>
          <div className={classes.button}>
            {password ? (
              <Button
                variant='contained'
                color='primary'
                onClick={async () => {
                  await makeRoom(selectedGame, roomName, password);
                  makeRoomsClose();
                  // cookie.save('selectedRoom', roomName, { path: '/' });
                  // history.push('/waitingroom');
                }}
              >
                비공개방 생성
              </Button>
            ) : (
              <Button
                variant='contained'
                onClick={() => {
                  makeRoom(null, roomName, '');
                  makeRoomsClose();
                  // cookie.save('selectedRoom', roomName, { path: '/' });
                  // history.push('/waitingroom');
                }}
              >
                공개방 생성
              </Button>
            )}
          </div>
        </Paper>
      </Fade>
    </Modal>
  );
}

function mapReduxStateToReactProps(state) {
  return {
    isMaking: state.selectedRoom.isMaking,
  };
}

function mapReduxDispatchToReactProps(dispatch) {
  return {
    makeRoomsClose: function () {
      dispatch({ type: 'MAKE_ROOM_CLOSE' });
    },
  };
}
export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(MakeGame);
