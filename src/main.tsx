import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { App as AntApp, ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import azAZ from 'antd/locale/az_AZ'
import dayjs from 'dayjs'
import 'dayjs/locale/az'
import './index.css'
import App from './App.tsx'
import { antdTheme } from './theme/antdTheme.ts'
import { store } from './store'

dayjs.locale('az')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider theme={antdTheme} locale={azAZ}>
        <AntApp>
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
)
