import { ref } from 'vue';
import { useNuxtApp } from '#app';

type ColorMap = { [key: string]: string };

export function useColorUtils() {
  const nuxtApp = useNuxtApp();
  const repoColors = ref<ColorMap>({});

  const initColors = () => {
    if (process.client) {
      const storedColors = localStorage.getItem('repoColors');
      if (storedColors) {
        repoColors.value = JSON.parse(storedColors);
      }
    }
  };

  const saveColors = () => {
    if (process.client) {
      localStorage.setItem('repoColors', JSON.stringify(repoColors.value));
    }
  };

  const getColorForRepo = (repoName: string): string => {
    if (!process.client) {
      // Return a default color for SSR
      return 'hsla(0, 70%, 60%, 0.7)';
    }

    if (repoColors.value[repoName]) {
      return repoColors.value[repoName];
    }
    
    const newColor = generateDistinctColor(Object.values(repoColors.value));
    repoColors.value[repoName] = newColor;
    saveColors();
    return newColor;
  };

  const generateDistinctColor = (existingColors: string[]): string => {
    const goldenRatioConjugate = 0.618033988749895;
    let hue = Math.random();
    const maxAttempts = 20;
    
    const getHSLAColor = (h: number): string => `hsla(${Math.floor(h * 360)}, 70%, 60%, 0.7)`;
    
    const isDistinct = (color: string, existingColors: string[]): boolean => {
      return existingColors.every(existingColor => {
        const hue1 = parseInt(color.match(/hsla\((\d+)/)?.[1] ?? '0');
        const hue2 = parseInt(existingColor.match(/hsla\((\d+)/)?.[1] ?? '0');
        const hueDiff = Math.min(Math.abs(hue1 - hue2), 360 - Math.abs(hue1 - hue2));
        return hueDiff > 30;
      });
    };
    
    for (let i = 0; i < maxAttempts; i++) {
      hue += goldenRatioConjugate;
      hue %= 1;
      const color = getHSLAColor(hue);
      if (existingColors.length === 0 || isDistinct(color, existingColors)) {
        return color;
      }
    }
    
    return getHSLAColor(hue);
  };

  // Initialize colors when the composable is used
  initColors();

  return {
    getColorForRepo,
    generateDistinctColor
  };
}