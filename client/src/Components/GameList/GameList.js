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
  IconButton,
} from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import SelectGame from '../../Pages/SelectGame/SelectGame';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '55vw',
    marginBottom: '2vw',
  },
  innerCard: {
    width: '100vw',
    height: '55vw',
  },
  button: {
    width: '40vw',
    height: '20vw',
    margin: '2vw',
  },
  practiceButton: {
    width: '90vw',
    height: '10vw',
  },
  title: {
    fontSize: '10vw',
  },
  desc: {
    fontSize: '3vw',
  },
  buttonFont: {
    fontSize: '5vw'
  }
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
            className={classes.innerCard}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            onClick={handlePopoverClose}
          >
            <Grid container direction="row" justify="space-around" alignItems="center" style={{marginLeft: '5%'}}>
              <Grid item />
              <Typography className={classes.title}>
                {gameDescription[gameName]['title']}
              </Typography>
              <IconButton >
                <CancelPresentationIcon />
              </IconButton>
            </Grid>
            <Typography className={classes.desc}>
              {gameDescription[gameName]['desc']}
            </Typography>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
              <Grid item>
                <Button color="primary" disableElevation className={classes.button} variant="contained" 
                  onClick={() => {
                    cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                    if(!cookie.load('username')) guestLogin()
                    history.push('/selectroom')
                  }
                }>
                  <Typography className={classes.buttonFont}>
                    참가하기
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary" disableElevation className={classes.button} variant="contained"
                  onClick={() => {
                    cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                    if(!cookie.load('username')) guestLogin()
                    makeRooms()
                  }}
                >
                  <Typography className={classes.buttonFont}>
                    방 만들기
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Button disableElevation variant="contained" 
              className={classes.practiceButton}
              onClick={() => {
                cookie.save('selectedGame', gameDescription[gameName]['code'], { path: '/' })
                if(!cookie.load('username')) guestLogin()
                history.push('/playgame')
              }}
            >
              <Typography className={classes.buttonFont}>
                연습하기
              </Typography>
            </Button>
          </Paper>
        </Grow>
        :
        <CardMedia
          component='img'
          alt='gameImg'
          class={classes.innerCard}
          image={image}
          title={`${gameName} game`}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick={handlePopoverOpen}
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
