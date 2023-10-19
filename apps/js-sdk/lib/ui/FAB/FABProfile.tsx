import FABIcon from 'ui/FAB/FABIcon';
import FABToggle from 'ui/FAB/FABToggle';
import EditMyInfo from 'ui/FAB/EditMyInfo';
import { BiUser } from 'react-icons/bi';

export default function FABProfile() {
  return (
    <FABToggle
      icon={
        <FABIcon
          tabIndex={0}
          aria-label="Edit My Info"
          role="tooltip"
          data-microtip-position="left"
        >
          <BiUser size={20} color={'rgba(0,0,0,0.8)'} />
        </FABIcon>
      }
    >
      <EditMyInfo />
    </FABToggle>
  );
}
