# Concepts

This document describes vocabulary and concepts used in the project.

## Custom Disciplines

Custom Disciplines ("Eigene Lernbereiche") are a feature where users can scan a QR code
to add a custom discipline that is not part of the normal list of disciplines.
These QR codes are usually provided by the institution of the user.

To work on custom disciplines, you need a valid API key, which you can get from the [lunes test server](https://lunes-test.tuerantuer.org/en/admin/):

- Go to 'API Keys'
- Select an api key marked as valid
- Scan the QR code with your phone or enter the key manually

If you don't have access to the lunes test server, you can use the code `3TLEPSE8X6` which adds 'Berufschule xy' with one module.

In both cases you need to make sure to [change the cms](#change-cms) to the test cms

## Dev Settings

The app contains some settings that are useful when debugging in a hidden menu.
To enable, you need to go to settings and keep clicking on the version text until a menu pops up.
As development code, enter `wirschaffendas`. Then you will see a few options:

### Send Sentry Error

Sends a sample error message to sentry for testing.

### Change CMS

Switches between the test and production cms.

### Enable Devmode

Enables the developer mode which simplifies some testing. For example, it adds an option to solve all questions in an exercise.

### Fill Repetition Exercise with Data

Adds some random words to the repetition exercise.

### Clear selected professions

Removes all selected professions. Useful on ios to get into the setup screen.
