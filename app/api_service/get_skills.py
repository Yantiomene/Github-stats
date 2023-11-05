import requests
from os import getenv

def get_all_user_repositories(username, access_token):
    user_repositories = []

    page = 1
    per_page = 100  # Adjust this value based on your needs

    headers = {
        'Authorization': f'token {access_token}',
    }
    
    while True:
        # Request a page of repositories
        user_repos_url = f"https://api.github.com/users/{username}/repos?page={page}&per_page={per_page}"
        response = requests.get(user_repos_url, headers=headers)

        if response.status_code == 200:
            repositories = response.json()
            if not repositories:
                break  # No more repositories to fetch
            user_repositories.extend(repositories)
            page += 1
        else:
            return None  # An error occurred

    return user_repositories

def get_github_user_skills(username, access_token):
    user_skills = {
        "programming_languages": {},
        "frameworks": {}
    }

    repositories = get_all_user_repositories(username, access_token)

    headers = {
        'Authorization': f'token {access_token}',
    }
    
    if repositories is not None:
        for repo in repositories:
            repo_name = repo["name"]
            repo_languages_url = f"https://api.github.com/repos/{username}/{repo_name}/languages"
            response = requests.get(repo_languages_url, headers=headers)

            if response.status_code == 200:
                repo_languages = response.json()
                for language, bytes_of_code in repo_languages.items():
                    if language in user_skills["programming_languages"]:
                        user_skills["programming_languages"][language] += bytes_of_code
                    else:
                        user_skills["programming_languages"][language] = bytes_of_code

            # Analyze frameworks here based on the repository's content
            # README. requirements.txt and package.json

    return user_skills

"""if __name__ == "__main__":
    username_to_query = "Yantiomene"
    access_token = getenv('GH_TOKEN')
    user_skills_info = get_github_user_skills(username_to_query, access_token)

    if user_skills_info:
        print("GitHub User Skills Information:")
        print("Programming Languages:")
        for language, bytes_of_code in user_skills_info["programming_languages"].items():
            print(f"{language}: {bytes_of_code} bytes of code")

        # You can similarly print out information about frameworks

    else:
        print(f"The GitHub user '{username_to_query}' does not exist.")
"""
