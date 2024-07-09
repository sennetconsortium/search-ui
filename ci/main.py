#!/usr/bin/env python
import json

from websockets.sync.client import connect
import datetime
from colorist import Color


def workflow_printer(message):
    result = json.loads(message)
    if is_complete(result):
        print(f"::notice::Tests complete")
        return
    test = result.get('report')
    if test is not None and test.get('reporter') == 'spec':
        print(f"::group::{test.get('spec').get('relative')}")  # group title
        stats = test.get('reporterStats', '')
        state = 'error' if stats.get('failures') > 0 else 'notice'
        print(f"::{state}::Tests: {stats.get('tests')} ; {Color.GREEN}Passes: {stats.get('passes')}{Color.OFF} ; {Color.RED}Fails: {stats.get('failures')}{Color.OFF}")
        for t in test.get('tests'):
            has_failed = t.get('state') != 'passed'
            state = 'error' if has_failed else 'notice'
            title = ' > '.join(t.get('title', ''))
            emoji = '❌  ' if has_failed else '✅  '
            color = Color.RED if has_failed else Color.GREEN
            print(f"::{state}::{color}{title}{color.OFF} {emoji}")
        print("::endgroup::")
    else:
        print(f"::notice::{Color.CYAN}{result.get('message')}{Color.OFF}")


def is_complete(result):
    report = result.get('report')
    if report is not None and type(report) is not str:
        return report.get('complete')
    else:
        return False


def main():
    with connect("wss://6721-2601-547-cc01-6200-5909-ee75-1d42-11a9.ngrok-free.app") as websocket:
        websocket.send(f"Requesting Cypress reports ... Date: {datetime.datetime.now()}. 🚀 ")
        receiving = True
        results = {}
        while receiving is True:
            message = websocket.recv()
            #print('received', message)
            result = json.loads(message)
            if is_complete(result):
                receiving = False
            else:
                workflow_printer(message)
            results.update(result)

        return json.dumps(results)


main()