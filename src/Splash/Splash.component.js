import React from 'react';
import { useSelector } from 'react-redux';

/*
  Credit: https://github.com/bkniffler/electron-splashscreen
*/
export default () => {
  const { loadingText } = useSelector(state => state.splash);
  return (
    <div className="box">
      <span className="logo">
        <img className="logo-img" src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Microsoft_Office_2013_logo.svg" alt="[Logo]" />
        <h6 className="logo-text">Brand</h6>
      </span>
      <h1 className="text">MyApp</h1>
      <div className="dot dot1" />
      <div className="dot dot2" />
      <div className="dot dot3" />
      <div className="dot dot4" />
      <div className="dot dot5" />
      <h4 className="text starting-txt">{loadingText || 'Loading...'}</h4>
      <h4 className="text author-txt">http://www.example.com</h4>
    </div>
  );
};
