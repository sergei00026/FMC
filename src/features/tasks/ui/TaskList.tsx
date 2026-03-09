'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Alert, Checkbox, IconButton, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useAppSelector } from '@/app/store/hooks';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from '@/shared/api/taskManagerApi';

export const TaskList = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { data: tasks = [], error, isFetching } = useGetTasksQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const errorMessage =
    error && 'data' in error && typeof error.data === 'object' && error.data && 'message' in error.data
      ? String(error.data.message)
      : null;

  const handleCreateTask = async (): Promise<void> => {
    if (!title.trim() || !userId) {
      return;
    }

    try {
      await createTask({ description, title, userId }).unwrap();
      setTitle('');
      setDescription('');
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean): Promise<void> => {
    try {
      await updateTask({ completed: !completed, id: taskId }).unwrap();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      await deleteTask(taskId).unwrap();
      toast.info('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Tasks</Typography>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Input id="task-title" label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input
            id="task-description"
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Button variant="contained" onClick={handleCreateTask} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Add task'}
          </Button>
        </Stack>
      </Paper>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {isFetching ? <Typography>Loading tasks...</Typography> : null}

      <List>
        {tasks.map((task) => {
          return (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton aria-label={`delete-${task.id}`} onClick={() => handleDeleteTask(task.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              }
            >
              <Checkbox checked={task.completed} onChange={() => handleToggleTask(task.id, task.completed)} />
              <ListItemText primary={task.title} secondary={task.description} />
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};
