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

            // QLResponse = groupAndSumLanguages(QLResponse.repositories.nodes);
            // drawBarChart(QLResponse);
        } else {
            console.log('Failed to get repository information.');
        }
    });


GQLFetch(contribCalendarQuery)
    .then(QLResponse => {
        if (QLResponse) {
            $('#total-commits').html(QLResponse.contributionsCollection.totalCommitContributions + ' commits');

            QLResponse = parseContributionData(QLResponse);
            drawTrendLine(QLResponse);
        } else {
            console.log('Failed to get calendar data');
        }
    });

GQLFetch(languagesQuery)
    .then(QLResponse => {
        if (QLResponse) {
            QLResponse = groupAndSumLanguages(QLResponse.repositories.nodes);
            drawBarChart(QLResponse);
            console.log(QLResponse);
        } else {
            console.log('Failed to get languages.')
        }
    })