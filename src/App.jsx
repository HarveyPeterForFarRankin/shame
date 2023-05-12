import './App.css';
// import shameAudio from './assets/shame.mp3';
import Typed from 'typed.js';
import React, { useEffect, useRef, useState } from 'react';

function App() {
  /**
   * this is done by the index
   */
  const [activeText, setActiveText] = useState(0);
  const texts = ['text 1', 'text 2', 'text 3'];

  const nextText = () => setActiveText(activeText + 1);

  return (
    <div className='App'>
      {texts.map((t, i) => {
        return <TextButtoEl click={nextText} text={t} startText={i === activeText} />;
      })}
    </div>
  );
}

const TextButtoEl = ({ text, click, startText }) => {
  const el = useRef(null);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (startText && !completed) {
      const typed = new Typed(el.current, { strings: [text], onComplete: setCompleted, typeSpeed: 300 });

      return () => typed.destroy();
    }
  }, [startText]);

  return (
    <div>
      {startText && (
        <>
          <div>
            <span ref={el} />
          </div>
          {completed && <button onClick={click}>button woo</button>}
        </>
      )}
    </div>
  );
};

export default App;
