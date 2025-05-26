import fs  from "fs"
import YAML from "yaml"

interface AppConfig {
    app: {
        timezone: string
        tokenExpiration: string
    }
    payment: PaymentConfig
}

interface PaymentConfig {
    defaultGateway: string
}

function loadAppConfig() {
    let cachedConfig: AppConfig | null = null;
    
    return (): AppConfig => {
        if (!cachedConfig) {
            const file = fs.readFileSync("./config.yml", "utf-8");
            cachedConfig = YAML.parse(file) as AppConfig;
        }
        return cachedConfig;
    };
}

export const appConfig = loadAppConfig();