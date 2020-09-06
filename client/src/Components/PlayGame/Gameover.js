import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { withRouter, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import congratulations from './img/congratulations.png';
import victoryEffect from '../../images/victoryEffect.gif';
import loseEffect from '../../images/loseEffect.gif';
import computer from '../../images/computer.gif';

const useStyles = makeStyles({
  root: {
    width: `${document.body.clientWidth / 1.5}px`,
    heigh: `${document.body.clientWidth / 4}px`,
    opacity: 0.9,
    zIndex: 100,
    position: 'fixed',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -20%)',
  },
});

function Gameover({ winner, isComputer }) {
  const classes = useStyles();
  const history = useHistory();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (timer < 0) {
      return history.goBack();
    }
    setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
  }, [timer]);

  return (
    <Card
      className={classes.root}
      style={{
        background: `${winner === cookie.load('username') ? '#fff' : '#000'}`,
      }}
    >
      <CardActionArea>
        <CardMedia
          component='img'
          alt='Contemplative Reptile'
          image={
            winner === cookie.load('username')
              ? victoryEffect
              : winner === 'Computer'
              ? computer
              : loseEffect
          }
          style={{
            height: `${document.body.clientWidth / 4}px`,
            opacity: `${winner === cookie.load('username') ? '100%' : '70%'}`,
          }}
        />
        <CardContent>
          <Typography
            gutterBottom
            style={{
              fontSize: `${document.body.clientWidth / 10}px`,
              color: `${winner === cookie.load('username') ? '#000' : '#fff'}`,
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              lineHeight: '80%',
            }}
          >
            {winner === cookie.load('username')
              ? 'Victory!'
              : winner === 'Computer'
              ? 'Human lose'
              : 'You lose'}
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
            component='h2'
            variant='h5'
            style={{
              color: `${winner === cookie.load('username') ? '#000' : '#fff'}`,
            }}
          >
            {
              isComputer
              ? `${timer}초 후 연습모드가 종료됩니다.`
              : `${timer}초 후 대기방으로 이동합니다.`
            }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withRouter(Gameover);
