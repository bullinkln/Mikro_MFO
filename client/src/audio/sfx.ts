// Заглушки для звуков (в реальном проекте будут настоящие аудиофайлы)
const sounds = {
  head: null as HTMLAudioElement | null,
  body: null as HTMLAudioElement | null,
  limb: null as HTMLAudioElement | null,
};

export function playHitSound(zone: string) {
  // В реальном проекте здесь будет воспроизведение звука
  console.log(`🔊 Playing hit sound for zone: ${zone}`);
  
  // Заглушка для демонстрации
  const sfx = sounds[zone as keyof typeof sounds];
  if (sfx) {
    sfx.currentTime = 0;
    sfx.play().catch(() => {
      // Игнорируем ошибки воспроизведения (пользователь не разрешил аудио)
    });
  }
}

export function vibrate(zone: string) {
  if (!("vibrate" in navigator)) return;
  
  const pattern = zone === "head" ? [100, 50, 100] : [60];
  navigator.vibrate(pattern);
  
  console.log(`📳 Vibration for zone: ${zone}`);
}

