function GQLFetch(graphqlQuery) {

    const accessToken = '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';
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };
    const graphqlURL = 'https://api.github.com/graphql';

    // Make a POST request to the GraphQL API using jQuery
    return $.ajax({
        url: graphqlURL,
        type: 'POST',
        headers: headers,
        data: JSON.stringify({ query: graphqlQuery }),
        dataType: 'json',
    })
    .then(response => {
        if (response.data) {
            return response.data.user;
        } else {
            throw new Error(`Failed to fetch data from GitHub API`);
        }
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
        return null;
    });
}


// --------------------------------------------------
const username = $('#dashboard-page').data('username');

// Calculate the start and end dates for the last year
const endDate = new Date();
const startDate = new Date(endDate);
startDate.setFullYear(endDate.getFullYear() - 1);
const endDateStr = endDate.toISOString();
const startDateStr = startDate.toISOString();

// Define the GraphQL query
const contribQuery = `
{
    user(login: "${username}") {
        contributionsCollection(from: "${startDateStr}", to: "${endDateStr}") {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoriesWithContributedCommits
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
                months {
                    name
                    year
                    firstDay
                    totalWeeks
                }
            }
        }
    }
}
`;

GQLFetch(contribQuery)
    .then(QLResponse => {
        if (QLResponse) {
            console.log(QLResponse);
            $('#total-repos').text(QLResponse.contributionsCollection.totalRepositoriesWithContributedCommits + ' repos');
            $('#total-commits').text(QLResponse.contributionsCollection.totalCommitContributions + ' commits');
        } else {
            console.log('No GitHub user activity information found.');
        }
    });
