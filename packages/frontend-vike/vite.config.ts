import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react(), vike()],
  ssr: {
    external: ['@l2beat/config'],
  },
}

export default config
