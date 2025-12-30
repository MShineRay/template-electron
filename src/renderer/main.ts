// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', async () => {
  // 检查 electronAPI 是否可用
  if (!window.electronAPI) {
    console.error('electronAPI 不可用');
    return;
  }

  // 加载应用信息
  await loadAppInfo();

  // 加载窗口状态
  await loadWindowState();

  // 设置按钮事件
  setupButtonEvents();

  // 定期更新窗口状态
  setInterval(loadWindowState, 1000);
});

async function loadAppInfo() {
  try {
    const appName = await window.electronAPI.app.getName();
    const appVersion = await window.electronAPI.app.getVersion();

    document.getElementById('app-name')!.textContent = appName;
    document.getElementById('app-version')!.textContent = appVersion;
  } catch (error) {
    console.error('加载应用信息失败:', error);
    updateStatus('加载应用信息失败');
  }
}

async function loadWindowState() {
  try {
    const state = await window.electronAPI.window.getState();
    if (state) {
      const stateText =
        [state.isMaximized && '最大化', state.isFullScreen && '全屏', state.isMinimized && '最小化']
          .filter(Boolean)
          .join(' | ') || '正常';
      document.getElementById('window-state')!.textContent = stateText;
    }
  } catch (error) {
    console.error('加载窗口状态失败:', error);
  }
}

function setupButtonEvents() {
  // 最小化按钮
  document.getElementById('btn-minimize')?.addEventListener('click', async () => {
    try {
      await window.electronAPI.window.minimize();
      updateStatus('窗口已最小化');
    } catch (error) {
      console.error('最小化窗口失败:', error);
      updateStatus('操作失败');
    }
  });

  // 最大化/还原按钮
  document.getElementById('btn-maximize')?.addEventListener('click', async () => {
    try {
      await window.electronAPI.window.maximize();
      updateStatus('窗口状态已切换');
    } catch (error) {
      console.error('最大化窗口失败:', error);
      updateStatus('操作失败');
    }
  });

  // 全屏按钮
  document.getElementById('btn-fullscreen')?.addEventListener('click', async () => {
    try {
      await window.electronAPI.window.toggleFullscreen();
      updateStatus('全屏状态已切换');
    } catch (error) {
      console.error('切换全屏失败:', error);
      updateStatus('操作失败');
    }
  });

  // 关闭按钮
  document.getElementById('btn-close')?.addEventListener('click', async () => {
    try {
      await window.electronAPI.window.close();
    } catch (error) {
      console.error('关闭窗口失败:', error);
      updateStatus('操作失败');
    }
  });
}

function updateStatus(message: string) {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = message;
    setTimeout(() => {
      statusEl.textContent = '就绪';
    }, 2000);
  }
}
