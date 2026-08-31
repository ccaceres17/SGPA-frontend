/**
 * Hand-written outline icon set (24x24 viewBox, stroke-based). Each entry is
 * a list of simple SVG shape descriptors rendered by Icon.svelte, which sets
 * fill/stroke/stroke-width once on the <svg> root — SVG presentation
 * attributes are inherited, so child shapes below only need geometry.
 *
 * No icon library dependency: this project has none, and the brief asks to
 * build lightweight components instead of adding one just for icons.
 */

export const ICONS = {
  sun: [
    { tag: 'circle', cx: 12, cy: 12, r: 4 },
    { tag: 'line', x1: 12, y1: 1.5, x2: 12, y2: 4 },
    { tag: 'line', x1: 12, y1: 20, x2: 12, y2: 22.5 },
    { tag: 'line', x1: 4.2, y1: 4.2, x2: 6, y2: 6 },
    { tag: 'line', x1: 18, y1: 18, x2: 19.8, y2: 19.8 },
    { tag: 'line', x1: 1.5, y1: 12, x2: 4, y2: 12 },
    { tag: 'line', x1: 20, y1: 12, x2: 22.5, y2: 12 },
    { tag: 'line', x1: 4.2, y1: 19.8, x2: 6, y2: 18 },
    { tag: 'line', x1: 18, y1: 6, x2: 19.8, y2: 4.2 }
  ],
  moon: [
    { tag: 'path', d: 'M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z' }
  ],
  search: [
    { tag: 'circle', cx: 10.5, cy: 10.5, r: 6.5 },
    { tag: 'line', x1: 15.5, y1: 15.5, x2: 21, y2: 21 }
  ],
  folder: [
    { tag: 'path', d: 'M3 6.5a1.5 1.5 0 0 1 1.5-1.5h4.5l2 2.5h8.5A1.5 1.5 0 0 1 21 9v8.5A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z' }
  ],
  'file-text': [
    { tag: 'path', d: 'M6 2.75h8l4 4v13.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.75a1 1 0 0 1 1-1Z' },
    { tag: 'path', d: 'M14 2.75v4h4' },
    { tag: 'line', x1: 8, y1: 12, x2: 16, y2: 12 },
    { tag: 'line', x1: 8, y1: 16, x2: 16, y2: 16 }
  ],
  download: [
    { tag: 'path', d: 'M12 3v12' },
    { tag: 'path', d: 'M7 10l5 5 5-5' },
    { tag: 'path', d: 'M4 19.5h16' }
  ],
  trash: [
    { tag: 'path', d: 'M4 6.5h16' },
    { tag: 'path', d: 'M8.5 6.5V4.75a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1V6.5' },
    { tag: 'path', d: 'M6.5 6.5 7.3 19.2a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.7' },
    { tag: 'line', x1: 10, y1: 10.5, x2: 10, y2: 16.5 },
    { tag: 'line', x1: 14, y1: 10.5, x2: 14, y2: 16.5 }
  ],
  check: [{ tag: 'path', d: 'M4.5 12.5 9.5 17.5 19.5 6.5' }],
  'check-circle': [
    { tag: 'circle', cx: 12, cy: 12, r: 9 },
    { tag: 'path', d: 'M7.5 12.5 10.3 15.3 16.5 8.5' }
  ],
  'x-circle': [
    { tag: 'circle', cx: 12, cy: 12, r: 9 },
    { tag: 'line', x1: 9, y1: 9, x2: 15, y2: 15 },
    { tag: 'line', x1: 15, y1: 9, x2: 9, y2: 15 }
  ],
  'alert-triangle': [
    { tag: 'path', d: 'M12 3.5 21.5 20h-19Z' },
    { tag: 'line', x1: 12, y1: 9.5, x2: 12, y2: 13.5 },
    { tag: 'circle', cx: 12, cy: 16.5, r: 0.6, fill: 'currentColor' }
  ],
  inbox: [
    { tag: 'path', d: 'M3.5 12.5h5l1.5 2.5h4l1.5-2.5h5' },
    { tag: 'path', d: 'M3.5 12.5 5.8 5.2A1.5 1.5 0 0 1 7.2 4h9.6a1.5 1.5 0 0 1 1.4 1.2l2.3 7.3v5.3a1.5 1.5 0 0 1-1.5 1.5h-14a1.5 1.5 0 0 1-1.5-1.5Z' }
  ],
  circle: [{ tag: 'circle', cx: 12, cy: 12, r: 5, fill: 'currentColor', stroke: 'none' }],
  clock: [
    { tag: 'circle', cx: 12, cy: 12, r: 9 },
    { tag: 'path', d: 'M12 7v5.5l3.5 2' }
  ],
  calendar: [
    { tag: 'path', d: 'M4.5 5.5h15a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z' },
    { tag: 'line', x1: 8, y1: 3, x2: 8, y2: 7.5 },
    { tag: 'line', x1: 16, y1: 3, x2: 16, y2: 7.5 },
    { tag: 'line', x1: 3.5, y1: 10.5, x2: 20.5, y2: 10.5 }
  ],
  'book-open': [
    { tag: 'path', d: 'M12 6.5c-1.7-1.3-4.2-2-7-2v13c2.8 0 5.3.7 7 2 1.7-1.3 4.2-2 7-2v-13c-2.8 0-5.3.7-7 2Z' },
    { tag: 'line', x1: 12, y1: 6.5, x2: 12, y2: 19.5 }
  ],
  mail: [
    { tag: 'path', d: 'M4 5.5h16a1 1 0 0 1 1 1V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z' },
    { tag: 'path', d: 'M3.5 6.5 12 13l8.5-6.5' }
  ],
  key: [
    { tag: 'circle', cx: 8, cy: 15, r: 4 },
    { tag: 'path', d: 'M11 12 19.5 3.5' },
    { tag: 'path', d: 'M16 7l2.5 2.5' },
    { tag: 'path', d: 'M18.5 4.5 21 7' }
  ],
  'chevron-left': [{ tag: 'path', d: 'M15 4.5 6.5 12l8.5 7.5' }],
  'chevron-right': [{ tag: 'path', d: 'M9 4.5 17.5 12 9 19.5' }],
  users: [
    { tag: 'circle', cx: 9, cy: 8, r: 3.2 },
    { tag: 'path', d: 'M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5' },
    { tag: 'path', d: 'M15.5 6c1.7.2 3 1.6 3 3.3 0 1.4-.9 2.6-2.1 3.1' },
    { tag: 'path', d: 'M17 13.8c2.3.6 4 2.5 4 5.2' }
  ],
  user: [
    { tag: 'circle', cx: 12, cy: 8, r: 3.5 },
    { tag: 'path', d: 'M5 19.5c0-3.6 3.1-6 7-6s7 2.4 7 6' }
  ],
  'user-circle': [
    { tag: 'circle', cx: 12, cy: 12, r: 9 },
    { tag: 'circle', cx: 12, cy: 9.8, r: 2.8 },
    { tag: 'path', d: 'M6.2 18.2c1-2.6 3.2-4 5.8-4s4.8 1.4 5.8 4' }
  ],
  'graduation-cap': [
    { tag: 'path', d: 'M2.5 9.5 12 5l9.5 4.5-9.5 4.5-9.5-4.5Z' },
    { tag: 'path', d: 'M6.5 11.5v4.2c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.2' },
    { tag: 'line', x1: 21, y1: 9.5, x2: 21, y2: 15.5 }
  ],
  globe: [
    { tag: 'circle', cx: 12, cy: 12, r: 9 },
    { tag: 'path', d: 'M3 12h18' },
    { tag: 'path', d: 'M12 3c2.4 2.4 3.6 5.6 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.6-3.6-9S9.6 5.4 12 3Z' }
  ],
  list: [
    { tag: 'line', x1: 8.5, y1: 6.5, x2: 20, y2: 6.5 },
    { tag: 'line', x1: 8.5, y1: 12, x2: 20, y2: 12 },
    { tag: 'line', x1: 8.5, y1: 17.5, x2: 20, y2: 17.5 },
    { tag: 'circle', cx: 4.5, cy: 6.5, r: 0.9, fill: 'currentColor' },
    { tag: 'circle', cx: 4.5, cy: 12, r: 0.9, fill: 'currentColor' },
    { tag: 'circle', cx: 4.5, cy: 17.5, r: 0.9, fill: 'currentColor' }
  ],
  'arrow-right': [
    { tag: 'line', x1: 4, y1: 12, x2: 19, y2: 12 },
    { tag: 'path', d: 'M13 6l6 6-6 6' }
  ],
  info: [
    { tag: 'circle', cx: 12, cy: 12, r: 9 },
    { tag: 'line', x1: 12, y1: 11, x2: 12, y2: 16 },
    { tag: 'circle', cx: 12, cy: 7.5, r: 0.6, fill: 'currentColor' }
  ],
  bell: [
    { tag: 'path', d: 'M6 10.5a6 6 0 0 1 12 0v4l1.8 2.5H4.2L6 14.5Z' },
    { tag: 'path', d: 'M10 19.5a2 2 0 0 0 4 0' }
  ],
  settings: [
    { tag: 'circle', cx: 12, cy: 12, r: 3.2 },
    { tag: 'path', d: 'M12 2.5v2.4M12 19.1v2.4M4.6 6.6l1.7 1.7M17.7 15.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 17.4l1.7-1.7M17.7 8.3l1.7-1.7' }
  ]
};
