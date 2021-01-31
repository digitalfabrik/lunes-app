import {
  React,
  TouchableOpacity,
  Text,
  styles,
  WhiteNextArrow,
  NextArrow,
  IActionsProps,
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
      <TouchableOpacity style={styles.nextWordButton} onPress={checkOut}>
        <Text style={styles.nextWordLabel}>Check out</Text>
        <WhiteNextArrow />
      </TouchableOpacity>
    ) : (
      <>
        {!isIncorrect && !isCorrect ? (
          <>
            <TouchableOpacity
              onPress={checkEntry}
              disabled={!input}
              style={[
                styles.checkEntryButton,
                !input && styles.disabledButton,
              ]}>
              <Text
                style={[
                  styles.checkEntryLabel,
                  !input && styles.disabledButtonLabel,
                ]}>
                Check entry
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.giveUpButton}
              onPress={markAsIncorrect}>
              <Text style={styles.giveUpLabel}>I give up!</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.nextWordButton}
            onPress={getNextWordAndModifyCounter}>
            <Text style={styles.nextWordLabel}>Next Word</Text>
            <WhiteNextArrow />
          </TouchableOpacity>
        )}

        {!isCorrect && !isIncorrect && !isAlmostCorrect && (
          <TouchableOpacity
            style={styles.tryLaterButton}
            onPress={addToTryLater}>
            <Text style={styles.giveUpLabel}>Try later</Text>
            <NextArrow />
          </TouchableOpacity>
        )}
      </>
    )}
  </>
);

export default Actions;
