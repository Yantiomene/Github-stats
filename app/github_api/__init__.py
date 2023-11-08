import aiohttp
import asyncio

from app.github_api.utils import APIFetchError, time_delta_YMD, time_delta_DHM, time_async_operation

class GitHubUser:

    __BASE_URL = "https://api.github.com/users"

    def __init__(self, username: str, access_token: str = None):
        self.username = username
        self.access_token = access_token
        self.headers = {"Authorization": f"Bearer {access_token}"} if access_token else {}

    async def fetch_data(self, url) -> dict:
        """Fetch data from a given URL using an aiohttp session."""

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as resp:
                if resp.status != 200:
                    raise APIFetchError(f"Failed to fetch data from {url}: {resp.status}")
                data = await resp.json()
            return data

    async def get_info(self) -> dict:
        """Process user data and return a dictionary with specific details."""
        
        user_data = await self.fetch_data(f"{self.__BASE_URL}/{self.username}")
        return {
            "avatar": user_data.get("avatar_url", ""),
            "full_name": user_data.get("name", ""),
            "username": user_data.get("login", ""),
            "bio": user_data.get("bio", ""),
            "location": user_data.get("location", ""),
            "company": user_data.get("company", ""),
            "twitter": user_data.get("twitter_username", ""),
            "email": user_data.get("email", ""),
            "website": user_data.get("blog", ""),
            "years_active": time_delta_YMD(user_data.get("created_at", ""))
        }

    async def get_repositories(self) -> list:
        """Process repository data and return a list of repositories with specific details."""

        repo_data = await self.fetch_data(f"{self.__BASE_URL}/{self.username}/repos")
        repositories = []
        for repo in repo_data:
            repository = {
                "name": repo.get("name", ""),
                "owner": repo.get("owner", {}).get("login", ""),
                "description": repo.get("description", ""),
                "created_at": repo.get("created_at", ""),
                "updated_at": repo.get("updated_at", ""),
                "repo_age": time_delta_DHM(repo.get("created_at", ""), repo.get("updated_at", "")),
                "commits": len(repo.get('commits_url')),
                "forks": repo.get("forks_count", 0),
                "stars": repo.get("stargazers_count", 0),
                "size": repo.get("size", 0),
                "languages": repo.get("language", ""),
            }
            repositories.append(repository)
        return repositories

    async def get_events(self) -> list:
        """Process activity data and return a list of activity with specific details."""

        activity_data = await self.fetch_data(f"{self.__BASE_URL}/{self.username}/events")

        events = []
        for event in activity_data:
            event_info = {
                "created_at": event.get("created_at", {}),
                "size": event.get("payload", {}).get("distinct_size"),
                "repo": event.get("repo", {}).get("name", {}),
                "type": event.get("type", {})
            }
            events.append(event_info)
        return events

    @time_async_operation
    async def get_all(self) -> tuple:
        """Fetch all user data, repositories, and events concurrently."""

        user_task = self.get_info()
        repos_task = self.get_repositories()
        events_task = self.get_events()

        return await asyncio.gather(user_task, repos_task, events_task)


if __name__ == "__main__":
    from pprint import pprint

    async def main():
        username = "esmond-adjei"
        access_token = "YOUR_ACCESS_TOKEN"  # Add your GitHub access token here

        user = GitHubUser(username)
        try:
            user_data, repos_data, events_data = await user.get_all()

            print("\n\n\nUser Info:")
            pprint(user_data)

            print("\n\n\nRepositories:", len(repos_data))
            pprint(repos_data)

            print("\n\n\nevents:", len(events_data))
            pprint(events_data)
        except APIFetchError as e:
            print(f"API fetch error: {str(e)}")
        except Exception as e:
            print(f"An error occurred: {str(e)}")

    asyncio.run(main())
