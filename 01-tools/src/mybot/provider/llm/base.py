"""Base LLM provider abstraction."""

from dataclasses import dataclass
from typing import Any, Optional, cast

from litellm import acompletion, Choices, TYPE_CHECKING
from litellm.types.completion import ChatCompletionMessageParam as Message
from litellm.types.utils import OpenAIChatCompletionFinishReason

if TYPE_CHECKING:
    from mybot.utils.config import LLMConfig

StopReason = OpenAIChatCompletionFinishReason


@dataclass
class LLMToolCall:
    """A tool/function call from the LLM."""

    id: str
    name: str
    arguments: str  # JSON string


class LLMProvider:
    """LLM provider using litellm for multi-provider support."""

    def __init__(
        self,
        model: str,
        api_key: str,
        api_base: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any,
    ):
        """Initialize LLM provider."""
        self.model = model
        self.api_key = api_key
        self.api_base = api_base
        self.temperature = temperature
        self.max_tokens = max_tokens
        self._settings = kwargs

    @classmethod
    def from_config(cls, config: "LLMConfig") -> "LLMProvider":
        """Create provider from LLMConfig."""
        return cls(
            model=config.model,
            api_key=config.api_key,
            api_base=config.api_base,
            temperature=config.temperature,
            max_tokens=config.max_tokens,
        )

    async def chat(
        self,
        messages: list[Message],
        tools: Optional[list[dict[str, Any]]] = None,
        **kwargs: Any,
    ) -> tuple[str, list[LLMToolCall], StopReason]:
        """Send a chat request to the LLM.

        Default implementation using litellm. Subclasses can override
        if provider-specific behavior is needed.

        Returns:
            Tuple of (content, tool_calls, stop_reason)
        """
        request_kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "api_key": self.api_key,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }

        if self.api_base:
            request_kwargs["api_base"] = self.api_base
        if tools:
            request_kwargs["tools"] = tools
        request_kwargs.update(kwargs)

        response = await acompletion(**request_kwargs)

        choice = cast(Choices, response.choices[0])
        message = choice.message
        stop_reason = choice.finish_reason

        return (
            message.content or "",
            [
                LLMToolCall(
                    id=tc["id"],
                    name=tc["function"]["name"],
                    arguments=tc["function"]["arguments"],
                )
                for tc in (message.tool_calls or [])
            ],
            stop_reason,
        )
