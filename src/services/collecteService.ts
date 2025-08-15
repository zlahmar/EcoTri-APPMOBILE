import collecteData from '../assets/donnees/en_frcol_s.json';

export interface CollecteZone {
  gid: string;
  commune: string;
  code_commune: string;
  type: 'OM' | 'TRI'; // OM = Ordures Ménagères, TRI = Tri/Recyclage
  jour_col: string[];
  passage: 'JOUR' | 'NUIT';
  geo_point_2d: {
    lat: number;
    lon: number;
  };
  geo_shape?: any;
  cdate: string;
  mdate: string;
}

export interface CollecteInfo {
  commune: string;
  orduresMenageres: {
    jours: string[];
    passage: 'JOUR' | 'NUIT';
  };
  triRecyclage: {
    jours: string[];
    passage: 'JOUR' | 'NUIT';
  };
}

class CollecteService {
  private static instance: CollecteService;
  private zones: CollecteZone[] = [];

  private constructor() {
    this.zones = collecteData as CollecteZone[];
  }

  public static getInstance(): CollecteService {
    if (!CollecteService.instance) {
      CollecteService.instance = new CollecteService();
    }
    return CollecteService.instance;
  }

  // Trouver la zone de collecte la plus proche d'un point GPS
  public findNearestZone(lat: number, lon: number): CollecteZone | null {
    if (this.zones.length === 0) return null;

    let nearestZone: CollecteZone | null = null;
    let minDistance = Infinity;

    for (const zone of this.zones) {
      if (zone.geo_point_2d) {
        const distance = this.calculateDistance(
          lat,
          lon,
          zone.geo_point_2d.lat,
          zone.geo_point_2d.lon
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestZone = zone;
        }
      }
    }

    return nearestZone;
  }

  // Obtenir les informations de collecte pour une commune
  public getCollecteInfo(commune: string): CollecteInfo | null {
    const zonesCommune = this.zones.filter(zone => 
      zone.commune.toLowerCase() === commune.toLowerCase()
    );

    if (zonesCommune.length === 0) return null;

    const orduresMenageres = zonesCommune.find(zone => zone.type === 'OM');
    const triRecyclage = zonesCommune.find(zone => zone.type === 'TRI');

    return {
      commune: commune,
      orduresMenageres: orduresMenageres ? {
        jours: orduresMenageres.jour_col,
        passage: orduresMenageres.passage
      } : { jours: [], passage: 'JOUR' },
      triRecyclage: triRecyclage ? {
        jours: triRecyclage.jour_col,
        passage: triRecyclage.passage
      } : { jours: [], passage: 'JOUR' }
    };
  }

  // Obtenir toutes les communes disponibles
  public getAvailableCommunes(): string[] {
    const communes = new Set<string>();
    this.zones.forEach(zone => {
      if (zone.commune) {
        communes.add(zone.commune);
      }
    });
    return Array.from(communes).sort();
  }

  // Obtenir les informations de collecte pour une position GPS
  public getCollecteInfoByLocation(lat: number, lon: number): CollecteInfo | null {
    const nearestZone = this.findNearestZone(lat, lon);
    if (!nearestZone) return null;

    return this.getCollecteInfo(nearestZone.commune);
  }

  // Calculer la distance entre deux points GPS (formule de Haversine)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en km
  }

  // Formater les jours de collecte pour l'affichage
  public formatCollecteDays(jours: string[]): string {
    if (jours.length === 0) return 'Aucune collecte programmée';
    
    const joursTraduits = jours.map(jour => {
      const traductions: { [key: string]: string } = {
        'LUNDI': 'Lundi',
        'MARDI': 'Mardi',
        'MERCREDI': 'Mercredi',
        'JEUDI': 'Jeudi',
        'VENDREDI': 'Vendredi',
        'SAMEDI': 'Samedi',
        'DIMANCHE': 'Dimanche'
      };
      return traductions[jour] || jour;
    });

    if (joursTraduits.length === 1) {
      return joursTraduits[0];
    } else if (joursTraduits.length === 2) {
      return `${joursTraduits[0]} et ${joursTraduits[1]}`;
    } else {
      const derniers = joursTraduits.slice(-1);
      const premiers = joursTraduits.slice(0, -1);
      return `${premiers.join(', ')} et ${derniers[0]}`;
    }
  }

  // Obtenir le prochain jour de collecte
  public getNextCollecteDay(jours: string[]): string | null {
    if (jours.length === 0) return null;

    const today = new Date();
    const todayName = this.getDayName(today.getDay());
    
    // Si aujourd'hui est un jour de collecte
    if (jours.includes(todayName)) {
      return 'Aujourd\'hui';
    }

    // Trouver le prochain jour de collecte
    const joursOrdre = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
    const todayIndex = joursOrdre.indexOf(todayName);
    
    for (let i = 1; i <= 7; i++) {
      const nextIndex = (todayIndex + i) % 7;
      const nextDay = joursOrdre[nextIndex];
      
      if (jours.includes(nextDay)) {
        const traductions: { [key: string]: string } = {
          'LUNDI': 'Lundi',
          'MARDI': 'Mardi',
          'MERCREDI': 'Mercredi',
          'JEUDI': 'Jeudi',
          'VENDREDI': 'Vendredi',
          'SAMEDI': 'Samedi',
          'DIMANCHE': 'Dimanche'
        };
        return traductions[nextDay];
      }
    }

    return null;
  }

  // Convertir l'index du jour en nom
  private getDayName(dayIndex: number): string {
    const jours = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    return jours[dayIndex];
  }
}

export default CollecteService.getInstance();
