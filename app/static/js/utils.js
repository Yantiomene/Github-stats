// DASHBOARD UTILITIES
function fetchData(url) {
    let access_token = localStorage.getItem('githubApiKey');
    if (!access_token) {
        access_token = prompt('Enter your GitHub API key:');
        localStorage.setItem('githubApiKey', access_token);
    }
    return $.ajax({
        url: url,
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
}

function GQLFetch(graphqlQuery) {
    let access_token = localStorage.getItem('githubApiKey');
    if (!access_token) {
        access_token = prompt('Enter your GitHub API key:');
        localStorage.setItem('githubApiKey', access_token);
    }
    const headers = {
        'Authorization': `Bearer ${access_token}`,
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

function groupAndSumLanguages(data) {

    const languageCounts = {};
    data.forEach((repository) => {
        repository.languages.edges.forEach((language) => {
            const languageName = language.node.name;
            const size = language.size;
            languageCounts[languageName] = (languageCounts[languageName] || 0) + size;
        });
    });

    
    const languageArray = Object.entries(languageCounts);
    const sortedLanguageArray = languageArray.sort((a, b) => b[1] - a[1]).slice(0, 10);
    return Object.fromEntries(sortedLanguageArray);
}

// BEHAVIORAL UTILITIES
function toggleDialog(triggerSelector, targetSelector) {
    const $trigger = $(triggerSelector);
    const $target = $(targetSelector);

    $trigger.click(function () {
        $target.fadeToggle();
    });

    $target.click(function (event) {
        console.log(event.target, $target)
        if (event.target === this) {
            $target.fadeOut();
        }
    });
}

$(document).ready(function () {
    toggleDialog('.user-icon', '.user-icon-detail');

    toggleDialog('.settings', '#dialogOverlay');
    toggleDialog('.close-btn', '#dialogOverlay');

    // set token
    $('#set-key').click(function (){
        const token = $('#token').val();
        localStorage.setItem('githubApiKey', token );
        $(this).css('background-color', 'green');
        setTimeout(() => {
            $(this).css('background-color', 'var(--primary-color)');
        }, 10000);
    });
});
