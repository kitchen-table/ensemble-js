import { ComponentChildren } from 'preact';
import styled from 'ui/styled';

type SwitchProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ComponentChildren;
};

export default function Switch({ children, checked, onCheckedChange }: SwitchProps) {
  return (
    <label>
      <SwitchWrapper>
        <input
          checked={checked}
          type="checkbox"
          onChange={(e) => {
            onCheckedChange?.(e.currentTarget.checked);
          }}
        />
        <span class="slide" />
      </SwitchWrapper>
      {children}
    </label>
  );
}

const SwitchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 30px;
  height: 16px;

  > input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  > .slide {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.2s;
    border-radius: 16px;
  }

  > .slide::before {
    position: absolute;
    border-radius: 50%;
    content: '';
    height: 12px;
    width: 12px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
  }

  > input:checked + .slide {
    background-color: #2196f3;
  }
  > input:checked + .slide:before {
    transform: translateX(14px);
  }
`;
