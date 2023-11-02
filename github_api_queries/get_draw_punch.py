import requests
import os
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
from matplotlib.colors import ListedColormap

# Retrieve GitHub username and Personal Access Token from environment variables
username = 'esmond-adjei'  #os.environ.get('GH_USERNAME')
token = os.environ.get('GH_TOKEN')

if not username or not token:
    print("Please set the GH_USERNAME and GH_TOKEN environment variables.")
else:
    # Initialize a 2D array to represent the punch card data
    punch_card = np.zeros((7, 24))

    # Initialize a list to store the month labels
    month_labels = []
    
    # Calculate the date one year ago from the current date
    one_year_ago = datetime.now() - timedelta(days=365)

    while one_year_ago < datetime.now():
        # Convert the date to ISO format
        since_date = one_year_ago.isoformat()

        # Append the month label to the list
        month_labels.append(one_year_ago.strftime("%b %Y"))
        
        # API URL for the user's contribution activity for a specific month
        api_url = f'https://api.github.com/users/{username}/events?since={since_date}'

        headers = {
            'Authorization': f'token {token}'
        }

        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()
            events = response.json()

            for event in events:
                if event['type'] == 'PushEvent':
                    # Parse the timestamp and extract day of the week (0 = Sunday, 6 = Saturday) and hour of the event
                    created_at = datetime.fromisoformat(event['created_at'].replace('Z', ''))
                    day = created_at.weekday()
                    hour = created_at.hour
                    punch_card[day][hour] += 1

        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")

        # Move to the next month
        one_year_ago = one_year_ago + timedelta(days=30)

    # Create a custom GitHub-like color palette
    colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
    custom_cmap = ListedColormap(colors)

    # Create the punch card graph with grid
    plt.imshow(punch_card, cmap=custom_cmap)
    plt.colorbar(label='Commits')
    plt.xlabel('Hour of Day')
    plt.ylabel('Day of Week')
    plt.title(f'GitHub-Like Punch Card for {username}')
    plt.xticks(np.arange(24), labels=[str(i) for i in range(24)])
    plt.yticks(np.arange(7), labels=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
    plt.grid(True, linestyle='--', alpha=0.7)

    # Add month labels to the punch card
    for i, label in enumerate(month_labels):
        plt.text(25, i * 7 + 3, label, fontsize=8)

    # Save the punch card image in the current directory
    plt.savefig('punch_card.png')
    plt.show()

