module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import com.oblador.vectoricons.VectorIconsPackage;',
          packageInstance: 'new VectorIconsPackage()',
        },
      },
    },
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
};
