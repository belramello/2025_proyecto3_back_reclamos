import { MetabaseStrategy } from './metabase-strategy';

export class AdministradorStrategy implements MetabaseStrategy {
  generatePayloard(userId: string) {
    const payload = {
      resource: { dashboard: 10 },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60,
    };
    return payload;
  }
}
