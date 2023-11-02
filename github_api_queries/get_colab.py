import requests
import os
import json

# Retrieve GitHub username and Personal Access Token from environment variables
username = os.environ.get('GH_USERNAME')
token = os.environ.get('GH_TOKEN')

if not username or not token:
    print("Please set the GITHUB_USERNAME and GITHUB_TOKEN environment variables.")
else:
    # API URL for the user's events (filtering for specific event types)
    api_url = f'https://api.github.com/users/{username}/events'

    headers = {
        'Authorization': f'token {token}'
    }

    # Specify the event types you're interested in (e.g., PushEvent, PullRequestEvent, IssueCommentEvent)
    colab_act = {
        'PushEvent': [],
        'PullRequestEvent': [],
        'IssueCommentEvent': []
    }

    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        events = response.json()

        print(f"Event keys: {events[0].keys()}")
        print(f'Collaboration activity for {username}:')
        for event in events:
            if event['type'] in colab_act:
                colab_act[event['type']].append({'created_at': event['created_at'],
                                                 'repo': event['repo'].get('name'),
                                                 'actor': event['actor'].get('login')})
            else:
                colab_act[event['type']] = []
                colab_act[event['type']].append({'created_at': event['created_at'],
                                                 'repo': event['repo'].get('name'),
                                                 'actor': event['actor'].get('login')})
        i = 1
        for event_type in colab_act:
            print(f"{i}: {event_type}:")
            print(f"\tdate list: {json.dumps(colab_act[event_type])}")
            print(f"\tEvent Counts: {len(colab_act[event_type])}\n\n")
            i += 1

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
