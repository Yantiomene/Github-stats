import './authPage.css';

import Histograph from '../components/histograph';
import AuthCard from '../components/authCard';
import Footer from '../container/footer';


const AuthPage = () => {
    return (
        <>
        <div id='login-page'>
            <div className='left-half'>
                <Histograph />
            </div>
            <div className='right-half'>
                <AuthCard />
            </div>
        </div>
        <Footer />
        </>
    )
}

export default AuthPage;