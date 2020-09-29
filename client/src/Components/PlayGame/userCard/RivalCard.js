import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import {
  Paper,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';

import YellowCard from './YellowCard'



function RivalCard({ 
  width, username, theNumber, avatar, computerModeStart, 
  myTurn = true, yellowCard,
  cardTheme
}) {

  const style = {
    root: {
      backgroundColor: !cardTheme ? 'white' : 'black',
      marginLeft: '7vw',
      borderRadius: '2vw',
      width: '13vw',
      height: '21vw',
      padding: '2vw',
      boxShadow: `${!myTurn 
        ? '0px 0px 20px 0px #0067c2'
        : '0px 0px 0px 0px #d6d6d6' 
      }`,
    },
    font: {
      color: !username.length ? null 
        : !cardTheme ? '#000' : '#fff',
      fontSize: '1.5vw',
    },
    countFont: {
      color: !cardTheme ? '#000' : '#fff',
      fontSize: '5vw',
    },
    button: {
      width: '10vw',
      height: '10vw',
    },
    avatarImg: {
      width: '10vw',
      height: '10vw',
    }
  }

  return (
    <Paper style={style.root}>
      <Grid container direction='column' justify='center' alignItems='center'>

        {!username.length ? (
          <Button color="secondary" variant="outlined" style={style.button} onClick={computerModeStart}>
            <Typography style={style.font}>
              컴퓨터<br/>대결시작
            </Typography>
          </Button>
        ) : (
          <>
            <img src={avatar} style={style.avatarImg} />
            <Typography style={style.font}>
              {username}
            </Typography>
          </>
        )}

        <Typography style={style.countFont}>
          {theNumber}
        </Typography>
        <YellowCard yellowCard={yellowCard} />
      </Grid>
    </Paper>
  )
}

export default RivalCard;