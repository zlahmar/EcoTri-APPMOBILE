import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';

interface CommuneSelectorProps {
  selectedCommune: string;
  availableCommunes: string[];
  onCommuneSelect: (commune: string) => void;
  visible: boolean;
  onClose: () => void;
}

const CommuneSelector: React.FC<CommuneSelectorProps> = ({
  selectedCommune,
  availableCommunes,
  onCommuneSelect,
  visible,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommunes = availableCommunes.filter(commune =>
    commune.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCommuneSelect = (commune: string) => {
    onCommuneSelect(commune);
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sélectionner une commune</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une commune..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.communesListContainer}>
            {/* Liste des communes à sélectionner */}
            <ScrollView
              style={styles.communesList}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.communesListContent}
            >
              {filteredCommunes.map(commune => (
                <TouchableOpacity
                  key={commune}
                  style={[
                    styles.communeItem,
                    commune === selectedCommune && styles.selectedCommuneItem,
                  ]}
                  onPress={() => handleCommuneSelect(commune)}
                >
                  <Text
                    style={[
                      styles.communeText,
                      commune === selectedCommune && styles.selectedCommuneText,
                    ]}
                  >
                    {commune}
                  </Text>
                  {commune === selectedCommune && (
                    <MaterialIcons name="check" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
  },
  communesList: {
    marginBottom: 10,
  },
  communesListContent: {
    paddingBottom: 1,
  },
  communesListContainer: {
    marginBottom: 1,
    maxHeight: 300,
  },
  communeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCommuneItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  communeText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  selectedCommuneText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalFooter: {
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CommuneSelector;
