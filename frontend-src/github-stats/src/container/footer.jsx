import './footer.css';

const Footer = () => {
    const githubURL = 'https://github.com'
    return (
        <footer className="footer">
            <p>
            Created with 💖 by <a href='/'>@Yaninthé</a>,{" "}
                <a href='/'>@esmond-adjei</a>,{" "}
                <a href='/'>@GHMensah</a>
            </p>
            <span className="text-muted">© 2023 GitHub Stats</span>
        </footer>
    );
}

export default Footer;