import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Modern navigation arrow buttons
const ArrowButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ArrowButton = styled.button`
  background: transparent;
  padding: 8px;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.4) 0%, rgba(205, 62, 253, 0) 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    transition: all 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-2px);
    
    &::after {
      width: 45px;
      height: 45px;
    }
    
    svg path {
      stroke: #CD3EFD;
      filter: drop-shadow(0 0 3px rgba(205, 62, 253, 0.6));
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    transform: none;
    
    &::after {
      width: 0;
      height: 0;
    }
  }
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Testimonials data with both English and Arabic
  const testimonials = [
    {
      id: 1,
      nameEn: "Ahmed",
      nameAr: "أحمد",
      roleEn: "Startup Founder",
      roleAr: "مؤسس شركة ناشئة",
      contentEn: "The mobile app he developed for our company exceeded our expectations. User-friendly and elegant!",
      contentAr: "تطبيق الجوال الذي طوره لشركتنا تجاوز توقعاتنا. سهل الاستخدام وأنيق!",
      icon: "👨‍💼",
      color: "#E9AFFC"
    },
    {
      id: 2,
      nameEn: "Mohamed",
      nameAr: "محمد",
      roleEn: "IT Director",
      roleAr: "مدير تقنية المعلومات",
      contentEn: "He developed a custom solution that saves us time and money. The collaboration process was extremely smooth.",
      contentAr: "طور حلاً مخصصًا يوفر لنا الوقت والمال. كانت عملية التعاون سلسة للغاية.",
      icon: "👨‍💻",
      color: "#BFDBFE"
    },
    {
      id: 3,
      nameEn: "Noura",
      nameAr: "نورة",
      roleEn: "E-commerce Owner",
      roleAr: "صاحبة متجر إلكتروني",
      contentEn: "Our online store's sales increased by 40% after implementing his recommendations and custom features.",
      contentAr: "زادت مبيعات متجرنا الإلكتروني بنسبة 40٪ بعد تنفيذ توصياته والميزات المخصصة.",
      icon: "👩‍💼",
      color: "#93C5FD"
    },
    {
      id: 4,
      nameEn: "Sarah",
      nameAr: "سارة",
      roleEn: "Marketing Manager",
      roleAr: "مديرة التسويق",
      contentEn: "The dashboard he built helps us track our campaigns in real-time. It's intuitive and visually appealing.",
      contentAr: "لوحة المعلومات التي بناها تساعدنا على تتبع حملاتنا في الوقت الفعلي. إنها بديهية وجذابة بصريًا.",
      icon: "👩‍💻",
      color: "#FCD34D"
    },
    {
      id: 5,
      nameEn: "Khalid",
      nameAr: "خالد",
      roleEn: "Restaurant Owner",
      roleAr: "صاحب مطعم",
      contentEn: "The QR code menu system he developed has modernized our restaurant experience. Customers love it!",
      contentAr: "نظام قائمة رمز QR الذي طوره عصرن تجربة مطعمنا. العملاء يحبونه!",
      icon: "🍽️",
      color: "#A78BFA"
    },
    {
      id: 6,
      nameEn: "Fatima",
      nameAr: "فاطمة",
      roleEn: "Educational Consultant",
      roleAr: "مستشارة تعليمية",
      contentEn: "The learning platform he created for our institution has transformed how we deliver courses online.",
      contentAr: "منصة التعلم التي أنشأها لمؤسستنا غيرت طريقة تقديمنا للدورات عبر الإنترنت.",
      icon: "👩‍🏫",
      color: "#F472B6"
    },
    {
      id: 7,
      nameEn: "Youssef",
      nameAr: "يوسف",
      roleEn: "Healthcare Administrator",
      roleAr: "مدير رعاية صحية",
      contentEn: "The patient management system has streamlined our operations and improved our service quality significantly.",
      contentAr: "نظام إدارة المرضى بسّط عملياتنا وحسّن جودة خدمتنا بشكل كبير.",
      icon: "⚕️",
      color: "#60A5FA"
    },
    {
      id: 8,
      nameEn: "Khalid",
      nameAr: "خالد",
      roleEn: "Software Engineer",
      roleAr: "مهندس برمجيات",
      contentEn: "His code quality and documentation are exceptional. Made our integration process seamless.",
      contentAr: "جودة الكود والتوثيق لديه استثنائية. جعل عملية التكامل سلسة.",
      icon: "👨‍🔧",
      color: "#93C5FD"
    }
  ];

  // Handle scroll events and update active index
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    const handleScroll = () => {
      if (scrollContainer) {
        const newPosition = scrollContainer.scrollLeft;
        const maxScrollValue = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        setScrollPosition(newPosition);
        setMaxScroll(maxScrollValue);
        
        // Calculate active card
        const cardWidth = scrollContainer.querySelector('.testimonial-card')?.offsetWidth || 0;
        const gap = 16; // Approximate gap between cards
        const newActiveIndex = Math.round(newPosition / (cardWidth + gap));
        setActiveIndex(newActiveIndex);
      }
    };
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // Initialize scroll values
      handleScroll();
      
      // Always start from the beginning regardless of language
      scrollContainer.scrollLeft = 0;
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isRTL]);

  // Reset scroll position when language changes and fix RTL scrolling
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Reset to beginning when language changes
      setTimeout(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
          scrollContainer.scrollLeft = isRTL ? scrollContainer.scrollWidth : 0;
          setScrollPosition(0);
          setActiveIndex(0);
        }
      }, 50); // Small delay to ensure DOM is updated
    }
  }, [isRTL]);

  // Scroll to next or previous testimonial
  const scrollToTestimonial = (direction) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const cardWidth = scrollContainer.querySelector('.testimonial-card')?.offsetWidth || 280;
    const gap = 16; // Gap between cards
    const scrollAmount = cardWidth + gap;
    const currentScroll = scrollContainer.scrollLeft;
    
    // In RTL mode, the scroll direction is naturally reversed
    if (direction === 'next') {
      scrollContainer.scrollTo({
        left: currentScroll + (isRTL ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    } else {
      scrollContainer.scrollTo({
        left: currentScroll + (isRTL ? scrollAmount : -scrollAmount),
        behavior: 'smooth'
      });
    }
  };
  // Update scroll position and enable scrollbar functionality
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const currentPosition = Math.abs(scrollContainer.scrollLeft);
        setScrollPosition(currentPosition);
        setMaxScroll(scrollContainer.scrollWidth - scrollContainer.clientWidth);
        
        // Calculate active index based on scroll position
        const cardWidth = scrollContainer.querySelector('.testimonial-card')?.offsetWidth || 280;
        const gap = 16;
        const newActiveIndex = Math.round(currentPosition / (cardWidth + gap));
        setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : 0);
      }
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // Initialize scroll values
      handleScroll();
      
      // Enable mouse wheel horizontal scrolling
      const handleWheel = (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          const delta = isRTL ? -e.deltaY : e.deltaY;
          scrollContainer.scrollLeft += delta;
        }
      };
      
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isRTL]);  // Add isRTL as dependency to update when language changes

  return (
    <Section>
      <Container>
        <SectionTitleWrapper>
          <GradientText as="h2">{t('testimonials.title', 'Client Testimonials')}</GradientText>
          <Subtitle>{t('testimonials.subtitle', 'What my clients say about my work')}</Subtitle>
        </SectionTitleWrapper>
        <TestimonialsContainer>
          <ScrollContainer 
            ref={scrollContainerRef} 
            isRTL={isRTL}
            className="testimonials-scroll-container"
          >
            <ScrollIndicator side="left" visible={true} />
            <ScrollIndicator side="right" visible={true} />  
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id} 
                className="testimonial-card"
                index={index}
              >
                <CardContent color={testimonial.color}>
                  <IconContainer color={testimonial.color} className="icon-container">
                    <IconText role="img" aria-label={t('testimonials.iconAlt', 'Client testimonial icon')}>{testimonial.icon}</IconText>
                  </IconContainer>
                  
                  <TestimonialText className="testimonial-text">
                    {isRTL ? testimonial.contentAr : testimonial.contentEn}
                  </TestimonialText>
                  
                  <AuthorInfo>
                    <AuthorName>{isRTL ? testimonial.nameAr : testimonial.nameEn}</AuthorName>
                    <AuthorRole>{isRTL ? testimonial.roleAr : testimonial.roleEn}</AuthorRole>
                  </AuthorInfo>
                </CardContent>
              </TestimonialCard>
            ))}
          </ScrollContainer>
          
          <ArrowButtonsContainer>
            <ArrowButton 
              onClick={() => scrollToTestimonial('prev')} 
              disabled={scrollPosition <= 20}
              aria-label="Previous testimonials"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d={isRTL ? "M10 6l6 6-6 6" : "M14 18l-6-6 6-6"}
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </ArrowButton>
            <ArrowButton 
              onClick={() => scrollToTestimonial('next')} 
              disabled={scrollPosition >= (maxScroll - 20)}
              aria-label="Next testimonials"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d={isRTL ? "M14 18l-6-6 6-6" : "M10 6l6 6-6 6"}
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </ArrowButton>
          </ArrowButtonsContainer>
        </TestimonialsContainer>
      </Container>
    </Section>
  );
};

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.7; transform: scale(1); }
`;

