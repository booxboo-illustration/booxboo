import { useState, useRef, type FormEvent } from 'react';
import { sections } from './inquiryFields';

export default function InquiryForm() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const result = useRef<HTMLDivElement>(null);
  const style = 'w-full bg-neutral-950 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/70';
  function fail(message: string) { setError(message); setStatus('error'); requestAnimationFrame(() => result.current?.focus()); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const body = new FormData(form);
    const styleFile = body.get('styleImage');
    if (!String(body.get('style') || '').trim() && !(styleFile instanceof File && styleFile.size)) {
      fail('BOOxBOO 작업 중 원하는 스타일의 이미지를 첨부하거나 작업물 링크를 작성해주세요.');
      (form.elements.namedItem('style') as HTMLTextAreaElement)?.focus();
      return;
    }
    if (body.get('projectType') === '기타' && !String(body.get('projectTypeOther') || '').trim()) {
      fail('기타 의뢰 분야를 작성해주세요.');
      (form.elements.namedItem('projectTypeOther') as HTMLInputElement)?.focus();
      return;
    }
    let size = 0;
    body.forEach(value => { size += value instanceof File ? value.size : new TextEncoder().encode(value).length; });
    if (size > 7 * 1024 * 1024) { fail('첨부 파일 합계는 7MB 이하로 올려주세요. 큰 자료는 공유 링크로 남겨주세요.'); return; }
    body.forEach((value, key) => { if (value instanceof File && !value.size) body.delete(key); });
    setError(''); setStatus('sending');
    try {
      const response = await fetch('/', { method: 'POST', body });
      if (!response.ok) throw new Error('Submission failed');
      form.reset(); setStatus('success');
      requestAnimationFrame(() => result.current?.focus());
    } catch { fail('전송하지 못했습니다. 입력 내용은 그대로 남아 있습니다. 다시 시도하거나 boox2boox2boo@gmail.com으로 보내주세요.'); }
  }
  return <section id="inquiry" className="scroll-mt-28 px-6 md:px-20 py-20 border-t border-white/10">
    <div className="max-w-4xl mx-auto">
      <p className="text-xs tracking-widest text-neutral-500 mb-5">PROJECT INQUIRY</p>
      <h2 className="text-3xl md:text-5xl tracking-tight leading-tight">프로젝트 작업 의뢰 폼</h2>
      <p className="mt-6 text-neutral-300 leading-relaxed">작업 가능 여부, 일정 및 견적 검토를 위한 사전 질문입니다. 작성해주시면 검토 후 기재하신 연락처로 회신드리겠습니다.</p>
      <p className="mt-4 text-neutral-400 leading-relaxed">아직 정해지지 않은 내용이나 해당 사항이 없는 항목은 <strong className="text-white">‘미정’, ‘협의 필요’, ‘해당 없음’</strong>으로 작성해주세요.<br /><strong className="text-white">* 표시는 필수 항목입니다.</strong></p>
      <form name="project-inquiry" method="POST" encType="multipart/form-data" onSubmit={submit} className="mt-12 space-y-12">
        <input type="hidden" name="form-name" value="project-inquiry" />
        <div hidden><label>Leave empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
        <fieldset disabled={status === 'sending'} className="space-y-12 min-w-0">
        {sections.map(([title, fields]) => <fieldset key={title} className="border-t border-white/15 pt-8 min-w-0">
          <legend className="text-xl md:text-2xl font-semibold pr-4">{title}</legend>
          <div className="grid gap-7 mt-4">{fields.map(field => {
            const id = `inquiry-${field.name}`;
            const hintId = `${id}-hint`;
            const label = <span className="text-base font-medium">{field.label}{field.required || field.name === 'style' ? ' *' : ''}</span>;
            const hint = field.hint ? <p id={hintId} className="text-sm text-neutral-400 leading-relaxed">{field.hint}</p> : null;
            if (field.kind === 'checkbox') return <fieldset key={id} className="space-y-3"><legend>{label}</legend>{hint}<div className="flex flex-wrap gap-x-6 gap-y-3">{field.options.map(option => <label key={option} className="flex items-center gap-2 text-sm"><input type="checkbox" name={field.name} value={option} className="accent-white w-4 h-4" />{option}</label>)}</div></fieldset>;
            return <div key={id} className="space-y-2"><label htmlFor={id}>{label}</label>{hint}
              {field.kind === 'textarea' ? <textarea id={id} name={field.name} required={field.required} aria-describedby={hint ? hintId : undefined} rows={4} maxLength={10000} className={style} />
              : field.kind === 'select' ? <select id={id} name={field.name} required={field.required} defaultValue="" className={style}><option value="">선택해주세요</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
              : <input id={id} name={field.name} required={field.required} aria-describedby={hint ? hintId : undefined} type={field.kind} accept={field.name === 'styleImage' ? 'image/*' : field.kind === 'file' ? '.jpg,.jpeg,.png,.webp,.gif,.pdf,.zip,.psd,.ai,.svg,.doc,.docx,.ppt,.pptx' : undefined} maxLength={field.kind === 'file' ? undefined : 500} autoComplete={field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : field.name === 'name' ? 'name' : field.name === 'company' ? 'organization' : undefined} className={style} />}
            </div>;
          })}</div>
        </fieldset>)}
        <p className="text-sm text-neutral-400 leading-relaxed">첨부 파일은 항목당 1개, 전체 합계 7MB 이하로 올려주세요. 여러 자료나 큰 파일은 공유 링크로 남겨주세요.</p>
        <p className="text-xs text-neutral-500 leading-relaxed">입력하신 연락처와 의뢰 내용은 문의 확인 및 회신에 사용됩니다.</p>
        <button type="submit" className="bg-white text-black rounded-full px-8 py-4 font-semibold hover:bg-neutral-200 disabled:opacity-60">{status === 'sending' ? '보내는 중…' : '의뢰 보내기 →'}</button>
        </fieldset>
        <div ref={result} tabIndex={-1} aria-live="polite" aria-atomic="true" className="outline-none">
          {status === 'success' && <div role="status" className="border border-white/20 rounded-xl p-6 leading-relaxed"><p>의뢰가 접수되었습니다. 검토 후 기재하신 연락처로 회신드리겠습니다.</p><p className="mt-2 text-neutral-400">폼 제출만으로 작업 예약이나 계약이 확정되지는 않습니다.</p></div>}
          {status === 'error' && <p role="alert" className="text-sm text-red-300 leading-relaxed">{error}</p>}
        </div>
      </form>
    </div>
  </section>;
}
