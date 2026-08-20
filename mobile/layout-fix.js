import {StyleSheet} from 'react-native';

const originalCreate = StyleSheet.create.bind(StyleSheet);

StyleSheet.create = (styles) => {
  const next = { ...styles };

  // Home categories: force 10 categories into exactly 2 rows (5 + 5).
  // Keep each tile below 20% so Android rounding/padding can never push
  // the fifth item onto a third column layout.
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

  // Latest listings: remove the oversized empty image area.
  if (next.marketImage) {
    next.marketImage = { ...next.marketImage, height: 155 };
  }
  if (next.marketImagePlaceholder) {
    next.marketImagePlaceholder = { ...next.marketImagePlaceholder, height: 155 };
  }

  return originalCreate(next);
};
