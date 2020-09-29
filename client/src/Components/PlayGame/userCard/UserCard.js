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


  const style = {
    root: {
      backgroundColor: !cardTheme ? 'white' : 'black',
      marginRight: '7vw',
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
  }

  return (
    <Paper style={style.root}>
      <Grid container direction='column' justify='center' alignItems='center'>
        <img src={userAvatar} style={style.avatarImg} />
        <Typography style={style.font}>
          {userName}
        </Typography>
        <Typography style={style.countFont}>
          {theNumber}
        </Typography>
        <YellowCard yellowCard={yellowCard} />
      </Grid>
    </Paper>
  )
}

export default UserCard;