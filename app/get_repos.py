import requests
from datetime import datetime
from os import getenv
import base64


def fetch_documentation(contents_url, headers):
    # Send a GET request to the GitHub API to retrieve the README file content
    response = requests.get(contents_url[:-7] + "README.md", headers=headers)

    # Check if the README file exists
    if response.status_code == 200:
        print("Readme Succeeded")
        content_data = response.json()
        # Decode the Base64-encoded content and count characters
        content_bytes = base64.b64decode(content_data.get("content"))
        readme_content = content_bytes.decode("utf-8")
        readme_length = len(readme_content)
        # The size may be larger due to Base64 encoding
        readme_size = len(content_bytes)

        return {"length": readme_length, "size": readme_size}
    else:
        return None


def fetch_languages(languages_url, headers):
    # Define the GitHub API URL for fetching languages used in a repository
    # api_url = f"https://api.github.com/repos/{repo_name}/languages"

    # Prepare the headers with the access token for authentication
    # headers = {
    #    "Authorization": f"token {access_token}"
    # }

    # Send a GET request to the GitHub API
    response = requests.get(languages_url, headers=headers)

    # Check if the repository exists
    if response.status_code == 200:
        languages_data = response.json()
        return list(languages_data.keys())
    else:
        return None


def get_github_repositories_info(username, access_token):
    repositories_info = []

    page = 1
    # Number of repositories per page (maximum allowed by GitHub)
    per_page = 30

    while True:
        # Define the GitHub API URL for the user's repositories, including pagination
        api_url = f"https://api.github.com/users/{username}/repos?page={page}&per_page={per_page}"

        # Prepare the headers with the access token for authentication
        # headers = {
        #     "Authorization": f"token {access_token}"
        # }
        headers = None

        # Send a GET request to the GitHub API
        response = requests.get(api_url, headers=headers)

        # Check if the user exists
        if response.status_code == 200:
            repositories_data = response.json()

            print("Contents_url: ", repositories_data[0].get(
                'contents_url')[:-7] + "README.md")
            for repo_data in repositories_data:
                repo_info = {
                    "name": repo_data.get("name"),
                    "owner": repo_data.get("owner").get("login"),
                    "description": repo_data.get("description"),
                    "commits": len(repo_data.get('commits_url')),
                    "created_at": repo_data.get("created_at"),
                    "updated_at": repo_data.get("updated_at"),
                    "forks": repo_data.get("forks_count"),
                    "stars": repo_data.get("stargazers_count"),
                    "size": repo_data.get("size"),
                    # fetch this information separately
                    "languages": fetch_languages(repo_data.get('languages_url'), headers),
                    # You can analyze the repository's content to determine this
                    "project_type": repo_data.get('topics'),
                    "completeness": None,  # Analyze commits for completeness
                    "repo_age": (datetime.now() - datetime.strptime(repo_data.get("created_at"), "%Y-%m-%dT%H:%M:%SZ")).days,
                    # Analyze length/size of README.md
                    "documentation": fetch_documentation(repo_data.get('contents_url'), headers),
                    "frameworks": None  # You can analyze the repository's content to determine this
                }
                repositories_info.append(repo_info)

            # Check if there are more pages of repositories to fetch
            if len(repositories_data) < per_page:
                break  # No more pages to fetch
            else:
                page += 1  # Move to the next page
        else:
            return None  # User does not exist or incorrect access token

    return repositories_info


if __name__ == "__main__":
    # Replace 'your_username' with the GitHub username you want to query
    username_to_query = "Yantiomene"

    # Replace 'your_access_token' with your GitHub Personal Access Token
    access_token = getenv('GH_TOKEN')

    repositories_info = get_github_repositories_info(
        username_to_query, access_token)

    if repositories_info:
        for repo in repositories_info:
            print("GitHub Repository Information:")
            for key, value in repo.items():
                print(f"{key}: {value}")
            print("\n\n===============================")
    else:
        print(
            f"The GitHub user '{username_to_query}' does not exist or you provided an incorrect access token.")
