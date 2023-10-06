import { ComponentChildren, JSX } from 'preact';
import styled from 'ui/styled';

type FABIconProps = {
  children: ComponentChildren;
} & Omit<JSX.IntrinsicElements['div'], 'className'>;

export default function FABIcon({ children, ...restProps }: FABIconProps) {
  return (
    <Container tabIndex={-1} {...restProps}>
      <SvgWrapper tabIndex={-1}>{children}</SvgWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border: 2px solid #3d3939;
  width: 32px;
  height: 32px;
  border-radius: 8px;

  // prevent text selection
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const SvgWrapper = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
  svg {
    pointer-events: none;
  }
`;
