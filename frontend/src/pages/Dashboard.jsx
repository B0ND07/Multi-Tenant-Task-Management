import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
        ]);

        const projects = projectsRes.data;
        const tasks = tasksRes.data;
        const completedTasks = tasks.filter(task => task.status === 'done').length;

        setStats({
          projects: projects.length,
          tasks: tasks.length,
          completedTasks,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-xl text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-sm uppercase text-gray-600 mb-2 tracking-wide">Total Projects</h3>
          <div className="text-4xl font-bold text-slate-800">{stats.projects}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-sm uppercase text-gray-600 mb-2 tracking-wide">Total Tasks</h3>
          <div className="text-4xl font-bold text-slate-800">{stats.tasks}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-sm uppercase text-gray-600 mb-2 tracking-wide">Completed Tasks</h3>
          <div className="text-4xl font-bold text-slate-800">{stats.completedTasks}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-sm uppercase text-gray-600 mb-2 tracking-wide">Completion Rate</h3>
          <div className="text-4xl font-bold text-slate-800">
            {stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Quick Actions</h3>
        <div className="flex gap-4">
          <a href="/projects" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors inline-block">Manage Projects</a>
          <a href="/tasks" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors inline-block">Manage Tasks</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;