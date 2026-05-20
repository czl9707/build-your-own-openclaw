"""Base LLM provider abstraction."""

from typing import Any, Optional, cast

from litellm import acompletion, Choices, TYPE_CHECKING
from litellm.types.completion import ChatCompletionMessageParam as Message

if TYPE_CHECKING:
    from mybot.utils.config import LLMConfig


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
        **kwargs: Any,
    ) -> str:        
        """Call LLM with messages."""
        request_kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "api_key": self.api_key,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }

        if self.api_base:
            request_kwargs["api_base"] = self.api_base
        request_kwargs.update(kwargs)

        response = await acompletion(**request_kwargs)

        message = cast(Choices, response.choices[0]).message

        return message.content or ""