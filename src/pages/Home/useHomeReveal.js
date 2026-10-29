import { useEffect, useRef } from 'react';

// 화면 밖 섹션만 한 번 등장시킨다. 관찰 API가 없거나 동작 줄이기 설정이면 그대로 표시한다.
export function useHomeReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const sections = [...ref.current.querySelectorAll('[data-reveal]')];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.dataset.reveal = 'shown';
          observer.unobserve(target);
        });
      },
      { threshold: 0 },
    );
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight) return;
      section.dataset.reveal = 'waiting';
      observer.observe(section);
    });
    const showAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      sections.forEach((section) => {
        section.dataset.reveal = 'shown';
      });
    };
    preference.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', showAll);
      sections.forEach((section) => {
        section.dataset.reveal = '';
      });
    };
  }, []);
  return ref;
}
