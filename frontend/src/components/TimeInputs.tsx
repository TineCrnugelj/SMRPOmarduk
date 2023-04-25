import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";

import classes from "./LogTimeModal.module.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { parseJwt } from "../helpers/helpers";
import { logWork } from "../features/tasks/taskSlice";

interface TimeInputsProps {
  taskId: string,
  index: number,
  onChange: (id: number, timeSpent: number, timeRemaining: number) => void,
  date: string,
  spentTimeInit: number,
  remainingTimeInit: number
}
const TimeInputs: React.FC<TimeInputsProps> = ({taskId, index, onChange, date, spentTimeInit, remainingTimeInit}) => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.users);  
  const [spentTime, setSpentTime] = useState(spentTimeInit);
  const [remainingTime, setRemainingTime] = useState(remainingTimeInit);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (user === null) {
      return;
    }
    const token = JSON.parse(localStorage.getItem("user")!).token;
    const userData = parseJwt(token);
    
    setUserId(userData.sid);
  }, [user]);


  const handleSpentTimeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpentTime(+e.currentTarget.value);
    onChange(index, +e.currentTarget.value, -1);
  }
  const handleRemainingChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemainingTime(+e.currentTarget.value);
    onChange(index, -1, +e.currentTarget.value);
  }

  const submitTimes = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
        taskId: taskId,
        userId: userId,
        date: date,
        spent: spentTime,
        remaining: remainingTime,
        description: "Log"
    }
    
    dispatch(logWork(body));
  }

  return (
      <Form onSubmit={submitTimes}>
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
            <span>hours,&nbsp;</span>
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
            <Button type='submit' style={{height: '2.5rem', marginTop: '.5rem'}}>Save</Button>
        </div>
      </Form>
  );
}

export default TimeInputs;