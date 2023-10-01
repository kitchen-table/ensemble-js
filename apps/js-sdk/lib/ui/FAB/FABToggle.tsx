import { ComponentChild, JSX } from 'preact';
import { useEffect, useRef } from 'preact/compat';
import styled from 'ui/styled';
import { resolve, TYPE } from 'di';

type FABToggleProps = {
  icon: ComponentChild;
} & Omit<JSX.IntrinsicElements['summary'], 'icon' | 'onClick'>;

export default function FABToggle({ icon, children, ...restProps }: FABToggleProps) {
  const getFab = resolve(TYPE.FAB);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const close = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  useEffect(() => {
    const fabRoot = getFab().getRoot();
    const fabContainer = getFab().getContainer();

    const onDocumentClick = (event: MouseEvent) => {
      if (fabContainer.isEqualNode(event.target as Node)) {
        return;
      }
      close();
    };

    function onClick(event: Event) {
      if (detailsRef.current?.contains(event.target as Node)) {
        return;
      }
      close();
    }

    fabRoot.addEventListener('click', onClick);
    document.addEventListener('click', onDocumentClick);

    return () => {
      fabRoot.removeEventListener('click', onClick);
      document.removeEventListener('click', onDocumentClick);
    };
  }, []);

  return (
    <Details ref={detailsRef}>
      <Summary {...restProps}>{icon}</Summary>
      <ContentWrapper>{children}</ContentWrapper>
    </Details>
  );
}

const Details = styled.details`
  position: relative;
`;

const Summary = styled.summary`
  list-style: none;
  cursor: pointer !important;
`;

const ContentWrapper = styled.div`
  position: absolute;
  z-index: -1;
  right: 56px;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: white;
  bottom: 0;
  padding: 8px;
`;
