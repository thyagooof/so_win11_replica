import { Store } from './store.js';
import * as UiRenderer from './system/uiRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Detect Dark Mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        Store.state.isDark = true;
    }
    
    // Initialize UI
    UiRenderer.init();
    
    console.log("Windows 11 Web Loaded");
});
