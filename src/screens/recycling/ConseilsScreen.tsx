import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import Header from '../../components/common/Header';

const ConseilsScreen = ({ 
  isAuthenticated = false, 
  onProfilePress, 
  userInfo: _userInfo 
}: { 
  isAuthenticated?: boolean; 
  onProfilePress?: () => void; 
  userInfo?: any; 
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Conseils & Astuces" 
        showProfileIcon={true}
        isAuthenticated={isAuthenticated} 
        onProfilePress={onProfilePress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <MaterialIcons name="info" size={20} color={colors.primaryDark} style={styles.infoBannerIcon} />
          <View style={styles.infoBannerContent}>
            <View style={styles.infoBannerTitleRow}>
              <MaterialIcons name="rocket-launch" size={18} color={colors.primary} style={styles.infoBannerTitleIcon} />
              <Text style={styles.infoBannerTitle}>Prochainement disponible !</Text>
            </View>
            <Text style={styles.infoBannerText}>
              Cette page sera entièrement fonctionnelle dans la prochaine mise à jour avec des conseils personnalisés et des données en temps réel.
            </Text>
          </View>
        </View>

        {/* Conseils du jour */}
        <View style={styles.dailyTipSection}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="lightbulb" size={24} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Conseil du Jour</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Rincer vos emballages avant recyclage</Text>
            <Text style={styles.tipDescription}>
              Un simple rinçage à l'eau froide suffit pour éliminer les résidus alimentaires. 
              Cela améliore la qualité du recyclage et évite la contamination des autres matériaux.
            </Text>
            <View style={styles.tipStats}>
              <View style={styles.tipStatRow}>
                <MaterialIcons name="recycling" size={16} color={colors.primaryDark} style={styles.tipStatIcon} />
                <Text style={styles.tipStat}>Impact: +15% de recyclage</Text>
              </View>
              <View style={styles.tipStatRow}>
                <MaterialIcons name="eco" size={16} color={colors.primaryDark} style={styles.tipStatIcon} />
                <Text style={styles.tipStat}>CO2 économisé: 2.3kg/mois</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Catégories de conseils */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="category" size={24} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Par Catégorie</Text>
          </View>
          
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.plastic }]}>
              <MaterialIcons name="local-drink" size={24} color={colors.primaryDark} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>Plastique</Text>
              <Text style={styles.categoryCount}>12 conseils</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.paper }]}>
              <MaterialIcons name="description" size={24} color={colors.primaryDark} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>Papier & Carton</Text>
              <Text style={styles.categoryCount}>8 conseils</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.glass }]}>
              <MaterialIcons name="wine-bar" size={24} color={colors.primaryDark} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>Verre</Text>
              <Text style={styles.categoryCount}>6 conseils</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.metal }]}>
              <MaterialIcons name="restaurant" size={24} color={colors.primaryDark} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>Métal</Text>
              <Text style={styles.categoryCount}>10 conseils</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Conseils rapides */}
        <View style={styles.quickTipsSection}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="flash-on" size={24} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Conseils Rapides</Text>
          </View>
          
          <View style={styles.quickTipItem}>
            <MaterialIcons name="check-circle" size={18} color={colors.primary} style={styles.quickTipIcon} />
            <Text style={styles.quickTipText}>Pliez les cartons pour gagner de l'espace</Text>
          </View>
          
          <View style={styles.quickTipItem}>
            <MaterialIcons name="check-circle" size={18} color={colors.primary} style={styles.quickTipIcon} />
            <Text style={styles.quickTipText}>Retirez les bouchons des bouteilles en plastique</Text>
          </View>
          
          <View style={styles.quickTipItem}>
            <MaterialIcons name="check-circle" size={18} color={colors.primary} style={styles.quickTipIcon} />
            <Text style={styles.quickTipText}>Vérifiez les symboles de recyclage</Text>
          </View>
          
          <View style={styles.quickTipItem}>
            <MaterialIcons name="check-circle" size={18} color={colors.primary} style={styles.quickTipIcon} />
            <Text style={styles.quickTipText}>Utilisez des sacs réutilisables</Text>
          </View>
        </View>

        {/* Impact environnemental */}
        <View style={styles.impactSection}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="public" size={24} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Votre Impact</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactTitle}>Ce mois-ci, vous avez :</Text>
            <View style={styles.impactItem}>
              <MaterialIcons name="eco" size={20} color={colors.primary} style={styles.impactIcon} />
              <Text style={styles.impactText}>Économisé 12.5 kg de CO2</Text>
            </View>
            <View style={styles.impactItem}>
              <MaterialIcons name="water-drop" size={20} color={colors.primary} style={styles.impactIcon} />
              <Text style={styles.impactText}>Épargné 45 litres d'eau</Text>
            </View>
            <View style={styles.impactItem}>
              <MaterialIcons name="flash-on" size={20} color={colors.primary} style={styles.impactIcon} />
              <Text style={styles.impactText}>Sauvegardé 8.2 kWh d'énergie</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionButtonContent}>
            <MaterialIcons name="menu-book" size={20} color={colors.textInverse} style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>Voir Tous les Conseils</Text>
          </View>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    marginTop: 10,
  },
  dailyTipSection: {
    marginBottom: 25,
  },
  tipCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 15,
  },
  tipStats: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
  },
  tipStat: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '500',
    marginBottom: 3,
  },
  categoriesSection: {
    marginBottom: 25,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  categoryArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  quickTipsSection: {
    marginBottom: 25,
  },
  quickTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  quickTipIcon: {
    marginRight: 12,
    width: 18,
    height: 18,
  },
  quickTipText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  impactSection: {
    marginBottom: 25,
  },
  impactCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  impactIcon: {
    marginRight: 12,
    width: 20,
    height: 20,
  },
  impactText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 10,
  },
  tipStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  tipStatIcon: {
    marginRight: 5,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoBannerIcon: {
    marginRight: 10,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoBannerTitleIcon: {
    marginRight: 5,
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoBannerText: {
    fontSize: 13,
    color: colors.textLight,
  },
});

export default ConseilsScreen;
