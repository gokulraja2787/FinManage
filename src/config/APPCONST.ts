/**
 * Application constants
 */
const VERSION = '0.0.1';

export const MYAPPCONFIG = {
    appName: 'FinManage',
    appVer: VERSION,
    appTitle: 'Simple Finance Manager'
}

export class APPCONST {

    /**
     * name
     */
    public getAppName() {
        return MYAPPCONFIG.appName;
    }
}