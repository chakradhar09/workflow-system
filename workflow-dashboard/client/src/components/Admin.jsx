import React, { useState, useEffect } from 'react';
import Task from './Task.jsx';

import { 
  TextField, Button, Select, MenuItem, FormControl, InputLabel, 
  Typography, Grid, Paper, Slider, CircularProgress, IconButton, 
  Box, List, ListItem, ListItemText 
} from '@mui/material';import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Admin = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    status: 'Not Started',
    progress: 0,
    estimatedTime: 0,
    subtasks: []
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks'); // Fetch tasks from backend
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array means this effect runs once on component mount

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubtaskChange = (e) => {
    setNewSubtask({ ...newSubtask, [e.target.name]: e.target.value });
  };

    const handleSubtaskSubmit = async (e) => {
    e.preventDefault();
    if (selectedTask) {
      try {
        const response = await fetch(`/api/tasks/${selectedTask.id}/subtasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubtask),
        });
        if (!response.ok) {
          const constType = response.headers.get('content-type');
        if (constType && constType.includes('application/json')){
          const errorData = await response.json();
          throw new Error(`Error: ${response.statusText} - ${errorData.message || JSON.Steringlst}`);
        } 
        else{
          const errorText = await response.text();
          throw new Error(`Error: ${response.statusText} - ${errorText}`);
        }
        }
        const updatedTask = await response.json();
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        setSelectedTask(updatedTask);
        setNewSubtask({
          title: '',
          description: '',
          dueDate: '',
          assignedTo: '',
          status: 'Not Started',
          progress: 0,
          estimatedTime: 0,
        });
      } catch (error) {
         console.error('Error creating subtask:', error);
         // Optionally, show an error message to the user
         setError(`Error creating subtask: ${error.message}`); // Display specific error message
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        const constType = response.header.get('content-type');
        if (constType && constType.includes('application/json')){
          const errorData = await response.json();
          throw new Error(`Error: ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`);
        } 
        else{
          const errorText = await response.text();
          throw new Error(`Error: ${response.statusText} - ${errorText}`);
        }
      }
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: '',
        status: 'Not Started',
        progress: 0,
        estimatedTime: 0,
        subtasks: []
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setError(`Error creating task: ${error.message}`); // Display specific error message
    }
  };

   const updateTask = async (taskId, updatedTaskData) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskData),
      });
      if (!response.ok) {
        const constType = response.header.get('content-type');
        if (constType && constType.includes('application/json')){
          const errorData = await response.json();
          throw new Error(`Error: ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`);
        }         
        else{
          const errorText = await response.text();
          throw new Error(`Error: ${response.statusText} - ${errorText}`);
        }
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setSelectedTask(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      setError(`Error updating task: ${error.message}`); // Display specific error message
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const constType = response.header.get('content-type');
        if (constType && constType.includes('application/json')){
          const errorData = await response.json();
          throw new Error(`Error: ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`);
        }         
        else{
          const errorText = await response.text();
          throw new Error(`Error: ${response.statusText} - ${errorText}`);
        }
      }
      setTasks(tasks.filter(task => task.id !== taskId));
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(`Error deleting task: ${error.message}`); // Display specific error message
    }
  };

  const updateSubtask = async (taskId, subtaskId, updatedSubtaskData) => {
    try {
       // Find the task and update the specific subtask within its subtasks list
       const taskToUpdate = tasks.find(task => task.id === taskId);
       if (!taskToUpdate) return; // Should not happen if selectedTask is valid

       const updatedSubtasks = taskToUpdate.subtasks.map(subtask =>
         subtask.id === subtaskId ? { ...subtask, ...updatedSubtaskData } : subtask
       );

       const updatedTaskData = { ...taskToUpdate, subtasks: updatedSubtasks };

      const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSubtaskData),
      });
      if (!response.ok) {
        const constType = response.header.get('content-type');
        if (constType && constType.includes('application/json')){
          const errorData = await response.json();
          throw new Error('Error: ${resoponse.statusText} - ${errorData.message || JSON.stringify(errorData)}')
        }
      }
       // Assuming the backend PUT subtask endpoint returns the updated task
      const updatedTask = await response.json();

      // Update the tasks state with the task containing the updated subtask
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setSelectedTask(updatedTask); // Update selected task state

    } catch (error) {
      console.error('Error updating subtask:', error);
      setError(`Error updating subtask: ${error.message}`); // Display specific error message
    }
  };

   const deleteSubtask = async (taskId, subtaskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const constType = response.header.get('content-type');
        if (constType && constType.includes('application/json')){
          const errorData = await response.json();
          throw new Error('Error: ${resoponse.statusText} - ${errorData.message || JSON.stringify(errorData)}')
        }
        else{
          const errorText = await response.text();
          throw new Error(`Error: ${response.statusText} - ${errorText}`);
        }
      }

      // Remove the deleted subtask from the state
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId) }
          : task
      ));

      // Update selected task state if a subtask within it was deleted
      if (selectedTask && selectedTask.id === taskId) {
         setSelectedTask({ ...selectedTask, subtasks: selectedTask.subtasks.filter(subtask => subtask.id !== subtaskId) });
      }

    } catch (error) {
      console.error('Error deleting subtask:', error);
      setError(`Error deleting subtask: ${error.message}`); // Display specific error message
    }
  };

  const handleSubtaskUpdate = (taskId, subtask) => {
     // This function would be triggered when a subtask is edited
     // For simplicity, we are not creating an edit form for subtasks right now.
     // If you implement editing, you would call updateSubtask from here.
     console.log(`Subtask ${subtask.id} of Task ${taskId} clicked for update/edit`);
  };


  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleProgressChange = (e, newValue) => {
    if (selectedTask) {
      // Optimistically update the UI
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, progress: newValue } : task
      );
      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, progress: newValue });

      // Send PUT request to update the backend
      updateTask(selectedTask.id, { ...selectedTask, progress: newValue });
    }
  };

  const handleEstimatedTimeChange = (e) => {
    const newValue = e.target.value;
    if (selectedTask) {
       // Optimistically update the UI
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, estimatedTime: newValue } : task
      );
      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, estimatedTime: newValue });

      // Send PUT request to update the backend
      updateTask(selectedTask.id, { ...selectedTask, estimatedTime: newValue });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>; // Render error.message
  }

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
             <FormControl fullWidth margin="normal">
              <TextField
                label="Estimated Time (hours)"
                name="estimatedTime"
                type="number"
                value={newTask.estimatedTime}
                onChange={handleChange}
                required
              />
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
            <Grid item xs={12} sm={6} md={4} key={task.id || task._id}> {/* Use task._id if backend uses MongoDB default */}
              <Task task={task} onClick={() => handleTaskClick(task)}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {selectedTask && (
        <Grid item xs={12}>
          <StyledPaper>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography variant="h6">Selected Task: {selectedTask.title}</Typography>
               <IconButton onClick={() => deleteTask(selectedTask.id || selectedTask._id)} aria-label="delete">
                 <DeleteIcon />
               </IconButton>
             </Box>
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
               <FormControl fullWidth margin="normal">
                <TextField
                  label="Estimated Time (hours)"
                  name="estimatedTime"
                  type="number"
                  value={newSubtask.estimatedTime}
                  onChange={handleSubtaskChange}
                  required
                />
              </FormControl>
              <Button variant="contained" color="primary" type="submit">
                Add Subtask
              </Button>
            </form>
            <Typography variant="h6" sx={{ mt: 2 }}>Progress: {selectedTask.progress}%</Typography>
            <Slider
              value={selectedTask.progress || 0}
              onChange={handleProgressChange}
              aria-labelledby="continuous-slider"
               sx={{ mb: 2 }}
            />
            <Typography variant="h6">Estimated Time: {selectedTask.estimatedTime} hours</Typography>
             {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
               <Box sx={{ mt: 2 }}>
                 <Typography variant="h6" component="h4">Subtasks:</Typography>
                 <List>
                   {selectedTask.subtasks.map(subtask => (
                     <ListItem key={subtask.id || subtask._id} secondaryAction={
                       <IconButton edge="end" aria-label="delete" onClick={() => deleteSubtask(selectedTask.id || selectedTask._id, subtask.id || subtask._id)}>
                         <DeleteIcon />
                       </IconButton>
                     }>
                       {/* For simplicity, subtasks are not editable directly here */}
                       <ListItemText
                         primary={subtask.title}
                         secondary={`Status: ${subtask.status} | Progress: ${subtask.progress}% | Estimated: ${subtask.estimatedTime} hours | Assigned: ${subtask.assignedTo}`}
                       />
                     </ListItem>
                   ))}
                 </List>
               </Box>
             )}
          </StyledPaper>
        </Grid>
      )}
    </Grid>
  );
};

export default Admin;