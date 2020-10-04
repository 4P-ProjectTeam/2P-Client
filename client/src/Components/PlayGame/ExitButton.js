import React from 'react';
import { withRouter } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToAppOutlined';

export default withRouter(function ExitButton(props) {
  return (
    <IconButton 
      style={{ 
        color: props.theme ? 'white' : '',
        position: 'fixed', 
        top: '2%', 
        right: '3%', 
      }}
      onClick={() => {
        props.history.goBack();
      }}
    >
      <ExitToAppIcon style={{ fontSize: '40px' }} />
    </IconButton>
  )
})