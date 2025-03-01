/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createContext, ReactElement, useContext, useLayoutEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import BookmarkTab from "./BookmarkTab";
import ContextMenu from "./ContextMenu";
import HistoryTab from "./HistoryTab";
import LoadingScreen from "./LoadingScreen";
import LocationsTab from "./LocationsTab";
import Reader from "./Reader";
import Settings from "./Settings";

interface IMainContext {
    showContextMenu: (data: IContextMenuData) => void;
    isContextMenuOpen: boolean;
}
export const MainContext = createContext<IMainContext>(null!);

const Main = (): ReactElement => {
    const { appSettings, isReaderOpen, linkInReader, setAppSettings } = useContext(AppContext);
    const [currentLink, setCurrentLink] = useState(appSettings.baseDir);
    // const [bookmarkTabDisplay, setBookmarkTabDisplay] = useState(true);
    // const [historyTabDisplay, setHistoryTabDisplay] = useState(true);
    const [isContextMenuOpen, setContextMenuOpen] = useState(false);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [contextMenuData, setContextMenuData] = useState<IContextMenuData | null>(null);
    // const bookmarkTabRef = useRef<HTMLDivElement>(null);
    // const historyTabRef = useRef<HTMLDivElement>(null);
    // const locationTabRef = useRef<HTMLDivElement>(null);
    // const tabContRef = useRef<HTMLDivElement>(null);
    // const [gridTemplate, setGridTemplate] = useState<string>("");
    // const [dividerWidth, setDividerWidth] = useState<number>(0);
    const showContextMenu = (data: IContextMenuData) => {
        setContextMenuData(data);
        setContextMenuOpen(true);
    };
    const closeContextMenu = () => {
        setContextMenuData(null);
        setContextMenuOpen(false);
    };
    useLayoutEffect(() => {
        document.addEventListener("wheel", () => closeContextMenu());

        // if (tabContRef.current) {
        //     setDividerWidth(
        //         parseInt(window.getComputedStyle(tabContRef.current).getPropertyValue("--divider-width"))
        //     );
        // }
    }, []);
    useLayoutEffect(() => setCurrentLink(appSettings.baseDir), [appSettings.baseDir]);

    //! did i really wasted time on this
    //
    //
    // const toggleTab = (whichTab: "bookmark" | "history") => {
    //     const gridTemplate = window.getComputedStyle(tabContRef.current!).gridTemplateColumns;
    //     let init1 = parseFloat(gridTemplate.split(" ")[0]);
    //     let init2 = parseFloat(gridTemplate.split(" ")[2]);
    //     let init3 = parseFloat(gridTemplate.split(" ")[4]);
    //     const maxWidth =
    //         (tabContRef.current!.offsetWidth - 2 * dividerWidth) / (+!!bookmarkTabDisplay + +!!historyTabDisplay);
    //     const speed = 30 / (+!!bookmarkTabDisplay + +!!historyTabDisplay);
    //     let displayState;
    //     let elem: HTMLDivElement;
    //     let setDisplayState: (value: React.SetStateAction<boolean>) => void;
    //     let returnAfter = false;
    //     if (whichTab === "bookmark") displayState = bookmarkTabDisplay;
    //     if (whichTab === "history") displayState = historyTabDisplay;
    //     if (whichTab === "bookmark") setDisplayState = setBookmarkTabDisplay;
    //     if (whichTab === "history") setDisplayState = setHistoryTabDisplay;
    //     if (whichTab === "bookmark") elem = bookmarkTabRef.current!;
    //     if (whichTab === "history") elem = historyTabRef.current!;
    //     if (displayState) {
    //         const animate = () => {
    //             if (init1 < maxWidth) init1 = init1 + speed > maxWidth ? maxWidth : init1 + speed;
    //             if (whichTab === "bookmark") {
    //                 if (init2 > 0) init2 = init2 - speed < 0 ? 0 : init2 - speed;
    //                 if (historyTabDisplay) {
    //                     if (init3 < maxWidth) init3 = init3 + speed >= maxWidth ? maxWidth : init3 + speed;
    //                     if (init2 <= 0 && init1 >= maxWidth && init3 >= maxWidth) {
    //                         setDisplayState(false);
    //                         returnAfter = true;
    //                     }
    //                 } else {
    //                     if (init2 <= 0 && init1 >= maxWidth) {
    //                         setDisplayState(false);
    //                         returnAfter = true;
    //                     }
    //                 }
    //             }
    //             if (whichTab === "history") {
    //                 if (init3 > 0) init3 = init3 - speed < 0 ? 0 : init3 - speed;
    //                 if (bookmarkTabDisplay) {
    //                     if (init2 < maxWidth) init2 = init2 + speed >= maxWidth ? maxWidth : init2 + speed;
    //                     if (init3 <= 0 && init1 >= maxWidth && init2 >= maxWidth) {
    //                         setDisplayState(false);
    //                         returnAfter = true;
    //                     }
    //                 } else {
    //                     if (init1 <= 0 && init1 >= maxWidth) {
    //                         setDisplayState(false);
    //                         returnAfter = true;
    //                     }
    //                 }
    //             }
    //             const gridtemp = `${init1}px ${dividerWidth}px ${init2}px ${dividerWidth}px ${init3}px`;
    //             tabContRef.current!.style.gridTemplateColumns = gridtemp;
    //             if (returnAfter) return;
    //             requestAnimationFrame(animate);
    //         };
    //         requestAnimationFrame(animate);
    //     } else {
    //         const animate = () => {
    //             if (init1 < maxWidth) init1 = init1 + speed > maxWidth ? maxWidth : init1 + speed;
    //             if (whichTab === "bookmark") {
    //                 if (init2 > 0) init2 = init2 - speed < 0 ? 0 : init2 - speed;
    //                 if (historyTabDisplay) {
    //                     if (init3 < maxWidth) init3 = init3 + speed > maxWidth ? maxWidth : init3 + speed;
    //                     if (init2 <= 0 && init1 >= maxWidth && init3 >= maxWidth) {
    //                         setDisplayState(true);
    //                         return;
    //                     }
    //                 } else {
    //                     if (init2 <= 0 && init1 >= maxWidth) {
    //                         setDisplayState(true);
    //                         return;
    //                     }
    //                 }
    //             }
    //             if (whichTab === "history") {
    //                 if (init3 > 0) init3 = init3 - speed < 0 ? 0 : init3 - speed;
    //                 if (bookmarkTabDisplay) {
    //                     if (init2 < maxWidth) init2 = init2 + speed > maxWidth ? maxWidth : init2 + speed;
    //                     if (init3 <= 0 && init1 >= maxWidth && init2 >= maxWidth) {
    //                         setDisplayState(true);
    //                         return;
    //                     }
    //                 } else {
    //                     if (init1 <= 0 && init1 >= maxWidth) {
    //                         setDisplayState(true);
    //                         return;
    //                     }
    //                 }
    //             }
    //             const gridtemp = `${init1}px ${dividerWidth}px ${init2}px ${dividerWidth}px ${init3}px`;
    //             tabContRef.current!.style.gridTemplateColumns = gridtemp;
    //             requestAnimationFrame(animate);
    //         };
    //         requestAnimationFrame(animate);
    //     }
    // };
    //!i really didnt need this
    //!why did i do this
    //

    // const toggleTab = (whichTab?: "bookmark" | "history") => {
    //     const width1 = (tabContRef.current!.offsetWidth - 2 * dividerWidth) / 3;
    //     const width2 = (tabContRef.current!.offsetWidth - 2 * dividerWidth) / 2;
    //     const width3 = tabContRef.current!.offsetWidth - 2 * dividerWidth;
    //     const maxWidth =
    //         (tabContRef.current!.offsetWidth - 2 * dividerWidth) / (+!!bookmarkTabDisplay + +!!historyTabDisplay);
    //     const minWidth = bookmarkTabDisplay || historyTabDisplay ? width1 : width2;
    //     const speed = 150 / (+!!bookmarkTabDisplay + +!!historyTabDisplay);
    //     const speed2 = 150 / (1 + +!!bookmarkTabDisplay + +!!historyTabDisplay);
    //     let init1 =
    //         bookmarkTabDisplay && historyTabDisplay
    //             ? width1
    //             : bookmarkTabDisplay || historyTabDisplay
    //             ? width2
    //             : width3;
    //     let init2 = bookmarkTabDisplay ? (historyTabDisplay ? width1 : width2) : 0;
    //     let init3 = historyTabDisplay ? (bookmarkTabDisplay ? width1 : width2) : 0;
    //     let displayState;
    //     let elem: HTMLDivElement;
    //     let setDisplayState: (value: React.SetStateAction<boolean>) => void;
    //     if (whichTab === "bookmark") displayState = bookmarkTabDisplay;
    //     if (whichTab === "history") displayState = historyTabDisplay;
    //     if (whichTab === "bookmark") setDisplayState = setBookmarkTabDisplay;
    //     if (whichTab === "history") setDisplayState = setHistoryTabDisplay;
    //     if (whichTab === "bookmark") elem = bookmarkTabRef.current!;
    //     if (whichTab === "history") elem = historyTabRef.current!;
    //     if (elem!) {
    //         if (displayState) {
    //             const animate = () => {
    //                 if (whichTab === "bookmark") {
    //                     init2 = init2 - speed < 0 ? 0 : init2 - speed;
    //                     bookmarkTabRef.current!.style.flexBasis = init2 + "px";
    //                     init1 = init1 + speed > maxWidth ? maxWidth : init1 + speed;
    //                     locationTabRef.current!.style.flexBasis = init1 + "px";
    //                     if (historyTabDisplay) {
    //                         init3 = init3 + speed > maxWidth ? maxWidth : init3 + speed;
    //                         historyTabRef.current!.style.flexBasis = init3 + "px";
    //                         if (init2 <= 0 && init1 >= maxWidth && init3 >= maxWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             historyTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             setDisplayState(false);
    //                             return;
    //                         }
    //                     } else {
    //                         if (init2 <= 0 && init1 >= maxWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 1)";
    //                             setDisplayState(false);
    //                             return;
    //                         }
    //                     }
    //                 }
    //                 if (whichTab === "history") {
    //                     init3 = init3 - speed < 0 ? 0 : init3 - speed;
    //                     historyTabRef.current!.style.flexBasis = init3 + "px";
    //                     init1 = init1 + speed > maxWidth ? maxWidth : init1 + speed;
    //                     locationTabRef.current!.style.flexBasis = init1 + "px";
    //                     if (bookmarkTabDisplay) {
    //                         init2 = init2 + speed > maxWidth ? maxWidth : init2 + speed;
    //                         bookmarkTabRef.current!.style.flexBasis = init2 + "px";
    //                         if (init3 <= 0 && init1 >= maxWidth && init2 >= maxWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             bookmarkTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             setDisplayState(false);
    //                             return;
    //                         }
    //                     } else {
    //                         if (init3 <= 0 && init1 >= maxWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 1)";
    //                             setDisplayState(false);
    //                             return;
    //                         }
    //                     }
    //                 }
    //                 requestAnimationFrame(animate);
    //             };
    //             requestAnimationFrame(animate);
    //         } else {
    //             setDisplayState!(true);
    //             const animate = () => {
    //                 if (whichTab === "bookmark") {
    //                     init2 = init2 + speed2 > minWidth ? minWidth : init2 + speed2;
    //                     bookmarkTabRef.current!.style.flexBasis = init2 + "px";
    //                     init1 = init1 - speed2 < minWidth ? minWidth : init1 - speed2;
    //                     locationTabRef.current!.style.flexBasis = init1 + "px";
    //                     if (historyTabDisplay) {
    //                         init3 = init3 - speed2 < minWidth ? minWidth : init3 - speed2;
    //                         historyTabRef.current!.style.flexBasis = init3 + "px";
    //                         if (init2 >= minWidth && init1 >= minWidth && init3 >= minWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 3)";
    //                             historyTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 3)";
    //                             bookmarkTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 3)";
    //                             return;
    //                         }
    //                     } else {
    //                         if (init2 >= minWidth && init1 >= minWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             bookmarkTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             return;
    //                         }
    //                     }
    //                 }
    //                 if (whichTab === "history") {
    //                     init3 = init3 + speed2 > minWidth ? minWidth : init3 + speed2;
    //                     historyTabRef.current!.style.flexBasis = init3 + "px";
    //                     init1 = init1 - speed2 < minWidth ? minWidth : init1 - speed2;
    //                     locationTabRef.current!.style.flexBasis = init1 + "px";
    //                     if (bookmarkTabDisplay) {
    //                         init2 = init2 - speed2 < minWidth ? minWidth : init2 - speed2;
    //                         bookmarkTabRef.current!.style.flexBasis = init2 + "px";
    //                         if (init3 >= minWidth && init1 >= minWidth && init3 >= minWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 3)";
    //                             historyTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 3)";
    //                             bookmarkTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 3)";
    //                             return;
    //                         }
    //                     } else {
    //                         if (init3 >= minWidth && init1 >= minWidth) {
    //                             locationTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             historyTabRef.current!.style.flexBasis =
    //                                 "calc((100% - 2 * (var(--divider-width))) / 2)";
    //                             return;
    //                         }
    //                     }
    //                 }
    //                 requestAnimationFrame(animate);
    //             };
    //             requestAnimationFrame(animate);
    //         }
    //     }
    // };
    return (
        <MainContext.Provider value={{ showContextMenu, isContextMenuOpen }}>
            <div id="app">
                <div
                    className="tabCont"
                    // ref={tabContRef}
                    style={{
                        display: isReaderOpen ? "none" : "grid",
                        // just why
                        gridTemplateColumns:
                            appSettings.showTabs.bookmark && appSettings.showTabs.history
                                ? "calc(calc(100vw - calc(var(--divider-width) * 2)) / 3) var(--divider-width) calc(calc(100vw - calc(var(--divider-width) * 2)) / 3) var(--divider-width) calc(calc(100vw - calc(var(--divider-width) * 2)) / 3)"
                                : !appSettings.showTabs.bookmark && appSettings.showTabs.history
                                ? "calc(calc(100vw - calc(var(--divider-width) * 2)) / 2) var(--divider-width) var(--divider-width) calc(calc(100vw - calc(var(--divider-width) * 2)) / 2)"
                                : appSettings.showTabs.bookmark && !appSettings.showTabs.history
                                ? "calc(calc(100vw - calc(var(--divider-width) * 2)) / 2) var(--divider-width) calc(calc(100vw - calc(var(--divider-width) * 2)) / 2) var(--divider-width)"
                                : "calc(calc(100vw - calc(var(--divider-width) * 2))) var(--divider-width) var(--divider-width)",
                    }}
                >
                    <LocationsTab
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                        // ref={locationTabRef}
                    />
                    <div
                        className="divider"
                        onClick={() =>
                            setAppSettings((init) => {
                                init.showTabs.bookmark = !init.showTabs.bookmark;
                                return { ...init };
                            })
                        }
                    >
                        <div className="bar"></div>
                    </div>
                    <BookmarkTab
                    //  ref={bookmarkTabRef}
                    />
                    <div
                        className="divider"
                        onClick={() =>
                            setAppSettings((init) => {
                                init.showTabs.history = !init.showTabs.history;
                                return { ...init };
                            })
                        }
                    >
                        <div className="bar"></div>
                    </div>
                    <HistoryTab
                    // ref={historyTabRef}
                    />
                </div>
                <Settings />
                <LoadingScreen />
                {isContextMenuOpen ? (
                    contextMenuData ? (
                        <ContextMenu
                            {...contextMenuData}
                            closeContextMenu={closeContextMenu}
                            realRef={contextMenuRef}
                            ref={contextMenuRef}
                        />
                    ) : null
                ) : (
                    ""
                )}
                {linkInReader.link !== "" ? <Reader /> : ""}
            </div>
        </MainContext.Provider>
    );
};

export default Main;
