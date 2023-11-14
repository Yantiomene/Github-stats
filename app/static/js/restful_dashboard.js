
// Function to calculate the years active
function timeDeltaYMD(start_date, end_date) {
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
  
    return `${years} yrs, ${months} mth, ${days} dys`;
}

// Function to calculate the time difference in days, hours, and minutes
function timeDeltaHM(start_date, end_date) {
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : new Date();
    
    const timeDiff = endDate - startDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + (days * 24);
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} hrs, ${minutes} min`;
}


// Function to render user info
function renderUserInfo(user_data) {
    const userInfoElement = $('#user-info');

    if (!user_data){
        userInfoElement.html('No user info found');
        return; 
    }

    // Create and populate user info HTML
    const userHtml = `
        <div class='profile-banner'>
            <img src="${user_data.avatar_url}" alt="Avatar" width=100>
        </div>
        
        <h2>${user_data.name}</h2>
        <small><i>${user_data.login}</i></small><br><br>
        <small>${user_data.bio}</small>
        
        <div class='row'>
            <p>Location: ${user_data.location}</p>
            <p>Company: ${user_data.company}</p>
        </div>

        <div class='row'>
            <p>Website: ${user_data.blog}</p>
            <p>Twitter: ${user_data.twitter_username}</p>
            <p>Email: ${user_data.email}</p>
        </div>
    `;
    userInfoElement.html(userHtml);
    $('#years-active').html(`${timeDeltaYMD(user_data.created_at)}`);
}

// Function to render repositories as a table
function renderRepositories(repos_data) {
    const reposElement = $('#repositories');
    
    if (repos_data.length === 0) {
        reposElement.html('<p style="text-align: center">No repositories found.</p>');
        return;
    }

    const reposTable = `
        <h2>Repositories (${repos_data.length}):</h2>
        <div class='table-view'>
        <table class="searchable sortable">
            <thead>
                <tr>
                    <th scope='row' style='text-align: left'>Name</th>
                    <th scope='row' style='text-align: left'>Description</th>
                    <th scope='row' style='min-width: 100px'>Maintenance duration</th>
                    <th scope='row'>Commits</th>
                    <th scope='row'>Size</th>
                    <th scope='row'>Language</th>
                    <th scope='row'>Forks</th>
                    <th scope='row'>Stars</th>
                </tr>
            </thead>
            <tbody>
                ${repos_data.map(repo => `
                    <tr>
                        <td style='text-align: left'>${repo.name}</td>
                        <td style='text-align: left'>${repo.description}</td>
                        <td>${timeDeltaHM(repo.created_at, repo.updated_at)}</td>
                        <td>${repo.commits_url.length}</td>
                        <td>${repo.size}</td>
                        <td>${repo.language}</td>
                        <td>${repo.forks_count}</td>
                        <td>${repo.stargazers_count}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        </div>
    `;
    reposElement.html(reposTable);
}

// Function to render events
function renderEvents(events_data) {
    const eventsElement = $('#events');
   
    if (events_data.length === 0) {
        eventsElement.html('<p style="text-align: center">No events found.</p>');
        return;
    }

    const eventsHtml = `
        <h2>Events (${events_data.length}):</h2>
        <ul>
            ${events_data.map(event => `<li>${event.type} at ${event.created_at} in ${event.repo.name}</li>`).join('')}
        </ul>
    `;
    eventsElement.html(eventsHtml);
}

function showLoadingMessage(element, message) {
    element.html(`<p>${message}</p>`);
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
    const username = $('#dashboard-page').data('username');
    
    showLoadingMessage($('#user-info'), ('Loading user info...'));
    showLoadingMessage($('#repositories'), ('Loading repositories'));
    showLoadingMessage($('#events'), ('Loading events..'));
 
    // Fetches user data, repositories, and events concurrently
    $.when(
        fetchData(`https://api.github.com/users/${username}`),
        fetchData(`https://api.github.com/users/${username}/events`)
    ).done(function (userData, eventsData) {
        renderUserInfo(userData[0]);
        renderEvents(eventsData[0]);

        // Create a snapshot of the user data
        const snapshotData = {
            username: userData[0].login,
            avatar_url: userData[0].avatar_url,
            repos_count: 1234, //reposData[0].length, // function to be implemented
            commits_count: 4321, //eventsData[0].length, // function to be implemented
        };
        // Send the snapshot data to the backend
        saveSearch(snapshotData);

    }).fail(function (error) {
        $('#dashboard-page').html('<p>Something went wrong. Please try again later.</p>')
        console.log('Error:', error);
    });
});
