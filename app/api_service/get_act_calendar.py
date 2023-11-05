import requests
from datetime import datetime, timedelta
from os import getenv

def get_github_user_activity(username, access_token):
    # Initialize the dictionary to store user activity information
    user_activity = {}

    # Calculate the start and end dates for the last year
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)

    # Format the dates in ISO 8601 format
    end_date_str = end_date.isoformat() + "Z"
    start_date_str = start_date.isoformat() + "Z"

    # Define the GitHub GraphQL API URL
    graphql_url = "https://api.github.com/graphql"

    # Define the GraphQL query to retrieve contribution history
    contribution_query = """
    {
        user(login: "%s") {
            contributionsCollection(from: "%s", to: "%s") {
                totalCommitContributions
                totalPullRequestContributions
                totalIssueContributions
                totalRepositoriesWithContributedCommits
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
                    months {
                        name
                        year
                        firstDay
                        totalWeeks
                    }
                }
            }
        }
    }
    """ % (username, start_date_str, end_date_str)

    # Prepare headers with the access token for authentication
    headers = {
        "Authorization": f"bearer {access_token}"
    }

    # Send a POST request to the GraphQL API
    response = requests.post(graphql_url, json={"query": contribution_query}, headers=headers)

    if response.status_code == 200:
        user_data = response.json().get("data", {}).get("user", {})
        contribution_data = user_data.get("contributionsCollection", {})
        user_activity["totalCommitContributions"] = contribution_data.get("totalCommitContributions")
        user_activity["totalPullRequestContributions"] = contribution_data.get("totalPullRequestContributions")
        user_activity["totalIssueContributions"] = contribution_data.get("totalIssueContributions")
        user_activity["totalRepositoriesWithContributedCommits"] = contribution_data.get("totalRepositoriesWithContributedCommits")
        user_activity["contributionCalendar"] = contribution_data.get("contributionCalendar")
    else:
        return None

    return user_activity

"""if __name__ == "__main__":
    username_to_query = "Yantiomene"
    access_token = getenv('GH_TOKEN')

    user_activity_info = get_github_user_activity(username_to_query, access_token)

    if user_activity_info:
        print("GitHub User Activity Information:")
        for key, value in user_activity_info.items():
            print(f"{key}: {value}")
    else:
        print(f"The GitHub user '{username_to_query}' does not exist or you provided an incorrect access token.")
"""
