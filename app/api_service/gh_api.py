import aiohttp
import asyncio

async def fetch_repos(username):
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://api.github.com/users/{username}/repos") as resp:
            repos = await resp.json()
    return repos

async def fetch_commits(repo_url):
    async with aiohttp.ClientSession() as session:
        async with session.get(repo_url+"/commits") as resp:
            commits = await resp.json()
    return commits

loop = asyncio.get_event_loop()
tasks = [
    loop.create_task(fetch_repos("username")),
    loop.create_task(fetch_commits("https://api.github.com/repos/username/repo1")),
    loop.create_task(fetch_commits("https://api.github.com/repos/username/repo2")),
]
for task in tasks:
    task.result()
