import { User } from '@packages/api';
import styled from 'ui/styled';

type UserProfileProps = {
  user: User;
};

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <Container>
      <span>NAME: {user.name}</span>
      <span>CreatedAt: {new Date(user.createdAt).toLocaleTimeString()}</span>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  width: 200px;
`;
