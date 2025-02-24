import { faArrowLeft, faHouse, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import logo from '../assets/image/SCAR.jpg';
import vf9 from '../assets/image/VF9.mp4';
import '../assets/style/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [dataToken, setDataToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/login", { username, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setDataToken(response.data);
        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className='login'>
      <video className='login-video' src={vf9} autoPlay muted loop />
      <div className='login-wrapper'>
        <div className='login-nav'>
          <Link className='nav-icon' to="/previous-page">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <img className='login-logo' src={logo} alt='SCAR' />
          <Link to="/">
            <FontAwesomeIcon className='nav-icon' icon={faHouse} />
          </Link>
        </div>
        <h2 className='login-title'>Đăng nhập</h2>
        <form className='login-input' onSubmit={handleSubmit}>
          <div className='account user-name'>
            <label className='account-label user-name-label'>Tên đăng nhập</label>
            <div className='user-input-icon'>
              <FontAwesomeIcon icon={faUser} className='account-icon' />
              <input
                className='account-input user-name-input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className='account password'>
            <label className='account-label password-label'>Mật khẩu</label>
            <div className='password-input-icon'>
              <FontAwesomeIcon icon={faLock} className='account-icon' />
              <input
                className='account-input password-input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className='account account-button'>
            <button className='account-button-submit' type="submit">Đăng nhập</button>
          </div>
          <Link className='forgot-password' to='/Forgot'>Quên mật khẩu</Link>
        </form>
        <hr className='login-line' />
        <div className='register-title'>Chưa có tài khoản? <Link className='register-link' to='/Register'>Đăng ký ngay</Link></div>
      </div>
    </div>
  );
};

export default Login;
