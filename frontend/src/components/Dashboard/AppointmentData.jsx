import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

export default function AppointmentData() {
  const [appointments, setAppointments] = React.useState([]);

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  return (
    <React.Fragment>
      <Title>Recent Appointments</Title>
      <Table size="medium" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Mobile Number</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow 
              key={appointment._id} 
              sx={{ '&:hover': { backgroundColor: '#FFF7FC' } }}
            >
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.patientMobileNumber}</TableCell>
              <TableCell>{appointment.patientAge}</TableCell>
              <TableCell>{appointment.patientGender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
