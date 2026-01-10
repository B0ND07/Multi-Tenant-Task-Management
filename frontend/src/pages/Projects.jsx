import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${projectId}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-xl text-gray-600">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Projects</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Project Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Description:</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-20"
            />
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
            Create Project
          </button>
        </form>
      )}

      <div>
        {projects.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No projects found. Create your first project!</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-800">{project.name}</h3>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-700 mb-4">{project.description || 'No description'}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;