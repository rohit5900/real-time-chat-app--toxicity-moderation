import React from 'react';
import styled from 'styled-components';

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
  max-width: 70%;
  align-self: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
`;

const Bubble = styled.div`
  padding: 10px 15px;
  border-radius: 15px;
  background: ${props => {
    if (props.$status === 'blocked') return '#ff4757';
    if (props.$status === 'flagged') return '#ffa502';
    if (props.$isOwn) return '#4ecca3';
    return 'rgba(255, 255, 255, 0.15)';
  }};
  color: ${props => props.$isOwn ? '#1a1a2e' : '#fff'};
  border-bottom-right-radius: ${props => props.$isOwn ? '2px' : '15px'};
  border-bottom-left-radius: ${props => props.$isOwn ? '15px' : '2px'};
  position: relative;
  min-width: 80px;
`;

const SenderName = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
  margin-left: 4px;
`;

const StatusIcon = styled.span`
  font-size: 0.7rem;
  position: absolute;
  bottom: -18px;
  right: 0;
  color: rgba(255, 255, 255, 0.4);
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

export default function MessageBubble({ message, isOwn }) {
  const { text, senderId, status, moderation } = message;

  return (
    <BubbleContainer $isOwn={isOwn}>
      {!isOwn && <SenderName>{senderId}</SenderName>}
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
