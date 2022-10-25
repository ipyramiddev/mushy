import { ActiveOffer } from '../types';
export const IMAGE_KIT_ENDPOINT_URL = 'https://ik.imagekit.io/srjnqnjbpn9/';

export const isArweaveImage = (fullImageUrl: string) => fullImageUrl.includes('arweave');
export const isSolarianImage = (fullImageUrl: string) => fullImageUrl.includes('solarian');
export const isBitboatImage = (fullImageUrl: string) => fullImageUrl.includes('bitboat');
export const isSolamanderImage = (fullImageUrl: string) => fullImageUrl.includes('cloudfront');
export const isIPFS = (fullImageUrl: string) => fullImageUrl.includes('ipfs');
export const isPeepsImage = (fullImagUrl: string) => fullImagUrl.includes('thepeeps');
export const isImageInCache = (fullImageUrl: string) => isArweaveImage(fullImageUrl)
    || isSolarianImage(fullImageUrl)
    || isBitboatImage(fullImageUrl)
    || isIPFS(fullImageUrl)
    || isSolamanderImage(fullImageUrl)
    && !isPeepsImage(fullImageUrl);

// For the URL = https://solarians.click/render/<hash>>
// this fn will return <hash>, and then connect to the preset base url in ImageKit dashboard
export const getImagePath = (fullImageUrl: string): string => {
    // const [mint, ...rest] = fullImageUrl.split('/').reverse();
    const url = new URL(fullImageUrl);
    const pathParts = url.pathname.split('/');
    let path;
    if( url.pathname.includes('/ipfs/') ) { 
        const newPath = pathParts.filter(e => e !== 'ipfs')
        path = newPath.join('/');
     } else if( url.pathname.includes('/assets/') ) {
        const newPath = pathParts.filter(e => e !== 'assets')
        path = newPath.join('/');
     } else if( url.pathname.includes('/render/captain/') ) {
        const newPath = pathParts.filter(e => e !== 'render').filter(e => e !== 'captain')
        path = newPath.join('/');
     } else if( url.pathname.includes('/render/') ) {
        const newPath = pathParts.filter(e => e !== 'render')
        path = newPath.join('/');
     } else { 
        path = url.pathname;
     }
    
    
    if (isImageInCache(fullImageUrl)) {
        return path;
    } else {
        return fullImageUrl;
    }
}
