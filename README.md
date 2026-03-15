# Build Your Own OpenClaw

A step-by-step tutorial to build your own AI agent, from a simple chat loop to a lightweight version of [OpenClaw](https://github.com/openclaw/openclaw).

## Overview

**18 progressive steps** that teach you how to build an minimal version of OpenClaw. Each step includes:

- A `README.md` going through key components and design decision.
- A Runnable codebase.

**Example Project:** [pickle-bot](https://github.com/czl9707/pickle-bot) - our reference implementation

## Tutorial Structure

### Phase 1: Capable Single Agent (Steps 1-7)
Build a fully-functional agent that can chat, use tools, learn skills, remember conversations, and access the internet.

- [**00-chat-loop**](./00-chat-loop/) - Just a Chat Loop
- [**01-tools**](./01-tools/) - Give your agent a tool.
- [**02-skills**](./02-skills/) - Extend your agent with `SKILL.md`
- [**03-persistence**](./03-persistence/) - Save your conversations.
- [**04-slash-commands**](./04-slash-commands/) - Direct user control over sessions.
- [**05-compaction**](./05-compaction/) - Pack you history and carry on...
- [**06-web-tools**](./06-web-tools/) - Your Agent want to see the bigger world.

### Phase 2: Event-Driven Architecture (Steps 8-11)
Refactor to event-driven architecture for scalability and multi-platform support.

- [**07-event-driven**](./07-event-driven/) - Expose you agent beyond CLI.
- [**08-config-hot-reload**](./08-config-hot-reload/) - Edit without restart.
- [**09-channels**](./09-channels/) - Talk to your agent from on your phone.
- [**10-websocket**](./10-websocket/) - Want to interact with you agent programatically?

### Phase 3: Autonomous & Multi-Agent (Steps 12-16)
Add scheduled tasks, agent collaboration, and intelligent routing.

- [**11-multi-agent-routing**](./11-multi-agent-routing/) - Route right job to right agent.
- [**12-cron-heartbeat**](./12-cron-heartbeat/) - An Agent work while you are sleeping.
- [**13-multi-layer-prompts**](./13-multi-layer-prompts/) - More Context, More Context, More Context.
- [**14-post-message-back**](./14-post-message-back/) - Your Agent want to Speak to you.
- [**15-agent-dispatch**](./15-agent-dispatch/) - Your Agent want friends to work with!

### Phase 4: Production & Scale (Steps 17-18)
Production features for reliability and long-term memory.

- [**16-concurrency-control**](./16-concurrency-control/) - Too many Pickle is running at the same time?
- [**17-memory**](./17-memory/) - Remember me!

## How to Use This Tutorial

### Configure API Keys

Before running any step, you need to configure your API keys:

1. **Copy the example config:**
   ```bash
   cp default_workspace/config.example.yaml default_workspace/config.user.yaml
   ```

2. **Edit `config.user.yaml`** with your API keys:
   - See [LiteLLM providers](https://docs.litellm.ai/docs/providers) for the full list of supported providers
   - Check out [Provider Examples](PROVIDER_EXAMPLES.md) for some examples

3. Just follow each steps, read and try it out.

## Contributing

Each step is implemented in a separate session. Feel free to suggest improvements!
