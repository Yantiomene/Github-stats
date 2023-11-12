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

function parseContributionData(contribData) {
    const contributionDays = contribData.contributionsCollection.contributionCalendar.weeks
        .flatMap(week => week.contributionDays);
        
        let totalCommits = 0;
        const formattedData = contributionDays.map(day => {
            const parseDate = d3.utcParse("%Y-%m-%d");
            totalCommits += +day.contributionCount;
            return {
                date: parseDate(day.date),
                commits: totalCommits
            };
        });

    return formattedData;
}
