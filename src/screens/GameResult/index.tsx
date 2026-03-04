import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTicTacToeStore } from "../../stores/ticTacToeStore";
import { cardStyles } from "../../styles/cards";
import { Colors } from "../../styles/colors";

export const GameResult = () => {
  const { goBack, navigate } = useNavigation();

  const { isDraw, resetStore, winner } = useTicTacToeStore();

  const { animation, resultText } = useMemo(() => {
    if (isDraw) {
      return {
        animation: require("../../../assets/lottie/draw.json"),
        resultText: "It's a Draw!",
      };
    } else {
      return winner === "X"
        ? {
            animation: require("../../../assets/lottie/you-win.json"),
            resultText:
              "You Win! (this should have been impossible... congrats I guess?)",
          }
        : {
            animation: require("../../../assets/lottie/game-over.json"),
            resultText: "You Lose!",
          };
    }
  }, [isDraw, winner]);

  const handlePlayAgain = useCallback(() => {
    resetStore();
    goBack();
  }, [resetStore, goBack]);

  const handleShowGameHistory = useCallback(() => {
    navigate("GameHistory");
  }, [navigate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.resultContainer}>
        <LottieView
          autoPlay
          loop={isDraw}
          source={animation}
          style={styles.resultAnimation}
        />
        <Text style={styles.resultText}>{resultText}</Text>
      </View>
      <View>
        <Pressable
          onPress={handleShowGameHistory}
          style={[cardStyles.card, styles.playAgainButton]}
        >
          <Text style={styles.playAgainText}>History</Text>
        </Pressable>
        <Pressable
          onPress={handlePlayAgain}
          style={[cardStyles.card, styles.playAgainButton]}
        >
          <Text style={styles.playAgainText}>Play Again!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  playAgainButton: {
    height: 100,
    justifyContent: "center",
    width: "100%",
  },
  playAgainText: {
    fontSize: 48,
  },
  resultAnimation: {
    height: 200,
    width: 200,
  },
  resultContainer: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
  },
  resultText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
  },
});
