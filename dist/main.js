"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const app_middleware_1 = require("./app.middleware");
const chalk_1 = require("chalk");
const util_1 = require("util");
const os_1 = require("os");
const cors_1 = require("./@config/cors");
const env_1 = require("./@utils/env");
const mail_1 = require("./@utils/mail");
const db = require("./@utils/db");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = env_1.default.port || 3000;
    app.enableCors(cors_1.CorsConfig);
    app.use(app_middleware_1.AppMiddleware);
    app.enableVersioning({
        type: common_1.VersioningType.HEADER,
        header: 'X-Api-Version'
    });
    (0, mail_1.setEmailApiKey)();
    await app.listen(port);
    if (env_1.default.nodeEnv !== 'production') {
        const msg = (0, util_1.format)('\nServer is running at %s\n', (0, chalk_1.cyanBright)(`http://${(0, os_1.hostname)()}:${port}`));
        process.stdout.write(msg);
    }
}
db
    .connect()
    .finally(bootstrap);
process.on('SIGINT', async () => {
    await db.disconnect();
    process.exit(0);
});
