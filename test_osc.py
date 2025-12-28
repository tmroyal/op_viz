#!/usr/bin/env python3
"""
Temporary OSC test sender - sends random OSC messages to visualizer
"""

import time
import random
from pythonosc import udp_client

OSC_IP = "127.0.0.1"
OSC_PORT = 9000

client = udp_client.SimpleUDPClient(OSC_IP, OSC_PORT)

print("=" * 50)
print("OSC Random Message Sender")
print("=" * 50)
print(f"Sending to: {OSC_IP}:{OSC_PORT}")
print("Press Ctrl+C to stop")
print("=" * 50)
print()

try:
    counter = 0
    while True:
        num_pitches = random.randint(1, 6)
        pitches = random.sample(range(12), num_pitches)
        pitches.sort()

        client.send_message("/pitches", pitches)

        counter += 1
        print(f"[{counter:4d}] /pitches {pitches}")

        delay = random.uniform(0.5, 2.0)
        time.sleep(delay)

except KeyboardInterrupt:
    print("\n" + "=" * 50)
    print(f"Sent {counter} messages. Goodbye!")
    print("=" * 50)
