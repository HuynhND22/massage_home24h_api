"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3001', 10) || 3001,
    database: {
        url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/spa',
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? 'fallback_secret_key_not_for_production',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    },
    r2: {
        endpoint: process.env.R2_ENDPOINT ?? '',
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
        bucketName: process.env.R2_BUCKET_NAME ?? 'spa-assets',
        publicUrl: process.env.R2_PUBLIC_URL ?? 'https://example.com/assets',
    },
    apiPrefix: process.env.API_PREFIX ?? 'api',
});
//# sourceMappingURL=configuration.js.map