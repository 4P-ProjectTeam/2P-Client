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
import { Translate } from '@material-ui/icons';


const styles = (theme) => ({
  paper: {
    backgroundColor: 'transparent',
    position: 'fixed',
    width: '90vw',
    height: '40vw',
    top: '50%',
    right: '50%',
    marginTop: '-20vw',
    marginRight: '-45vw',
  },
  space: {
    height: document.body.clientHeight,
    display: 'flex',
    height: '100vh',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  
});

class PlayGame extends Component {
  constructor(props){
    super(props);
    this.state = {
      gameHeight: 0,
      gameWidth: 0,
    }
    
    this.games = [
      {},{
        tag: <MoleGame />,
        color: '#00babd',
        id: '#molegame',
        shadow: '1px 1px 100px 0px #00535c',
      }, {
        tag: <BDman />,
        color: '#000',
        id: '#bdman',
        shadow: '-40px -40px 100px 0px #5c0200, 30px 30px 100px 0px #5e5d00',
      }, {
        tag: <NumsGame />,
        color: '#f0f0f0',
        id: '#numsgame',
        shadow: '1px 1px 100px 0px #d6d6d6',
      }
    ];
  }

  componentWillMount() {
    
    if (!cookie.load('selectedGame')) {
      this.props.history.push('/')
    } 
  }
  
  componentDidMount() {
    this.getHeight();
    window.addEventListener('resize', this.getHeight.bind(this), false);
  }

  getHeight() {
    this.setState({ gameHeight: document.querySelector(this.games[cookie.load('selectedGame')]['id']).clientHeight})
  }
  
  componentWillUnmount() {
    cookie.remove('isPlaying', { path: '/' })
    window.removeEventListener('resize', this.getHeight.bind(this), false);
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
                id="gamePaper"
                style={{ 
                  backgroundColor: 'transparent',
                  position: 'fixed',
                  width: `90vw`,
                  height: `${this.state.gameHeight}px`,
                  top: '50%',
                  right: '50%',
                  marginTop: `-${this.state.gameHeight / 2}px`,
                  marginRight: `-45vw`,
                  boxShadow: this.games[cookie.load('selectedGame')]['shadow'],
                  border: cookie.load('selectedGame') === '2' ? '0.1vw solid #fff' : '',
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
