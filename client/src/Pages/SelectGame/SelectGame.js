import React from 'react';
import GameList from '../../Components/GameList/GameList';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom'
import cookie from 'react-cookies'

import molethumbnail from '../../images/molethumbnail.png';
import bidthumbnail from '../../images/bidthumbnail.png';
import baseballthumbnail from '../../images/baseballthumbnail.png';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  flexContainer: {
    padding: theme.spacing(8, 0, 0, 0),
  }
}))

const SelectGame = ({ isLogin }) => {
  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    // if(!cookie.load('username')){
    //   history.push('/')
    // } else 
    // if(cookie.load('selectedGame')){
    //   history.push('/selectroom')
    // }

  },[])


  return (
      <Grid className={ classes.flexContainer } container direction="column" justify="space-evenly" alignItems="center">
        <Grid container direction="row" justify="space-evenly" alignItems="center" >
          <Grid item>
            <GameList image={molethumbnail} gameName='moleGame' />
          </Grid>
          <Grid item>
            <GameList image={bidthumbnail} gameName='bidGame' />
          </Grid>
          <Grid item>
            <GameList image={baseballthumbnail} gameName='baseballGame' />
          </Grid>
        </Grid>
      </Grid>
  );
};

function mapReduxStateToReactProps(state) {
  return {
    isLogin: state.login.isLogin
  }
}

export default connect(mapReduxStateToReactProps)(SelectGame);
