---
name: cron-ops
description: Create, list, and delete scheduled cron jobs
---

Help users manage scheduled cron jobs in pickle-bot.

## What is a Cron?

A cron is a scheduled task that runs at specified intervals. Crons are stored as `CRON.md` files at `{{crons_path}}/<name>/CRON.md`.

## Schedule Syntax

Standard cron format: `minute hour day month weekday`

Examples:
- `0 9 * * *` - Every day at 9:00 AM
- `*/30 * * * *` - Every 30 minutes
- `0 0 * * 0` - Every Sunday at midnight

## One-Off Jobs

Set `one_off: true` for jobs that should run only once. After execution, the cron is automatically deleted.

Use this for:
- Reminders at a specific future time
- Scheduled one-time tasks
- Delayed notifications

## Operations

### Create

1. Ask what task should run and when
2. Determine the schedule
3. Ask which agent should run the task
4. Ask for a brief description of what the cron does
5. If the task should run only once (e.g., "remind me tomorrow"), set `one_off: true`
6. Create the directory and CRON.md file

### List

Use `bash` to list directories:
```bash
ls {{crons_path}}
```

### Delete

1. List available crons
2. Confirm which one to delete
3. Use `bash` to remove:
```bash
rm -rf {{crons_path}}/<cron-name>
```

## Cron Prompt Guidelines

Cron jobs run in the background with no direct output to the user. The agent executing the cron has no conversation context.

**When the user asks to be notified** (e.g., "tell me", "let me know", "remind me"):
- Include `post_message` instruction in the prompt

**When the user doesn't ask for notification:**
- No `post_message` needed (e.g., background cleanup, data processing)

## Cron Template

```markdown
---
name: Cron Name
description: Brief description of what this cron does
agent: pickle
schedule: "0 9 * * *"
one_off: false  # Set to true for one-time jobs (optional, defaults to false)
---

Task description for the agent to execute.
```

**With notification:**
```markdown
---
name: Daily Summary
description: Sends a daily summary of activity
agent: pickle
schedule: "0 9 * * *"
---

Check my inbox and use post_message to send me a summary.
```

**One-off reminder:**
```markdown
---
name: Meeting Reminder
description: Reminder for tomorrow's meeting
agent: pickle
schedule: "30 14 21 3 *"
one_off: true
---

Use post_message to remind me about the team meeting in 15 minutes.
```