// Styled Components
const Section = styled.section`
  padding: 4rem 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(205, 62, 253, 0.3), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(205, 62, 253, 0.3), transparent);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -30px;
    ${props => props.theme.isRTL ? 'right: 5%;' : 'left: 5%;'}
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.15) 0%, transparent 70%);
    filter: blur(10px);
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    ${props => props.theme.isRTL ? 'left: 10%;' : 'right: 10%;'}
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147, 197, 253, 0.15) 0%, transparent 70%);
    filter: blur(15px);
    z-index: -1;
  }
`;

// Section header styling

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #cd3efd;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
`;

const SectionHeading = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TestimonialsContainer = styled.div`
  position: relative;
  padding: 0.5rem 0;
  overflow: hidden;
  width: 100%;
  cursor: grab;
  touch-action: pan-x;
  
  &:active {
    cursor: grabbing;
  }
  
  /* Enable horizontal scrolling with mouse wheel */
  & .testimonials-scroll-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
    user-select: none;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.75rem 0;
  gap: 16px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: relative;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 5%,
    black 95%,
    transparent
  );
  flex-wrap: nowrap;
  white-space: nowrap;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    gap: 12px;
    padding: 0.5rem 0;
  }
  
  /* Fix for RTL scrolling */
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const TestimonialCard = styled.div`
  flex: 0 0 auto;
  width: 280px;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  opacity: ${props => props.isActive ? 1 : 0.9};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 250px;
    height: 200px;
  }
`;

