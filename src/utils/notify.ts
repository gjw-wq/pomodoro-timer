export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/** 请求通知权限，返回最新权限状态；不支持时返回 null */
export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!isNotificationSupported()) {
    return null;
  }
  if (Notification.permission !== "default") {
    return Notification.permission;
  }
  return await Notification.requestPermission();
}

/** 发送系统通知（仅在已授权时生效） */
export function sendNotification(title: string, body: string): void {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return;
  }
  try {
    const notification = new Notification(title, {
      body,
      tag: "pomodoro-phase-end",
    });
    // 用户点击通知时回到计时页面
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    // 部分环境（如 Android WebView）不支持构造函数，静默降级
  }
}
