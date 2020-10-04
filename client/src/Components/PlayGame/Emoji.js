import React, { useState, useEffect } from 'react'

import {
  Tooltip,
  Fab,
  GridList,
  GridListTile,
} from '@material-ui/core'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import CloseIcon from '@material-ui/icons/Close';

const style = {
  buttonPos: {
    position: 'fixed',
    right: '3%',
  },
  listPos: {
    position: 'fixed',
    right: '1%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  listCard: {
    width: '200px', 
    height: '40vw',
  },
  tile: {
    width: '100px', 
    height: '90px',
  },
  img: {
    width: '70px', 
    height: '70px',
  },
  background: {
    position: 'fixed', 
    top:'0px', 
    right:'0px', 
    width:'100vw', 
    height:'100vh', 
    backgroundColor: 'rgb(0, 0, 0, 0.5)' 
  }
}


export default function Emoji({ openEmojiList, activeEmoji, showEmojis, tileData }) {
  return (
    <>
      { showEmojis && 
        <>
          <div onClick={openEmojiList} style={style.background} />
          <GridList style={{
            ...style.listPos,
            bottom: window.innerWidth > 700 ? '100px' : '35%',
            width: window.innerWidth > 700 ? '200px' : '100px', 
            height: window.innerWidth > 700 ? '40vw' : '60vh', 
          }}>
            { tileData.map((tile) => (
              <GridListTile key={tile.img} style={style.tile} onClick={() => activeEmoji(tile.img)}>
                <img src={tile.img} alt={tile.title} style={style.img} />
              </GridListTile>
            ))}
          </GridList>
        </>   
      }
      <Tooltip title={ showEmojis ? '닫기' : '이모티콘' } aria-label='add' onClick={ openEmojiList }>
        <Fab color='secondary' style={{
          ...style.buttonPos, 
          bottom: window.innerWidth > 700 ? '3%' : '25%',
        }}>
          { showEmojis ? <CloseIcon /> : <EmojiEmotionsIcon /> }
        </Fab>
      </Tooltip>
    </>
  )
}
