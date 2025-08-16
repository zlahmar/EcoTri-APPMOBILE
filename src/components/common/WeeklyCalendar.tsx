import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import { CollecteInfo } from '../../services';

interface WeeklyCalendarProps {
  collecteInfo: CollecteInfo;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ collecteInfo }) => {
  const joursSemaine = [
    { nom: 'Lundi', code: 'LUNDI' },
    { nom: 'Mardi', code: 'MARDI' },
    { nom: 'Mercredi', code: 'MERCREDI' },
    { nom: 'Jeudi', code: 'JEUDI' },
    { nom: 'Vendredi', code: 'VENDREDI' },
    { nom: 'Samedi', code: 'SAMEDI' },
    { nom: 'Dimanche', code: 'DIMANCHE' },
  ];

  const getCollecteType = (jourCode: string) => {
    const hasOrdures = collecteInfo.orduresMenageres.jours.includes(jourCode);
    const hasTri = collecteInfo.triRecyclage.jours.includes(jourCode);

    if (hasOrdures && hasTri) {
      return { type: 'both', text: 'OM + TRI' };
    } else if (hasOrdures) {
      return { type: 'om', text: 'OM' };
    } else if (hasTri) {
      return { type: 'tri', text: 'TRI' };
    } else {
      return { type: 'none', text: '' };
    }
  };

  const isToday = (jourCode: string) => {
    const today = new Date();
    const todayName = [
      'DIMANCHE',
      'LUNDI',
      'MARDI',
      'MERCREDI',
      'JEUDI',
      'VENDREDI',
      'SAMEDI',
    ][today.getDay()];
    return jourCode === todayName;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <MaterialIcons
          name="calendar-today"
          size={20}
          color={colors.text}
          style={styles.titleIcon}
        />
        <Text style={styles.title}>Calendrier de la Semaine</Text>
      </View>

      <View style={styles.calendarGrid}>
        {joursSemaine.map(jour => {
          const collecte = getCollecteType(jour.code);
          const today = isToday(jour.code);

          return (
            <View
              key={jour.code}
              style={[styles.dayCell, today && styles.todayCell]}
            >
              <Text style={[styles.dayName, today && styles.todayText]}>
                {jour.nom}
              </Text>

              {collecte.type !== 'none' ? (
                <View
                  style={[
                    styles.collecteBadge,
                    collecte.type === 'both' && styles.bothBadge,
                    collecte.type === 'om' && styles.omBadge,
                    collecte.type === 'tri' && styles.triBadge,
                  ]}
                >
                  <Text style={styles.collecteText}>{collecte.text}</Text>
                </View>
              ) : (
                <View style={styles.noCollecteBadge}>
                  <Text style={styles.noCollecteText}>-</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBadge, styles.omBadge]}>
            <Text style={styles.legendText}>OM</Text>
          </View>
          <Text style={styles.legendLabel}>Ordures Ménagères</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBadge, styles.triBadge]}>
            <Text style={styles.legendText}>TRI</Text>
          </View>
          <Text style={styles.legendLabel}>Tri & Recyclage</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBadge, styles.bothBadge]}>
            <Text style={styles.legendText}>OM+TRI</Text>
          </View>
          <Text style={styles.legendLabel}>Les deux</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginHorizontal: 2,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  todayCell: {
    backgroundColor: colors.primary + '20',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  todayText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  collecteBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  omBadge: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },
  triBadge: {
    backgroundColor: colors.success + '20',
    borderWidth: 1,
    borderColor: colors.success,
  },
  bothBadge: {
    backgroundColor: colors.warning + '20',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  collecteText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  noCollecteBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noCollecteText: {
    fontSize: 12,
    color: colors.textLight,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
});

export default WeeklyCalendar;
