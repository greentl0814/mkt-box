import React from 'react';

export default function AdSenseLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex gap-6">
        {/* 왼쪽 사이드바 - 데스크탑에서만 표시 */}
        <aside className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-8">
            {/* 왼쪽 광고 공간 예약 */}
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* 오른쪽 사이드바 - 데스크탑에서만 표시 */}
        <aside className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-8">
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