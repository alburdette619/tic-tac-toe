import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHistoryStore } from "../../stores/gameHistoryStore";
import { Colors } from "../../styles/colors";
import { HistoryType } from "../../types/ticTacToeTypes";

export const GameHistory = () => {
  const { goBack } = useNavigation();

  const { history } = useHistoryStore();

  const renderHistoryItem = useCallback(
    ({ item }: ListRenderItemInfo<HistoryType>) => {
      const formattedTimestamp = format(
        new Date(item.timestamp),
        "MMM do, yyyy h:mm aa",
      );

      return (
        <View style={styles.historyItemContainer}>
          <Text style={styles.historyItemText}>{item.result}</Text>
          <Text style={styles.historyItemText}>{formattedTimestamp}</Text>
        </View>
      );
    },
    [],
  );

  const renderItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <MaterialIcons color={Colors.sky} name="arrow-back" size={24} />
      </Pressable>
      <FlatList
        alwaysBounceVertical={false}
        contentContainerStyle={styles.historyListContainer}
        data={history}
        ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={(item) =>
          `${item.result}_${new Date(item.timestamp).toISOString()}`
        }
        renderItem={renderHistoryItem}
        style={styles.historyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: Colors.coral,
    borderRadius: 24,
    padding: 8,
  },
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    padding: 16,
  },
  historyItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  historyItemText: {
    color: Colors.sky,
    fontSize: 24,
    fontWeight: "bold",
  },
  historyList: {
    marginTop: 24,
  },
  historyListContainer: {
    flexGrow: 1,
  },
  separator: {
    backgroundColor: Colors.gold,
    height: 1,
    width: "100%",
  },
});
