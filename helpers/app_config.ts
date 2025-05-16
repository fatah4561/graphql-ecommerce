import fs  from "fs"
import YAML from "yaml"

interface AppConfig {
    timezone: string;
    tokenExpiration: string;
}

function loadApConfig() {
    let cachedConfig: AppConfig | null = null;
    
    return (): AppConfig => {
        if (!cachedConfig) {
            const file = fs.readFileSync("./config.yml", "utf-8");
            cachedConfig = YAML.parse(file).app as AppConfig;
        }
        return cachedConfig;
    };
}

export const appConfig = loadApConfig();