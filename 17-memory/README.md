# Step 17: Memory

> Remember me!

## Prerequisites

Same as Step 09 - copy the config file and add your API key:

```bash
cp default_workspace/config.example.yaml default_workspace/config.user.yaml
# Edit config.user.yaml to add your API key
```

## What We Will Build

Long-term memory across all conversations. 

```
pickle: @cookie Do you know <topic> about user?
cookie: Yes, <content>.
```

## Key Components

- **Memory agent** - Specialized agent for memory management
- [default_workspace/agents/cookie/AGENT.md](../default_workspace/agents/cookie/AGENT.md)

## Try it out

```bash
cd 17-memory
uv run my-bot chat

# You: Remember that my name is Zane
# Pickle: Got it! I've saved that preference.

uv run my-bot chat

# User: What's my name?
# Pickle: Based on your memory, you name is Zane! Hi Zane! 😸
```

## Note

This implementation uses **Specialized Agent** approach. Alternatives include:

| Approach | Description |
|----------|-------------|
| **Specialized Agent** (this) | Dedicated memory agent accessed via dispatch |
| **Direct Tools** | Memory tools in main agent |
| **Skill-Based** | Using CLI tools like grep |
| **Vector Database** | Semantic search over embeddings |

### Memory Directory Structure (Pickle Bot)

```
memories/
├── topics/
│   ├── preferences.md    # User preferences
│   └── identity.md       # User info
├── projects/
│   └── my-project.md     # Project-specific notes
└── daily-notes/
    └── 2024-01-15.md     # Daily journal
```

## What's Next

Deploy, extend, and customize!
