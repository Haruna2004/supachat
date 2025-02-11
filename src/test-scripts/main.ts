import { HelperSevice } from "./libs/helpers";
import { Processor } from "./libs/processor";
import { getDefaultAgent } from "./agent";

const processor = new Processor();
const helpers = new HelperSevice();

async function main() {
  let userInput = await helpers.getUserInput();

  while (true) {
    await processor.handleInput(userInput);
    userInput = await helpers.getUserInput();
  }
}

main().catch((error) => console.log(error));
