import requests
import os
from datetime import datetime
import matplotlib.pyplot as plt

# Replace with your GitHub username and Personal Access Token
username = os.getenv('GH_USERNAME')
token = os.getenv('GH_TOKEN')

# API URL for the user's recent activity
api_url = f'https://api.github.com/users/{username}/events/public'

headers = {
    'Authorization': f'token {token}'
}

try:
    response = requests.get(api_url, headers=headers)
    response.raise_for_status()
    events = response.json()

    # Initialize lists to store timestamps and event types
    timestamps = []
    event_types = []

    for event in events:
        created_at = event['created_at']
        timestamps.append(datetime.fromisoformat(created_at.replace('Z', '')))
        event_types.append(event['type'])

    # Create a list of events per day
    days = []
    for timestamp, event_type in zip(timestamps, event_types):
        day = timestamp.date()
        if not days or day != days[-1]:
            days.append(day)

    # Create a list of event counts per day
    event_counts = [event_types.count(event_type) for event_type in set(event_types)]

    # Create the activity chart
    plt.figure(figsize=(12, 6))
    plt.bar(days, event_counts, width=0.9)
    plt.xlabel('Date')
    plt.ylabel('Event Count')
    plt.title(f'GitHub Activity Chart for {username}')
    plt.xticks(rotation=45)
    plt.tight_layout()

    
    # Show the activity chart
    plt.show()

except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
