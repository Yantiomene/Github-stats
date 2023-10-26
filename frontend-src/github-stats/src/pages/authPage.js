import React from 'react';
import './authPage.css';

import Histograph from '../components/histograph';
import AuthCard from '../components/authCard';


const AuthPage = () => {
    return (
        <div id='login-page'>
            <div className='left-half'>
                <Histograph />
            </div>
            <div className='right-half'>
                <AuthCard />
            </div>
        </div>
    )
}

export default AuthPage;