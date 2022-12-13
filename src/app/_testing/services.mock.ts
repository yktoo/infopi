import { ConfigService } from '../_services/config.service';
import { InfoPiConfig } from '../_models/info-pi-config';

export const getConfigServiceMock = (mockProperties?: Partial<InfoPiConfig>): ConfigService => ({
    configuration: (mockProperties || {}) as InfoPiConfig,
    corsProxy: 'PROXY:',
});
