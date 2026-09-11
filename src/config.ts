import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("ERROR: A 'db_url' is required in the .gatorconfig.json");
  }

  const cfg: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name ?? "",
  };

  return cfg;
}

export function setUser(user: string) {
  const cfg = readConfig();
  cfg.currentUserName = user;
  writeConfig(cfg);
}

function writeConfig(cfg: Config) {
  const configFilePath = getConfigFilePath();
  const configToSave = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(configFilePath, JSON.stringify(configToSave));
}

export function readConfig(): Config {
  const configFilePath = getConfigFilePath();
  const rawConfig = fs.readFileSync(configFilePath, {
    encoding: "utf-8",
  });

  let parsedConfig;

  try {
    parsedConfig = JSON.parse(rawConfig);
    return validateConfig(parsedConfig);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
