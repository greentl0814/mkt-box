import React, { useEffect } from 'react';

export default function AdSenseLayout({ children }) {
  useEffect(() => {
    // 페이지가 로드된 후 AdSense 광고 초기화
    const initializeAds = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          const ads = document.querySelectorAll('.adsbygoogle');
          console.log(`🚀 Initializing ${ads.length} ads`);
          
          ads.forEach((ad, index) => {
            // 이미 처리된 광고는 건너뛰기
            if (!ad.hasAttribute('data-adsbygoogle-status')) {
              console.log(`📢 Pushing ad ${index + 1}`);
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
          });
        } catch (e) {
          console.error('AdSense initialization error:', e);
        }
      }
    };

    // 페이지 로드 후 잠시 대기
    const timer = setTimeout(initializeAds, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 상단 광고 */}
      <div className="w-full max-w-4xl mx-auto mb-6 px-4">
        <ins className="adsbygoogle"
             style={{display: 'block', width: '100%', minHeight: '250px'}}
             data-ad-client="ca-pub-6071061687711848"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="w-full">
        {children}
      </div>
      
      {/* 하단 광고 */}
      <div className="w-full max-w-4xl mx-auto mt-6 px-4">
        <ins className="adsbygoogle"
             style={{display: 'block', width: '100%', minHeight: '250px'}}
             data-ad-client="ca-pub-6071061687711848"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </>
  );
}