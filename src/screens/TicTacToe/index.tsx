import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { useHistoryStore } from "../../stores/gameHistoryStore";
import { useTicTacToeStore } from "../../stores/ticTacToeStore";
import { cardStyles } from "../../styles/cards";
import { Colors } from "../../styles/colors";
import { WinCondition } from "../../types/ticTacToeTypes";
import { TicTacToeBoard } from "./components/TicTacToeBoard";

export const TicTacToe = () => {
  const { navigate } = useNavigation();

  const { board, currentPlayer, gameFinished, isDraw, startGame, winner } =
    useTicTacToeStore();
  const { addItem } = useHistoryStore();
  const isFirstMove = board.every((cell) => cell === null);

  // We need to access the store state in the `maybeAiFirstMove` worklet, but worklets capture,
  // so we need to get the state in the component scope and then reference it in the worklet.
  // Creating a reference to `getState` here allows us to call `getState()` in the worklet
  // to get the latest state when the worklet runs.
  const getState = useTicTacToeStore.getState;

  const maybeMakeAiFirstMove = useCallback(() => {
    const { currentPlayer: currentPlayerInWorklet, makeAiMove } = getState();

    if (currentPlayerInWorklet === "O" && isFirstMove) {
      makeAiMove();
    }
  }, [getState, isFirstMove]);

  const handleFirstPlayerChoice = useCallback(
    (symbol: "O" | "X") => {
      startGame(symbol);
    },
    [startGame],
  );

  const handlePlayerChoiceFadeOut = useCallback(
    (finished: boolean) => {
      "worklet";
      if (finished) {
        scheduleOnRN(maybeMakeAiFirstMove);
      }
    },
    [maybeMakeAiFirstMove],
  );

  useEffect(() => {
    if (isDraw || (winner && gameFinished)) {
      let result: WinCondition = "Tie";

      if (!isDraw) {
        result = winner === "O" ? "Lose" : "Win";
      }

      addItem(result);

      // Give the user a moment to see the game finalized before navigating to the GameResult screen.
      setTimeout(() => {
        navigate("GameResult");
      }, 500);
    }
  }, [gameFinished, isDraw, navigate, winner, addItem]);

  const handleShowGameHistory = useCallback(() => {
    navigate("GameHistory");
  }, [navigate]);

  return (
    <SafeAreaView style={styles.container}>
      {currentPlayer === null ? (
        // Handle Ai first move AFTER the fade out animation completes to avoid
        // the first 'O' move appearing before the player choice fades out.
        <Animated.View
          exiting={FadeOut.withCallback(handlePlayerChoiceFadeOut)}
          style={styles.pregameContainer}
        >
          <Text style={styles.playerChoiceText}>Who Goes First?</Text>
          <View style={styles.playerChoiceContainer}>
            <Pressable
              onPress={() => handleFirstPlayerChoice("X")}
              style={[cardStyles.card, styles.playerChoicePressable]}
            >
              <Text style={styles.playerChoiceText}>X</Text>
              <Text style={styles.playerIdentityText}>(Me)</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFirstPlayerChoice("O")}
              style={[cardStyles.card, styles.playerChoicePressable]}
            >
              <Text style={styles.playerChoiceText}>O</Text>
              <Text style={styles.playerIdentityText}>(CPU)</Text>
            </Pressable>
          </View>
          <Pressable onPress={handleShowGameHistory} style={[cardStyles.card]}>
            <Text>History</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <TicTacToeBoard />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: "center",
  },
  playerChoiceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 36,
  },
  playerChoicePressable: {
    minWidth: "33%",
  },
  playerChoiceText: {
    fontSize: 48,
    textAlign: "center",
  },
  playerIdentityText: {
    fontSize: 24,
    marginTop: 8,
  },
  pregameContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
});
