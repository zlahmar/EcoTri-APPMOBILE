import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles/colors';

interface UserGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ isVisible, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const guideSections = [
    {
      id: 'scan',
      title: 'Scanner des Déchets',
      icon: 'camera-alt',
      content: [
        '• Ouvrez la page de scan',
        '• Pointez votre caméra vers le déchet',
        "• L'IA identifie automatiquement le type",
        '• Confirmez la classification',
        '• Gagnez des points de recyclage !',
      ],
    },
    {
      id: 'recycling-points',
      title: 'Trouver des Points de Recyclage',
      icon: 'location-on',
      content: [
        "• Allez sur la page d'accueil",
        '• Votre position est détectée automatiquement',
        "• Les points proches s'affichent sur la carte",
        '• Cliquez sur un point pour voir les détails',
        '• Utilisez le bouton de navigation pour y aller',
      ],
    },
    {
      id: 'collecte',
      title: 'Calendrier de Collecte',
      icon: 'event',
      content: [
        '• Consultez les jours de collecte de votre ville',
        '• Changez de commune si nécessaire',
        '• Voir le planning des bacs gris et verts',
        '• Calendrier hebdomadaire visuel',
        '• Informations spécifiques à Bordeaux Métropole',
      ],
    },
    {
      id: 'stats',
      title: 'Suivi de vos Progrès',
      icon: 'trending-up',
      content: [
        '• Consultez vos statistiques dans le profil',
        '• Suivez vos points et votre niveau',
        '• Voir votre série de recyclage',
        '• Précision de vos scans',
        '• Historique de vos recherches',
      ],
    },
    {
      id: 'tips',
      title: 'Conseils de Recyclage',
      icon: 'lightbulb',
      content: [
        '• Rincez les emballages avant recyclage',
        '• Vérifiez les consignes de votre commune',
        '• Utilisez les bons bacs (gris/vert)',
        '• Évitez les déchets contaminés',
        '• Privilégiez la réduction des déchets',
      ],
    },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>
            <MaterialIcons
              name="menu-book"
              size={24}
              color={colors.primary}
              style={styles.titleIcon}
            />
            Guide d'Utilisation EcoTri
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            Bienvenue sur EcoTri ! Voici comment utiliser l'application pour
            recycler efficacement :
          </Text>

          {guideSections.map(section => (
            <View key={section.id} style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionTitleRow}>
                  <MaterialIcons
                    name={section.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <MaterialIcons
                  name={
                    expandedSection === section.id
                      ? 'expand-less'
                      : 'expand-more'
                  }
                  size={24}
                  color={colors.textLight}
                />
              </TouchableOpacity>

              {expandedSection === section.id && (
                <View style={styles.sectionContent}>
                  {section.content.map((item, index) => (
                    <Text key={index} style={styles.bulletPoint}>
                      {item}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}

          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <MaterialIcons name="eco" size={20} color={colors.success} />
              <Text style={styles.footerText}>
                Chaque geste compte pour notre planète !
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight + '20',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  titleIcon: {
    marginRight: 12,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.textLight + '30',
  },
  content: {
    padding: 20,
  },
  intro: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.textLight + '20',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary + '10',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  sectionContent: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 8,
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 8,
  },
});

export default UserGuide;
