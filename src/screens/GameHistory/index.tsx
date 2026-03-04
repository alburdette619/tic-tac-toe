import { format } from "date-fns";
import { useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHistoryStore } from "../../stores/gameHistoryStore";
import { Colors } from "../../styles/colors";
import { HistoryType } from "../../types/ticTacToeTypes";

export const GameHistory = () => {
  const { history } = useHistoryStore();

  const renderHistoryItem = useCallback(
    ({ item }: ListRenderItemInfo<HistoryType>) => {
      const formattedTimestamp = format(item.timestamp, "MMM do, yyyy h:mm aa");

      return (
        <View style={styles.historyItemContainer}>
          <Text>{item.result}</Text>
          <Text>{formattedTimestamp}</Text>
        </View>
      );
    },
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        alwaysBounceVertical={false}
        data={history}
        keyExtractor={(item) =>
          `${item.result}_${item.timestamp.toISOString()}`
        }
        renderItem={renderHistoryItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    padding: 16,
  },
  historyItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
