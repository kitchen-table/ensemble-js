import { css } from '@emotion/css';
import { useEffect, useRef } from 'preact/compat';
import { resolve, TYPE } from 'di';
import FABIcon from 'ui/FAB/FABIcon';
import FABToggle from 'ui/FAB/FABToggle';

export default function FABChatList() {
  return (
    <FABToggle
      icon={
        <FABIcon>
          <ChatIcon color={'rgba(0,0,0,0.8)'} />
        </FABIcon>
      }
    >
      <ChatListBox />
    </FABToggle>
  );
}

const ChatListBox = () => {
  const chatStorage = resolve(TYPE.CHAT_STORAGE);

  const messageList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageList.current) {
      return;
    }
    messageList.current.scrollTop = messageList.current.scrollHeight;
  }, [chatStorage().messages.value.length === 0]);

  useEffect(() => {
    if (messageList.current) {
      messageList.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [chatStorage().messages.value.length]);

  return (
    <div
      className={css`
        width: 200px;
        height: 180px;
        font-size: 14px;
        overflow-y: hidden;
      `}
    >
      <div
        ref={messageList}
        className={css`
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
        `}
      >
        {chatStorage().messages.value.map((message) => {
          return (
            <div
              className={css`
                display: flex;
              `}
            >
              <div
                className={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background-color: ${message.userColor};
                  border: 1px solid #3d3939;
                  min-width: 24px;
                  max-width: 24px;
                  min-height: 22px;
                  max-height: 22px;
                  border-radius: 6px;
                  margin-right: 8px;
                `}
              >
                {message.userName[0].toUpperCase()}
              </div>
              <span
                className={css`
                  padding: 4px 8px;
                  border: 1px solid #3d3939;
                  border-radius: 4px;
                  font-size: 13px;
                `}
              >
                {message.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChatIcon = ({ color }: { color: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};
