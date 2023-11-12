// ---------------- GRPAHQL QUERIES ------------------
const username = $('#dashboard-page').data('username');

// Define the GraphQL query
// const contribQuery = `{
//     user(login: "${username}") {
//         contributionsCollection(from: "${startDateStr}", to: "${endDateStr}") {
//             totalCommitContributions
//             totalPullRequestContributions
//             totalIssueContributions
//             totalRepositoriesWithContributedCommits
//             contributionCalendar {
//                 totalContributions
//                 weeks {
//                     contributionDays {
//                         weekday
//                         date
//                         contributionCount
//                         color
//                     }
//                 }
//                 months {
//                     name
//                     year
//                     firstDay
//                     totalWeeks
//                 }
//             }
//         }
//     }
// }`;

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
          primaryLanguage {
            name
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
  }`;

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
