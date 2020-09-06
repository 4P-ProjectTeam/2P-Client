import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import cookie from 'react-cookies'

import  Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import NumsGame from './NumsGame';
import BDman from './BDman';
import MoleGame from './MoleGame';
import PongGame from './PongGame';


const styles = (theme) => ({
  paper: {
    backgroundColor: 'transparent',
    width: theme.shadows[20],
    
  },
  gameover: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: 500,
    height: 200,
    margin: theme.spacing(3, 3),
  },
  userCard: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    alignItems: 'center',
    width: 200,
    height: 240,
    margin: theme.spacing(3, 3),
  },
  space: {
    height: document.body.clientHeight,
    display: 'flex',
    height: '100vh',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  user1: {
    height: 200,
    width: 200,
  },
  user2: {
    height: 200,
    width: 200,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // flexGrow: 1,
  },
});

class PlayGame extends Component {
  constructor(props){
    super(props);
    
    this.games = [
      {},{
        tag: <MoleGame />,
        color: '#00babd',
        pos: 90,
        shadow: '1px 1px 100px 0px #00535c',
      }, {
        tag: <BDman />,
        color: '#000',
        pos: 90,
        shadow: '-40px 0px 100px 0px #5c0200, 30px 0px 100px 0px #5e5d00',
      }, {
        tag: <NumsGame />,
        color: '#f0f0f0',
        pos: 60,
        shadow: '1px 1px 100px 0px #d6d6d6',
      }
    ];
  }

  componentWillMount() {
    if (!cookie.load('selectedGame')) {
      this.props.history.push('/')
    } 
    
  }

  componentWillUnmount() {
    cookie.remove('isPlaying', { path: '/' })
  }

  render(){
    const { classes } = this.props;
    return (
      <div>
        {
          cookie.load('selectedGame')
          ? <div 
              className={classes.space} 
              style={{ backgroundColor: this.games[cookie.load('selectedGame')]['color'] }}
            >
              <Paper 
                className={classes.paper} 
                style={{ 
                  paddingTop: `${this.games[cookie.load('selectedGame')]['pos']}px`,
                  height: `${Math.floor(document.body.clientHeight / 1.2) + this.games[cookie.load('selectedGame')]['pos']}px`,
                  boxShadow: this.games[cookie.load('selectedGame')]['shadow'],
                }}>
                  { this.games[cookie.load('selectedGame')]['tag'] }
              </Paper> 
            </div>
          : null
        }
      </div>
    );
  }
};
PlayGame.propsTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(PlayGame));
