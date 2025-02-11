import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export class HelperSevice {
  writeToTerminal(text: string) {
    process.stdout.write(`\nAssistant: ${text}\n\n`);
  }

  async getUserInput() {
    let userInput = await terminal.question('You: ');
    while (!userInput.trim()) {
      this.writeToTerminal('Cannot process empty value');
      userInput = await terminal.question('You: ');
    }

    if (userInput === 'END') process.exit(0);

    return userInput;
  }
}
