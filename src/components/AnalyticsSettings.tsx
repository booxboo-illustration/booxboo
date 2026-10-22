import { useState } from 'react';
import { isAnalyticsExcluded, setAnalyticsExcluded } from '../analytics';

export default function AnalyticsSettings() {
  const [excluded, setExcluded] = useState(isAnalyticsExcluded);
  const [error, setError] = useState('');
  function update(value: boolean) {
    const saved = setAnalyticsExcluded(value);
    setExcluded(isAnalyticsExcluded());
    setError(saved ? '' : '설정을 저장하지 못했어요. 브라우저에서 쿠키와 사이트 저장 공간을 허용한 뒤 다시 시도해 주세요.');
  }
  return (
    <main className="min-h-screen bg-[#f6f5f1] text-neutral-900 px-6 py-20 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <p className="text-xs tracking-[.2em] font-bold mb-12">BOOxBOO . ILLUSTRATION</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">내 방문 제외 설정</h1>
        <p className="text-neutral-600 leading-relaxed">작업 확인을 위한 내 접속과 작품 클릭이 방문 통계에 포함되지 않도록 설정할 수 있어요.</p>
        <p className="text-sm text-neutral-500 leading-relaxed mt-4">이 사이트는 Google Analytics와 브라우저 식별용 쿠키를 사용해 방문한 페이지, 작품 클릭, 참여 시간 등의 이용 정보를 측정합니다. 통계는 사이트 운영자가 확인하며 공개하지 않습니다. 아래에서 현재 브라우저의 수집을 제외할 수 있어요. <a href="https://policies.google.com/technologies/partner-sites?hl=ko" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Google의 정보 처리 안내</a></p>
        <div role="status" className="my-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="font-semibold">{excluded ? '이 브라우저의 방문은 통계에서 제외됩니다.' : '이 브라우저는 방문 제외가 설정되지 않았습니다.'}</p>
          <p className="text-sm text-neutral-500 leading-relaxed mt-3">이 설정 화면의 방문은 항상 집계하지 않습니다. 방문 제외는 앞으로의 기록에 적용됩니다.</p>
        </div>
        <button onClick={() => update(!excluded)} className="rounded-full bg-black text-white px-7 py-4 text-sm font-semibold hover:bg-neutral-700 transition-colors">
          {excluded ? '방문 제외 해제' : '이 브라우저의 내 방문 제외'}
        </button>
        {error && <p role="alert" className="text-red-700 mt-4 text-sm">{error}</p>}
        <p className="text-sm text-neutral-500 leading-relaxed mt-8">휴대폰이나 다른 브라우저에서도 이 페이지를 열어 각각 설정해 주세요. 쿠키와 사이트 데이터를 삭제하면 다시 설정해야 합니다.</p>
        <a href="/" className="inline-block mt-8 text-sm underline underline-offset-4">홈페이지로 돌아가기</a>
      </div>
    </main>
  );
}
