import React from 'react';
import {
  Grid,
  Button,
  Typography
} from '@material-ui/core';

function MobileUserCard({
  myTurn, rivalName, rivalAvatar,
  theNumber, warningAlert,
  userAvatar, userName,
  computerModeStart
}) {

  
  let cardStyle = {
    position: 'fixed',
    bottom: '1vh',
    borderRadius: '5vw',
    width: document.body.clientWidth > 500 ? 220 : '45vw',
    height: document.body.clientWidth > 500 ? 170 : '35vw',
    backgroundColor: 'white',
  }

  let style = {
    rivalCard: {
      ...cardStyle,
      left: '3%',
      boxShadow: `${!myTurn 
        ? '0px 0px 20px 0px #0067c2'
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
      fontSize: document.body.clientWidth > 500 ? 15 : '4vw',
      marginTop: document.body.clientWidth > 500 ? -15 : null,
      width: '30vw'
    },
    numberFont: {
      fontSize: document.body.clientWidth > 500 ? 40 : '10vw'
    },
    image: {
      margin: document.body.clientWidth > 500 ? 10 : '2vw',
      width: document.body.clientWidth > 500 ? 90 : '20vw', 
      height: document.body.clientWidth > 500 ? 90 : '20vw'
    },
  }
  return (
    <>
      {document.body.clientWidth > 650 ? null : (
          <>
            <Grid container direction='row' justify='center' alignItems='center'
              style={style.rivalCard}>
              <>
                {!rivalName ? (
                  <Button color="secondary" variant="outlined" style={style.image} onClick={computerModeStart}>
                    <Typography style={{fontSize: style.nameFont.fontSize}}>
                      컴퓨터<br/>대결시작
                    </Typography>
                  </Button>
                ) : (
                  <img src={rivalAvatar} style={style.image} />
                )}
                <Typography style={style.numberFont}>
                  {myTurn ? '대기' : theNumber}
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
                  {myTurn ? theNumber : '대기'}
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