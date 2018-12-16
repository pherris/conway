module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "src/**/*.ts" // *.tsx for React Jsx
        ],
        include: "**/*_spec.ts",
        preprocessors: {
            "**/*.ts": "karma-typescript" // *.tsx for React Jsx
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["ChromeHeadless"],
        logLevel: config.LOG_INFO,
        karmaTypescriptConfig: {
            compilerOptions: {
                target: "esnext"
            }
        },
        autoWatch: true,
        singleRun: false,
    });
};
