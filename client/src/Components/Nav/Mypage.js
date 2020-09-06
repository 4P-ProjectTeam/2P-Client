import React, { Component } from 'react'
import { connect } from 'react-redux';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardHeader, CardMedia, CardContent, CardActions, 
  MobileStepper, 
  Paper, Collapse, IconButton, Typography, Button, 
} from '@material-ui/core';
import { VictoryBar, VictoryLabel, VictoryChart, VictoryTheme, VictoryPolarAxis } from 'victory';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';


import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import avatar from '../../images/avatar.png'
import cookie from 'react-cookies'

const axios = require('axios');

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    minWidth: 150,
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 300,
    paddingIop: '56.25%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  record: {
    position: 'absolute',
    right: '20%'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 380,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  img: {
    height: 150,
    maxWidth: 200,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
  imgroot: {
    maxWidth: 220,
    flexGrow: 1,
    marginLeft: '50px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },

}));

let sampleData = [
  
]

let avatarId = Number(cookie.load('avatarId'));

function Mypage({ avatar, userData }) {
  const classes = useStyles();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const [expanded, setExpanded] = React.useState(false);
  const [isSetAvatar, setAvatar] = React.useState(false);
  const [currentAvatar, changeAvatar] = React.useState(avatar[avatarId]);
  const [userGameData, GameData] = React.useState([]);
  
  // 아바타 갯수
  const maxSteps = avatar.length-1;

  const createData = (mole, bid, baseball) => {
    return [
      {x: '구슬동자', y: bid},
      {x: '숫자야구', y: baseball},
      {x: '두더지잡기', y: mole},
    ]
  }

  const getUserGameData = () => {
    let gameNames = ['molegame', 'bidman', 'baseballgame']
    let winRate = [];
    let sample = {
      nickname: "유저닉네임",
      avatar: "유저프로필이미지번호",
      molegame:{
          play: 10,
          win: 2,
          tie: "비긴 수",
          lose: "진 수"
      },
      bidman:{
          play: 30,
          win: 10,
          tie: "비긴 수",
          lose: "진 수"
      },
      baseballgame:{
          play: 10,
          win: 2,
          tie: "비긴 수",
          lose: "진 수"
      },
  }

    gameNames.map((game) => {
      let gameData = userData.data[game]
      if(gameData){
        winRate.push(Math.floor(gameData.win / gameData.play * 10))
      }
    })
    GameData(createData(winRate[0], winRate[1], winRate[2]))
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }
  
  const handleNext = () => {
    avatarId += 1
    changeAvatar(avatar[avatarId])
  };

  const handleBack = () => {
    avatarId -= 1
    changeAvatar(avatar[avatarId])
  };

  const putAvatarData = async (id) => {
    try {
      const response = await axios({
        method: 'put',
        url: 'http://3.35.27.36:3001/users/mypage',
        data: {
          userId: cookie.load('username'),
          avatarId: avatarId,
        },
        withCredentials: true,
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  console.log(typeof avatarId)
  return (
      <Card style={modalStyle} className={classes.paper}>
        <CardHeader
          title="Mypage"
          subheader={cookie.load('username')}
        />
        <div className={classes.imgroot}>
          <img
            className={classes.img}
            src={currentAvatar}
            alt='유저 아바타'
          />
          {
            isSetAvatar
            ? <div>
                <Button variant="contained" color="primary" style={{ marginLeft: '45px' }} onClick={() => {
                      setAvatar(false)
                      putAvatarData(avatarId)
                      cookie.save('avatarId', avatarId, { path: '/' })
                    }}>아바타 바꾸기</Button>
                <MobileStepper
                  style={{ marginLeft: '-20px'}}
                  steps={maxSteps}
                  position="static"
                  variant="text"
                  activeStep={avatarId}
                  nextButton={
                    <Button size="small" onClick={handleNext} disabled={avatarId === maxSteps - 1}>
                      Next
                      {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                  }
                  backButton={
                    <Button size="small" onClick={handleBack} disabled={avatarId === 0}>
                      {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                      Back
                    </Button>
                  }
                />
              </div>
            : cookie.load('selectedRoom')
              ? <Button variant="contained" color="primary" style={{ marginLeft: '45px' }} disabled >아바타 바꾸기</Button>
              : <Button variant="contained" style={{ marginLeft: '45px' }} onClick={() => setAvatar(true)}>아바타 바꾸기</Button>
          }
        </div>
        
        <CardActions disableSpacing>
          <div className={classes.record}>게임승률보기</div>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={() => {
              handleExpandClick();
              getUserGameData();
            }}
            aria-expanded={expanded}
            aria-label="score"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {
            userGameData[0]
            ? <VictoryChart polar
                theme={VictoryTheme.material}
              >
                <VictoryPolarAxis/>
                <VictoryBar 
                    polar
                    theme={VictoryTheme.material}
                    data={userGameData}
                    labels={({ datum }) => `${datum.y}0%`}
                    domain={{ 
                      y: [0, 10] 
                    }}
                    style={{ 
                      data: { fill: "#c43a31", stroke: "black", strokeWidth: 2 },
                    }}
                  />
              </VictoryChart>
            : <Typography variant='h4' component='h2'>
                플레이 기록이 <br /> 존재하지 않습니다
              </Typography>
          }
          
        </Collapse>
      </Card>
  )
}

const mapReduxStateToReactProps = (state) => {
  return {
    avatar: state.login.avatar
  }
}

export default connect(mapReduxStateToReactProps)(Mypage)