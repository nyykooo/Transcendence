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
    carousel: 
        [
            {
                src: `${assetsPath}/image/carousel/carousel_1.jpg`,
                alt: 'Carousel Picture 1'
            },
            {
                src: `${assetsPath}/image/carousel/carousel_2.jpg`,
                alt: 'Carousel Picture 2'
            },
            {
                src: `${assetsPath}/image/carousel/carousel_3.jpg`,
                alt: 'Carousel Picture 3'
            },
            {
                src: `${assetsPath}/image/carousel/carousel_4.jpg`,
                alt: 'Carousel Picture 4'
            },
            {
                src: `${assetsPath}/image/carousel/carousel_5.jpg`,
                alt: 'Carousel Picture 5'
            },
            {
                src: `${assetsPath}/image/carousel/carousel_6.jpg`,
                alt: 'Carousel Picture 6'
            },
            {
                src: `${assetsPath}/image/carousel/carousel_7.jpg`,
                alt: 'Carousel Picture 7'
            },
        ]
};
