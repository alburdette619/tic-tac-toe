import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GameHistory } from "../screens/GameHistory";
import { GameResult } from "../screens/GameResult";
import { TicTacToe } from "../screens/TicTacToe";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="TicTacToe"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={TicTacToe} name="TicTacToe" />
      <Stack.Screen component={GameResult} name="GameResult" />
      <Stack.Screen component={GameHistory} name="GameHistory" />
    </Stack.Navigator>
  );
};
