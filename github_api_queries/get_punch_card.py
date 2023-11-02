import json
import os
import requests

# Get GitHub username and token from environment variables
username = os.environ.get('GH_USERNAME')
token = os.environ.get('GH_TOKEN')

if not username or not token:
    raise ValueError("GitHub username and token environment variables are not set.")
else:
    print("Username:{}\nToken:{}".format(username, token))

# GitHub API endpoint for punch card data
url = f'https://api.github.com/users/{username}/events'

headers = {
    'Authorization': f'token {token}',
}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Check for errors

    punch_card_data = response.json()

    # Extract the punch card data from the response
    punch_card = {}  # Initialize an empty dictionary

    for event in punch_card_data:
        if 'type' in event and event['type'] == 'PushEvent':
            day_of_week = event['created_at']  # Get the day of the week
            punch_card[day_of_week] = punch_card.get(day_of_week, 0) + 1


    print("\n\n================Punch Card=========")
    print(json.dumps(punch_card, indent=4))  # The punch card data

    # The punch card data contains an array for each day of the week, with each sub-array containing the hour and commit count.
    print("\n\n================Punch Card per day of the week=========")
    for day, hours in enumerate(punch_card_data):
        day_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        print(f'{day_of_week[day]}:')
        for hour, commits in enumerate(hours):
            print(f'{hour} o\'clock: {commits} commits')
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
