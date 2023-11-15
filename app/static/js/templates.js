// ---------------- RENDER FUNCTIONS ------------------

// function to render loading message
function showLoadingMessage(element, message) {
    element.html(`<p>${message}</p>`);
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
            <a href="${user_data.html_url}" target="_blank">
            <img src="${user_data.avatar_url}" alt="Avatar" width=100>
            </a>
        </div>
        
        <a href="${user_data.html_url}" target="_blank">
        <h2>${user_data.name}</h2>
        </a>
        <small><em>${user_data.login}</em></small><br><br>
        <small>${user_data.bio}</small>
        
        <div class='row'>
            <small>Location: ${user_data?.location ?? 'unknown'}</small><br>
            <small>Company: ${user_data?.company ?? 'unknown'}</small>
        </div>

        <div class='row'>
            <small>Website: <a href="${user_data.blog}" target='_blank'>${user_data.blog}</a></small><br>
            <small>X (prev. Twitter): <a href="https://x.com/${user_data.twitter_username}" target='_blank'>@${user_data.twitter_username}</a></small><br>
            <small>Email: <a href="mailto:${user_data.email}" target='_blank'>${user_data.email}</a></small>
        </div>
    `;
    userInfoElement.html(userHtml);
}

// Function to render events
function renderEvents(events_data) {
    const eventsElement = $('#events');
   
    if (events_data.length === 0) {
        eventsElement.html('<p style="text-align: center">No events found.</p>');
        return;
    }

    const loadEvents = `
        <div class='hcc'>
            <span class='button-cta' id='loadEvents'> Load recent events for <em>${username}</em></span>
        </div>
    `
    eventsElement.html(loadEvents);

    // Grouping events by date
    const groupedData = {};
    events_data.forEach(item => {
        const createdAtDate = convertDate(item.created_at)
        if (!groupedData[createdAtDate]) {
            groupedData[createdAtDate] = [];
        }

        groupedData[createdAtDate].push({
            "created_at": item.created_at,
            "event_type": item.type,
            "reponame": item.repo.name,
            // "message": item.payload?.commits[0].message ?? 'null',
        });
    });
    const eventsHtml = `
        <h2>Recent ${events_data.length} activities of ${username}</h2>
        ${Object.keys(groupedData).map(date => `
            <h5>${date}</h5>
            <ul>
                ${groupedData[date].map(event => `
                    <li><em>${formatTime(event.created_at)}: </em> ${event.event_type} in ${event.reponame}</li>
                `).join('')}
            </ul>
        `).join('')}
    `;

    $('#loadEvents').click(function () {
        eventsElement.html(eventsHtml);
    });
}

// Function to render repositories as a table
function QLrenderRepositories(repos_data) {
    const reposElement = $('#repositories');
    
    if (repos_data.length === 0) {
        reposElement.html(`<div style='hcc'><p style="text-align: center">No repositories found.</p></div>`);
        return;
    }
  
    const reposTable = `
        <h2>Repositories (${repos_data.length})</h2>
        <div class="legend">
            <small style="color: orange"><em>*Forked repo</em></small><br>
            <small style="color: var(--secondary-color)"><em>*Personal or Collaborative repo</em></small>
        </div>
        <div class='table-view'>
        <table class="searchable sortable">
            <thead>
                <tr>
                    <th scope='row' style='text-align: left'>Name</th>
                    <th scope='row' style='text-align: left'>Description</th>
                    <th scope='row' style='min-width: 100px'>created at</th>
                    <th scope='row' style='min-width: 100px'>last updated</th>
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
                        <td style='text-align: left;'>
                            <a 
                                style='color: ${repo.isFork? 'orange' : ''}'
                                href='${repo.url}'
                                target='_blank'
                            >
                                ${repo.name}
                            </a>
                        </td>
                        <td style='text-align: left'>${repo.description}</td>
                        <td>${convertDate(repo.createdAt)}</td>
                        <td>${convertDate(repo.updatedAt)}</td>
                        <td>${timeDeltaHM(repo.createdAt, repo.updatedAt)}</td>
                        <td>${repo.defaultBranchRef?.target.history.totalCount ?? 'null'}</td>
                        <td>${repo.diskUsage}</td>
                        <td>${repo.primaryLanguage?.name ?? 'null'}</td>
                        <td>${repo.forkCount}</td>
                        <td>${repo.stargazerCount}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        </div>
    `;
    reposElement.html(reposTable);
  }

// Function to render summary
function renderSummary(targetSelector, value, valueDescription, tooltip) {
    
    if (!value) {value = ''}
    if (!tooltip) { tooltip = valueDescription }
    value = !value ? '' : `<h3>${value}</h3>` 
    valueDescription = !valueDescription ? '' : `<p>${valueDescription}</p>`
    const template = `${value}${valueDescription}`
    $(targetSelector).html(template);
}