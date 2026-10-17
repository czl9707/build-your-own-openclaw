# Step 06: Web Tools

> Your Agent wants to see the bigger world.
> At the root, they are just two new tools.

## Prerequisites

```bash
cp default_workspace/config.example.yaml default_workspace/config.user.yaml
# Edit config.user.yaml to add your API key
# Uncomment websearch and webread sections
# Add your websearch api key
```

## What We Will Build

An LLM may know how to write Python, but it cannot know the latest trends in the Python ecosystem. This opens up the world beyond the local file system and the LLM's training data.

<img src="06-web-tools.svg" align="center" width="100%" />

## Key Components

- **WebSearchProvider**: Web search providers.
- **WebReadProvider**: Web reading providers.
- **Tools**: `websearch` and `webread` tools.



[src/mybot/provider/web_search/](src/mybot/provider/web_search/)

```python
class WebSearchProvider(ABC):
    async def search(self, query: str) -> list[SearchResult]: ...
```

[src/mybot/provider/web_read/](src/mybot/provider/web_read/)

```python
class WebReadProvider(ABC):
    async def read(self, url: str) -> ReadResult: ...
```

[src/mybot/tools/websearch_tool.py](src/mybot/tools/websearch_tool.py)

```python
@tool(...)
async def websearch(query: str, session: "AgentSession") -> str:
    results = await provider.search(query)

    if not results:
        return "No results found."
    output = []
    for i, r in enumerate(results, 1):
        output.append(f"{i}. **{r.title}**\n   {r.url}\n   {r.snippet}")
    return "\n\n".join(output)
```

[src/mybot/tools/webread_tool.py](src/mybot/tools/webread_tool.py)

```python
@tool(...)
async def webread(url: str, session: "AgentSession") -> str:
    result = await provider.read(url)
    if result.error:
        return f"Error reading {url}: {result.error}"

    return f"**{result.title}**\n\n{result.content}"
```

## Try it out

```bash
cd 06-web-tools
uv run my-bot chat

# You: What is pickle bot? search online please.
# pickle: Based on my search, there are actually a few different things called "Pickle Bot":

# ### 1. **Pickle Robot Company** 🤖
# ### 2. **Pickle Bot (Discord Bot)** 💬
# ### 3. **pickle-bot (GitHub)** 🐱
# An open-source project described as:
# - "Your own AI assistant, speak like a cat"
# - "Pickle is a standard little cat"
# - A customizable AI assistant that you can name, talk to, and teach

# The GitHub version sounds like it could be related to me - a cat-speaking AI assistant! 😺

# Which one were you curious about?
```

## Alternative: Search through MCP

[Parallel Search MCP](https://docs.parallel.ai/integrations/mcp/search-mcp) offers web search and page fetching at `https://search.parallel.ai/mcp`. An MCP client can connect over Streamable HTTP without an account or API key. Anonymous search uses Fast mode and has lower rate limits than authenticated access.

This is an optional extension exercise: the tutorial currently supports Brave for `websearch` and Crawl4AI for `webread`, and does not include an MCP client. Setting `provider: parallel` in `config.user.yaml` will not enable it.

To explore a different backend behind the same interface, implement a `WebSearchProvider` adapter using an [MCP client](https://github.com/modelcontextprotocol/python-sdk). Call the server's `web_search` tool with an `objective` and a `search_queries` list, for example:

```json
{
  "objective": "Find the official Python asyncio documentation",
  "search_queries": ["Python asyncio official documentation"]
}
```

Map each item in the tool's structured `results` to `SearchResult`: use `title` (or an empty string when absent), `url`, and joined `excerpts` as `snippet`. The existing `websearch` tool can then format the results without knowing which backend produced them. You would also need to extend the configuration model and `WebSearchProvider.from_config` to select the adapter. Keep `webread` separate; replacing it with the server's `web_fetch` tool would require its own `WebReadProvider` adapter.

## What's Next

[Step 07: Event-Driven](../07-event-driven/) - The great refactor to event-based architecture
