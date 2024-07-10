import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [userData, setUserData] = useState({ id: '', name: '', jobPosition: '', employeeId: '' });
  const [newTask, setNewTask] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [detectedImage, setDetectedImage] = useState(null);
  const [detectedLabel, setDetectedLabel] = useState(null);
  const [error, setError] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkInMessage, setCheckInMessage] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [expire, setExpire] = useState('');
  const [userId, setUserId] = useState(null);
  const [userNote, setUserNote] = useState('');
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState('');
  const [popUpType, setPopUpType] = useState(''); // Added state to manage pop-up type
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

  const getUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = response.data.userId;
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  }

  function deleteTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      const temp = updatedTasks[index];
      updatedTasks[index] = updatedTasks[index - 1];
      updatedTasks[index - 1] = temp;
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      const temp = updatedTasks[index];
      updatedTasks[index] = updatedTasks[index + 1];
      updatedTasks[index + 1] = temp;
      setTasks(updatedTasks);
    }
  }

  function toggleTaskCompletion(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  }

  const [currentDate, setCurrentDate] = useState(new Date());
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    const storedDate = localStorage.getItem('lastDate');
    const lastDate = storedDate ? new Date(storedDate) : null;
    const now = new Date();

    if (!lastDate || lastDate.getDate() !== now.getDate()) {
      localStorage.removeItem('tasks');
      localStorage.setItem('lastDate', now.toString());
    }
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(sendFrameToAPI, 3000);
    return () => clearInterval(timer);
  }, [showCamera, isPasswordCorrect, isCheckOut]);

  useEffect(() => {
    let stream = null;
    if (showCamera && isPasswordCorrect) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((streamResult) => {
          const videoElement = document.getElementById('camera');
          if (videoElement) {
            videoElement.srcObject = streamResult;
          }
          stream = streamResult;
          setCameraStream(streamResult);
        })
        .catch((error) => {
          console.error('Error accessing camera: ', error);
          alert('Gagal mengakses kamera.');
          setShowCamera(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera, isPasswordCorrect]);

  function handleAbsenClick() {
    const expectedPassword = '1234';
    const enteredPassword = prompt('Masukkan kata sandi:');
    if (enteredPassword === expectedPassword) {
      setIsPasswordCorrect(true);
      setShowCamera(true);
      setIsCheckOut(false);
    } else {
      alert('Kata sandi salah. Akses ditolak.');
    }
  }

  function handleAbsenKeluarClick() {
    const expectedPassword = '1234';
    const enteredPassword = prompt('Masukkan kata sandi:');
    if (enteredPassword === expectedPassword) {
      setShowNoteInput(true);
    } else {
      alert('Kata sandi salah. Akses ditolak.');
    }
  }

  const handleNoteSubmit = () => {
    setIsPasswordCorrect(true);
    setIsCheckOut(true);
    setShowCamera(true);
    setShowNoteInput(false);
  };

  async function sendFrameToAPI() {
    const videoElement = document.getElementById('camera');
    if (videoElement && cameraStream && isPasswordCorrect) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append('image', blob, 'frame.jpg');
            axios
              .post('http://127.0.0.1:5000/detect_face', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then((response) => {
                if (response.data && response.data.label) {
                  setDetectedLabel(response.data.label);
                  if (isCheckOut) {
                    saveCheckOutTime(response.data.label, userNote);
                  } else {
                    saveCheckInTime(response.data.label);
                  }
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          } else {
            console.error('Error: Empty blob');
          }
        },
        'image/jpeg'
      );
    } else {
      console.log('Error: Camera not available or password incorrect');
    }
  }

  const saveCheckInTime = (detectedLabel) => {
    axios
      .post('http://localhost:8000/checkin', { detectedLabel: detectedLabel, userId: userData.id })
      .then((response) => {
        console.log(response.data);
        setCheckInMessage(response.data.message);
        if (response.status === 201) {
          setShowCamera(false);
          setPopUpType('success');
          setPopUpMessage('Check-in berhasil!');
          setShowPopUp(true); // Menampilkan pop-up
        }
      })
      .catch((error) => {
        console.error('Error during check-in:', error);
        if (error.response && error.response.status === 400) {
          setShowCamera(false);
          setPopUpType('error');
          setPopUpMessage('Gagal mendeteksi wajah, coba lagi.');
          setShowPopUp(true); // Menampilkan pop-up
        }
      });
  };
  
  const saveCheckOutTime = (detectedLabel, note) => {
    axios
      .post('http://localhost:8000/checkout', { detectedLabel: detectedLabel, userId: userData.id, userNote: note })
      .then((response) => {
        console.log(response.data);
        setCheckInMessage(response.data.message);
        if (response.status === 201) {
          setShowCamera(false);
          setPopUpType('success');
          setPopUpMessage('Check-out berhasil!');
          setShowPopUp(true); // Menampilkan pop-up
        }
      })
      .catch((error) => {
        console.error('Error during check-out:', error);
        if (error.response && error.response.status === 400) {
          setShowCamera(false);
          setPopUpType('error');
          setPopUpMessage('Gagal mendeteksi wajah, coba lagi.');
          setShowPopUp(true); // Menampilkan pop-up
        }
      });
  };
  

  useEffect(() => {
    if (userId) {
      fetchCheckInTime(userId);
    }
  }, [userId]);

  const fetchCheckInTime = async (userId) => {
    try {
      const response = await axios.post('http://localhost:8000/getCheckInTime', {
        userId: userData.id,
      });

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      setCheckInTime(response.data.message);
    } catch (error) {
      console.error('Error fetching check-in time:', error);
    }
  };

  return (
    <div className="wrapper">
      <div className="welcome-dashboard">
        <div className="welcome-sign">
          <img src="https://www.w3schools.com/howto/img_avatar.png" alt="profile" />
          <div className="halo-user">
            <h2>Selamat Datang!</h2>
            <h2>{userData.name}</h2>
            <h4>{userData.jobPosition}</h4>
          </div>
        </div>
        <div className="dashboard-date">
          <h5>{currentDate.toLocaleDateString('id-ID', options)}</h5>
          <h5>status: {checkInTime}</h5>
          <h5>id anda: {userData.employeeId}</h5>
        </div>
      </div>
      <div className="buttons">
        <div className="absent-button">
          <button className="button-in" onClick={handleAbsenClick}>
            Absen Masuk
          </button>
        </div>
        <div className="out-button">
          <button className="button-out" onClick={handleAbsenKeluarClick}>
            Absen Keluar
          </button>
        </div>
      </div>
      {showNoteInput && (
        <>
          <div className="note-overlay" onClick={() => setShowNoteInput(false)}></div>
          <div className="note-input-container">
            <textarea
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Masukkan catatan sebelum absen keluar"
            />
            <button onClick={handleNoteSubmit}>Submit Note</button>
          </div>
        </>
      )}
      {showCamera && isPasswordCorrect && (
        <div className="camera-container">
          <video id="camera" width="100%" autoPlay playsInline muted></video>
          <button className="close-camera" onClick={() => setShowCamera(false)}>
            Close Camera
          </button>
          <p>{checkInMessage}</p>
        </div>
      )}
      {showPopUp && (
        <>
          <div className="pop-up-overlay"></div>
          <div className={`pop-up ${popUpType}`}>
            <div className="pop-up-message">
              <p>{popUpMessage}</p>
              <button className='close-btn' onClick={() => setShowPopUp(false)}>Close</button>
            </div>
          </div>
        </>
      )}
      <div className="to-do-list">
        <div>
          <input
            type="text"
            placeholder="Apa yang akan anda lakukan hari ini?"
            value={newTask}
            onChange={handleInputChange}
          />
          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>
      </div>
      {tasks.map((task, index) => (
        <div key={index} className={`todo-lists ${task.completed ? 'completed' : ''}`}>
          <div className="task-lists">
            <p className="tasks">{task.text}</p>
          </div>
          <div>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={() => moveTaskUp(index)} className="up-button">
              Up
            </button>
            <button onClick={() => moveTaskDown(index)} className="down-button">
              Down
            </button>
            <button onClick={() => toggleTaskCompletion(index)} className="finish-button">
              {task.completed ? 'Unfinish' : 'Finish'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
