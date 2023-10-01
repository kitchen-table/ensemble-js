import FABIcon from 'ui/FAB/FABIcon';
import { resolve, TYPE } from 'di';

export default function FABLeave() {
  const getKitchenTable = resolve(TYPE.KITCHEN_TABLE);

  const confirmLeave = () => {
    if (confirm('Are you sure you want to leave?')) {
      getKitchenTable().cleanup();
    }
  };

  return (
    <FABIcon aria-label="Leave" role="tooltip" data-microtip-position="left" onClick={confirmLeave}>
      <LeaveIcon color={'rgba(0,0,0,0.8)'} />
    </FABIcon>
  );
}

const LeaveIcon = ({ color }: { color: string }) => {
  return (
    <svg fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points="18 9 21 12 18 15"
        stroke={color}
        style="fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
      />
      <path
        stroke={color}
        d="M21,12H7m7,4v3a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V5A1,1,0,0,1,4,4h9a1,1,0,0,1,1,1V8"
        style="fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
      />
    </svg>
  );
};
