import requests
from datetime import datetime
from os import getenv

def get_github_user_info(username, access_token):
    # Define the GitHub API URL for the user profile
    api_url = f"https://api.github.com/users/{username}"

    headers = {
        'Authorization': f'token {access_token}',
    }

    # Send a GET request to the GitHub API
    response = requests.get(api_url, headers=headers)

    # Check if the user exists
    if response.status_code == 200:
        user_data = response.json()

        # Extract the desired user information
        user_info = {
            "avatar": user_data.get("avatar_url"),
            "full_name": user_data.get("name"),
            "username": user_data.get("login"),
            "bio": user_data.get("bio"),
            "location": user_data.get("location"),
            "company": user_data.get("company"),
            "twitter": user_data.get("twitter_username"),
            "email": user_data.get("email"),
            "website": user_data.get("blog"),
            "year_active": datetime.now().year - int(user_data.get("created_at")[:4])
        }

        return user_info
    else:
        return None

"""if __name__ == "__main__":
    # Replace 'your_username' with the GitHub username you want to query
    username_to_query = "esmond-adjei"
    access_token = getenv('GH_TOKEN')

    user_info = get_github_user_info(username_to_query, access_token)

    if user_info:
        print("GitHub User Information:")
        for key, value in user_info.items():
            print(f"{key}: {value}")
    else:
        print(f"The GitHub user '{username_to_query}' does not exist.")
"""
