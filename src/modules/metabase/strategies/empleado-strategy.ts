import { MetabaseStrategy } from './metabase-strategy';

export class EmpleadoStrategy implements MetabaseStrategy {
  generatePayloard(userId: string) {
    const payload = {
      resource: { dashboard: 12 },
      params: {
        id: userId,
      },
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    return payload;
  }
}
