# Deep Linking

We use deep linking to activate additional app content.

## Schemes

### 1. Https

This scheme has a trust association to our server and only works if `assetlinks.json` and `apple-app-site-association` files are properly deployed on our webserver.
We need this scheme, because some mail clients and camera apps are not able to handle custom schemes.

#### Example

`https://lunes.tuerantuer.org/.well-known/assetlinks.json`

### 2. Custom scheme

Custom scheme deep links have a better browser compatibility than https deep links.
They will be used in the browser f.e. on the landing page.

## ActivationLink

The activation link for additional content can be created in the custom area options in our backend (tbd)

### Examples:

```
https://lunes.tuerantuer.org/activation/telc0h1sj21

lunes://lunes.app/activation/telc0h1sj21
```

## Testing

Install: `npm i -g uri-scheme` if you want to use the simplified command

### a) Android

#### Note

For android trusted associations, which are required for https schemes, only work with signed apks out of the box.
For local testing you have to install the app and add these domains manually.

- AppSettings -> OpenByDefault -> AddLinks -> enable supported links

```
npx uri-scheme open https://lunes.tuerantuer.org/activation/telc0h1sj21 --android
```

or

```
npx uri-scheme open lunes://lunes.app/activation/telc0h1sj21 --android
```

### b) iOS

```
npx uri-scheme open https://lunes.tuerantuer.org/activation/telc0h1sj21 --ios
```

or

```
npx uri-scheme open lunes://lunes.app/activation/telc0h1sj21 --android --ios
```
