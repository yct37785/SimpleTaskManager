
  "use client";
  import { createTheme } from '@mui/material';

  const theme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
  });

  export default theme;
  