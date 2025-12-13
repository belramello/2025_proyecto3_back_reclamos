import { MetabaseStrategy } from './metabase-strategy';

export class ClienteStrategy implements MetabaseStrategy {
  generatePayloard(userId: string) {
    const payload = {
      resource: { dashboard: 13 },
      params: {
        id: userId,
      },
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    return payload;
  }
}
