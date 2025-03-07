import React from 'react';
import First from './components/Front';
 import './style.css';
import Bottom from './components/BottomOne';

export default function Home() {
  return (
  <div className='home'>
    <First/>
    <Bottom/>
  </div>
  );
}
