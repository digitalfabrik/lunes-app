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
}: IActionsProps) => {
  return (

    <>
      {isFinished ? (
        <Button onPress={checkOut} theme={BUTTONS_THEME.dark}>
          <Text style={[styles.lightLabel, styles.arrowLabel]}>Check out</Text>
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
                    styles.lightLabel,
                    !input && styles.disabledButtonLabel,
                  ]}>
                  Check entry
                </Text>
              </Button>

              <Button onPress={markAsIncorrect} theme={BUTTONS_THEME.light}>
                <Text style={styles.darkLabel}>I give up!</Text>
              </Button>
            </>
          ) : (
            <Button
              onPress={getNextWordAndModifyCounter}
              theme={BUTTONS_THEME.dark}>
              <Text style={[styles.lightLabel, styles.arrowLabel]}>
                Next Word
              </Text>
              <WhiteNextArrow />
            </Button>
          )}

          {!isCorrect && !isIncorrect && !isAlmostCorrect && (
            <Button onPress={addToTryLater}>
              <Text style={styles.darkLabel}>Try later</Text>
              <NextArrow style={styles.arrow} />
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default Actions;
