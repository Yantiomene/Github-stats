import "./snapshotCard.css";

const SnapshotCard = () => {
  const search = {
    avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    gh_username: "mojombo",
    github_url: "https://gihub.com/mojombo",
    commits_count: 1230,
    repos_count: 30,
    top_langueges: ["python", "javascript", "c++"],
  };

  return (
    <div className="snapshot-card">
      <div className="snapshot-card__profile">
        <a href="/view_dashboard?username=mojombo">
          <img
            src={search.avatar_url}
            className="snapshot-card__img-top"
            alt={`${search.gh_username} Dashboard`}
            width="100px"
          />
          <h3 className="snapshot-card__title">{search.gh_username}</h3>
        </a>
      </div>

      <div className="snapshot-card__body">
        <p className="snapshot-card__text">
          <span className="big-text">{search.repos_count}</span> total
          repositories
        </p>

        <p className="snapshot-card__text">
          <span className="big-text">{search.commits_count}</span>
          <span>
            total commits <br />
            <span className="small-text">*365 days</span>
          </span>
        </p>

        <ul className="snapshot-card__text">
          {search.top_langueges.map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
      </div>

      <a
        href={`/view_dashboard?username=${search.gh_username}`}
        className="button-cta inv leave-button"
      >
        <span>&#8599;</span>
      </a>
    </div>
  );
};

export default SnapshotCard;
