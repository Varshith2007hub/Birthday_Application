import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ItsYourBirthday.com',
  appName: 'ItsYourBirthday',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
