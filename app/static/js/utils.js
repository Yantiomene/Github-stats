// API CALLS
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
// -------------------

// PARSERS & FORMATTERS 
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
    const sortedLanguageArray = languageArray.sort((a, b) => b[1] - a[1]).slice(0, 8);
    return Object.fromEntries(sortedLanguageArray);
}
// -------------------


// TIME UTILITIES
function convertDate(str) {
    const date = new Date(str);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(dateTime) {
    const time = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return time;
}

function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let i = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      i++;
    }  
    return `${bytes.toFixed(2)} ${units[i]}`;
}

function timeDeltaYMD(start_date, end_date) {
    // Function to calculate the years active
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : new Date();
  
    const years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
  
    // Adjust months if days are negative
    if (days < 0) {
      days += new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
      months -= 1;
    }
  
    return `${years}/${months}/${days}`;
}

function timeDeltaHM(start_date, end_date) {
    // Function to calculate the time difference in days, hours, and minutes
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : new Date();
    
    const timeDiff = endDate - startDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + (days * 24);
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} hrs, ${minutes} min`;
}

function daysAgo(n) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - n);
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
    var day = String(currentDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}T00:00:00Z`;
}
// -------------------


// BEHAVIORAL UTILITIES
function createTooltip(containerSelector) {
    const tooltip = $('<div class="tooltip"></div>');
    $(containerSelector).append(tooltip);
    
    function handleMouseOver(event, content) {
        tooltip.css({
            display: 'block',
            opacity: 1,
            left: event.pageX + 'px',
            top: (event.pageY - 28) + 'px'
        }).html(content);
    }

    function handleMouseOut() {
        tooltip.css('opacity', 0);
    }
    return {
        show: handleMouseOver,
        hide: handleMouseOut
    };
}

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
// -------------------


$(document).ready(function () {
    const username = $('#dashboard-page').data('username'); 

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
