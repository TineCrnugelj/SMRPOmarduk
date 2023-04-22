import classes from "./LogTimeModal.module.css";
import {Form} from "react-bootstrap";
import React, {useState} from "react";

interface TimeInputsProps {
  date: string,
  spentTimeInit: number,
  remainingTimeInit: number
}
const TimeInputs: React.FC<TimeInputsProps> = ({date, spentTimeInit, remainingTimeInit}) => {
  const [spentTime, setSpentTime] = useState(spentTimeInit);
  const [remainingTime, setRemainingTime] = useState(remainingTimeInit);

  const handleSpentTimeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpentTime(+e.currentTarget.value)
  }
  const handleRemainingChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemainingTime(+e.currentTarget.value)
  }

  return (
    <div className={classes.inputsContainer}>
      <p>{date}</p>
      <Form.Group className={classes.inputGroup} controlId="formBasicworkspent">
        <div style={{display: 'inline-flex'}}>
          <Form.Label>Spent</Form.Label>
          <Form.Control
            name='spentTime'
            type='number'
            value={spentTime}
            onChange={handleSpentTimeChanged}
            min={0}
          />
        </div>
      </Form.Group>
      <Form.Group className={classes.inputGroup} controlId="formBasicremaining">
        <div style={{display: 'inline-flex'}}>
          <Form.Label>Remaining</Form.Label>
          <Form.Control
            className={classes.input}
            type='number'
            name='remainingTime'
            value={remainingTime}
            onChange={handleRemainingChanged}
            min={0}
          />
        </div>
      </Form.Group>
    </div>
  );
}

export default TimeInputs;
