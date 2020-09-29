import React from 'react';

function YellowCard({ yellowCard }) {

  return (
    <>
      {yellowCard === 1 ? (
        <div
          style={{
            backgroundColor: 'yellow',
            width: '1.5vw',
            height: '2vw',
            border: '0.2vw solid #000',
          }}
        />
      ) : yellowCard === 2 ? (
        <div
          style={{
            backgroundColor: 'red',
            width: '1.5vw',
            height: '2vw',
            border: '0.2vw solid #000',
          }}
        />
      ) : null}
    </>
  )
}

export default YellowCard;