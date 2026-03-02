import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { paths } from '../configs/routes';

type PageProps = {
    route: keyof typeof paths;
    label: string;
}

export default function Page({ route, label }: PageProps) {
    return (
        <Link component={RouterLink} to={paths[route]}>
            {label}
        </Link>
    );
}
