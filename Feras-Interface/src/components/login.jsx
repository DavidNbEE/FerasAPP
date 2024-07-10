import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/login', {
                email: email,
                password: password,
            });
            navigate('/dashboard'); // Mengarahkan ke /dashboard setelah login berhasil
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-5 rounded-50 border  loginform' style={{ width: '400px' }}>
                <h2>Login Page</h2>
                <p>{message}</p>
                <form onSubmit={Auth}>
                    <div className='email-input'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            placeholder='dummy@email.com'
                            autoComplete='off'
                            className='rounded form-control '
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='password-input'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            placeholder='min 6 characters'
                            className='form-control rounded-0'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className='btn btn-success w-100 rounded-0 mb-3 mt-3'>Login</button>
                    </div>
                    <div className='register-href'>
                        Don't have an account? <a href='/register'>Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;