const CardContent = styled.div`
  height: 100%;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(30, 26, 51, 0.9), rgba(20, 17, 35, 0.95));
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 15px 30px rgba(0, 0, 0, 0.2),
      0 5px 15px rgba(${props => {
        const color = props.color || '#CD3EFD';
        if (color.startsWith('#')) {
          return color.replace('#', '').match(/.{2}/g)
            .map(hex => parseInt(hex, 16))
            .join(', ') + ', 0.2';
        }
        return '205, 62, 253, 0.2';
      }}),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
`;

const IconContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.color || '#CD3EFD'}, ${props => props.color || '#CD3EFD'}aa);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2), 0 0 15px ${props => props.color || '#CD3EFD'}44;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  ${TestimonialCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 20px ${props => props.color || '#CD3EFD'}55;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${props => props.color || '#CD3EFD'} 0%,
      transparent 80%
    );
    opacity: 0.3;
    z-index: -1;
  }
`;

const IconText = styled.div`
  font-size: 1.25rem;
  line-height: 1;
`;

const TestimonialText = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.85rem;
  line-height: 1.4;
  flex: 1;
  margin-bottom: 0.75rem;
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 400;
  letter-spacing: 0.01em;
  z-index: 1;
  overflow: hidden;
  word-wrap: break-word;
  white-space: normal;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    line-height: 1.35;
  }
`;

const AuthorInfo = styled.div`
  position: relative;
  z-index: 1;
`;

const AuthorName = styled.h4`
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.1rem 0;
  color: white;
`;

const AuthorRole = styled.p`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  z-index: 10;
  pointer-events: none;
  ${props => props.side === 'left' ? 'left: 0;' : 'right: 0;'}
  background: linear-gradient(
    to ${props => props.side === 'left' ? 'right' : 'left'},
    rgba(20, 17, 35, 0.5),
    transparent
  );
  opacity: 0.7;
`;

const DesktopScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.side === 'left' ? 'left: -15px;' : 'right: -15px;'}
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(30, 26, 51, 0.8);
  border: 1px solid rgba(205, 62, 253, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: ${props => props.visible ? 1 : 0};
  transition: all 0.2s ease;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(205, 62, 253, 0.7);
  }
  
  @media (max-width: 768px) {
    display: none; /* Hide on mobile */
  }
`;

const SectionTitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const GradientText = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #CD3EFD, #93C5FD);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#cd3efd' : 'rgba(255, 255, 255, 0.3)'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#cd3efd' : 'rgba(255, 255, 255, 0.5)'};
    transform: scale(1.2);
  }
  
  &:focus {
    outline: none;
  }
`;

export default Testimonials;

// Add these translations to your translation files
// English (en/translation.json)
// "testimonials": {
//   "title": "Client Testimonials",
//   "subtitle": "What my clients say about my work"
// },

// Arabic (ar/translation.json)
// "testimonials": {
//   "title": "آراء العملاء",
//   "subtitle": "ما يقوله عملائي عن عملي"
// },
