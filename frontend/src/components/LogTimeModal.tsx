import {Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";

import TimeInputs from "./TimeInputs";

interface LogTimeModalProps {
  showModal: boolean
}

const DUMMY_LOGS = [
  {
    date: new Date().toString(),
    spentTime: 4,
    remainingTime: 3
  },
  {
    date: new Date().toString(),
    spentTime: 5,
    remainingTime: 1
  },
  {
    date: new Date().toString(),
    spentTime: 5,
    remainingTime: 2
  },
  {
    date: new Date().toString(),
    spentTime: 6,
    remainingTime: 5
  }
];

const LogTimeModal: React.FC<LogTimeModalProps> = ({showModal}) => {
  const [show, setShow] = useState(true);

  const closeModal = () => {setShow(false)};

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <Modal show={show} onHide={closeModal} dialogClassName="modal-lg">
      <Modal.Header closeButton>
        <Modal.Title>Log work</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSave}>
          {DUMMY_LOGS.map((log, i) => {
            return <TimeInputs date={log.date} spentTimeInit={log.spentTime} remainingTimeInit={log.remainingTime} />
          })}
          <Button type='submit' variant="primary">Save</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default LogTimeModal;