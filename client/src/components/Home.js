import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setErrorMessage('Salon plein ou non disponible');
    };

    // Add event listeners for socket connection and disconnection
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Cleanup event listeners when the component unmounts
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the socket is connected before allowing the user to sign in
    if (isConnected) {
      localStorage.setItem('userName', userName);
      socket.emit('newUser', { userName, socketID: socket.id });
      navigate('/chat');
    } else {
      setErrorMessage('Salon plein ou non disponible');
    }
  };

  return (
    <form className='home__container' onSubmit={handleSubmit}>
      <h2 className='home__header'>Sign in to Open Chat</h2>
      <label htmlFor='username'>Username</label>
      <input
        type='text'
        minLength={1}
        name='username'
        id='username'
        className='username__input'
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button className='home__cta' disabled={!isConnected}>
        SIGN IN
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default Home;
