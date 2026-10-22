import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPage, watchProjectInterest } from '../analytics';

type Project = { id: number; title: string };

export default function Analytics({ projects }: { projects: Project[] }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const project = projects.find(item => pathname === `/project/${item.id}`);
    const pageName = project?.title || ({ '/': 'Home', '/projects': 'Work', '/about': 'About', '/analytics-settings': '내 방문 제외 설정' }[pathname]);
    if (!pageName) return;
    document.title = `${pageName} | BOOxBOO . ILLUSTRATION`;
    trackPage(pathname, document.title, project);
    return project ? watchProjectInterest(project) : undefined;
  }, [pathname, projects]);

  useEffect(() => {
    let lastClick = { href: '', time: 0 };
    const onClick = (event: MouseEvent) => {
      if (event.type === 'auxclick' && event.button !== 1) return;
      if (event.type === 'click' && event.button !== 0) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const now = performance.now();
      if (lastClick.href === link.href && now - lastClick.time < 1000) return;
      lastClick = { href: link.href, time: now };
      const url = new URL(link.href, location.origin);
      const project = url.origin === location.origin && projects.find(item => url.pathname === `/project/${item.id}`);
      if (project) {
        trackEvent('project_click', { project_id: String(project.id), project_name: project.title, source_page: location.pathname });
      } else if (url.protocol === 'mailto:') {
        trackEvent('contact_click', { contact_method: 'email', source_page: location.pathname });
      }
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, [projects]);
  return null;
}
