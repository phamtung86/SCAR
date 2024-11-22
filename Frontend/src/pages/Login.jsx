import { faArrowLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/image/SCAR.jpg';
import vf9 from '../assets/image/VF9.mp4';
import scar from '../assets/image/SCAR.mp4';
import '../assets/style/Login.css';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className='login'>
      <video className='login-video' src={vf9} autoPlay muted loop />
      <div className='login-wrapper'>
        <div className='login-nav'>
          <Link className='nav-icon' to="/previous-page">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          {/* <video className='login-logo' src={scar} autoPlay muted loop /> */}
          <img className='login-logo' src={logo} alt='SCAR'/>
          <Link to="/">
            <FontAwesomeIcon className='nav-icon' icon={faHouse} />
          </Link>
        </div>
        <h2 className='login-title'>Đăng nhập</h2>
        <form className='login-input' onSubmit={handleSubmit}>
          <div className='account user-name'>
            <label className='account-label user-name-label'>Tên đăng nhập</label>
            <input 
              className='account-input user-name-input'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='account password'>
            <label className='account-label password-label'>Mật khẩu</label>
            <input 
              className='account-input password-input'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='account account-button'>
            <button className='account-button-submit' type="submit">Đăng nhập</button>
          </div>
          <Link className='forgot-password' to='/Forgot'>Quên mật khẩu</Link>
        </form>
        <hr className='login-line' />
          <div className='register-title'>Chưa có tài khoản? <Link className='register-link' to='/Register'>Đăng ký ngay</Link> </div>
      </div>
    </div>
  );
};

export default Login;
