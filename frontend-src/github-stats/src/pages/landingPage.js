import { Link } from 'react-router-dom';
import './landingPage.css';
import { asset1, asset2, asset3 } from '../assets/assets';

import Header from '../container/header';
import Footer from '../container/footer';

const LandingPage = () => {
    return (
        <>
        <Header />
        <div id="landing-page">
            
            <section>
                <div className='text-section'>
                    <h2>Comprehensive Developer Insights 📊</h2>
                    <p>Dive deep into the heart of developers' GitHub journeys with our Comprehensive Developer Insights feature. Gain a panoramic view of their coding activity, commit patterns, and repository growth over time.</p>
                    <p>Whether you're a hiring manager looking for top talent, a fellow developer seeking collaboration opportunities, or an enthusiast exploring the coding universe, our insights provide a holistic understanding of a developer's expertise and contributions.</p>
                </div>
                <img src={asset1} alt='asset1' className='image'/>
            </section>

            <section>
                <div className='text-section'>
                    <h2>Intelligent Repository Analytics 🚀</h2>
                    <p>Unleash the power of Intelligent Repository Analytics to dissect the anatomy of GitHub repositories. Track performance metrics, identify trending projects, and visualize collaboration dynamics. </p>
                    <p>Our analytics engine goes beyond the surface, offering an intuitive interface for frontend developers, a robust backend perspective for engineers, and a comprehensive full-stack overview for those navigating both realms. Elevate your GitHub experience with unparalleled insights into the heartbeat of your repositories.</p>
                </div>
                <img src={asset2} alt='asset2'className='image'/>
            </section>

            <section>
                <div className='text-section'>
                    <h2>Dynamic Contribution Impact 🌐</h2>
                    <p>Experience collaboration like never before with our Innovative Collaboration Heatmaps. Witness the ebb and flow of teamwork within repositories, identify key contributors, and discover the hotspots of innovation. </p>
                    <p>This feature caters to ethical collaboration, promoting transparency and teamwork while respecting individual contributions. Whether you're a project manager fostering collaboration or a developer eager to explore the synergies within your community, our collaboration heatmaps bring a new dimension to the social coding experience.</p>
                </div>
                <img src={asset3} alt='asset3'className='image'/>
            </section>

            <div className='full-section'>
                <h1>A Video Demo</h1>
                <iframe src="https://drive.google.com/file/d/1s4WJmj1tYx0tX28uoDyaZ6yySENVQUsN/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>
            
            <div id="about" className='full-section'>                
                <div className='text-section'>
                    <h1>About this project</h1>
                    <p>Picture this: late-night coding sessions fueled by caffeine, the rhythmic clatter of keys, and the glow of countless lines of code illuminating the screen. It was within this digital sanctuary that the spark of inspiration ignited.</p>
                    <p>This team came together, worked hard and endured the tyranny of bugs to make this appication a reality</p>
                </div>
                
                <div className='developers'>
                    <div className='developer-card'>
                        <img src='https://avatars.githubusercontent.com/u/49885974?v=4' alt='developer' />
                        <div className='developer-info'>
                            <h2>Yaninthé Tiomene</h2>
                            <a href='https://github.com/Yantiomene' target='_blank'>Yantiomene</a>
                        </div>
                    </div>

                    <div className='developer-card'>
                        <img src='https://avatars.githubusercontent.com/u/81225469?v=4' alt='developer' />
                        <div className='developer-info'>
                            <h2>Esmond Adjei</h2>
                            <a href='https://github.com/esmond-adjei' target='_blank'>esmond-adjei</a>
                        </div>
                    </div>

                    <div className='developer-card'>
                        <img src='https://avatars.githubusercontent.com/u/24933447?v=4' alt='developer' />
                        <div className='developer-info'>
                            <h2>Gregory Slippi-Mensah</h2>
                            <a href='https://github.com/GHMatrix' target='_blank'>GHMatrix</a>
                        </div>
                    </div>
                </div>
        
                <a href='https://github.com/Yantiomene/Github-stats' className='button-cta' target='_blank'>Check out project repo &#8599;</a>

            </div>

        </div>
        <Footer />
        </>
    );
}

export default LandingPage;