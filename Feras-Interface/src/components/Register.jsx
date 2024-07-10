import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { useState } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client'
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [jobPosition, setJobPosition] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const Register = async(e) =>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/users', {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                jobPosition: jobPosition
            })
            navigate('/')
        } catch (error) {
            setMessage(error.response.data.message)
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 RegisterPage'>
            <div className='p-5 rounded-50 border  registerform' style={{ width: '400px' }}>
                <h2>Register</h2>
                <p>{message}</p>
                <form onSubmit={Register}>
                    <div className='name-input'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            placeholder='your name'
                            autoComplete='off'
                            className='rounded form-control'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='email-input'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            placeholder='dummy@email.com'
                            autoComplete='off'
                            className='rounded form-control'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
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
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            type='password'
                            placeholder='min 6 characters'
                            className='form-control rounded-0'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='Job Position'>Job Position:</label>
                        <input
                            type='Text'
                            placeholder='General Manager'
                            className='form-control rounded-0'
                            value={jobPosition}
                            onChange={(e) => setJobPosition(e.target.value)}
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-3 mt-3'>Submit</button>
                    <div className='register-href'>
                        Already have account?<a href='/'>Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register