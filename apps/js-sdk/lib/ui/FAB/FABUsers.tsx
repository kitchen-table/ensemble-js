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
        const isBackground = user.isBackground;
        return (
          <div
            key={user.id}
            id={`kitchen-table-fab-user-profile-${user.id}`}
            aria-description={user.name}
            className={css`
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              border: 2px ${isBackground ? 'dashed' : 'solid'} #3d3939;

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
              style="cursor: pointer"
              className={css`
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: ${user.color};
                color: ${getContrastColor(user.color)};

                width: 100%;
                height: 100%;
                ::after {
                  position: absolute;
                  content: '';
                  width: 100%;
                  height: 100%;
                  backdrop-filter: grayscale(${isBackground ? 0.4 : 0});
                }
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
