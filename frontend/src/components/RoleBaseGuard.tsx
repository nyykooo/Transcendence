import { type RoleBaseGuardProps } from '../props/RoleBaseGuardProps';

export default function RoleBaseGuard({ role, children, protection }: RoleBaseGuardProps)
{
    if (role === 'admin')
    {
        return <>{children}</>;
    }
    
    return <>{protection}</>;
}