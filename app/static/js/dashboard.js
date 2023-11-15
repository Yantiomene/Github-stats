function fetchContribRangeData(range) {
    // set range
    const contributionsFrom = daysAgo(range);
    console.log('from', contributionsFrom);
    const contributionsTo = new Date().toISOString();
    // update query
    const contribCalendarQuery = `{
        user(login: "${username}") {
          contributionsCollection(from: "${contributionsFrom}", to: "${contributionsTo}") {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoriesWithContributedCommits
            contributionYears
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  weekday
                  date
                  contributionCount
                  color
                }
              }
            }
          }
        }
      }`
    // fetch and render
    GQLFetch(contribCalendarQuery)
    .then(QLResponse => {
        if (QLResponse) {
            QLResponse = parseContributionData(QLResponse);
            drawTrendLine(QLResponse);
        } else {
            console.log('Failed to get calendar data');
        }
    });
}

function fetchContribYTD(){
    // query
    const contribCalendarQuery = `{
        user(login: "${username}") {
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoriesWithContributedCommits
            contributionYears
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  weekday
                  date
                  contributionCount
                  color
                }
              }
            }
          }
        }
      }`
    
    // fetch and update
    return GQLFetch(contribCalendarQuery)
    .then(QLResponse => {
        if (QLResponse) {
            const total_commit =  QLResponse.contributionsCollection.totalCommitContributions;
            renderSummary('#total-commits', total_commit, ' commits');
            QLResponse = parseContributionData(QLResponse);
            drawTrendLine(QLResponse);
            return total_commit;
        } else {
            console.log('Failed to get calendar data');
        }
    });
}

function fetchRepoTable(){
    // query
    const repoTableQuery = `{
        user(login: "${username}") {
        repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
            name
            description
            createdAt
            updatedAt
            diskUsage
            forkCount
            stargazerCount
            isFork
            url
            primaryLanguage {
                name
            }
            languages(first: 4, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                size
                node {
                    name
                }
                }
            }
            defaultBranchRef {
                target {
                ... on Commit {
                    history {
                    totalCount
                    }
                }
                }
            }
            }
        }
        }
    }`
    
    // fetch and render
    return GQLFetch(repoTableQuery)
    .then(QLResponse => {
        if (QLResponse) {
            const repo_count = QLResponse.repositories.nodes.length
            renderSummary('#total-repos', repo_count, ' repos');
            QLrenderRepositories(QLResponse.repositories.nodes);
            return repo_count
        } else {
            console.log('Failed to get repository information.');
        }
    });

}

function fetchLanguages(){
    const languagesQuery = `{
        user(login: "${username}") {
          repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }`

    GQLFetch(languagesQuery)
    .then(QLResponse => {
        if (QLResponse) {
            QLResponse = groupAndSumLanguages(QLResponse.repositories.nodes);
            drawBarChart(QLResponse);
        } else {
            console.log('Failed to get languages.')
        }
    })
}


function saveSearch(snapshotData) {
    $.ajax({
        type: 'POST',
        url: '/save_search',
        data: JSON.stringify(snapshotData),
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': $('#csrf_token').val(),
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}

// --------------------------------------------------
$(document).ready(function () {
    // show loading messages  
    showLoadingMessage($('#user-info'), ('Loading user info...'));
    showLoadingMessage($('#repositories'), ('Loading repositories'));
    showLoadingMessage($('#events'), ('Loading events..'));

    const snapshotData = {
      username: '',
      avatar_url: '',
      commits_count: 0,
      repos_count: 0
    }

    // RESTFUL: Fetches user data, repositories, and events concurrently
    $.when(
        fetchData(`https://api.github.com/users/${username}`),
        fetchData(`https://api.github.com/users/${username}/events`),
        fetchLanguages(),
    ).done(function (userData, eventsData) {
        renderUserInfo(userData[0]);
        renderSummary('#years-active', timeDeltaYMD(userData[0].created_at), 'yrs/mths/days');
        renderEvents(eventsData[0]);

        snapshotData.username = userData[0].login;
        snapshotData.avatar_url = userData[0].avatar_url;

    }).fail(function (error) {
        $('#dashboard-page').html(`
        <div class="hcc">
            <p>Something went wrong. Please try again later.</p>
        </div>`)
        console.log('Error:', error);
    });

            
    // GRAPHQL: Fetches repository, contributions, and languages data concurrently
    $.when(
      fetchContribYTD().then(count => { snapshotData.commits_count = count }),
      fetchRepoTable().then(count => { snapshotData.repos_count = count }),
    ).done(() => {
      // save search
      console.log(snapshotData);
      saveSearch(snapshotData);
    }).fail((error) => {
        console.log('Error:', error);
    });


    // fetch contrib range on button click
    $('.button-fetch').click(function () {
        const range = $(this).data('range');
        fetchContribRangeData(range);
        $('.button-fetch').removeClass('current');
        $(this).addClass('current');
    });
});
