import React from 'react';
import PublicationForm from '../components/PublicationForm';
import { Objeto } from '../types';

const CreatePublicationPage: React.FC = () => {
  const handleSubmit = (objeto: Omit<Objeto, 'id'>) => {
    // For now, just log the data - in a real app this would send to backend
    console.log('Nueva publicación:', objeto);
    alert('Publicación creada exitosamente!');
  };

  const handleCancel = () => {
    // In a real app, this might navigate back to the main page
    console.log('Cancelado');
  };

  return (
    <div>
      <PublicationForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreatePublicationPage;