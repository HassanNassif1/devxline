import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Clients from '../components/clients/Clients';
import ClientForm from '../components/clients/ClientForm';
import ClientDetails from '../components/clients/ClientDetails';
import Loader from '../components/common/Loader';
import { clientsApi } from '../api/clientsApi';

const ClientsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if we're on the new client page
    if (location.pathname === '/clients/new') {
      setIsEditing(true);
      return;
    }

    // Check if we're on the edit page
    const searchParams = new URLSearchParams(location.search);
    if (id && searchParams.get('edit') === 'true') {
      setIsEditing(true);
      fetchClient(id);
      return;
    }

    // Check if we're on the view page
    if (id && id !== 'new') {
      fetchClient(id);
    }
  }, [id, location]);

  const fetchClient = async (clientId) => {
    try {
      setLoading(true);
      const response = await clientsApi.getClient(clientId);
      setClient(response.data.data);
    } catch (error) {
      console.error('Error fetching client:', error);
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate('/clients');
  };

  // Show loading state
  if (loading) {
    return <Loader />;
  }

  // Show Add form
  if (location.pathname === '/clients/new') {
    return <ClientForm onSuccess={handleSuccess} />;
  }

  // Show Edit form
  if (id && isEditing && client) {
    return <ClientForm client={client} onSuccess={handleSuccess} />;
  }

  // Show client details view
  if (id && client && !isEditing) {
    return (
      <ClientDetails 
        client={client} 
        onEdit={() => {
          navigate(`/clients/${id}?edit=true`);
        }}
        onSuccess={handleSuccess}
      />
    );
  }

  // Show the client list
  return <Clients />;
};

export default ClientsPage;