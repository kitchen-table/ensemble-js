import FABToggle from 'ui/FAB/FABToggle';
import FABIcon from 'ui/FAB/FABIcon';
import { BiCog } from 'react-icons/bi';
import { resolve, TYPE } from 'di';
import styled from 'ui/styled';
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
  const showMessage = getUiState().getShowMessage();

  const toggleShowCursor = (checked: boolean) => {
    getUiState().setShowCursor(checked);
  };

  const toggleShowMessage = (checked: boolean) => {
    getUiState().setShowMessage(checked);
  };

  return (
    <UserSettingContainer>
      <label>
        <Switch checked={showCursor} onCheckedChange={toggleShowCursor} />
        <span>Show Cursor</span>
      </label>
      <label>
        <Switch checked={showMessage} onCheckedChange={toggleShowMessage} />
        <span>Show Message</span>
      </label>
    </UserSettingContainer>
  );
}

const UserSettingContainer = styled.div`
  width: 200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;

  > label {
    display: flex;
    align-items: center;
    gap: 8px;

    cursor: pointer;
    font-size: 14px;
    user-select: none;
  }
`;
