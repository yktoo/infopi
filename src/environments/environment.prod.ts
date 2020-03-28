import { configuration } from './config';

export const environment = {
    production:    true,
    // No CORS proxy, we're disabling CORS enforcement in Electron
    corsProxy:     '',
    configuration,
};
