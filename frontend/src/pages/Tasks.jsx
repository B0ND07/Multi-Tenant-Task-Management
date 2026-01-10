import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to_id: '',
    priority: 'medium',
    due_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
      ]);

      setTasks(tasksRes.data);
      setProjects(projectsRes.data);

      // For now, we'll assume users can be assigned from the same tenant
      // In a real app, you'd fetch users from the API
      setUsers([
        { id: 1, username: 'admin' },
        { id: 2, username: 'testuser' },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        project_id: parseInt(formData.project_id),
        assigned_to_id: formData.assigned_to_id ? parseInt(formData.assigned_to_id) : null,
        due_date: formData.due_date || null,
      };

      await api.post('/tasks', taskData);
      setFormData({
        title: '',
        description: '',
        project_id: '',
        assigned_to_id: '',
        priority: 'medium',
        due_date: '',
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'border-l-4 border-gray-400';
      case 'in_progress': return 'border-l-4 border-blue-500';
      case 'review': return 'border-l-4 border-yellow-500';
      case 'done': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-gray-300 text-gray-800';
      case 'medium': return 'bg-yellow-300 text-gray-800';
      case 'high': return 'bg-orange-400 text-gray-800';
      case 'urgent': return 'bg-red-500 text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-xl text-gray-600">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Tasks</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block mb-2 font-medium text-gray-700">Task Title:</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="project_id" className="block mb-2 font-medium text-gray-700">Project:</label>
              <select
                id="project_id"
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Description:</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="priority" className="block mb-2 font-medium text-gray-700">Priority:</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="assigned_to_id" className="block mb-2 font-medium text-gray-700">Assign To:</label>
              <select
                id="assigned_to_id"
                value={formData.assigned_to_id}
                onChange={(e) => setFormData({ ...formData, assigned_to_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="due_date" className="block mb-2 font-medium text-gray-700">Due Date:</label>
              <input
                type="date"
                id="due_date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
            Create Task
          </button>
        </form>
      )}

      <div>
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No tasks found. Create your first task!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`bg-white p-6 rounded-lg shadow-md mb-4 ${getStatusColor(task.status)}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-800">{task.title}</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{task.description || 'No description'}</p>

              <div className="flex gap-4 text-sm text-gray-600 items-center flex-wrap">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
                {task.assigned_to_id && <span>Assigned to: User {task.assigned_to_id}</span>}
                {task.due_date && (
                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
