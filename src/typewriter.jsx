import  { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 100) => {
  const [displayText, setDisplayText] = useState('');
  const targetText = "Welcome to Signify!"

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < targetText.length) {
        setDisplayText((text) => text + targetText[text.length]);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
};

const Typewriter = ({ text, speed }) => {
  const displayText = useTypewriter(text, speed);

  return <p>{displayText}</p>;
};

export default Typewriter;