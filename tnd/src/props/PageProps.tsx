import { paths } from '../configs/routes';

export type PageProps = {
    route: keyof typeof paths;
    label: string;
}