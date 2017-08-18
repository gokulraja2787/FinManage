/**
 * Holds CGI App details
 */

 import { AppModel } from './app-model';

export class CGIAppDetails extends AppModel {
    private appName: string;
    private appVersion: string;

    constructor(appName: string, appVersion: string) {
        super();
        this.appName = appName;
        this.appVersion = appVersion;
    }

    /**
     * getAppName
     */
    public getAppName(): string {
        return this.appName;
    }

    /**
     * getAppVersion
     */
    public getAppVersion(): string {
        return this.appVersion;
    }

    public toString(): string {
        return '[' + this.appName + ':' + this.appVersion + ']';
    }
}
