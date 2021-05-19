@RunWith(JUnit4.class)
public class ExampleInstrumentedTest {
    @ClassRule
    public static final LocaleTestRule localeTestRule = new LocaleTestRule();

    @Rule
    public ActivityTestRule<MainActivity> activityRule = new ActivityTestRule<>(MainActivity.class);

    @Test
    public void testTakeScreenshot() {
        Screengrab.screenshot("before_button_click");

//        // Your custom onView...
//        onView(withId(R.id.fab)).perform(click());
//
//        Screengrab.screenshot("after_button_click");
    }
}