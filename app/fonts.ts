import localFont from 'next/font/local';

// Circular font - using local files
export const circular = localFont({
  src: [
    {
      path: '../public/fonts/CircularStd-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CircularStd-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/CircularStd-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-circular',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

// Monospace font for code
export const jetbrainsMono = localFont({
  src: [
    {
      path: '../public/fonts/JetBrainsMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['monospace'],
});
