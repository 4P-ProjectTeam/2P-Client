import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, useHistory } from 'react-router-dom';
import cookie from 'react-cookies'
import { connect } from 'react-redux';

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Popover,
  Paper,
  Grow,
  Grid,
} from '@material-ui/core';
import SelectGame from '../../Pages/SelectGame/SelectGame';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    // margin: 'auto',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  mouseOverPaper: {
    width: '600px',
    height: '300px',
  },
  button: {
    width: '200px',
    height: '100px',
    margin: theme.spacing(3)
  },
}));

const gameDescription = {
  moleGame: {
    title: '두더지 잡기',
    desc: '두더지를 잡아라! 에잇!',
    code: 1,
  },
  bidGame: {
    title: '구슬동자',
    desc: '핑핑핑슝슝슝',
    code: 2,
  },
  baseballGame: {
    title: '숫자야구',
    desc: '원 스트라잌! 쓰리 볼!! ',
    code: 3,
  },
};

// 비로그인 유저
const guestLogin = () => {
  let randomName = Math.random().toString(36).substr(2, 5)
  let randomAvatar = String(Math.floor(Math.random() * 12))
  cookie.save('username', `Guest_${randomName}`, { path: '/' })
  cookie.save('avatarId', randomAvatar, { path: '/' })
}

const GameList = ({ image, gameName, getRooms, selectGame, makeRooms }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handlePopoverClose = (event) => {
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);


  return (
    <Card className={classes.root}>
      {
        open
        ? 
        <Grow in={open}>
          <Paper 
            elevation={4}
            className={classes.mouseOverPaper}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Typography variant='h3'>
              {gameDescription[gameName]['title']}
            </Typography>
            <Typography variant='body' color='textSecondary' component='p'>
              {gameDescription[gameName]['desc']}
            </Typography>
            <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={3}>
              <Grid item>
                <Button color="primary" disableElevation className={classes.button} variant="contained" 
                  onClick={() => {
                    cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                    if(!cookie.load('username')) guestLogin()
                    history.push('/selectroom')
                  }
                }>
                  <Typography variant='h6'>
                    참가하기
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary" disableElevation className={classes.button} variant="contained"
                  style={{ marginLeft: '-40px'}} 
                  onClick={() => {
                    cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                    if(!cookie.load('username')) guestLogin()
                    makeRooms()
                  }}
                >
                  <Typography variant='h6'>
                    방 만들기
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Button disableElevation variant="contained" 
              style={{
                width: '450px',
                height: '50px',
              }}
              onClick={() => {
                cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                if(!cookie.load('username')) guestLogin()
                history.push('/playgame')
              }}
            >
              <Typography variant='h6'>
                연습하기
              </Typography>
            </Button>
          </Paper>
        </Grow>
        :
        <CardMedia
          component='img'
          alt='gameImg'
          height='300'
          image={image}
          title={`${gameName} game`}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
      }
    </Card>
  );
};

const mapReduxDispatchToReactProps = (dispatch) => {
  return {
    makeRooms: function () {
      dispatch({ type: 'MAKE_ROOM' });
    },
  };
};

export default connect(null, mapReduxDispatchToReactProps)(withRouter(GameList));
