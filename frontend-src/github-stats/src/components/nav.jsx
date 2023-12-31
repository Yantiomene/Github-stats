import { Link } from 'react-router-dom';
import { logo } from '../assets/assets';
import './nav.css';

const Nav = () => {
    return (
        <nav className='header'>
        <div className='logo'>
            <Link to='/'>
                <img src={logo} alt='logo' width='80'/>
            </Link>
        </div>
        <ul className='nav-links'>
            <li><Link to='#about'>About</Link></li>
            <li><Link to='/sign-in' className='button-cta cta-stroked'>Login</Link></li>
            <li><Link to='/sign-up' className='button-cta'>Sign up</Link></li>
        </ul>
    </nav>
    )
}

export default Nav;