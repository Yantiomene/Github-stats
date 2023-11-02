import './searchPage.css';

import Nav from '../components/nav';
import Search from '../components/search';
import SnapshotCard from '../components/snapshotCard';

const SearchPage = () => {

    return (
        <>
        <Nav />
        <div id="search-page">
            <div className='welcome'>
                <h1>Welcome User 👋</h1>
                <p>enjoy digging into the analytics of your github user of interest</p>
            </div>

            <Search />
        
            <div className='recent-searches'>
                <h1>Recent Searches</h1>
                <div className='snapshot__container'>
                    <SnapshotCard />
                    <SnapshotCard />
                    <SnapshotCard />
                    <SnapshotCard />
                </div>
            </div>

        </div>
        </>
    );
}

export default SearchPage;
