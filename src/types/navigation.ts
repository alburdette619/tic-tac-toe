export type RootStackParamList = {
  GameHistory: undefined;
  GameResult: undefined;
  TicTacToe: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
