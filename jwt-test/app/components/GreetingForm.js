import React, { Component, PropTypes } from 'react';
import { reduxForm, initialize } from 'redux-form';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap';

class GreetingForm extends Component {

  componentWillMount() {
    this.props.dispatch(initialize('greeting', {
      greeting: ''
    }, ['greeting']));
  }

  render() {
    const {fields: {greeting}, handleSubmit, postAgain, error, submitted} = this.props;

    return (
      <div>
        {!submitted &&
        <Form onSubmit={handleSubmit}>
          <FormGroup controlId='greeting'>
            <ControlLabel style={labelStyle}>Greeting</ControlLabel>
            {' '}
            <FormControl
              componentClass='textarea'
              placeholder='Type your greeting here ...'
              {...greeting}/>
          </FormGroup>
          {' '}
          <Button onClick={handleSubmit} type='submit' style={buttonStyle}>
            Add greeting
          </Button>
          {
            error && <h3>{error}</h3>
          }
        </Form>
        ||
        <Button onClick={postAgain}>Want submit again?</Button>
       }
     </div>
    );
  }
}

const labelStyle = {
  color: '#BBBBBB'
};

const buttonStyle = {
  height: '30px',
  lineHeight: '1em'
};

GreetingForm.PropTypes = {
  handleSubmit: PropTypes.func.isRequired
};

// decorator
export default GreetingForm = reduxForm({
  form: 'greeting',                           // a unique name for this form
  fields: ['greeting']                        // all the fields in your form
})(GreetingForm);
