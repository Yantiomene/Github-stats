import requests
import os

# Retrieve GitHub username and Personal Access Token from environment variables
username = 'esmond-adjei'  #os.environ.get('GH_USERNAME')
token = os.environ.get('GH_TOKEN')

if not username or not token:
    print("Please set the GITHUB_USERNAME and GITHUB_TOKEN environment variables.")
else:
    # API URL for the user's repositories
    api_url = f'https://api.github.com/users/{username}/repos'

    headers = {
        'Authorization': f'token {token}'
    }

    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        repositories = response.json()

        print(f'Repositorie keys: {repositories[0].keys()}')
        print(f'Repositories for {username}:')
        i = 1
        languages = []
        for repo in repositories:
            print(f"{i}: {repo['name']}")
            print(f"\tCreated at: {repo['created_at']}")
            print(f"\tLast Update: {repo['updated_at']}")
            print(f"\tDescription: {repo['description']}")
            print(f"\tForks counts: {repo['forks_count']}")
            print(f"\tLanguages:")
            languages_url = repo['languages_url']
            try:
                res = requests.get(languages_url, headers=headers)
                res.raise_for_status()
                langs = res.json()
                for language, bytes_of_code in langs.items():
                    print(f'\t\t{language}: {bytes_of_code} bytes of code')
            except requests.exceptions.RequestException as e:
                print(f"Error: {e}")
                
            print(f"\tCommit counts: {len(repo['commits_url'])}")
            print(f"\tMain language: {repo['language']}")
            print(f"\tGit_commit counts: {len(repo['git_commits_url'])}\n\n")
            languages.append(repo['language'])
            i += 1
        print(f"languages: {languages}")
            
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
