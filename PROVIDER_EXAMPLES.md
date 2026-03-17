# Provider Example Configuration

### OpenAI

```yaml
llm:
    provider: openai
    model: gpt-4
    api_key: sk-your-openai-api-key
```

### MiniMax (OpenAI-compatible)

```yaml
llm:
    provider: minimax
    model: openai/MiniMax-M2.5
    api_key: your-minimax-api-key
    api_base: https://api.minimax.io/v1
    temperature: 0.7
```
Get your API key at [MiniMax Platform](https://platform.minimax.io).

### Z.ai Coding Plan

```yaml
llm:
    provider: zai
    model: "zai/glm-4.7"
    api_key: your-zai-api-key
    api_base: "https://api.z.ai/api/coding/paas/v4"
```

### Anthropic

```yaml
llm:
    provider: anthropic
    model: claude-sonnet-4-20250514
    api_key: your-anthropic-api-key
```
Get your API key at [Anthropic Console](https://console.anthropic.com).

### Qwen (OpenAI-compatible)

```yaml
llm:
    provider: openai
    model: qwen/qwen-max
    api_key: your-dashscope-api-key
    api_base: https://dashscope.aliyuncs.com/compatible-mode/v1
    temperature: 0.7
```
Get your API key at [DashScope](https://dashscope.console.aliyun.com).

### Grok (OpenAI-compatible)

```yaml
llm:
    provider: openai
    model: grok-2-1212
    api_key: your-x-api-key
    api_base: https://api.x.ai/v1
    temperature: 0.7
```
Get your API key at [x.ai](https://console.x.ai).

### Gemini (Google AI)

```yaml
llm:
    provider: google
    model: gemini-2.0-flash
    api_key: your-google-api-key
```
Get your API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
