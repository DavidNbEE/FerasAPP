import React, { useState, useEffect } from 'react';
import '../components/activity.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Activity = () => {
  const [userData, setUserData] = useState({ id: '', name: '', jobPosition: '', employeeId: '' });
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [expire, setExpire] = useState('');
  const [userId, setUserId] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Tambahkan state untuk error
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:8000/token');
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUserData({
        id: decoded.userId,
        name: decoded.name,
        jobPosition: decoded.jobPosition,
        employeeId: decoded.employeeId,
      });
      setUserId(decoded.userId);
      setName(decoded.name);
      setJobPosition(decoded.jobPosition);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/');
      }
    }
  };

  const axiosJwt = axios.create();

  axiosJwt.interceptors.response.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get('http://localhost:8000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setName(decoded.name);
        setJobPosition(decoded.jobPosition);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetchUserActivities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/getactivity', {
        params: { userId: userData.id },
      });
      setUserActivities(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching activities');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivities();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  border-radius: 5px;
  overflow: hidden;
  background: #fafafa;
`;

const StyledTh = styled.th`
  background-color: #4CAF50;
  color: white;
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: left;
`;

const StyledTd = styled.td`
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: left;
`;

const StyledTr = styled.tr`
  background-color: ${props => props.index % 2 === 0 ? '#ffffff' : '#f9f9f9'};
  transition: all 0.25s ease-in-out;
  &:hover {
    background-color: #f5f5f5;
  }
`;

return (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <h1>Dashboard Aktivitas Pengguna</h1>
    <StyledTable>
      <thead>
        <tr>
          <StyledTh>No</StyledTh>
          <StyledTh>Tanggal</StyledTh>
          <StyledTh>Hari</StyledTh>
          <StyledTh>Waktu Absen Masuk</StyledTh>
          <StyledTh>Waktu Absen Pulang</StyledTh>
          <StyledTh>Durasi</StyledTh>
          <StyledTh>Lembur</StyledTh>
          <StyledTh>Catatan</StyledTh>
        </tr>
      </thead>
      <tbody>
        {userActivities.map((activity, index) => (
          <StyledTr key={activity.id} index={index}>
            <StyledTd>{index + 1}</StyledTd>
            <StyledTd>{activity.date}</StyledTd>
            <StyledTd>{activity.day}</StyledTd>
            <StyledTd>{activity.checkinTime}</StyledTd>
            <StyledTd>{activity.checkOutTime}</StyledTd>
            <StyledTd>{activity.duration}</StyledTd>
            <StyledTd>{activity.OverWork}</StyledTd>
            <StyledTd>{activity.userNote}</StyledTd>
          </StyledTr>
        ))}
      </tbody>
    </StyledTable>
  </div>
);
};

export default Activity;
