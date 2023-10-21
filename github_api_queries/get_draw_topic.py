import requests
import os
import networkx as nx
import matplotlib.pyplot as plt

# Replace with your GitHub username and Personal Access Token
username = os.getenv('GH_USERNAME')
token = os.getenv('GH_TOKEN')

# Initialize a graph to represent the topics
G = nx.Graph()

# API URL for the user's repositories
api_url = f'https://api.github.com/users/{username}/repos'

headers = {
    'Authorization': f'token {token}'
}

try:
    response = requests.get(api_url, headers=headers)
    response.raise_for_status()
    repositories = response.json()

    for repo in repositories:
        # Fetch the repository topics
        repo_name = repo['name']
        repo_url = repo['url']  # API URL for the repository
        repo_topics_url = f'{repo_url}/topics'

        topics_response = requests.get(repo_topics_url, headers=headers)
        topics_response.raise_for_status()
        repo_topics = topics_response.json().get('names', [])

        # Add repository and topics to the graph
        G.add_node(repo_name, type='repository')
        for topic in repo_topics:
            G.add_node(topic, type='topic')
            G.add_edge(repo_name, topic)

    # Create the topics graph
    pos = nx.spring_layout(G, seed=42)  # You can choose a different layout algorithm
    plt.figure(figsize=(10, 10))
    node_types = nx.get_node_attributes(G, 'type')
    node_colors = {'repository': 'blue', 'topic': 'red'}
    node_color = [node_colors[node_types[node]] for node in G.nodes]
    nx.draw(G, pos, with_labels=True, node_color=node_color)
    plt.title(f'Topics Graph for {username}')

    # Save the fig in the current directory
    filename = 'topic_graph.png'
    plt.savefig(filename)
    
    plt.show()

except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
