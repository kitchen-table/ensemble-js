import FABIcon from 'ui/FAB/FABIcon';
import FABToggle from 'ui/FAB/FABToggle';
import styled from 'ui/styled';
import { BiShare } from 'react-icons/bi';

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
          <BiShare size={20} color={'rgba(0,0,0,0.8)'} />
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
