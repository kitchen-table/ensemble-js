import { css } from '@emotion/css';
import Fab from 'ui/FAB/index';

export default function FABUsers() {
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
      {Fab.usersSignal.value.map((user) => {
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
              width: 32px;
              height: 30px;
              border-radius: 8px;
            `}
          >
            {user.name[0].toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
