import fs from "fs";
import path from "path";
import IS_PORTABLE from "./IS_PORTABLE";
import { spawn, spawnSync } from "child_process";
import { app, BrowserWindow, dialog } from "electron";
import fetch from "electron-fetch";
import crossZip from "cross-zip";
import logger from "electron-log";
import { download, File } from "electron-dl";
/**
 * prevent deletion of these files in "Portable" version of app on installing new update.
 * add new settings/store file to this.
 */
const fileToKeep = [
    "bookmarks.json",
    "history.json",
    "settings.json",
    "themes.json",
    "shortcuts.json",
    "logs",
    "main.log",
    "renderer.log",
];

const downloadLink = "https://github.com/mienaiyami/yomikiru/releases/download/v";
/**
 *
 * @param windowId id of window in which message box should be shown
 * @param promptAfterCheck (false by default) Show message box if current version is same as latest version.
 */
const checkForUpdate = async (windowId: number, skipMinor = false, promptAfterCheck = false) => {
    const rawdata = await fetch("https://raw.githubusercontent.com/mienaiyami/yomikiru/master/package.json").then(
        (data) => data.json()
    );
    const latestVersion: number[] = await rawdata.version.split(".").map((e: string) => parseInt(e));
    logger.log("checking for update...");
    const currentAppVersion = app
        .getVersion()
        .split(".")
        .map((e) => parseInt(e));
    logger.log("Latest version ", latestVersion.join("."));
    logger.log("Current version ", currentAppVersion.join("."));
    if (skipMinor) {
        if (latestVersion[0] === currentAppVersion[0] && latestVersion[1] === currentAppVersion[1]) {
            logger.log("Minor update available, skipping update.");
            return;
        }
    }
    if (
        latestVersion[0] > currentAppVersion[0] ||
        (latestVersion[0] === currentAppVersion[0] && latestVersion[1] > currentAppVersion[1]) ||
        (latestVersion[0] === currentAppVersion[0] &&
            latestVersion[1] === currentAppVersion[1] &&
            latestVersion[2] > currentAppVersion[2])
    ) {
        dialog
            .showMessageBox(BrowserWindow.fromId(windowId ?? 1)!, {
                type: "info",
                title: "New Version Available",
                message:
                    `Current Version : ${currentAppVersion.join(".")}\n` +
                    `Latest Version   : ${latestVersion.join(".")}` +
                    (latestVersion[0] === currentAppVersion[0] && latestVersion[1] === currentAppVersion[1]
                        ? `\n\nTo skip check for minor updates, enable "skip minor update" in settings`
                        : ""),
                buttons: ["Download Now", "Download and show Changelog", "Show Changelog", "Download Later"],
                cancelId: 3,
            })
            .then((response) => {
                if (response.response === 0) downloadUpdates(latestVersion.join("."), windowId);
                if (response.response === 1) {
                    downloadUpdates(latestVersion.join("."), windowId);
                    // shell.openExternal("https://github.com/mienaiyami/yomikiru/releases");

                    const newWindow = new BrowserWindow({
                        width: 1200,
                        height: 800,
                        minWidth: 940,
                        minHeight: 560,
                        backgroundColor: "#272727",
                    });
                    newWindow.loadURL("https://github.com/mienaiyami/yomikiru/releases");
                    newWindow.setMenuBarVisibility(false);
                }
                if (response.response === 2) {
                    const newWindow = new BrowserWindow({
                        width: 1200,
                        height: 800,
                        minWidth: 940,
                        minHeight: 560,
                        backgroundColor: "#272727",
                    });
                    newWindow.loadURL("https://github.com/mienaiyami/yomikiru/releases");
                    newWindow.setMenuBarVisibility(false);
                }
            });
        return;
    }
    logger.log("Running latest version.");
    if (promptAfterCheck) {
        dialog.showMessageBox(BrowserWindow.fromId(windowId ?? 1)!, {
            type: "info",
            title: "Yomikiru",
            message: "Running latest version",
            buttons: [],
        });
    }
};
/**
 *
 * @param latestVersion latest version ex. "2.3.8"
 * @param windowId id of window in which message box should be shown
 */
const downloadUpdates = (latestVersion: string, windowId: number) => {
    const tempPath = path.join(app.getPath("temp"), "manga reader updates " + new Date().toDateString());
    if (fs.existsSync(tempPath)) spawnSync("powershell.exe", [`rm "${tempPath}" -r -force`]);
    fs.mkdirSync(tempPath);
    const promptInstall = () => {
        dialog
            .showMessageBox(BrowserWindow.fromId(windowId ?? 1)!, {
                type: "info",
                title: "Updates downloaded",
                message: "Updates downloaded.",
                buttons: ["Install Now"],
                cancelId: 1,
            })
            .then((res) => {
                if (res.response === 0) {
                    app.quit();
                }
            });
    };
    const downloadFile = (dl: string, callback: (file: File) => void) => {
        download(BrowserWindow.fromId(windowId ?? 1)!, dl, {
            directory: tempPath,
            onStarted: () => {
                logger.log("Downloading updates...");
                logger.log(dl, `"${tempPath}"`);
                // dialog.showMessageBox(BrowserWindow.fromId(windowId ?? 1)!, {
                //     message: "Download Started",
                //     type: "info",
                // });
            },
            onCancel: () => {
                logger.log("Download canceled.");
            },
            errorMessage: "Download error while downloading updates.",
            onCompleted: (file) => callback(file),
            showProgressBar: true,
        });
    };
    if (IS_PORTABLE) {
        const dl = downloadLink + latestVersion + "/" + `Manga.Reader-win32-${latestVersion}-Portable.zip`;
        const extractPath = path.join(tempPath, "updates");
        if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath);

        downloadFile(dl, (file) => {
            logger.log(`${file.filename} downloaded.`);
            crossZip.unzip(file.path, extractPath, (err) => {
                if (err) return logger.error(err);
                logger.log(`Successfully extracted at "${extractPath}"`);
                const appPath = path.join(app.getAppPath(), "../../");
                const appDirName = path.join(app.getPath("exe"), "../");
                app.on("before-quit", () => {
                    logger.log("Installing updates...");
                    logger.log(`Moving files to "${appPath}"`);
                    spawn(
                        "start",
                        [
                            `powershell.exe Start-Sleep -Seconds 5.0 ; Remove-Item -Recurse -Force '${appDirName}\\*' -Exclude ${fileToKeep.join(
                                ","
                            )} ; Write-Output 'Moving extracted files...' ; Move-Item -Path '${extractPath}\\*' -Destination '${appDirName}' ; ` +
                                `Write-Output 'Launching app' ; ;  explorer '${app.getPath("exe")}' ; ; `,
                        ],
                        { shell: true }
                    ).on("exit", process.exit);
                    logger.log("Quitting app...");
                });
                logger.log("Preparing to install updates...");
                promptInstall();
            });
        });
    } else {
        const dl = downloadLink + latestVersion + "/" + `Manga.Reader-${latestVersion}-Setup.exe`;
        downloadFile(dl, (file) => {
            logger.log(`${file.filename} downloaded.`);
            app.on("before-quit", () => {
                logger.log("Installing updates...");
                spawn("start", [`powershell.exe Start-Sleep -Seconds 5.0 ; Start-Process '${file.path}'`], {
                    shell: true,
                }).on("exit", process.exit);
                logger.log("Quitting app...");
            });
            logger.log("Preparing to install updates...");
            promptInstall();
        });
    }
};
export default checkForUpdate;
