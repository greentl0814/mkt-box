import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdSenseLayout({ children }) {
  const router = useRouter();
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    // 페이지 이동 시 광고 강제 새로고침
    const handleRouteChange = () => {
      setAdKey(prev => prev + 1);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    // 광고 스크립트 재실행
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [adKey]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex gap-6">
        {/* 왼쪽 사이드바 - 데스크탑에서만 표시 */}
        <aside className="hidden xl:block w-[160px] flex-shrink-0 pt-8">
          <div className="sticky top-4">
            {/* 왼쪽 광고 공간 예약 */}
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* 오른쪽 사이드바 - 데스크탑에서만 표시 */}
        <aside key={adKey} className="hidden xl:block w-[160px] flex-shrink-0 pt-8">
          <div className="sticky top-4">
            <ins className="kakao_ad_area" style={{ display: 'none' }}
              data-ad-unit="DAN-nSdQcn9jHBDrIfwf"
              data-ad-width="160"
              data-ad-height="600"></ins>
          </div>
        </aside>
      </div>
    </div>
  );
}