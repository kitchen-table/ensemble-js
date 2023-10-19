import FABIcon from 'ui/FAB/FABIcon';
import FABToggle from 'ui/FAB/FABToggle';
import styled from 'ui/styled';

export default function FABShare() {
  const share = () => {
    const url = window.location.href;
    const title = document.title;
    const text = 'Check out this awesome website!';
    navigator.share?.({ url, title, text });
  };

  return (
    <FABToggle
      aria-label="Share"
      role="tooltip"
      data-microtip-position="left"
      icon={
        <FABIcon onClick={share}>
          <ShareIcon color={'rgba(0,0,0,0.8)'} />
        </FABIcon>
      }
    >
      <ShareBox>
        {/*  TODO*/}
        {window.location.href}
      </ShareBox>
    </FABToggle>
  );
}

const ShareBox = styled.div`
  padding: 2px;
  font-size: 14px;
`;

const ShareIcon = ({ color }: { color: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 9C10.3431 9 9 7.65685 9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6C15 7.65685 13.6569 9 12 9Z"
        stroke={color}
        stroke-width="2"
      />
      <path
        d="M5.5 21C3.84315 21 2.5 19.6569 2.5 18C2.5 16.3431 3.84315 15 5.5 15C7.15685 15 8.5 16.3431 8.5 18C8.5 19.6569 7.15685 21 5.5 21Z"
        stroke={color}
        stroke-width="2"
      />
      <path
        d="M18.5 21C16.8431 21 15.5 19.6569 15.5 18C15.5 16.3431 16.8431 15 18.5 15C20.1569 15 21.5 16.3431 21.5 18C21.5 19.6569 20.1569 21 18.5 21Z"
        stroke={color}
        stroke-width="2"
      />
      <path
        d="M20 13C20 10.6106 18.9525 8.46589 17.2916 7M4 13C4 10.6106 5.04752 8.46589 6.70838 7M10 20.748C10.6392 20.9125 11.3094 21 12 21C12.6906 21 13.3608 20.9125 14 20.748"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};
