# 步骤 01：给你的智能体一个工具

> 简单的工具比你想象的更强大。Read、Write、Bash 就足够了。

## 前置条件

与步骤 00 相同 - 复制配置文件并添加你的 API 密钥：

```bash
cp default_workspace/config.example.yaml default_workspace/config.user.yaml
# 编辑 config.user.yaml 添加你的 API 密钥
```

## 这节做什么

让智能体能真正*做事*——不只是聊天。

<img src="01-tools.svg" align="center" width="100%" />

## 关键组件

- **Stop Reason**：聊天循环根据 `stop_reason` 分支 — `"tool_calls"` 执行工具，`"stop"` 正常结束，`"length"` 响应被截断
- **Tools**：管理可用工具并执行工具调用
- **Tool Calling Loop**：智能体调用工具，将结果添加到历史，继续对话



[src/mybot/tools/base.py](src/mybot/tools/base.py)

```python
class BaseTool(ABC):
    name: str
    description: str
    parameters: dict[str, Any]

    @abstractmethod
    async def execute(self, session: "AgentSession", **kwargs: Any) -> str:
        pass

    def get_tool_schema(self) -> dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters,
            },
        }
```

[src/mybot/core/agent.py](src/mybot/core/agent.py)

工具集成到聊天循环：

```python
class AgentSession:
    async def chat(self, message: str) -> str:
        user_msg: Message = {"role": "user", "content": message}
        self.state.add_message(user_msg)

        tool_schemas = self.tools.get_tool_schemas()
        logger = logging.getLogger(__name__)

        while True:
            messages = self.state.build_messages()
            content, tool_calls, stop_reason = await self.agent.llm.chat(messages, tool_schemas)

            assistant_msg: Message = {
                "role": "assistant",
                "content": content,
                "tool_calls": [...],
            }
            self.state.add_message(assistant_msg)

            if stop_reason == "tool_calls":
                await self._handle_tool_calls(tool_calls)
                continue

            if stop_reason == "length":
                logger.warning(
                    "LLM response truncated (max_tokens reached), "
                    "returning partial response"
                )

            break

        return content
```


## 设计说明

### 为什么工具是硬编码的

工具通过 `ToolRegistry.with_builtins()` 在 Python 中注册，而不是在 `AGENT.md` frontmatter 中声明。

基于 YAML 的工具配置涉及的设计决策超出了本教程范围。`BaseTool` 抽象已经让工具在代码层面保持可插拔。

OpenClaw 用插件系统和按智能体配置的 JSON 来处理这件事——但不在本教程范围内。

## 试一试

```bash
cd 01-tools
uv run my-bot chat

# You: Hey Can you read your README.md please?
# pickle: I found and read the README.md file! 🐱

# # Step 01: Tools - Read, Write, Bash is Powerful Enough

# Give the agent the ability to execute tools (read, write, edit, bash) and interact with the filesystem.
# [More lines]
```

## 下一步

[步骤 02：技能](../02-skills/) - 用 SKILL.md 动态加载能力。
