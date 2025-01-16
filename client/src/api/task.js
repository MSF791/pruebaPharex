import axios from "axios";

const task = axios.create({
    baseURL:"http://localhost:8000/tasks",
})

export const SaveTask = (data) => task.post('', data)

export const LoadTaskCreated = (user) => task.get(`${user}`)

export const LoadTaskAssigned = (user) => task.get(`/assigned/${user}`)

export const DeleteTask = (id) => task.delete(`${id}`)

export const LoadTask = (id) => task.get(`/load/${id}`)

export const EditTaskForm = (data) => task.patch('', data)

export const LoadHistoryTask = (id) => task.get(`/history/${id}`)