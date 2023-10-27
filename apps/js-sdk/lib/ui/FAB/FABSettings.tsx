import FABToggle from 'ui/FAB/FABToggle';
import FABIcon from 'ui/FAB/FABIcon';
import { BiCog } from 'react-icons/bi';
import { resolve, TYPE } from 'di';
import styled from 'ui/styled';
import { ComponentChildren } from 'preact';
import Switch from 'ui/FAB/Switch';

export default function FABSettings() {
  return (
    <FABToggle
      icon={
        <FABIcon tabIndex={0} aria-label="Config" role="tooltip" data-microtip-position="left">
          <BiCog size={20} color={'rgba(0,0,0,0.8)'} />
        </FABIcon>
      }
    >
      <UserSetting />
    </FABToggle>
  );
}

function UserSetting() {
  const getUiState = resolve(TYPE.UI_STATE_STORAGE);
  const showCursor = getUiState().getShowCursor();
  const toggleShowCursor = (checked: boolean) => {
    getUiState().setShowCursor(checked);
  };

  return (
    <UserSettingContainer>
      <Switch checked={showCursor} onCheckedChange={toggleShowCursor}>
        Show Cursor
      </Switch>
    </UserSettingContainer>
  );
}

const UserSettingContainer = styled.div`
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;
