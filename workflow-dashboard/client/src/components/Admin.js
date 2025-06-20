import React, { useState } from 'react';
import Task from './Task';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Grid, Paper, Slider } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Admin = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design UI',
      description: 'Design the user interface for the dashboard',
      dueDate: '2024-01-31',
      assignedTo: 'John Doe',
      status: 'In Progress',
      subtasks: [],
      progress: 50,
      estimatedTime: 40,
    },
    {
      id: 2,
      title: 'Develop API',
      description: 'Develop the backend API for task management',
      dueDate: '2024-02-15',
      assignedTo: 'Jane Smith',
      status: 'Not Started',
      subtasks: [],
      progress: 0,
      estimatedTime: 80,
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    status: 'Not Started',
    progress: 0,
    estimatedTime: 0,
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [newSubtask, setNewSubtask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    status: 'Not Started',
    progress: 0,
    estimatedTime: 0,
  });

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubtaskChange = (e) => {
    setNewSubtask({ ...newSubtask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks([...tasks, { ...newTask, id: tasks.length + 1, subtasks: [] }]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      assignedTo: '',
      status: 'Not Started',
      progress: 0,
      estimatedTime: 0,
    });
  };

  const handleSubtaskSubmit = (e) => {
    e.preventDefault();
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id
          ? { ...task, subtasks: [...task.subtasks, { ...newSubtask, id: task.subtasks.length + 1 }] }
          : task
      );
      setTasks(updatedTasks);
      setNewSubtask({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: '',
        status: 'Not Started',
        progress: 0,
        estimatedTime: 0,
      });
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleProgressChange = (e, newValue) => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, progress: newValue } : task
      );
      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, progress: newValue });
    }
  };

  const handleEstimatedTimeChange = (e) => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, estimatedTime: e.target.value } : task
      );
      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, estimatedTime: e.target.value });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2">
          Admin Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" component="h3">
            Task Allocation
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Title"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Description"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Assigned To"
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={newTask.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Add Task
            </Button>
          </form>
        </StyledPaper>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" component="h3">
          Task List
        </Typography>
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Task task={task} onClick={() => handleTaskClick(task)}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {selectedTask && (
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6">Selected Task: {selectedTask.title}</Typography>
            <Typography variant="h5" component="h3">
              Subtask Allocation
            </Typography>
            <form onSubmit={handleSubtaskSubmit}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Title"
                  name="title"
                  value={newSubtask.title}
                  onChange={handleSubtaskChange}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Description"
                  name="description"
                  value={newSubtask.description}
                  onChange={handleSubtaskChange}
                  multiline
                  rows={4}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={newSubtask.dueDate}
                  onChange={handleSubtaskChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Assigned To"
                  name="assignedTo"
                  value={newSubtask.assignedTo}
                  onChange={handleSubtaskChange}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={newSubtask.status}
                  onChange={handleSubtaskChange}
                  required
                >
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" type="submit">
                Add Subtask
              </Button>
            </form>
            <Typography variant="h6">Progress</Typography>
            <Slider
              value={selectedTask.progress || 0}
              onChange={handleProgressChange}
              aria-labelledby="continuous-slider"
            />
            <Typography variant="h6">Estimated Time (hours)</Typography>
            <TextField
              type="number"
              value={selectedTask.estimatedTime || 0}
              onChange={handleEstimatedTimeChange}
            />
          </StyledPaper>
        </Grid>
      )}
    </Grid>
  );
};

export default Admin;