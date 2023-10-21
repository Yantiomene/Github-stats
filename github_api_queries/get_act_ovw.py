import requests
import os
import matplotlib.pyplot as plt

# Replace with your GitHub username and Personal Access Token
username = os.getenv('GH_USERNAME')
token = os.getenv('GH_TOKEN')

# API URL for the user's events
api_url = f'https://api.github.com/users/{username}/events'

headers = {
    'Authorization': f'token {token}'
}

try:
    response = requests.get(api_url, headers=headers)
    response.raise_for_status()
    events = response.json()

    # Initialize counters for different event types
    commit_count = 0
    pr_count = 0
    issue_count = 0
    review_count = 0
    total_events = len(events)

    for event in events:
        if event['type'] == 'PushEvent':
            commit_count += 1
        elif event['type'] == 'PullRequestEvent':
            pr_count += 1
        elif event['type'] == 'IssuesEvent':
            issue_count += 1
        elif event['type'] == 'PullRequestReviewCommentEvent':
            review_count += 1

    # Calculate percentages
    commit_percent = commit_count / total_events * 100
    pr_percent = pr_count / total_events * 100
    issue_percent = issue_count / total_events * 100
    review_percent = review_count / total_events * 100

    # Create the activity overview chart
    labels = ['Commits', 'Pull Requests', 'Issues', 'Code Reviews']
    sizes = [commit_percent, pr_percent, issue_percent, review_percent]
    colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightsalmon']
    explode = (0.1, 0, 0, 0)

    plt.pie(sizes, explode=explode, labels=labels, colors=colors,
            autopct='%1.1f%%', shadow=True, startangle=140)
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    plt.title(f'Activity Overview for {username}')
    plt.show()

except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
