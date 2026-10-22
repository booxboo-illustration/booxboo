import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

function setup({ hostname = 'www.booxboo.me', pathname = '/', id = 'G-TEST123', excluded = false } = {}) {
  const source = transformSync(readFileSync(new URL('../src/analytics.ts', import.meta.url), 'utf8'), {
    loader: 'ts', format: 'cjs', define: { 'import.meta.env.VITE_GA_MEASUREMENT_ID': JSON.stringify(id) },
  }).code;
  let now = 0;
  let focused = true;
  const stored = new Map(excluded ? [['booxboo_analytics_excluded', 'true']] : []);
  const cookies = new Map();
  const listeners = new Map();
  const timers = new Set();
  const scripts = [];
  const location = { hostname, pathname, origin: `https://${hostname}`, protocol: 'https:' };
  const events = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); },
  };
  const document = {
    ...events, visibilityState: 'visible', hasFocus: () => focused,
    createElement: () => ({}), head: { appendChild: script => scripts.push(script) },
    get cookie() { return [...cookies].map(([key, value]) => `${key}=${value}`).join('; '); },
    set cookie(value) { const [key, data] = value.split(';')[0].split('='); cookies.set(key, data); },
  };
  const window = {
    ...events, setInterval: fn => { timers.add(fn); return fn; }, clearInterval: fn => timers.delete(fn),
  };
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, window, document, location,
    localStorage: { getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value) },
    performance: { now: () => now },
  });
  return {
    api: module.exports, scripts, window, document, location, stored, listeners, timers,
    events: () => (window.dataLayer || []).map(args => Array.from(args)).filter(args => args[0] === 'event'),
    advance(seconds) { for (let i = 0; i < seconds; i++) { now += 1000; for (const fn of timers) fn(); } },
    setFocused(value) { focused = value; listeners.get(value ? 'focus' : 'blur')?.(); },
  };
}

test('owner visits, previews, settings and missing configuration never load Google or send events', () => {
  for (const options of [{ excluded: true }, { hostname: 'localhost' }, { hostname: 'preview.netlify.app' },
    { pathname: '/analytics-settings' }, { pathname: '/analytics-settings/' }, { id: '' }]) {
    const state = setup(options);
    state.api.trackPage('/project/23', 'BOO!', { id: 23, title: 'BOO!' });
    state.api.trackEvent('contact_click');
    assert.equal(state.scripts.length, 0);
    assert.equal(state.events().length, 0);
  }
});

test('page transitions count once, revisiting a project counts again, and initialization has no extra page view', () => {
  const state = setup();
  state.api.trackPage('/', 'Home');
  state.api.trackPage('/', 'Home');
  state.api.trackPage('/project/23', 'BOO!', { id: 23, title: 'BOO!' });
  state.api.trackPage('/project/23', 'BOO!', { id: 23, title: 'BOO!' });
  state.api.trackPage('/projects', 'Work');
  state.api.trackPage('/project/23', 'BOO!', { id: 23, title: 'BOO!' });
  assert.equal(state.scripts.length, 1);
  assert.equal(state.events().filter(event => event[1] === 'page_view').length, 4);
  assert.equal(state.events().filter(event => event[1] === 'project_view').length, 2);
  const config = state.window.dataLayer.map(args => Array.from(args)).find(args => args[0] === 'config');
  assert.equal(config[2].send_page_view, false);
  assert.equal(config[2].allow_google_signals, false);
});

test('opting out persists and immediately blocks subsequent events in this and other open tabs', () => {
  const state = setup();
  state.api.trackPage('/', 'Home');
  assert.equal(state.api.setAnalyticsExcluded(true), true);
  assert.equal(state.api.isAnalyticsExcluded(), true);
  assert.equal(state.window['ga-disable-G-TEST123'], true);
  state.api.trackEvent('project_click');
  assert.equal(state.events().length, 1);
  state.window['ga-disable-G-TEST123'] = false;
  state.listeners.get('storage')({ key: 'booxboo_analytics_excluded' });
  assert.equal(state.window['ga-disable-G-TEST123'], true);
});

test('project interest requires 30 foreground seconds and fires only once per page visit', () => {
  const state = setup();
  const stop = state.api.watchProjectInterest({ id: 23, title: 'BOO!' });
  state.advance(15);
  state.setFocused(false);
  state.advance(90);
  state.setFocused(true);
  state.advance(14);
  assert.equal(state.events().length, 0);
  state.advance(1);
  assert.equal(state.events()[0][1], 'project_interest');
  state.advance(60);
  assert.equal(state.events().length, 1);
  stop();
  assert.equal(state.timers.size, 0);
});
