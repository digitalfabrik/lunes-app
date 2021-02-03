import {
  React,
  Text,
  styles,
  WhiteNextArrow,
  NextArrow,
  IActionsProps,
  Button,
  BUTTONS_THEME,
} from './imports';

const Actions = ({
  isCorrect,
  isIncorrect,
  isAlmostCorrect,
  addToTryLater,
  getNextWordAndModifyCounter,
  checkEntry,
  markAsIncorrect,
  input,
  isFinished,
  checkOut,
}: IActionsProps) => (
  <>
    {isFinished ? (
      <Button onPress={checkOut} theme={BUTTONS_THEME.dark}>
        <Text style={styles.nextWordLabel}>Check out</Text>
        <WhiteNextArrow />
      </Button>
    ) : (
      <>
        {!isIncorrect && !isCorrect ? (
          <>
            <Button
              onPress={checkEntry}
              disabled={!input}
              theme={BUTTONS_THEME.dark}>
              <Text
                style={[
                  styles.checkEntryLabel,
                  !input && styles.disabledButtonLabel,
                ]}>
                Check entry
              </Text>
            </Button>

            <Button onPress={markAsIncorrect} theme={BUTTONS_THEME.light}>
              <Text style={styles.giveUpLabel}>I give up!</Text>
            </Button>
          </>
        ) : (
          <Button
            onPress={getNextWordAndModifyCounter}
            theme={BUTTONS_THEME.dark}>
            <Text style={styles.nextWordLabel}>Next Word</Text>
            <WhiteNextArrow />
          </Button>
        )}

        {!isCorrect && !isIncorrect && !isAlmostCorrect && (
          <Button onPress={addToTryLater}>
            <Text style={styles.giveUpLabel}>Try later</Text>
            <NextArrow />
          </Button>
        )}
      </>
    )}
  </>
);

export default Actions;
