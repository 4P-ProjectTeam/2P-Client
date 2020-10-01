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

  const [styleObj, setStyleObj] = useState({});
  const [style, setStyle] = useState({
    root: {
      backgroundColor: !cardTheme ? 'white' : 'black',
      marginRight: '6vw',
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
    avatarImg: {
      width: '10vw',
      height: '10vw',
    }
  })
  const [fixedStyle, setFixedStyle] = useState({
    root: {
      backgroundColor: !cardTheme ? 'white' : 'black',
      marginRight: 61,
      borderRadius: 20,
      width: 133,
      height: 215,
      padding: 20,
      boxShadow: `${!myTurn 
        ? '0px 0px 20px 0px #0067c2'
        : '0px 0px 0px 0px #d6d6d6' 
      }`,
    },
    font: {
      color: !username.length ? null 
        : !cardTheme ? '#000' : '#fff',
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
            {!username.length ? (
              <Button color="secondary" variant="outlined" style={styleObj.avatarImg} onClick={computerModeStart}>
                <Typography style={styleObj.font}>
                  컴퓨터<br/>대결시작
                </Typography>
              </Button>
            ) : (
              <>
                <img src={avatar} style={styleObj.avatarImg} />
                <Typography style={styleObj.font}>
                  {username}
                </Typography>
              </>
            )}

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

export default RivalCard;