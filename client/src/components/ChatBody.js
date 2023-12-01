import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, typingStatus, lastMessageRef }) => {
  const navigate = useNavigate();
  const [randomWord, setRandomWord] = useState('');
  const isPlayer1 = localStorage.getItem('isPlayer1') === '1';

  const wordsList = ['Mot1', 'Mot2', 'Mot3', 'Mot4', 'Mot5']; // Add your French words here

  useEffect(() => {
    if (isPlayer1) {
      // Display random word only for player 1
      const randomIndex = Math.floor(Math.random() * wordsList.length);
      setRandomWord(wordsList[randomIndex]);
    }
  }, [isPlayer1]);

  const handleLeaveChat = () => {
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <header className='chat__mainHeader'>
        {isPlayer1 && <p id='motADeviner'>Mot à deviner : {randomWord}</p>}
        <button className='leaveChat__btn' onClick={handleLeaveChat}>
          Quitter
        </button>
      </header>

      <div className='message__container'>
        {messages.map((message) => (
          <div className='message__chats' key={message.id}>
            {message.name === localStorage.getItem('userName') ? (
              <>
                <p className='sender__name'>Vous</p>
                <div className='message__sender'>
                  <p>{message.text}</p>
                </div>
              </>
            ) : (
              <>
                <p>{message.name}</p>
                <div className='message__recipient'>
                  <p>{message.text}</p>
                </div>
              </>
            )}
          </div>
        ))}

        <div className='message__status'>
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
