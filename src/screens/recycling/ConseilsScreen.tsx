import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import Header from '../../components/common/Header';
import conseilsData from '../../assets/donnees/conseils.json';

const ConseilsScreen = ({
  isAuthenticated = false,
  onProfilePress,
  userInfo: _userInfo,
}: {
  isAuthenticated?: boolean;
  onProfilePress?: () => void;
  userInfo?: any;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [conseils, setConseils] = useState(conseilsData.categories_recyclage);
  const [dailyTip, setDailyTip] = useState<any>(null);

  // Fonctions utilitaires pour les catégories
  const getCategoryDisplayName = (key: string): string => {
    const names: { [key: string]: string } = {
      'plastique': 'Plastique',
      'papier_carton': 'Papier & Carton',
      'verre': 'Verre',
      'metal': 'Métal',
      'dechets_organique': 'Déchets Organiques',
    };
    return names[key] || key;
  };

  const getCategoryIcon = (key: string): string => {
    const icons: { [key: string]: string } = {
      'plastique': 'local-drink',
      'papier_carton': 'description',
      'verre': 'wine-bar',
      'metal': 'build',
      'dechets_organique': 'eco',
    };
    return icons[key] || 'recycling';
  };

  const getCategoryColor = (key: string): string => {
    const colors_map: { [key: string]: string } = {
      'plastique': colors.primary,
      'papier_carton': colors.warning,
      'verre': colors.success,
      'metal': colors.textLight,
      'dechets_organique': colors.secondary,
    };
    return colors_map[key] || colors.primary;
  };

  // Obtenir les catégories disponibles
  const categories = Object.keys(conseils).map(key => ({
    key,
    name: getCategoryDisplayName(key),
    icon: getCategoryIcon(key),
    color: getCategoryColor(key),
  }));

  // Initialiser le conseil du jour une seule fois
  useEffect(() => {
    const allConseils = Object.values(conseils).flat();
    const randomIndex = Math.floor(Math.random() * allConseils.length);
    const tip = allConseils[randomIndex];
    
    // Trouver la catégorie du conseil
    let tipCategory = 'general';
    Object.keys(conseils).forEach(categoryKey => {
      if (conseils[categoryKey as keyof typeof conseils].includes(tip)) {
        tipCategory = categoryKey;
      }
    });
    
    setDailyTip({
      ...tip,
      category: tipCategory
    });
  }, []); // Seulement au montage du composant

  // Fonction pour obtenir la catégorie d'un conseil
  const getTipCategory = (tip: any) => {
    let tipCategory = 'general';
    Object.keys(conseils).forEach(categoryKey => {
      if (conseils[categoryKey as keyof typeof conseils].includes(tip)) {
        tipCategory = categoryKey;
      }
    });
    return tipCategory;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Conseils & Astuces"
        showProfileIcon={true}
        isAuthenticated={isAuthenticated}
        onProfilePress={onProfilePress}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Conseil du jour - Design moderne */}
        {dailyTip && (
          <View style={styles.dailyTipSection}>
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={styles.tipIconContainer}>
                  <MaterialIcons
                    name="lightbulb"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.tipBadge}>Conseil du jour</Text>
                <View style={styles.tipCategoryTag}>
                  <MaterialIcons
                    name={getCategoryIcon(dailyTip.category) as any}
                    size={12}
                    color={getCategoryColor(dailyTip.category)}
                  />
                  <Text style={[styles.tipCategoryText, { color: getCategoryColor(dailyTip.category) }]}>
                    {getCategoryDisplayName(dailyTip.category)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.tipTitle}>
                {dailyTip.titre}
              </Text>
              <Text style={styles.tipDescription}>
                {dailyTip.description}
              </Text>
              
              <View style={styles.tipFooter}>
                <View style={styles.tipTag}>
                  <MaterialIcons
                    name="eco"
                    size={12}
                    color={colors.primary}
                  />
                  <Text style={styles.tipTagText}>EcoTri</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Catégories de conseils - Affichage horizontal */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons
              name="category"
              size={24}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Choisissez une catégorie</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScrollView}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive,
                  { borderColor: category.color }
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.key ? null : category.key
                )}
              >
                <View
                  style={[
                    styles.categoryButtonIcon,
                    { 
                      backgroundColor: selectedCategory === category.key 
                        ? colors.textInverse + '20' 
                        : category.color + '20' 
                    },
                  ]}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={20}
                    color={selectedCategory === category.key ? colors.textInverse : category.color}
                  />
                </View>
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.key && styles.categoryButtonTextActive
                ]}>
                  {category.name}
                </Text>
                <Text style={[
                  styles.categoryButtonCount,
                  selectedCategory === category.key && styles.categoryButtonCountActive
                ]}>
                  {conseils[category.key as keyof typeof conseils].length}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Conseils détaillés par catégorie - Affichage immédiat */}
        {selectedCategory && (
          <View style={styles.detailedTipsSection}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons
                name="list"
                size={24}
                color={colors.primary}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>
                {categories.find(c => c.key === selectedCategory)?.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedCategory(null)}
              >
                <MaterialIcons name="close" size={20} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            {conseils[selectedCategory as keyof typeof conseils].map((conseil, index) => (
              <View key={index} style={styles.detailedTipCard}>
                <View style={styles.detailedTipHeader}>
                  <View style={styles.detailedTipNumber}>
                    <Text style={styles.detailedTipNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.detailedTipTitle}>{conseil.titre}</Text>
                </View>
                <Text style={styles.detailedTipDescription}>
                  {conseil.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Informations simples */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <MaterialIcons
              name="info-outline"
              size={20}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                <Text style={styles.infoNumber}>{Object.values(conseils).flat().length}</Text> conseils disponibles dans <Text style={styles.infoNumber}>{Object.keys(conseils).length}</Text> catégories
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 10,
  },
  dailyTipSection: {
    marginBottom: 30,
  },
  tipCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 'auto',
  },
  tipCategoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  tipDescription: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
    marginBottom: 20,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  tipTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  categoriesSection: {
    marginBottom: 25,
  },
  categoriesScrollView: {
    marginTop: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 5,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    transform: [{ scale: 1.02 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryButtonTextActive: {
    color: colors.textInverse,
    fontWeight: 'bold',
  },
  categoryButtonCount: {
    fontSize: 10,
    color: colors.textLight,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryButtonCountActive: {
    color: colors.textInverse,
    backgroundColor: colors.textInverse + '30',
  },
  detailedTipsSection: {
    marginBottom: 25,
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  detailedTipCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  detailedTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailedTipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailedTipNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  detailedTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  detailedTipDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginLeft: 36,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  infoNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default ConseilsScreen;