<p align="center">
  <a href="https://www.atlascloud.ai/?utm_source=github&utm_medium=link&utm_campaign=build-your-own-openclaw">
    <img src="docs/atlas-cloud-logo.png" alt="Atlas Cloud" width="200">
  </a>
</p>

> 🎁 **[Atlas Cloud](https://www.atlascloud.ai/?utm_source=github&utm_medium=link&utm_campaign=build-your-own-openclaw)** is a full-modal AI inference platform — use it as the LLM backend for this tutorial. 59 frontier models (DeepSeek-V4, Qwen3, Kimi K2, GPT-5, Gemini 2.5 Pro, Claude…) via a single OpenAI-compatible endpoint. [View all models](https://www.atlascloud.ai/models) · [Coding Plan](https://www.atlascloud.ai/console/coding-plan)

<details>
<summary>📋 59 models available on Atlas Cloud</summary>

| Model | Type |
|-------|------|
| deepseek-ai/deepseek-v4-pro | LLM |
| deepseek-ai/deepseek-v4-0520 | LLM |
| deepseek-ai/deepseek-v4-flash | LLM |
| deepseek-ai/deepseek-r2 | LLM |
| deepseek-ai/deepseek-r2-0528 | LLM |
| deepseek-ai/deepseek-r1-0528 | LLM |
| deepseek-ai/deepseek-r1 | LLM |
| deepseek-ai/deepseek-prover-v2 | LLM |
| moonshot-ai/kimi-k2 | LLM |
| moonshot-ai/kimi-k2-0711 | LLM |
| moonshot-ai/kimi-k1.5-long | LLM |
| qwen/qwen3-235b-a22b | LLM |
| qwen/qwen3-30b-a3b | LLM |
| qwen/qwen3-32b | LLM |
| qwen/qwq-32b | LLM |
| openai/gpt-5 | LLM |
| openai/gpt-5-mini | LLM |
| openai/gpt-4.1 | LLM |
| openai/gpt-4o | LLM |
| openai/o3 | LLM |
| openai/o4-mini | LLM |
| openai/o3-mini | LLM |
| anthropic/claude-sonnet-4-5 | LLM |
| anthropic/claude-opus-4 | LLM |
| anthropic/claude-sonnet-4 | LLM |
| anthropic/claude-haiku-4-5 | LLM |
| google/gemini-2.5-pro | LLM |
| google/gemini-2.5-flash | LLM |
| google/gemini-2.5-flash-lite | LLM |
| google/gemini-2.0-flash | LLM |
| xai/grok-4 | LLM |
| xai/grok-3 | LLM |
| xai/grok-3-mini | LLM |
| meta-llama/llama-4-scout | LLM |
| meta-llama/llama-4-maverick | LLM |
| meta-llama/llama-3.3-70b | LLM |
| cohere/command-a | LLM |
| mistral/mistral-large | LLM |
| minimax/minimax-m1 | LLM |
| 01ai/yi-lightning | LLM |
| seedance/seedance-v1-pro | Video |
| seedance/seedance-v1-pro-fast | Video |
| seedance/seedance-v1-lite | Video |
| kling/kling-v2.1-pro | Video |
| kling/kling-v2.1-standard | Video |
| kling/kling-v1.6-pro | Video |
| kling/kling-v1.6-standard | Video |
| wan2/wan2.1-t2v-turbo | Video |
| wan2/wan2.1-i2v-turbo | Video |
| veo/veo3.1-fast | Video |
| veo/veo3-fast | Video |
| veo/veo3 | Video |
| runway/gen4-turbo | Video |
| stable-diffusion/sd3.5-large | Image |
| flux/flux1.1-pro-ultra | Image |
| flux/flux1.1-pro | Image |
| ideogram/ideogram-v3 | Image |
| recraft/recraft-v3 | Image |
| minimax/hailuo-i2v-01-live | Video |
</details>

---

# Build Your Own OpenClaw

A step-by-step tutorial to build your own AI agent, from a simple chat loop to a lightweight version of [OpenClaw](https://github.com/openclaw/openclaw).

<img src="Cover.png" style="width: 100%;">

## Overview

**18 progressive steps** that teach you how to build an minimal version of OpenClaw. Each step includes:

- A `README.md` going through key components and design decision.
- A Runnable codebase.

**Example Project:** [pickle-bot](https://github.com/czl9707/pickle-bot) - our reference implementation

## Tutorial Structure

### Phase 1: Capable Single Agent (Steps 0-6)
Build a fully-functional agent that can chat, use tools, learn skills, remember conversations, and access the internet.

- [**00-chat-loop**](./00-chat-loop/) - Just a Chat Loop
- [**01-tools**](./01-tools/) - Give your agent a tool.
- [**02-skills**](./02-skills/) - Extend your agent with `SKILL.md`
- [**03-persistence**](./03-persistence/) - Save your conversations.
- [**04-slash-commands**](./04-slash-commands/) - Direct user control over sessions.
- [**05-compaction**](./05-compaction/) - Pack you history and carry on...
- [**06-web-tools**](./06-web-tools/) - Your Agent want to see the bigger world.

### Phase 2: Event-Driven Architecture (Steps 7-10)
Refactor to event-driven architecture for scalability and multi-platform support.

- [**07-event-driven**](./07-event-driven/) - Expose you agent beyond CLI.
- [**08-config-hot-reload**](./08-config-hot-reload/) - Edit without restart.
- [**09-channels**](./09-channels/) - Talk to your agent from on your phone.
- [**10-websocket**](./10-websocket/) - Want to interact with you agent programatically?

### Phase 3: Autonomous & Multi-Agent (Steps 11-15)
Add scheduled tasks, agent collaboration, and intelligent routing.

- [**11-multi-agent-routing**](./11-multi-agent-routing/) - Route right job to right agent.
- [**12-cron-heartbeat**](./12-cron-heartbeat/) - An Agent work while you are sleeping.
- [**13-multi-layer-prompts**](./13-multi-layer-prompts/) - More Context, More Context, More Context.
- [**14-post-message-back**](./14-post-message-back/) - Your Agent want to Speak to you.
- [**15-agent-dispatch**](./15-agent-dispatch/) - Your Agent want friends to work with!

### Phase 4: Production & Scale (Steps 16-17)
Features for reliability and long-term memory.

- [**16-concurrency-control**](./16-concurrency-control/) - Too many Pickle are running at the same time?
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
