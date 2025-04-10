export const lockScrollToElement = (element) => {
    if (element) {
        element.style.overflowY = "auto";
        element.style.maxHeight = "100vh";
    }
    document.body.style.overflow = "hidden";
};

export const unlockScrollFromElement = (element) => {
    if (element) {
        element.style.overflowY = "";
        element.style.maxHeight = "";
    }
    document.body.style.overflow = "";
};
