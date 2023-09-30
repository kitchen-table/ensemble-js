import { css } from '@emotion/css';
import { getContrastColor } from 'utils/color';
import UsersStorage from 'storage/UsersStorage';

export default function FABUsers() {
  const users = UsersStorage.usersSignal.value;

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
        return (
          <div
            key={user.id}
            style="cursor: pointer"
            className={css`
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: ${user.color};
              border: 2px solid #3d3939;
              color: ${getContrastColor(user.color)};
              width: 32px;
              height: 30px;
              border-radius: 8px;

              &:hover {
                transform: scale(1.03);
                transition: transform 0.2s;
              }
            `}
          >
            {user.name[0].toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
