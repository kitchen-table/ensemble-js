import FABIcon from 'ui/FAB/FABIcon';
import { resolve, TYPE } from 'di';
import { BiExit } from 'react-icons/bi';

export default function FABLeave() {
  const getKitchenTable = resolve(TYPE.KITCHEN_TABLE);

  const confirmLeave = () => {
    if (confirm('Are you sure you want to leave?')) {
      getKitchenTable().cleanup();
    }
  };

  return (
    <FABIcon
      tabIndex={0}
      aria-label="Leave"
      role="tooltip"
      data-microtip-position="left"
      onClick={confirmLeave}
    >
      <BiExit size={20} color={'rgba(0,0,0,0.8)'} />
    </FABIcon>
  );
}
