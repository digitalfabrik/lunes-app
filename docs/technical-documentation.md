# Technical Documentation

## Content

- [Folder structure](#Folder structure)
- [Tools](#Tools)

## Folder structure

```
src
└───routes
│ └───someRoute
│ │   │ SomeRoutePage.tsx
│ └───components
│ │   │ SomeRouteItem.tsx
│ │   │ SomeRouteList.tsx
│ └───services
│     │ SomeRouteSpecificService.ts
└───components
│   │ Button.tsx
│   │ Icon.tsx
└───hooks
└───constants
└───services
    │ DateFormatterService.ts
```

## Tools

We are using:

- StyledComponents
- React Testing Library

If working on components which currently use enzym or StyleSheet feel free to refactor them.
