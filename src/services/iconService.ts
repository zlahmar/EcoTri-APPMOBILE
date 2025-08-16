import { colors } from '../styles/colors';

export class IconService {
  static getRecyclingIconName(type: string): string {
    switch (type.toLowerCase()) {
      case 'plastic':
        return 'local-drink';
      case 'paper':
        return 'article';
      case 'glass':
        return 'wine-bar';
      case 'metal':
        return 'hardware';
      case 'organic':
        return 'eco';
      case 'electronic':
        return 'devices';
      case 'textile':
        return 'checkroom';
      default:
        return 'recycling';
    }
  }

  static getUIIconName(name: string): string {
    switch (name) {
      case 'camera':
        return 'camera-alt';
      case 'gallery':
        return 'photo-library';
      case 'scan':
        return 'qr-code-scanner';
      case 'profile':
        return 'person';
      case 'collecte':
        return 'inventory';
      case 'conseils':
        return 'lightbulb';
      case 'home':
        return 'home';
      case 'settings':
        return 'settings';
      case 'logout':
        return 'logout';
      case 'login':
        return 'login';
      case 'signup':
        return 'person-add';
      case 'close':
        return 'close';
      case 'check':
        return 'check';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'help';
    }
  }

  static getMLKitIconName(name: string): string {
    switch (name) {
      case 'object-detection':
        return 'visibility';
      case 'barcode':
        return 'qr-code';
      case 'text-recognition':
        return 'text-fields';
      case 'face-detection':
        return 'face';
      case 'segmentation':
        return 'crop-square';
      case 'pose-detection':
        return 'accessibility';
      case 'ai':
        return 'psychology';
      default:
        return 'auto-awesome';
    }
  }

  static getEnvironmentalIconName(name: string): string {
    switch (name) {
      case 'co2':
        return 'cloud';
      case 'energy':
        return 'flash-on';
      case 'water':
        return 'water-drop';
      case 'tree':
        return 'park';
      case 'recycle':
        return 'recycling';
      case 'earth':
        return 'public';
      case 'leaf':
        return 'eco';
      default:
        return 'nature';
    }
  }

  static getMetricsIconName(name: string): string {
    switch (name) {
      case 'chart':
        return 'bar-chart';
      case 'analytics':
        return 'analytics';
      case 'progress':
        return 'trending-up';
      case 'target':
        return 'gps-fixed';
      case 'achievement':
        return 'emoji-events';
      case 'score':
        return 'stars';
      default:
        return 'assessment';
    }
  }

  static getActionIconName(name: string): string {
    switch (name) {
      case 'add':
        return 'add';
      case 'edit':
        return 'edit';
      case 'delete':
        return 'delete';
      case 'save':
        return 'save';
      case 'share':
        return 'share';
      case 'download':
        return 'download';
      case 'upload':
        return 'upload';
      case 'search':
        return 'search';
      case 'filter':
        return 'filter-list';
      case 'sort':
        return 'sort';
      case 'refresh':
        return 'refresh';
      case 'back':
        return 'arrow-back';
      case 'forward':
        return 'arrow-forward';
      case 'menu':
        return 'menu';
      case 'more':
        return 'more-vert';
      default:
        return 'touch-app';
    }
  }

  static getStatusIconName(name: string): string {
    switch (name) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'loading':
        return 'hourglass-empty';
      case 'done':
        return 'done-all';
      case 'pending':
        return 'schedule';
      default:
        return 'help';
    }
  }

  static getRecyclingIcon(type: string, size: number = 24, color?: string) {
    const iconName = this.getRecyclingIconName(type);
    const iconColor = color || colors.primary;
    return { iconName, size, color: iconColor };
  }

  static getUIIcon(name: string, size: number = 24, color?: string) {
    const iconName = this.getUIIconName(name);
    const iconColor = color || colors.text;
    return { iconName, size, color: iconColor };
  }
}

export default IconService;
