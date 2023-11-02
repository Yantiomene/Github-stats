import { Link } from 'react-router-dom';
import './landingPage.css';

import Header from '../container/header';
import Footer from '../container/footer';

const LandingPage = () => {
    return (
        <>
        <Header />
        <div id="landing-page">
            <h1>go to search</h1>
            <span>&#x2190;</span>
            <Link to="/search">Search</Link>
        </div>
        <Footer />
        </>
    );
}

export default LandingPage;