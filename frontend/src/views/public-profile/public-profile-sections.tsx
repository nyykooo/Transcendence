import { PublicProfileInfoPanel } from './public-profile-components';
import type { PublicProfileInfoSectionProps } from '../../props/profile/sectionProps';

export function PublicProfileAvatarSection({
    user,
}: PublicProfileInfoSectionProps) {
    return (
        <PublicProfileInfoPanel
            user={user}
        />
    );
}