// ---------------- RENDER FUNCTIONS ------------------
// Function to render repositories as a table
const repoTooltip = createTooltip("#repositories");
function QLrenderRepositories(repos_data) {
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
                            <a style='color: ${repo.isFork? 'orange' : ''}' href='https://github.com/${username}/${repo.name}' target='_blank'>${repo.name}</a>
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


function renderSummary(targetSelector, value, valueDescription, tooltip) {
    
    if (!value) {value = ''}
    if (!tooltip) { tooltip = valueDescription }
    value = !value ? '' : `<h3>${value}</h3>` 
    valueDescription = !valueDescription ? '' : `<p>${valueDescription}</p>`
    const template = `${value}${valueDescription}`
    $(targetSelector).html(template);
}