import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/auth/Login.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import ClientAddPage from './pages/ClientAddPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectAddPage from './pages/ProjectAddPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

// User Management
import UsersPage from './pages/UsersPage.jsx';
import UsersViewPage from './pages/UsersViewPage.jsx';
import UsersEditPage from './pages/UsersEditPage.jsx';
import UsersAddPage from './pages/UsersAddPage.jsx';

// Roles
import RolesPage from './pages/RolesPage.jsx';
import RoleViewPage from './pages/RoleViewPage.jsx';
import RoleEditPage from './pages/RoleEditPage.jsx';
import RoleAddPage from './pages/RoleAddPage.jsx';

// Permissions
import PermissionsPage from './pages/PermissionsPage.jsx';
import PermissionViewPage from './pages/PermissionViewPage.jsx';
import PermissionEditPage from './pages/PermissionEditPage.jsx';
import PermissionAddPage from './pages/PermissionAddPage.jsx';

// Role Permissions
import RolePermissionsPage from './pages/RolePermissionsPage.jsx';
import RolePermissionViewPage from './pages/RolePermissionViewPage.jsx';
import RolePermissionEditPage from './pages/RolePermissionEditPage.jsx';

// Tickets
import TicketsPage from './pages/TicketsPage.jsx';
import TicketsViewPage from './pages/TicketsViewPage.jsx';
import TicketEditPage from './pages/TicketEditPage.jsx';
import TicketsAddPage from './pages/TicketsAddPage.jsx';

// Tasks
import Tasks from './components/Tasks/tasks.jsx';
import TaskAddPage from './pages/TaskAddPage.jsx';
import TaskEditPage from './pages/TaskEditPage.jsx';
import TaskDetailsPage from './pages/TaskDetailsPage.jsx';
import MyTasksPage from './components/Tasks/MyTasks.jsx';
import TodayTasksPage from './components/Tasks/TodayTasksPage.jsx';
import UpcomingTasksPage from './components/Tasks/UpcomingTasksPage.jsx';
import PendingTasksPage from './components/Tasks/PendingTasksPage.jsx';
import CompletedTasksPage from './components/Tasks/CompletedTasksPage.jsx';
import OverdueTasksPage from './components/Tasks/OverdueTasksPage.jsx';

import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import TaskPage from './pages/TaskPage.jsx';
import ProjectEditPage from './pages/ProjectEditPage.jsx';
import ApiDocs from './components/ApiDocs/ApiDocs.jsx';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> 
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard & Main Pages */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Client Routes */}
            <Route path="/clients/new" element={<ClientAddPage />} />
            <Route path="/clients/:id/edit" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            
            {/* Task Management Routes */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/add" element={<TaskAddPage />} />
            <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
            <Route path="/tasks/edit/:taskId" element={<TaskEditPage />} />
            
            {/* Task Filter Routes */}
            <Route path="/tasks/my" element={<MyTasksPage />} />
            <Route path="/tasks/today" element={<TodayTasksPage />} />
            <Route path="/tasks/upcoming" element={<UpcomingTasksPage />} />
            <Route path="/tasks/pending" element={<PendingTasksPage />} />
            <Route path="/tasks/completed" element={<CompletedTasksPage />} />
            <Route path="/tasks/overdue" element={<OverdueTasksPage />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            {/* Project Tasks Routes */}
            <Route path="/projects/:projectId/tasks" element={<Tasks />} />
         
<Route path="/projects/:projectId/tasks" element={<TaskPage />} />
            <Route path="/projects/:projectId/tasks/add" element={<TaskAddPage />} />
            <Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetailsPage />} />
            <Route path="/projects/:projectId/tasks/edit/:taskId" element={<TaskEditPage />} />
            
            {/* Project Routes */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/add" element={<ProjectAddPage />} />
            <Route path="/projects/:projectId" element={<ProjectsPage />} />
          
            <Route path="/projects/edit/:projectId" element={<ProjectEditPage />} />
            
            <Route path="/reports" element={<ReportsPage />} />
            
            {/* User Management Routes */}
            <Route path="/users/add" element={<UsersAddPage />} />
            <Route path="/users/:id/edit" element={<UsersEditPage />} />
            <Route path="/users/:id" element={<UsersViewPage />} />
            <Route path="/users" element={<UsersPage />} />
            
            {/* Role Management Routes */}
            <Route path="/roles/add" element={<RoleAddPage />} />
            <Route path="/roles/:id/edit" element={<RoleEditPage />} />
            <Route path="/roles/:id" element={<RoleViewPage />} />
            <Route path="/roles" element={<RolesPage />} />
            
            {/* Permission Management Routes */}
            <Route path="/permissions/add" element={<PermissionAddPage />} />
            <Route path="/permissions/:id/edit" element={<PermissionEditPage />} />
            <Route path="/permissions/:id" element={<PermissionViewPage />} />
            <Route path="/permissions" element={<PermissionsPage />} />
          
            {/* Role Permissions Mapping Routes */}
            <Route path="/role-permissions/:id/edit" element={<RolePermissionEditPage />} />
            <Route path="/role-permissions/:id" element={<RolePermissionViewPage />} />
            <Route path="/role-permissions" element={<RolePermissionsPage />} />
            
            {/* Ticket Management Routes */}
            <Route path="/tickets/add" element={<TicketsAddPage />} />
            <Route path="/tickets/:id/edit" element={<TicketEditPage />} />
            <Route path="/tickets/:id" element={<TicketsViewPage />} />
            <Route path="/tickets/my" element={<TicketsPage />} />
            <Route path="/tickets/reported" element={<TicketsPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            
            {/* System Management Routes */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/audit-logs" element={<SettingsPage />} />
            <Route path="/backup" element={<SettingsPage />} />
          </Route>
        </Route>
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;