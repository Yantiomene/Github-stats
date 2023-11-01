import { Link } from 'react-router-dom';
import { logo } from '../assets/assets';
import './nav.css';

const Nav = () => {
    return (
        <nav className='header'>
        <div className='logo'>
            <img src={logo} alt='logo' width='80'/>
        </div>
        <ul className='nav-links'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/'>About</Link></li>
            <li><Link to='/sign-in'>Sign in</Link></li>
            <li><Link to='/sign-up' className='button-cta'>Sign up</Link></li>
        </ul>
    </nav>
    )
}

export default Nav;