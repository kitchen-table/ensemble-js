import { User } from '@packages/api/dist/esm';
import { resolve, TYPE } from 'di';
import styled from 'ui/styled';
import { JSXInternal } from 'preact/src/jsx';

export default function EditMyInfo() {
  const getMyInfoStorage = resolve(TYPE.MY_INFO_STORAGE);
  const getApi = resolve(TYPE.API);
  const myInfo = getMyInfoStorage().myInfoSignal.value;

  const onSubmit = (event: JSXInternal.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('my-name') as User['name'];
    const color = formData.get('my-color') as User['color'];

    getApi().updateMyInfo({
      name,
      color,
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      <InputRow>
        <label for="name">Name</label>
        <NameInput
          id="name"
          name="my-name"
          autocomplete="off"
          type="text"
          defaultValue={myInfo?.name}
          maxLength={40}
          required
          placeholder="Name"
        />
      </InputRow>
      <InputRow>
        <label for="color">Color</label>
        <ColorInput
          id="color"
          autocomplete="off"
          name="my-color"
          type="color"
          defaultValue={myInfo?.color}
        />
      </InputRow>
      <EditButton>EDIT</EditButton>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;

  > label {
    font-size: 13px;
    color: #222222;
  }
`;

const NameInput = styled.input`
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #222222;
`;

const ColorInput = styled.input`
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: none;
  cursor: pointer;
  padding: 0;
  height: 25px;
  width: 25px;
  border: 1px solid #222222;
  border-radius: 50%;
  overflow: hidden;

  ::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  ::-webkit-color-swatch {
    border: 0;
    border-radius: 0;
  }

  ::-moz-color-swatch,
  ::-moz-focus-inner {
    border: 0;
  }

  ::-moz-focus-inner {
    padding: 0;
  }
`;

const EditButton = styled.button`
  cursor: pointer;
  background-color: white;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #222222;

  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;
