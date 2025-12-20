import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: ${props => props.theme.bg}; /* Fallback or theme bg */
  background: radial-gradient(circle at top right, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4rem;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(to right, #4ecca3, #45b393);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
`;

const NavBtn = styled.button`
  padding: 10px 24px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const HeroSection = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;
  margin-top: 2rem;

  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    padding: 0 2rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;
  animation: ${fadeIn} 1s ease-out 0.2s backwards;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #fff;

  span {
    color: #4ecca3;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2.5rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  padding: 18px 40px;
  border-radius: 50px;
  border: none;
  background: linear-gradient(135deg, #4ecca3 0%, #2ecc71 100%);
  color: #1a1a2e;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(78, 204, 163, 0.3);

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 30px rgba(78, 204, 163, 0.4);
  }
`;

const VisualContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: ${fadeIn} 1s ease-out 0.4s backwards;
  
  @media (max-width: 968px) {
    margin-top: 4rem;
  }
`;

const Card = styled.div`
  width: 340px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
  animation: ${float} 6s ease-in-out infinite;
  
  &:hover {
    transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
    transition: transform 0.5s ease;
  }
`;

const ChatBubble = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  background: ${props => props.$own ? 'rgba(78, 204, 163, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$own ? '#4ecca3' : '#fff'};
  margin-bottom: 1rem;
  width: fit-content;
  max-width: 80%;
  align-self: ${props => props.$own ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.$own ? 'auto' : '0'};
  border: 1px solid ${props => props.$own ? 'rgba(78, 204, 163, 0.1)' : 'transparent'};
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  margin-top: 4px;
`;

const FeaturesSection = styled.section`
  padding: 4rem 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: auto;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out 0.6s backwards;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-5px);
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #4ecca3;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
    font-size: 0.95rem;
  }
`;

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Nav>
        <Logo onClick={() => navigate('/')}>Safe Chat</Logo>
        <NavBtn onClick={() => navigate('/login')}>Login</NavBtn>
      </Nav>

      <HeroSection>
        <HeroContent>
          <Title>
            Conversations, <br />
            <span>Clean & Safe.</span>
          </Title>
          <Subtitle>
            Experience a new standard of communication with real-time AI moderation 
            that filters toxicity instantly. Keep your community safe effortlessly.
          </Subtitle>
          <CTAButton onClick={() => navigate('/login')}>Start Chatting Free</CTAButton>
        </HeroContent>

        <VisualContainer>
          <Card>
            <ChatBubble>Hey, how is the project coming along?</ChatBubble>
            <ChatBubble $own>It's going great! Just implementing the AI service.</ChatBubble>
            <ChatBubble>
              You are stupid and ugly
              <br />
              <Badge>⚠️ Flagged by AI</Badge>
            </ChatBubble>
            <ChatBubble $own>Let's keep it professional, please.</ChatBubble>
          </Card>
        </VisualContainer>
      </HeroSection>

      <FeaturesSection>
        <FeatureCard>
          <h3>⚡ Real-Time</h3>
          <p>Instant messaging with zero latency. Connect with anyone, anywhere, instantly.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>🛡️ AI Moderation</h3>
          <p>Advanced machine learning models detect and filter toxic content automatically.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>🔒 Secure</h3>
          <p>Your conversations are private and protected. We prioritize your safety and data.</p>
        </FeatureCard>
      </FeaturesSection>
    </Container>
  );
}
