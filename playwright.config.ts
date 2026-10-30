import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{channel:'chrome',headless:true},webServer:{command:'npm run start -- --port 3001',url:'http://localhost:3001',reuseExistingServer:false}});
