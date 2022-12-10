enum LogLevels {
    NONE,
    INFO,
    ERROR,
    ALL
}

class Logger {
    static logLevel = LogLevels.ALL;
    static LogLevels = LogLevels;


    // @ts-ignore
    static info(message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel === LogLevels.INFO || Logger.logLevel == LogLevels.ALL)
            console.info.apply(this, arguments as any);
    }

    // @ts-ignore
    static error(message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel === LogLevels.ERROR || Logger.logLevel == LogLevels.ALL)
            console.error.apply(this, arguments as any);
    }

    // @ts-ignore
    static log(message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel === LogLevels.ALL)
            console.log.apply(this, arguments as any);
    }

}

export default Logger;