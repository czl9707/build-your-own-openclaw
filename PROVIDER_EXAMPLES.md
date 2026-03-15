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