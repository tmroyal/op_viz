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

osc_addresses = [
    "/synth/freq",
    "/synth/amp",
    "/effect/reverb",
    "/effect/delay",
    "/control/pan",
    "/control/volume",
    "/sequencer/step",
    "/trigger/note",
    "/filter/cutoff",
    "/filter/resonance",
    "/lfo/rate",
    "/envelope/attack",
    "/envelope/decay",
    "/modulation/depth",
    "/harmony/chord",
]

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
        address = random.choice(osc_addresses)

        num_args = random.randint(1, 4)
        args = []

        for _ in range(num_args):
            arg_type = random.choice(['float', 'int', 'string'])

            if arg_type == 'float':
                args.append(random.uniform(0.0, 1.0))
            elif arg_type == 'int':
                args.append(random.randint(0, 127))
            else:
                args.append(random.choice(['on', 'off', 'trigger', 'gate']))

        client.send_message(address, args)

        counter += 1
        print(f"[{counter:4d}] {address:25s} {args}")

        delay = random.uniform(0.05, 0.3)
        time.sleep(delay)

except KeyboardInterrupt:
    print("\n" + "=" * 50)
    print(f"Sent {counter} messages. Goodbye!")
    print("=" * 50)
