import { type PageProps } from '../props/PageProps';

export const pages: PageProps[] = [
    {
        route: 
        {
            path: '/recipe-list-view',
            name: 'Recipes List'
        },
        label: 'Recipes List' 
    },
    {
        route: 
        {
            path: '/admin',
            name: 'Admin Panel'
        },
        label: 'Admin Panel'
    },
    {
        route: 
        {
            path: '/profile',
            name: 'Profile'
        },
        label: 'Profile'
    },
    {
        route: 
        {
            path: '/file-management',
            name: 'File Management'
        },
        label: 'File Management'
    }
]