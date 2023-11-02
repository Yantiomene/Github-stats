import './footer.css';

const Footer = () => {
    const githubURL = 'https://github.com'
    return (
        <footer className="footer">
            <p>
            Created with 💖 by <a href={`${githubURL}/yaninth0`}>@Yaninthé</a>,{" "}
                <a href={`${githubURL}/esmond-adjei`}>@esmond-adjei</a>,{" "}
                <a href={`${githubURL}/GHMensah`}>@GHMensah</a>
            </p>
            <span>© 2023 GitHub Stats</span>
        </footer>
    );
}

export default Footer;