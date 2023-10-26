import React from 'react';
import './authCard.css';

const AuthCard = () => {
    return (
        <div className='auth-card'>
            <h2>Sign up</h2>

            <form action='/'>
                <input type='text' placeholder='username' />
                <input type='text' placeholder='email' />
                <input type='password' placeholder='password' />
                <input type='password' placeholder='confirm password' />

                <input type='submit' />
            </form>

            <hr />
            <h3 className='or'>Or</h3>

        </div>
    )
}

export default AuthCard;