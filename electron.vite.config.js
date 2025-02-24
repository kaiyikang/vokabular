import { resolve } from "path";

const sharedAliases = {
    "@": resolve(__dirname, "./src"),
    "@api": resolve(__dirname, "./src/api"),
    "@config": resolve(__dirname, "./src/config"),
    "@main": resolve(__dirname, "./src/main"),
    "@preload": resolve(__dirname, "./src/preload"),
    "@renderer": resolve(__dirname, "./src/renderer"),
    "@services": resolve(__dirname, "./src/services"),
    "@pages": resolve(__dirname, "./src/renderer/pages"),
    "@styles": resolve(__dirname, "./src/renderer/styles"),
};

export default {
    main: {
        build: {
            outDir: "dist/main",
            entry: "src/main/main.js",
            rollupOptions: {
                external: ["electron"],
            },
        },
        resolve: { alias: sharedAliases },
    },
    preload: {
        build: {
            outDir: "dist/preload",
            rollupOptions: {
                input: "src/preload/preload.js",
                external: ["electron"],
            },
        },
        resolve: { alias: sharedAliases },
    },
    renderer: {
        root: "src/renderer",
        build: {
            outDir: "dist/renderer",
            rollupOptions: {
                input: {
                    index: resolve(
                        __dirname,
                        "src/renderer/pages/index/index.html",
                    ),
                    settings: resolve(
                        __dirname,
                        "src/renderer/pages/settings/settings.html",
                    ),
                },
            },
        },
        css: {
            postcss: "./postcss.config.js",
        },
        resolve: {
            alias: sharedAliases,
        },
    },
};
