import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup } from 'react-bootstrap';
import { FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import './App.css';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async () => {
    if (task.trim()) {
      const newTask = { description: task, status: false };
      await axios.post('http://localhost:5000/tasks', newTask);
      setTask('');
      fetchTasks();
    }
  };

  const toggleStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, { status: !status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center">To-Do List</Card.Title>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter a task..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={addTask} block>
                Add Task
              </Button>
            </Card.Body>
          </Card>
          <ListGroup className="mt-3">
            {loading ? (
              <h5>Loading tasks...</h5>
            ) : (
              tasks.map((task) => (
                <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Button
                      variant="link"
                      onClick={() => toggleStatus(task.id, task.status)}
                      style={{ padding: 0 }}
                    >
                      <FaCheckCircle
                        color={task.status ? 'green' : 'gray'}
                        size={20}
                        style={{ cursor: 'pointer' }}
                      />
                    </Button>
                    <span
                      style={{
                        textDecoration: task.status ? 'line-through' : 'none',
                        marginLeft: '10px',
                      }}
                    >
                      {task.description}
                    </span>
                  </div>
                  <Button variant="danger" onClick={() => deleteTask(task.id)}>
                    <FaTrashAlt />
                  </Button>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
