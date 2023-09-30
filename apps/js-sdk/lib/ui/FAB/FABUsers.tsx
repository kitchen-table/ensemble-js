import { css } from '@emotion/css';
import { getContrastColor } from 'utils/color';
import UsersStorage from 'storage/UsersStorage';
import { resolve, TYPE } from 'di';

export default function FABUsers() {
  const users = UsersStorage.usersSignal.value;
  const getMyInfoStorage = resolve(TYPE.MY_INFO_STORAGE);

  return (
    <div
      id="kitchen-table-fab-users"
      className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      `}
    >
      {Array.from(users.values()).map((user) => {
        const isMe = user.id === getMyInfoStorage().get().id;
        return (
          <div
            key={user.id}
            id={`kitchen-table-fab-user-profile-${user.id}`}
            style="cursor: pointer"
            aria-description={user.name}
            className={css`
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              border-width: 2px;
              border-color: #3d3939;
              border-style: ${isMe ? 'solid' : 'dashed'};
              border-spacing: 1px;
              width: 32px;
              height: 30px;
              border-radius: 8px;

              &:hover {
                transform: scale(1.03);
                transition: transform 0.2s;
              }
            `}
          >
            <div
              className={css`
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: ${user.color};
                color: ${getContrastColor(user.color)};
                width: 100%;
                height: 100%;
              `}
            >
              {user.name[0].toUpperCase()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
