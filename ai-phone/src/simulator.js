import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { CallSession } from "./callSession.js";

const rl = readline.createInterface({ input, output });
const session = new CallSession();

console.log(`Assistant: ${session.start()}`);
console.log("Type caller messages. Type 'exit' to finish.\n");

while (!session.closed) {
  const callerText = await rl.question("Caller: ");

  if (callerText.trim().toLowerCase() === "exit") {
    break;
  }

  console.log(`Assistant: ${session.receive(callerText)}\n`);
}

console.log("\nInternal call summary:");
console.log(session.formatSummary());

rl.close();
