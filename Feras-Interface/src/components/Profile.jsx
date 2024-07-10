import React from 'react'

const Profile = () => {
  return (
    <div className="wrapper-profile" style={{
      padding: 0,
      textDecoration: 'none',
      fontFamily: 'Poppins, sans-serif',
      height: '100%',
      backgroundColor: 'lightslategray',
      marginRight: '50px',
      marginLeft: '50px',
      borderRadius: '10px',
    }}>
      <div>
        <div className="img-photo" style={
          {
            display: 'flex',
            justifyContent: 'center',
            height: '200px',
            backgroundColor: 'darkslategray',
            borderRadius: '10px',
          }
        }>
          <div>
            <img src='https://www.w3schools.com/howto/img_avatar.png' alt='profile'
              style={
                {
                  borderRadius: '50%',
                  width: '150px',
                  height: '150px',
                  margin: '20px',
                }
              } />
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          marginRight: '50px',
          marginLeft: '50px',
          border: '2px solid black',
          padding: '10px',
        }}>
          <h2>Name:</h2>
          <h2>David N</h2>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '50px',
          marginRight: '50px',
          marginLeft: '50px',
          border: '2px solid black',
          padding: '10px'
        }}>
          <h2>Email:</h2>
          <h2>david@gmail.com</h2>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '50px',
          marginRight: '50px',
          marginLeft: '50px',
          border: '2px solid black',
          padding: '10px'
        }}>
          <h2>Position:</h2>
          <h2>Engineer</h2>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '50px',
          marginRight: '50px',
          marginLeft: '50px',
          border: '2px solid black',
          padding: '10px'
        }}>
          <h2>Employee id:</h2>
          <h2>120122</h2>
        </div>
      </div>

    </div>
  )
}

export default Profile