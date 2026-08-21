import {StyleSheet} from 'react-native';

const originalCreate = StyleSheet.create.bind(StyleSheet);

StyleSheet.create = (styles) => {
  const next = { ...styles };

  // Home categories: force 10 categories into exactly 2 rows (5 + 5).
  if (next.quickPanel && next.quickItem && next.quickLabel) {
    next.quickPanel = {
      ...next.quickPanel,
      paddingHorizontal: 2,
      justifyContent: 'space-around',
      alignItems: 'flex-start',
    };
    next.quickItem = {
      ...next.quickItem,
      width: '18%',
      minWidth: '18%',
      maxWidth: '18%',
      flexBasis: '18%',
      flexGrow: 0,
      flexShrink: 0,
      paddingHorizontal: 0,
    };
    next.quickLabel = {
      ...next.quickLabel,
      fontSize: 8.6,
      lineHeight: 10.2,
    };
  }

  // Latest listing images.
  if (next.marketImage) {
    next.marketImage = { ...next.marketImage, height: 155 };
  }
  if (next.marketImagePlaceholder) {
    next.marketImagePlaceholder = { ...next.marketImagePlaceholder, height: 155 };
  }

  // Actual styles used by App.js on listing cards.
  if (next.favoriteButton) {
    next.favoriteButton = {
      ...next.favoriteButton,
      right: 10,
      top: 10,
      width: 30,
      height: 30,
      borderRadius: 15,
      padding: 0,
    };
  }
  if (next.favoriteIcon) {
    next.favoriteIcon = {
      ...next.favoriteIcon,
      fontSize: 17,
      lineHeight: 20,
    };
  }
  if (next.primarySmall) {
    next.primarySmall = {
      ...next.primarySmall,
      height: 32,
      minHeight: 32,
      paddingVertical: 0,
      paddingHorizontal: 12,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    };
  }

  return originalCreate(next);
};
