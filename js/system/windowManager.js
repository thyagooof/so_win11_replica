import { Store } from '../store.js';
import { APP_ID } from '../config.js';
import * as UiRenderer from './uiRenderer.js';

export function openApp(id) {
    const existing = Store.state.windows.find(w => w.id === id);
    if (existing) {
        if (existing.isMinimized) existing.isMinimized = false;
        focusWindow(id);
    } else {
        Store.state.windows.push({
            id,
            title: Store.t.apps[id] || id, // Fallback para Web Apps
            zIndex: ++Store.state.nextZIndex,
            isMinimized: false,
            isMaximized: false,
            position: { x: 100 + (Store.state.windows.length * 30), y: 50 + (Store.state.windows.length * 30) },
            size: id === APP_ID.CALCULATOR ? { width: 320, height: 480 } : { width: 900, height: 600 }
        });
        Store.state.isStartOpen = false;
    }
    UiRenderer.renderAll();
}

export function closeWindow(id) {
    Store.state.windows = Store.state.windows.filter(w => w.id !== id);
    UiRenderer.renderWindows();
    UiRenderer.renderTaskbar();
}

export function minimizeWindow(id) {
    const w = Store.state.windows.find(w => w.id === id);
    if (w) w.isMinimized = true;
    UiRenderer.renderWindows();
    UiRenderer.renderTaskbar();
}

export function maximizeWindow(id) {
    const w = Store.state.windows.find(w => w.id === id);
    if (w) w.isMaximized = !w.isMaximized;
    UiRenderer.renderWindows();
}

export function focusWindow(id) {
    const w = Store.state.windows.find(w => w.id === id);
    if (w) {
        w.zIndex = ++Store.state.nextZIndex;
        const el = document.getElementById(`window-${id}`);
        if(el) el.style.zIndex = w.zIndex;
        UiRenderer.renderTaskbar();
    }
}

export function startDrag(e, id) {
    const win = Store.state.windows.find(w => w.id === id);
    if(win.isMaximized) return;
    
    const el = document.getElementById(`window-${id}`);
    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialLeft = win.position.x;
    const initialTop = win.position.y;
    
    function onMove(me) {
        win.position.x = initialLeft + (me.clientX - initialX);
        win.position.y = initialTop + (me.clientY - initialY);
        el.style.left = win.position.x + 'px';
        el.style.top = win.position.y + 'px';
    }
    
    function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
}
