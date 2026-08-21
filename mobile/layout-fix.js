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

  // Listing card actions: keep favorite and reservation controls compact.
  // Match common style-key variants used by the mobile UI so this remains
  // compatible if the component naming changes slightly.
  const compactCircle = (style) => ({
    ...style,
    width: 38,
    height: 38,
    minWidth: 38,
    minHeight: 38,
    borderRadius: 19,
    padding: 0,
  });
  const compactReserve = (style) => ({
    ...style,
    minHeight: 38,
    height: 38,
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 11,
  });

  ['favoriteButton','favoriteBtn','heartButton','heartBtn','marketFavorite','marketHeart'].forEach((key) => {
    if (next[key]) next[key] = compactCircle(next[key]);
  });
  ['favoriteIcon','heartIcon'].forEach((key) => {
    if (next[key]) next[key] = { ...next[key], fontSize: 20 };
  });
  ['reserveButton','reserveBtn','reservationButton','marketReserve','marketReserveButton'].forEach((key) => {
    if (next[key]) next[key] = compactReserve(next[key]);
  });
  ['reserveButtonText','reserveText','reservationButtonText','marketReserveText'].forEach((key) => {
    if (next[key]) next[key] = { ...next[key], fontSize: 14, lineHeight: 18 };
  });

  return originalCreate(next);
};
