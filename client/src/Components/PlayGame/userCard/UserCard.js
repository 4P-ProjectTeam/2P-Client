import React, { useEffect, useState } from 'react';
import {
  Paper,
  Grid,
  Typography
} from '@material-ui/core';

import YellowCard from './YellowCard'

function UserCard({ 
  userAvatar, userName,
  theNumber, warningAlert, 
  myTurn, yellowCard,  // numsGame
  cardTheme,
}) {

  const [styleObj, setStyleObj] = useState({});
  const [style, setStyle] = useState({
    root: {
      backgroundColor: !cardTheme ? 'white' : 'black',
      marginLeft: '6vw',
      borderRadius: '2vw',
      width: '13vw',
      height: '21vw',
      padding: '2vw',
      boxShadow: `${warningAlert 
        ? '0px 0px 20px 0px #ff5c5c' 
        : myTurn 
        ? `0px 0px 2vw 0px #0067c2`
        : '0px 0px 0px 0px #d6d6d6'
      }`,
    },
    font: {
      color: !cardTheme ? '#000' : '#fff',
      fontSize: '1.5vw',
    },
    countFont: {
      color: !cardTheme ? '#000' : '#fff',
      fontSize: '5vw',
    },
    avatarImg: {
      width: '10vw',
      height: '10vw',
    }
  })
  const [fixedStyle, setFixedStyle] = useState({
    root: {
      backgroundColor: !cardTheme ? 'white' : 'black',
      marginLeft: 61,
      borderRadius: 20,
      width: 133,
      height: 215,
      padding: 20,
      boxShadow: `${warningAlert 
        ? '0px 0px 20px 0px #ff5c5c' 
        : myTurn 
        ? `0px 0px 20 0px #0067c2`
        : '0px 0px 0px 0px #d6d6d6'
      }`,
    },
    font: {
      color: !cardTheme ? '#000' : '#fff',
      fontSize: 15,
    },
    countFont: {
      color: !cardTheme ? '#000' : '#fff',
      fontSize: 51,
    },
    avatarImg: {
      width: 102,
      height: 102,
    }
  })

  useEffect(() => {
    resize();

    window.addEventListener('resize', resize, false);
    return () => {
      window.removeEventListener('resize', resize, false);
    }
  }, [styleObj]);

  const resize = () => {
    if (window.innerWidth > 1024) {
      setStyleObj(fixedStyle);
    } else {
      setStyleObj(style);
    }
  }


  

  return (
    <>
      {document.body.clientWidth > 700 ? (
        <Paper style={styleObj.root}>
          <Grid container direction='column' justify='center' alignItems='center'>
            <img src={userAvatar} style={styleObj.avatarImg} />
            <Typography style={styleObj.font}>
              {userName}
            </Typography>
            <Typography style={styleObj.countFont}>
              {theNumber}
            </Typography>
            <YellowCard yellowCard={yellowCard} />
          </Grid>
        </Paper>
      ) : null }
    </>
  )
}

export default UserCard;