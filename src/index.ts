import { ChildProcess } from 'child_process';
import { red, green } from 'colo';
import * as setBlocking from 'set-blocking';
import { Reporter as IReporter, Test, TestResult } from 'beater-reporter';
import { console } from './console';

const v = '\u2713'; // U+2713 CHECK MARK
const x = '\u2717'; // U+2717 BALLOT X

export default class Reporter implements IReporter {
  constructor() {
    // FIXME: workaround for https://github.com/nodejs/node/pull/6773
    setBlocking(true);
  }

  started(): void {
    // do nothing
  }

  finished(results: TestResult[]): void {
    const passed = results.filter(({ error }) => !!!error);
    const failed = results.filter(({ error }) => !!error);

    failed.forEach(({ test, error: { name, message } }) => {
      console.log(`${red(x + ' failure: ')}${test.name}`);
      console.log(`${name}: ${message}`);
    });

    const summary = failed.length > 0
      ? red(x + ` ${failed.length} of ${results.length} tests failed`)
      : green(v + ` ${results.length} tests passed`);
    console.log(summary);
  }

  testStarted(_: Test): void {
    // do nothing
  }

  testFinished(result: TestResult): void {
    if (!!result.error) return;
    console.log(`${green(v + ' success: ')}${result.test.name}`);
  }
}
