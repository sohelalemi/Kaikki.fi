import {StyleSheet} from 'react-native';

const originalCreate = StyleSheet.create.bind(StyleSheet);

StyleSheet.create = (styles) => {
  const next = { ...styles };

  // Home categories: force 10 categories into exactly 2 rows (5 + 5).
  if (next.quickPanel && next.quickItem && next.quickLabel) {
    next.quickPanel = {
      ...next.quickPanel,
      paddingHorizontal: 4,
      justifyContent: 'space-between',
    };
    next.quickItem = {
      ...next.quickItem,
      width: '19%',
      minWidth: '19%',
      maxWidth: '19%',
      flexBasis: '19%',
      flexGrow: 0,
      flexShrink: 0,
      paddingHorizontal: 0,
    };
    next.quickLabel = {
      ...next.quickLabel,
      fontSize: 8.8,
      lineHeight: 10.5,
    };
  }

  // Latest listings: remove the oversized empty image area.
  if (next.marketImage) {
    next.marketImage = { ...next.marketImage, height: 155 };
  }
  if (next.marketImagePlaceholder) {
    next.marketImagePlaceholder = { ...next.marketImagePlaceholder, height: 155 };
  }

  return originalCreate(next);
};
