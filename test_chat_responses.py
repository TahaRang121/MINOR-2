#!/usr/bin/env python3
"""
Quick test script to verify the dynamic chat responses work correctly.
This simulates different user inputs and shows that responses are context-aware.
"""

import sys
sys.path.insert(0, 'backend')

from app.config import Settings
from app.services.ai import AIAnalysisService

# Initialize service
settings = Settings()
ai_service = AIAnalysisService(settings)

# Sample context with events
context_with_events = """Event: Energy Supply Disruption
Title: Oil Prices Spike
Summary: A major supply disruption is affecting fuel markets. Energy producers benefit from higher prices while airlines face pressure.
Predictions: Oil & Gas rise (84%): Supply constraints lift prices; Airlines fall (76%): Fuel costs pressure margins; Transport fall (70%): Higher operating costs"""

context_empty = ""

# Test cases
test_cases = [
    ("Hello", context_with_events, "Should give greeting response"),
    ("What about oil prices?", context_with_events, "Should discuss energy markets"),
    ("How are supply chains affected?", context_with_events, "Should analyze supply chain impacts"),
    ("Which sectors will be impacted?", context_with_events, "Should discuss sector impacts"),
    ("What predictions do we have?", context_with_events, "Should explain predictions"),
    ("Hi there!", context_with_events, "Should give greeting response"),
    ("Hello", context_empty, "Should offer to fetch news first"),
]

print("=" * 80)
print("CHATBOT DYNAMIC RESPONSE TEST")
print("=" * 80)
print()

for i, (message, context, expectation) in enumerate(test_cases, 1):
    print(f"TEST {i}: {expectation}")
    print(f"Input: '{message}'")
    print(f"Context: {'[WITH EVENTS]' if context else '[EMPTY]'}")
    print("-" * 80)
    
    response = ai_service._demo_chat(message, context)
    
    # Truncate response for display
    display_response = response[:200] + "..." if len(response) > 200 else response
    print(f"Response: {display_response}")
    print()

print("=" * 80)
print("✅ TEST COMPLETE - Responses should be different for each input!")
print("=" * 80)
