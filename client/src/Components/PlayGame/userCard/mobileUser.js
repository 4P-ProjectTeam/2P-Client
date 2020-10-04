import React from 'react';
import {
  Grid,
  Button,
  Typography
} from '@material-ui/core';

function MobileUserCard({
  // numsgame
  myTurn, warningAlert, countNum, 
  // bdman  
  cardTheme,
  rivalName, rivalAvatar, rivalScore,
  userAvatar, userName, userScore,
  computerModeStart
}) {

  
  let cardStyle = {
    position: 'fixed',
    bottom: '1vh',
    borderRadius: '5vw',
    width: document.body.clientWidth > 500 ? 220 : '45vw',
    height: document.body.clientWidth > 500 ? 170 : '35vw',
    backgroundColor: !cardTheme ? 'white' : 'black',
    border: !cardTheme ? '' : '2px solid #fff',
  }

  let style = {
    rivalCard: {
      ...cardStyle,
      left: '3%',
      boxShadow: `${!myTurn 
        ? countNum && '0px 0px 20px 0px #0067c2'
        : '0px 0px 0px 0px #d6d6d6' 
      }`,
    },
    userCard: {
      ...cardStyle,
      right: '3%',
      boxShadow: `${warningAlert 
        ? '0px 0px 20px 0px #ff5c5c' 
        : myTurn 
        ? `0px 0px 2vw 0px #0067c2`
        : '0px 0px 0px 0px #d6d6d6'
      }`,
    },
    nameFont: {
      fontSize: document.body.clientWidth > 500 ? 15 : '3.3vw',
      marginTop: document.body.clientWidth > 500 ? -15 : null,
      color: !cardTheme ? '#000' : '#fff',
      width: '30vw',
    },
    numberFont: {
      fontSize: document.body.clientWidth > 500 ? 40 : '10vw',
      color: !cardTheme ? '#000' : '#fff',
    },
    image: {
      margin: document.body.clientWidth > 500 ? 10 : '2vw',
      width: document.body.clientWidth > 500 ? 90 : '20vw', 
      height: document.body.clientWidth > 500 ? 90 : '20vw',
    },
  }
  return (
    <>
      {document.body.clientWidth > 700 ? null : (
          <>
            <Grid container direction='row' justify='center' alignItems='center'
              style={style.rivalCard}>
              <>
                {!rivalName ? (
                  <Button color="secondary" variant="outlined" style={style.image} onClick={computerModeStart}>
                    <Typography style={{fontSize: style.nameFont.fontSize}}>
                      연습하기<br/>START
                    </Typography>
                  </Button>
                ) : (
                  <img src={rivalAvatar} style={style.image} />
                )}
                <Typography style={style.numberFont}>
                  { countNum ? (
                    myTurn ? '대기' : countNum
                  ) : (
                    rivalScore 
                  )}
                </Typography>
              </>
              <Typography style={style.nameFont}>
                {rivalName ? rivalName : '.'}
              </Typography>
            </Grid>
              
            <Grid container direction='row' justify='center' alignItems='center'
              id="mobileUser"
              style={style.userCard}>
              <>
                <Typography style={style.numberFont}>
                  { countNum ? (
                    myTurn ? countNum : '대기'
                  ) : (
                    userScore
                  )}
                </Typography>
                <img src={userAvatar} style={style.image} />
              </>
              <Typography style={style.nameFont}>
                {userName}
              </Typography>
            </Grid>
          </>
        )}
    </>
  )
}

export default MobileUserCard;