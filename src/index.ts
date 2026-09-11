import { readConfig, setUser } from "./config.js";

function main() {
  setUser("Reece");
  const cfg = readConfig();
  console.log(cfg);
}

main();