import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0b6e4f',
    colorLink: '#0b6e4f',
    borderRadius: 8,
    fontFamily: '"Inter", system-ui, "Segoe UI", Roboto, sans-serif',
    controlHeightLG: 44,
  },
  components: {
    Segmented: {
      itemSelectedBg: '#ffffff',
      trackBg: '#f1f2f4',
      trackPadding: 4,
    },
    Form: {
      labelColor: '#111827',
      verticalLabelPadding: '0 0 6px',
    },
    Button: {
      fontWeight: 600,
    },
  },
}
