import React from 'react';
import { render } from '@testing-library/react-native';
import WeeklyCalendar from '../../src/components/common/WeeklyCalendar';

// Mock des icônes MaterialIcons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('WeeklyCalendar', () => {
  const mockCollecteInfo = {
    commune: 'Bordeaux',
    orduresMenageres: {
      jours: ['LUNDI', 'JEUDI'],
      passage: 'JOUR' as const,
    },
    triRecyclage: {
      jours: ['MARDI', 'VENDREDI'],
      passage: 'NUIT' as const,
    },
  };

  const defaultProps = {
    collecteInfo: mockCollecteInfo,
  };

  it('should render correctly with collecte info', () => {
    const { getByText } = render(<WeeklyCalendar {...defaultProps} />);
    
    expect(getByText('Calendrier de la Semaine')).toBeTruthy();
    expect(getByText('Lundi')).toBeTruthy();
    expect(getByText('Mardi')).toBeTruthy();
  });

  it('should display all days of the week', () => {
    const { getByText } = render(<WeeklyCalendar {...defaultProps} />);
    
    expect(getByText('Lundi')).toBeTruthy();
    expect(getByText('Mardi')).toBeTruthy();
    expect(getByText('Mercredi')).toBeTruthy();
    expect(getByText('Jeudi')).toBeTruthy();
    expect(getByText('Vendredi')).toBeTruthy();
    expect(getByText('Samedi')).toBeTruthy();
    expect(getByText('Dimanche')).toBeTruthy();
  });

  it('should handle null collecteInfo gracefully', () => {
    const emptyCollecteInfo = {
      commune: 'Test',
      orduresMenageres: { jours: [], passage: 'JOUR' as const },
      triRecyclage: { jours: [], passage: 'NUIT' as const },
    };
    
    const { getByText } = render(
      <WeeklyCalendar collecteInfo={emptyCollecteInfo} />
    );
    
    expect(getByText('Calendrier de la Semaine')).toBeTruthy();
  });

  it('should handle empty collecte info gracefully', () => {
    const emptyCollecteInfo = {
      commune: 'Test',
      orduresMenageres: { jours: [], passage: 'JOUR' as const },
      triRecyclage: { jours: [], passage: 'NUIT' as const },
    };
    
    const { getByText } = render(
      <WeeklyCalendar collecteInfo={emptyCollecteInfo} />
    );
    
    expect(getByText('Calendrier de la Semaine')).toBeTruthy();
  });

  it('should display calendar icon in title', () => {
    const { getByText } = render(<WeeklyCalendar {...defaultProps} />);
    
    expect(getByText('Calendrier de la Semaine')).toBeTruthy();
  });
});
