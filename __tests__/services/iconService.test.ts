import { IconService } from '../../src/services/iconService';

describe('IconService', () => {
  describe('getRecyclingIconName', () => {
    it('should return correct icons for main waste types', () => {
      expect(IconService.getRecyclingIconName('plastic')).toBe('local-drink');
      expect(IconService.getRecyclingIconName('paper')).toBe('article');
      expect(IconService.getRecyclingIconName('glass')).toBe('wine-bar');
      expect(IconService.getRecyclingIconName('metal')).toBe('hardware');
    });

    it('should return default icon for unknown type', () => {
      expect(IconService.getRecyclingIconName('unknown')).toBe('recycling');
    });
  });

  describe('getUIIconName', () => {
    it('should return correct icons for main UI elements', () => {
      expect(IconService.getUIIconName('camera')).toBe('camera-alt');
      expect(IconService.getUIIconName('home')).toBe('home');
      expect(IconService.getUIIconName('profile')).toBe('person');
      expect(IconService.getUIIconName('settings')).toBe('settings');
    });

    it('should return default icon for unknown name', () => {
      expect(IconService.getUIIconName('unknown')).toBe('help');
    });
  });

  describe('getMLKitIconName', () => {
    it('should return correct icons for main ML features', () => {
      expect(IconService.getMLKitIconName('object-detection')).toBe('visibility');
      expect(IconService.getMLKitIconName('barcode')).toBe('qr-code');
      expect(IconService.getMLKitIconName('ai')).toBe('psychology');
    });

    it('should return default icon for unknown name', () => {
      expect(IconService.getMLKitIconName('unknown')).toBe('auto-awesome');
    });
  });

  describe('getEnvironmentalIconName', () => {
    it('should return correct icons for main environmental concepts', () => {
      expect(IconService.getEnvironmentalIconName('co2')).toBe('cloud');
      expect(IconService.getEnvironmentalIconName('energy')).toBe('flash-on');
      expect(IconService.getEnvironmentalIconName('recycle')).toBe('recycling');
    });

    it('should return default icon for unknown name', () => {
      expect(IconService.getEnvironmentalIconName('unknown')).toBe('nature');
    });
  });

  describe('getMetricsIconName', () => {
    it('should return correct icons for main metrics', () => {
      expect(IconService.getMetricsIconName('chart')).toBe('bar-chart');
      expect(IconService.getMetricsIconName('progress')).toBe('trending-up');
      expect(IconService.getMetricsIconName('achievement')).toBe('emoji-events');
    });

    it('should return default icon for unknown name', () => {
      expect(IconService.getMetricsIconName('unknown')).toBe('assessment');
    });
  });

  describe('getActionIconName', () => {
    it('should return correct icons for main actions', () => {
      expect(IconService.getActionIconName('add')).toBe('add');
      expect(IconService.getActionIconName('edit')).toBe('edit');
      expect(IconService.getActionIconName('delete')).toBe('delete');
      expect(IconService.getActionIconName('search')).toBe('search');
    });

    it('should return default icon for unknown name', () => {
      expect(IconService.getActionIconName('unknown')).toBe('touch-app');
    });
  });

  describe('getStatusIconName', () => {
    it('should return correct icons for main statuses', () => {
      expect(IconService.getStatusIconName('success')).toBe('check-circle');
      expect(IconService.getStatusIconName('error')).toBe('error');
      expect(IconService.getStatusIconName('warning')).toBe('warning');
      expect(IconService.getStatusIconName('done')).toBe('done-all');
    });

    it('should return default icon for unknown status', () => {
      expect(IconService.getStatusIconName('unknown')).toBe('help');
    });
  });
});
