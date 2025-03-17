import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* responsive meta tag for mobile-first rendering */}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        {/* normalize styles */}
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}