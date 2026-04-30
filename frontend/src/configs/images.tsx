// base URL for public assets; in a Vite/React app files placed under `public`
// are served from the root of the site, so we can reference them with
// an absolute path starting at `/assets`.
const assetsPath = "/assets";

export const images = {
    icons: {
        logo: `${assetsPath}/image/icons/brunchio_logo.png`,
        settings: `${assetsPath}/image/icons/setting_icon.png`,
        search: `${assetsPath}/image/icons/search.png`,
        trash: `${assetsPath}/image/icons/trash.png`
    },
};
