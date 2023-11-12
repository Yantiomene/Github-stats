// ---------------- MAIN ENTRY -----------------
// REQUIRES:
//      - js/utils.js
//      - js/gql_queries.js
//      - js/templates.js
//      - js/chart.js

GQLFetch(repoTableQuery)
    .then(QLResponse => {
        if (QLResponse) {
            $('#total-repos').html(QLResponse.repositories.nodes.length + ' repos');
            QLrenderRepositories(QLResponse.repositories.nodes);
        } else {
            console.log('No GitHub user activity information found.');
        }
    });


GQLFetch(contribCalendarQuery)
    .then(QLResponse => {
        if (QLResponse) {
            $('#total-commits').html(QLResponse.contributionsCollection.totalCommitContributions + ' commits');

            QLResponse = parseContributionData(QLResponse);
            drawTrendLine(QLResponse);
        } else {
            console.log('No GitHub user activity information found.');
        }
    });

