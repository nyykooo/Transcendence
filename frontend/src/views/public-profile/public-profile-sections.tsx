import { PublicProfileAvatarPanel } from './public-profile-components';
import type { PublicProfileAvatarSectionProps } from '../../props/profile/sectionProps';

export function PublicProfileAvatarSection({
    user,
}: PublicProfileAvatarSectionProps) {
    return (
        <PublicProfileAvatarPanel
            user={user}
        />
    );
}