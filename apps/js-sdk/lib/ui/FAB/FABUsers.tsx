import { getContrastColor } from 'utils/color';
import UsersStorage from 'storage/UsersStorage';
import { resolve, TYPE } from 'di';
import styled from 'ui/styled';
import { User } from '@packages/api';
import FABToggle from 'ui/FAB/FABToggle';
import EditMyInfo from 'ui/FAB/EditMyInfo';
import UserProfile from 'ui/FAB/UserProfile';
import { getUrlWithoutHost, parseUserPath } from 'utils/userPath';
import { timeAgo } from 'utils/timeAgo';

export default function FABUsers() {
  const users = UsersStorage.usersSignal.value;
  const getMyInfoStorage = resolve(TYPE.MY_INFO_STORAGE);

  return (
    <Container id="kitchen-table-fab-users">
      {Array.from(users.values()).map((user) => {
        const isMe = getMyInfoStorage().isMyId(user.id);
        const isBackground = user.isBackground;
        const suffix = isMe ? ' (You)' : isBackground ? ' (Idle)' : '';
        return (
          <UserWrapper
            key={user.id}
            aria-label={`${user.name}${suffix}\n${timeAgo(
              new Date(user.createdAt),
            )}\n${getUrlWithoutHost(parseUserPath(user.path))}`}
            data-microtip-position="left"
            role="tooltip"
            id={`kitchen-table-fab-user-profile-${user.id}`}
            isBackground={isBackground}
          >
            <UserIcon href={user.path} target="_self" color={user.color} style="cursor: pointer">
              {user.name[0].toUpperCase()}
            </UserIcon>
          </UserWrapper>
        );
      })}
    </Container>
  );
}

const ellipsis = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length).trim() + '...' : text;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const UserWrapper = styled.div<{ isBackground: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px ${({ isBackground }) => (isBackground ? 'dashed' : 'solid')} #3d3939;

  width: 32px;
  height: 30px;
  border-radius: 8px;

  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const UserIcon = styled.a<{ color: User['color'] }>`
  text-decoration: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ color }) => color};
  color: ${({ color }) => getContrastColor(color)};
  border-radius: 6px;
  width: 100%;
  height: 100%;
`;
