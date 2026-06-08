import React, { useState } from 'react';
import axios from 'axios';
import '../styles/style.css'; // Assuming you have your styles here

const CreateAppointment = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const response = await axios.post('http://localhost:5001/create-appointment', {
        name,
        email,
        appointmentDate,  // Send the combined datetime
        message,
      });

      // Reset form fields
      setName('');
      setEmail('');
      setAppointmentDate('');
      setMessage('');

      // Show confirmation message
      setConfirmation(response.data.message);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setConfirmation('Error creating appointment. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after the submission is complete
    }
  };

  return (
    <div className="container">
      <h2>Create an Appointment</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="app-fields"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="app-fields"
          />
        </div>

        <div>
          <label htmlFor="appointmentDate">Date and Time</label>
          <input
            type="datetime-local"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            className="app-fields"
          />
        </div>

        <div>
          <label htmlFor="message">Message (Optional)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="app-fields"
          />
        </div>

        <button type="submit">Create Appointment</button>
      </form>

      {/* Show loader when submitting */}
      {loading && <div className="clip-loader"></div>}

      {/* Display confirmation message */}
      {confirmation && <p>{confirmation}</p>}
    </div>
  );
};

export default CreateAppointment;
