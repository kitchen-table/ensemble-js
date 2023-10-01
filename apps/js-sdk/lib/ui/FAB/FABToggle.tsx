import { ComponentChild, ComponentChildren, JSX } from 'preact';
import { useEffect, useRef } from 'preact/compat';
import { signal } from '@preact/signals';
import styled from 'ui/styled';
import { resolve, TYPE } from 'di';

type FABToggleProps = {
  icon: ComponentChild;
} & Omit<JSX.IntrinsicElements['summary'], 'icon' | 'onClick'>;

export default function FABToggle({ icon, children, ...restProps }: FABToggleProps) {
  const getFab = resolve(TYPE.FAB);
  const openSignal = signal<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const fabRoot = getFab().getRoot();
    const fabContainer = getFab().getContainer();

    const onDocumentClick = (event: MouseEvent) => {
      if (fabContainer.isEqualNode(event.target as Node)) {
        return;
      }
      openSignal.value = false;
    };

    function onClick(event: Event) {
      if (detailsRef.current?.contains(event.target as Node)) {
        return;
      }
      openSignal.value = false;
    }

    fabRoot.addEventListener('click', onClick);
    document.addEventListener('click', onDocumentClick);

    return () => {
      fabRoot.removeEventListener('click', onClick);
      document.removeEventListener('click', onDocumentClick);
    };
  }, []);

  return (
    <Details ref={detailsRef} open={openSignal}>
      <Summary
        onClick={(event) => {
          event.preventDefault();
          openSignal.value = !openSignal.value;
        }}
        {...restProps}
      >
        {icon}
      </Summary>
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