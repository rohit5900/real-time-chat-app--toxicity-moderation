import React, { useState } from 'react';
import styled from 'styled-components';

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
  max-width: 70%;
  align-self: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
  position: relative;
  
  &:hover .message-actions {
    opacity: 1;
    pointer-events: auto;
  }
`;

const Bubble = styled.div`
  padding: 10px 15px;
  border-radius: 15px;
  background: ${props => {
    if (props.$status === 'blocked') return '#ff4757';
    if (props.$status === 'flagged') return '#ffa502';
    if (props.$isOwn) return props.theme.ownMsgBg;
    return props.theme.otherMsgBg;
  }};
  color: ${props => props.$isOwn ? props.theme.ownMsgText : props.theme.otherMsgText};
  border-bottom-right-radius: ${props => props.$isOwn ? '2px' : '15px'};
  border-bottom-left-radius: ${props => props.$isOwn ? '15px' : '2px'};
  position: relative;
  min-width: 80px;
  cursor: pointer;
`;

const SenderName = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.text};
  opacity: 0.5;
  margin-bottom: 4px;
  margin-left: 4px;
`;

const StatusIcon = styled.span`
  font-size: 0.7rem;
  position: absolute;
  bottom: -18px;
  right: 0;
  color: ${props => props.theme.text};
  opacity: 0.4;
`;

const ModerationLabel = styled.div`
  font-size: 0.7rem;
  color: #fff;
  background: rgba(0,0,0,0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  display: inline-block;
`;

const ActionMenu = styled.div`
  position: absolute;
  top: -30px;
  right: ${props => props.$isOwn ? '0' : 'auto'};
  left: ${props => props.$isOwn ? 'auto' : '0'};
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 4px;
  display: flex;
  gap: 5px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default function MessageBubble({ message, isOwn, onDelete, onForward }) {
  const { text, senderId, status, moderation } = message;
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <BubbleContainer $isOwn={isOwn}>
      {!isOwn && <SenderName>{senderId}</SenderName>}
      
      <ActionMenu className="message-actions" $isOwn={isOwn}>
        <ActionBtn onClick={handleCopy} title="Copy">
          {showCopied ? '✓' : '📋'}
        </ActionBtn>
        <ActionBtn onClick={() => onForward && onForward(text)} title="Forward">↪️</ActionBtn>
        {isOwn && <ActionBtn onClick={() => onDelete && onDelete(message._id)} title="Delete">🗑️</ActionBtn>}
      </ActionMenu>

      <Bubble $isOwn={isOwn} $status={status}>
        {status === 'blocked' ? (
          <i>Message blocked (Toxic)</i>
        ) : (
          text
        )}
        
        {status === 'flagged' && (
          <ModerationLabel>
            ⚠️ Flagged: {moderation?.labels?.join(', ')}
          </ModerationLabel>
        )}
      </Bubble>
      <StatusIcon>
        {status === 'pending' && '🕒'}
        {status === 'allowed' && '✓'}
        {status === 'flagged' && '⚠️'}
        {status === 'blocked' && '🚫'}
      </StatusIcon>
    </BubbleContainer>
  );
}
