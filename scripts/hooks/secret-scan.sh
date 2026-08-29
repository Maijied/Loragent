#!/bin/bash
if echo "$AGENT_OUTPUT" | grep -qE '(sk-[a-zA-Z0-9]{40,}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36})' 2>/dev/null; then
  echo 'SECRET_DETECTED'
  exit 1
fi
exit 0
