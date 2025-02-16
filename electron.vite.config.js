import { resolve } from "path";

export default {
    main: {
        build: {
            outDir: "dist/main",
            entry: "scr/main/main.js",
        },
    },
    preload: {
        build: {
            outDir: "dist/preload",
            rollupOptions: {
                input: "src/preload/preload.js",
                external: ["electron"],
            },
        },
    },
    renderer: {
        root: "src/renderer",
        build: {
            outDir: "dist/renderer",
            rollupOptions: {
                input: {
                    index: resolve(
                        __dirname,
                        "src/renderer/pages/index/index.html"
                    ),
                    settings: resolve(
                        __dirname,
                        "src/renderer/pages/settings/settings.html"
                    ),
                },
            },
        },
        css: {
            postcss: "./postcss.config.js",
        },
        resolve: {
            alias: {
                "@": "/src",
            },
        },
    },
};
