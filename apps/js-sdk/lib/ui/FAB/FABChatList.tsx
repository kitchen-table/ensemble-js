import { useEffect, useRef } from 'preact/compat';
import { resolve, TYPE } from 'di';
import FABIcon from 'ui/FAB/FABIcon';
import FABToggle from 'ui/FAB/FABToggle';
import styled from 'ui/styled';
import { getContrastColor } from 'utils/color';
import { User } from '@packages/api';
import { BiChat } from 'react-icons/bi';

export default function FABChatList() {
  return (
    <FABToggle
      aria-label={`Chat List\nPress '/' key to start typing.`}
      role="tooltip"
      data-microtip-position="left"
      icon={
        <FABIcon>
          <BiChat size={20} color={'rgba(0,0,0,0.8)'} />
        </FABIcon>
      }
    >
      <ChatListBox />
    </FABToggle>
  );
}

const ChatListBox = () => {
  const chatStorage = resolve(TYPE.CHAT_STORAGE);

  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatListRef.current) {
      return;
    }
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [chatStorage().messages.value.length === 0]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [chatStorage().messages.value.length]);

  return (
    <ChatListBoxContainer>
      <ChatList ref={chatListRef}>
        {chatStorage().messages.value.map((message) => {
          return (
            <ChatMessageContainer>
              <ChatUserIcon bgColor={message.userColor}>
                {message.userName[0].toUpperCase()}
              </ChatUserIcon>
              <ChatMessage>{message.message}</ChatMessage>
            </ChatMessageContainer>
          );
        })}
      </ChatList>
    </ChatListBoxContainer>
  );
};

const ChatListBoxContainer = styled.div`
  width: 200px;
  height: 180px;
  font-size: 14px;
  overflow-y: hidden;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  gap: 8px;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChatMessageContainer = styled.div`
  display: flex;
`;

const ChatUserIcon = styled.div<{ bgColor: User['color'] }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ bgColor }) => getContrastColor(bgColor)};
  border: 1px solid #3d3939;
  min-width: 24px;
  max-width: 24px;
  min-height: 22px;
  max-height: 22px;
  border-radius: 6px;
  margin-right: 8px;
`;

const ChatMessage = styled.span`
  padding: 4px 8px;
  border: 1px solid #3d3939;
  border-radius: 4px;
  font-size: 13px;
`;
