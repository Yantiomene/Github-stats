// ---------------- GRPAHQL QUERIES ------------------
let username = $('#dashboard-page').data('username');

const languagesQuery = `{
  user(login: "${username}") {
    repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
            }
          }
        }
      }
    }
  }
}`

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
        isFork
        url
        primaryLanguage {
          name
        }
        languages(first: 4, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
            }
          }
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
}`

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
