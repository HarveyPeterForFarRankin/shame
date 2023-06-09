import './App.css';
import Typed from 'typed.js';
import ProgressBar from 'progressbar.js';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRightAlt, ArrowRightRounded } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import shame1 from './assets/shame1.mp3';
import shame2 from './assets/shame2.mp3';
import shame3 from './assets/shame3.mp3';
import shame4 from './assets/shame4.mp3';
import shame5 from './assets/shame5.mp3';
import hi from './assets/hi.mp3';

const HI_AUDIO = 'HI_AUDIO';
const SHAME_AUDIO = 'SHAME_AUDIO';

const texts = ['Hi, and welcome to this webpage. Please click the arrow at the bottom of the page...please', 'If you are bored - you can change the speed at the top right.... if you dare...... give it a go', 'I wanted to deploy something to AWS, so i wanted a masterpiece - but instead i made this', 'sfsdfgsfjhsdfjhdsfgh fsjdhgjhsdfjhgsdhjgf hsdf g', 'That was a joke, that made no sense - at this point, you will want 10x speed', 'You are also probably wondering what the point of this site is even now, there is no point', 'SHAME', 'Hey Darcy'];

const useStyles = makeStyles(theme => ({
  button: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    color: 'white',
    cursor: 'pointer',
  },
  root: {
    position: 'fixed',
  },
  menu: {
    backgroundColor: '#222', // set the background color to black
    borderRadius: 10, // add some rounded corners to the menu
    '& .MuiMenuItem-root': {
      color: '#fff', // set the text color to white
      '&:hover': {
        backgroundColor: '#333', // darken the background color on hover
      },
    },
  },
}));

const audioMapper = {
  1: shame1,
  2: shame2,
  4: shame3,
  6: shame4,
  10: shame5,
};

const playAudio = (audio, speed = 1) => {
  if (audio) {
    const audioPlayer = new Audio(audio);
    audioPlayer.playbackRate = speed;
    audioPlayer.play();
  }
};

const getAudio = action => {
  const { type, payload } = action;
  switch (type) {
    case HI_AUDIO:
      return hi;
    case SHAME_AUDIO:
      return audioMapper[payload];
    default:
      return null;
  }
};

function App() {
  const normlSpeed = 100;
  const el = useRef(null);
  const loadingEl = useRef(null);
  const [activeText, setActiveText] = useState(0);
  const [showButton, setButtonToShow] = useState(false);
  const [textSpeed, setTextSpeed] = useState(normlSpeed);
  const [hiSaid, setHiSaid] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [start, setStart] = useState(false);
  const classes = useStyles();

  const nextText = () => {
    setButtonToShow(false);
    setActiveText(activeText + 1);
  };

  useEffect(() => {
    if (texts[activeText] && start) {
      const typed = new Typed(el.current, {
        smartBackspace: true,
        strings: [texts[activeText]],
        fadeOut: true,
        typeSpeed: textSpeed,
        showCursor: false,
        cursorChar: '|',
        onComplete: () => {
          if (activeText === texts.length - 1) {
            setButtonToShow(false);
          } else {
            setButtonToShow(true);
          }
        },
      });
      return () => typed.destroy();
    }
  }, [activeText, textSpeed, start]);

  useEffect(() => {
    var bar = new ProgressBar.Line(loadingEl.current, {
      duration: 8000,
      color: 'white',
    });

    bar.animate(8);
    setTimeout(() => setStart(true), 8000);
  }, []);

  const handleClick = event => {
    if (!hiSaid) {
      const action = { type: HI_AUDIO };
      const audio = getAudio(action);

      playAudio(audio);
      setHiSaid(true);
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = speed => {
    if (isNaN(speed)) {
      setTextSpeed(normlSpeed);
    } else {
      setTextSpeed(normlSpeed / speed);
    }

    const action = { type: SHAME_AUDIO, payload: speed };
    const audio = getAudio(action);
    playAudio(audio, speed);

    setAnchorEl(null);
  };

  const menuValues = [
    { display: '2X', value: 2 },
    { display: '4X', value: 4 },
    { display: '6X', value: 6 },
    { display: '10X', value: 10 },
    { display: 'RESET', value: 1 },
  ];

  return (
    <div className='screen'>
      <div ref={loadingEl}></div>
      <div className='App'>{<span ref={el} />}</div>
      <div>
        <ArrowRightAlt style={{ fontSize: 100 }} className={`arrow ${showButton ? 'arrowShow' : 'arrow'}`} onClick={nextText} />
      </div>
      <div>
        {showButton && activeText > 0 && <ArrowRightRounded style={{ fontSize: 80 }} className={classes.button} onClick={handleClick} color='red' />}
        <Menu classNmae={classes.menu} id='simple-menu' anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
          {menuValues.map(({ display, value }) => {
            return <MenuItem onClick={() => handleClose(value)}>{display}</MenuItem>;
          })}
        </Menu>
      </div>
      {activeText === texts.length - 1 && <div id='heart'></div>}
    </div>
  );
}

export default App;
