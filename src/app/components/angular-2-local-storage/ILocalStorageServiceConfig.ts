'use strict';

// Interfaces:
import INotifyOptions from './INotifyOptions';

interface ILocalStorageServiceConfig {
    // Properties:
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}

export default ILocalStorageServiceConfig;
