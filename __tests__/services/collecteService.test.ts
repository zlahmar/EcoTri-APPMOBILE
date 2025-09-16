import collecteService, { CollecteZone } from '../../src/services/collecteService';

// Mock des données de test
const mockZones: CollecteZone[] = [
  {
    gid: '1',
    commune: 'Bordeaux',
    code_commune: '33063',
    type: 'OM',
    jour_col: ['Lundi', 'Jeudi'],
    passage: 'JOUR',
    geo_point_2d: { lat: 44.837789, lon: -0.57918 },
    geo_shape: { type: 'Polygon', coordinates: [] },
    cdate: '2025-01-08T10:31:15+01:00',
    mdate: '2025-01-13T14:48:10+01:00',
  },
  {
    gid: '2',
    commune: 'Bordeaux',
    code_commune: '33063',
    type: 'TRI',
    jour_col: ['Mardi', 'Vendredi'],
    passage: 'JOUR',
    geo_point_2d: { lat: 44.837789, lon: -0.57918 },
    geo_shape: { type: 'Polygon', coordinates: [] },
    cdate: '2025-01-08T10:31:15+01:00',
    mdate: '2025-01-13T14:48:10+01:00',
  },
  {
    gid: '3',
    commune: 'Mérignac',
    code_commune: '33281',
    type: 'OM',
    jour_col: ['Mardi', 'Vendredi'],
    passage: 'JOUR',
    geo_point_2d: { lat: 44.8635, lon: -0.6442 },
    geo_shape: { type: 'Polygon', coordinates: [] },
    cdate: '2025-01-08T10:31:15+01:00',
    mdate: '2025-01-13T14:48:10+01:00',
  },
];

describe('CollecteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (collecteService as any).zones = mockZones;
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton pattern)', () => {
      const instance1 = collecteService;
      const instance2 = collecteService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('getAvailableCommunes', () => {
    it('should return unique list of communes', () => {
      const communes = collecteService.getAvailableCommunes();
      expect(communes).toEqual(['Bordeaux', 'Mérignac']);
      expect(communes.length).toBe(2);
    });

    it('should return empty array when no zones exist', () => {
      (collecteService as any).zones = [];
      const communes = collecteService.getAvailableCommunes();
      expect(communes).toEqual([]);
    });
  });

  describe('getCollecteInfo', () => {
    it('should return collecte info for existing commune', () => {
      const info = collecteService.getCollecteInfo('Bordeaux');
      expect(info).toBeDefined();
      expect(info?.commune).toBe('Bordeaux');
      expect(info?.orduresMenageres).toBeDefined();
      expect(info?.triRecyclage).toBeDefined();
    });

    it('should return null for non-existing commune', () => {
      const info = collecteService.getCollecteInfo('Inexistante');
      expect(info).toBeNull();
    });

    it('should handle case-insensitive commune names', () => {
      const info = collecteService.getCollecteInfo('bordeaux');
      expect(info).toBeDefined();
      expect(info?.commune).toBe('bordeaux');
    });
  });

  describe('findNearestZone', () => {
    it('should find nearest zone to given coordinates', () => {
      const nearestZone = collecteService.findNearestZone(44.837789, -0.57918);
      expect(nearestZone).toBeDefined();
      expect(nearestZone?.commune).toBe('Bordeaux');
    });

    it('should return null when no zones exist', () => {
      (collecteService as any).zones = [];
      const nearestZone = collecteService.findNearestZone(44.837789, -0.57918);
      expect(nearestZone).toBeNull();
    });

    it('should calculate correct distances', () => {
      const zone1 = collecteService.findNearestZone(44.837789, -0.57918); // Bordeaux
      const zone2 = collecteService.findNearestZone(44.8635, -0.6442); // Mérignac
      
      expect(zone1?.commune).toBe('Bordeaux');
      expect(zone2?.commune).toBe('Mérignac');
    });
  });

  describe('getCollecteInfoByLocation', () => {
    it('should return collecte info based on GPS coordinates', () => {
      const info = collecteService.getCollecteInfoByLocation(44.837789, -0.57918);
      expect(info).toBeDefined();
      expect(info?.commune).toBe('Bordeaux');
    });

    it('should return collecte info even for distant coordinates', () => {
      const info = collecteService.getCollecteInfoByLocation(0, 0); // Coordonnées très éloignées
      expect(info).toBeDefined();
      expect(info?.commune).toBeDefined();
    });
  });

  describe('formatCollecteDays', () => {
    it('should format single day correctly', () => {
      const formatted = collecteService.formatCollecteDays(['LUNDI']);
      expect(formatted).toBe('Lundi');
    });

    it('should format multiple days correctly', () => {
      const formatted = collecteService.formatCollecteDays(['LUNDI', 'JEUDI']);
      expect(formatted).toBe('Lundi et Jeudi');
    });

    it('should format three or more days correctly', () => {
      const formatted = collecteService.formatCollecteDays(['LUNDI', 'MERCREDI', 'VENDREDI']);
      expect(formatted).toBe('Lundi, Mercredi et Vendredi');
    });

    it('should handle empty array', () => {
      const formatted = collecteService.formatCollecteDays([]);
      expect(formatted).toBe('Aucune collecte programmée');
    });
  });

  describe('getNextCollecteDay', () => {
    it('should handle empty array', () => {
      const nextDay = collecteService.getNextCollecteDay([]);
      expect(nextDay).toBeNull();
    });
  });

  describe('calculateDistance', () => {
    it('should calculate correct distance between two points', () => {
      const distance = (collecteService as any).calculateDistance(44.837789, -0.57918, 44.8635, -0.6442);
      expect(distance).toBeGreaterThan(0);
      expect(typeof distance).toBe('number');
    });

    it('should return 0 for same coordinates', () => {
      const distance = (collecteService as any).calculateDistance(44.837789, -0.57918, 44.837789, -0.57918);
      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const distance = (collecteService as any).calculateDistance(-44.837789, -0.57918, -44.8635, -0.6442);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate correct distance between two points', () => {
      const distance = (collecteService as any).calculateDistance(44.837789, -0.57918, 44.8635, -0.6442);
      expect(distance).toBeGreaterThan(0);
      expect(typeof distance).toBe('number');
    });

    it('should return 0 for same coordinates', () => {
      const distance = (collecteService as any).calculateDistance(44.837789, -0.57918, 44.837789, -0.57918);
      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const distance = (collecteService as any).calculateDistance(-44.837789, -0.57918, -44.8635, -0.6442);
      expect(distance).toBeGreaterThan(0);
    });
  });
});
