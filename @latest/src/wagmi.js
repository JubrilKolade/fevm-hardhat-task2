// wagmi.js or wagmiConfig.js
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { filecoinCalibration } from 'wagmi/chains';
import { createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    appName: 'My Todo App',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // from cloud.walletconnect.com
    chains: [filecoinCalibration],
  })
);

export default config;
