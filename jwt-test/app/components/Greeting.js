import React from 'react';
import {
  Panel
} from 'react-bootstrap';

import CustomButton from './CustomButton';

const Greeting = (props) => {
  console.log('props', props.getGreeting);
  return (
    <div>
      <Panel>
        <strong>Click</strong> the <strong>button </strong> down
        and get yout <strong>greeting for today</strong>!
      </Panel>
      <CustomButton onClick={props.getGreeting}>Get greeting</CustomButton>
    </div>
  );
};


export default Greeting;