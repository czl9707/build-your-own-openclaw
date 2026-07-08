# 步骤 03：持久化

> 保存你的对话。
保存和恢复对话历史，让智能体记住过去的交互。

## 前置条件

与步骤 00 相同 - 复制配置文件并添加你的 API 密钥：

```bash
cp default_workspace/config.example.yaml default_workspace/config.user.yaml
# 编辑 config.user.yaml 添加你的 API 密钥
```

## 这节做什么

<img src="03-persistence.svg" align="center" width="100%" />

文件系统结构：

```
.history/
├── index.jsonl              # 会话元数据
└── sessions/
    └── {session_id}.jsonl   # 消息（每个会话一个文件）
```

## 关键组件

- **.history/index.jsonl**：基于 JSONL 文件的会话索引，包含元数据
- **.history/sessions/{id}.jsonl**：基于 JSONL 文件的消息存储



[src/mybot/core/history.py](src/mybot/core/history.py) - 新文件

```python
class HistoryStore:
    def create_session(self, agent_id: str, session_id: str) -> dict:
        """Create a new conversation session."""

    def save_message(self, session_id: str, message: HistoryMessage) -> None:
        """Save a message to history."""

    def get_messages(self, session_id: str) -> list[HistoryMessage]:
        """Get all messages for a session."""
```


## 持久化实现方式

基于文件的存储刻意保持简单，许多智能体仍然这样处理持久化。如果之后你需要扩展项目，数据库是一个自然的进阶选择。Sqlite，Postgres 等等。由于一切都通过 `HistoryStore` 接口进行，实现一个更加复杂的持久化方案不会影响项目的其他部分。

## 试一试

```bash
cd 03-persistence
uv run my-bot chat

# 每次运行都会启动一个新会话
# 消息保存到 .history/ 目录
```

## 下一步

[步骤 04：斜杠命令](../04-slash-commands/) - 直接命令调用
