import { Game } from "./scripts/Game.js";
import { loadLocalStorage } from "./scripts/Utils.js";
import { Texture } from "./scripts/Texture.js";
import { BeatmapFile } from "./scripts/BeatmapFile.js";
import { urlParams } from "./scripts/GlobalVariables.js";
import { toggleSidePanel } from "./scripts/SidePanel.js";
import { openMenu } from "./scripts/Settings.js";

document.querySelector(".loading").style.opacity = 1;
document.querySelector("#loadingText").textContent = `Initializing`;

function setupDefaultStorage() {
    const settingsTemplate = {
        mirror: {
            val: "mino",
            custom: "",
        },
        mapping: {
            beatsnap: 4,
            offset: 0,
            showGreenLine: false,
        },
        background: {
            dim: 0.8,
            blur: 0,
        },
        volume: {
            master: 1,
            music: 0.5,
            hs: 0.2,
        },
        skinning: {
            type: "0",
            val: "-1",
        },
        sliderAppearance: {
            snaking: true,
            hitAnim: true,
            ignoreSkin: false,
        },
        timeline: {
            zoomRate: 200,
        },
    };

    if (!localStorage.getItem("settings")) {
        localStorage.setItem("settings", JSON.stringify(settingsTemplate));
    } else {
        const currentLocalStorage = JSON.parse(localStorage.getItem("settings"));
        Object.keys(settingsTemplate).forEach((k) => {
            if (currentLocalStorage[k] === undefined) currentLocalStorage[k] = settingsTemplate[k];

            Object.keys(settingsTemplate[k]).forEach((k2) => {
                if (currentLocalStorage[k][k2] === undefined) currentLocalStorage[k][k2] = settingsTemplate[k][k2];
            });
        });

        localStorage.setItem("settings", JSON.stringify(currentLocalStorage));
    }
}

(async () => {
    setupDefaultStorage();

    Game.MASTER_VOL = JSON.parse(localStorage.getItem("settings")).volume.master;
    Game.MUSIC_VOL = JSON.parse(localStorage.getItem("settings")).volume.music;
    Game.HS_VOL = JSON.parse(localStorage.getItem("settings")).volume.hs;
    Game.SLIDER_APPEARANCE = JSON.parse(localStorage.getItem("settings")).sliderAppearance;
    Game.SKINNING = JSON.parse(localStorage.getItem("settings")).skinning;
    Game.MAPPING = JSON.parse(localStorage.getItem("settings")).mapping;

    await loadLocalStorage();
    document.querySelector(".loading").style.opacity = 0;
    document.querySelector(".loading").style.display = "none";

    // Init
    Game.init();
    Texture.generateDefaultTextures();

    document.body.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "F6": {
                e.preventDefault();
                break;
            }
            case "F4": {
                e.preventDefault();
                break;
            }
            case "o": {
                e.preventDefault();
                break;
            }
        }
    });

    document.body.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "F6": {
                e.preventDefault();
                toggleSidePanel("timing");
                break;
            }
            case "F4": {
                e.preventDefault();
                toggleSidePanel("metadata");
                break;
            }
            case "o": {
                if (e.ctrlKey) {
                    e.preventDefault();
                    openMenu();
                }

                break;
            }
        }
    });

    if (urlParams.get("b") && /[0-9]+/g.test(urlParams.get("b"))) {
        Game.BEATMAP_FILE = new BeatmapFile(urlParams.get("b"));
        document.querySelector("#mapInput").value = urlParams.get("b");
    }
})();
