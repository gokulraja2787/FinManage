/**
 * Holds CGI App details
 */
export class CGIAppDetails {
    private appName: string;
    private appVersion: string;

    constructor(appName: string, appVersion: string) {
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
