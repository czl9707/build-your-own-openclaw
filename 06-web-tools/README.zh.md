# 步骤 06：Web 工具

> 你的智能体想看看更大的世界。
> 归根结底，它们只是两个新工具。

## 前置条件

```bash
cp default_workspace/config.example.yaml default_workspace/config.user.yaml
# 编辑 config.user.yaml 添加你的 API 密钥
# 取消注释 websearch 和 webread 部分
# 添加你的 websearch api 密钥
```

## 这节做什么

LLM 懂 Python，但不知道昨天 PyPI 上发了什么新包。加两个工具让它能搜网页、读 URL。

<img src="06-web-tools.svg" align="center" width="100%" />

## 关键组件

- **WebSearchProvider**：网络搜索提供商。
- **WebReadProvider**：网页阅读提供商。
- **Tools**：`websearch` 和 `webread` 工具。



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

## 试一试

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

## 替代方案：通过 MCP 搜索

[Parallel Search MCP](https://docs.parallel.ai/integrations/mcp/search-mcp) 在 `https://search.parallel.ai/mcp` 提供网页搜索和内容提取。MCP 客户端可通过 Streamable HTTP 连接，无需账号或 API 密钥。匿名搜索使用 Fast 模式，速率限制比认证访问更低。

这是一个可选的扩展练习：教程目前的 `websearch` 支持 Brave，`webread` 支持 Crawl4AI，并未包含 MCP 客户端。在 `config.user.yaml` 中设置 `provider: parallel` 不会启用它。

可以用 [MCP 客户端](https://github.com/modelcontextprotocol/python-sdk) 实现一个 `WebSearchProvider` 适配器，练习在相同接口下替换后端。调用服务器的 `web_search` 工具时，传入 `objective` 和 `search_queries` 列表，例如：

```json
{
  "objective": "Find the official Python asyncio documentation",
  "search_queries": ["Python asyncio official documentation"]
}
```

将工具结构化返回的 `results` 中每一项转换为 `SearchResult`：使用 `title`（缺失时用空字符串）、`url`，并将 `excerpts` 拼接为 `snippet`。这样，现有的 `websearch` 工具无需关心后端就能格式化结果。还需要扩展配置模型和 `WebSearchProvider.from_config`，才能选择这个适配器。`webread` 仍单独处理；若要改用服务器的 `web_fetch` 工具，还需要实现对应的 `WebReadProvider` 适配器。

## 下一步

[步骤 07：事件驱动](../07-event-driven/) - 重构为基于事件的架构
