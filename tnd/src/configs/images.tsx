// base URL for public assets; in a Vite/React app files placed under `public`
// are served from the root of the site, so we can reference them with
// an absolute path starting at `/assets`.
const assetsPath = "/public/assets";

export const images = {
    icons: {
        logo: `${assetsPath}/image/icons/brunchio_logo.png`,
        settings: `${assetsPath}/image/icons/setting_icon.png`,
    },

    // carousel images live directly on the `images` key – there was no need to
    // nest another `images` object since it was never referenced elsewhere.
    carousel: {
        image1: `${assetsPath}/image/carousel/carousel_1.jpg`,
        image2: `${assetsPath}/image/carousel/carousel_2.jpg`,
        image3: `${assetsPath}/image/carousel/carousel_3.jpg`,
    },
};
