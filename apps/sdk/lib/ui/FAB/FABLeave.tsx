import FABIcon from 'ui/FAB/FABIcon';
import { resolve, TYPE } from 'di';
import { BiExit } from 'react-icons/bi';

export default function FABLeave() {
  const getEnsembleJS = resolve(TYPE.ENSEMBLE_JS);

  const confirmLeave = () => {
    if (confirm('Are you sure you want to leave?')) {
      getEnsembleJS().cleanup();
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
