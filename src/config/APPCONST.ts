/**
 * Application constants
 */
const VERSION = '0.0.1';

export const MYAPPCONFIG = {
    appName: 'FinManage',
    appVer: VERSION,
    appTitle: 'Simple Finance Manager',
    baseUrl: 'http://localhost:4301/'
}

export class APPCONST {

    /**
     * name
     */
    public getAppName() {
        return MYAPPCONFIG.appName;
    }
}