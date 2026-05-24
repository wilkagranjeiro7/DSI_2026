# DSI_2026

O FitMatch é um aplicativo que recomenda exercícios físicos de forma personalizada, de acordo com seus objetivos, tempo disponível e nível de condicionamento. Nosso objetivo é tornar o treino mais simples, acessível e eficiente para todos.

## Primeiros passos com o ExpoApp

Este é um projeto [Expo](https://expo.dev) criado com [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

1. Instale as dependências

```bash
npm install
```

2. Inicie o app

```bash
npx expo start
```

Na saída do terminal, você terá opções de como abrir o app:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) - um ambiente sandbox restrito para testes de desenvolvimento do app com o Expo


## Configurando as env do firebase e supabase
Para utilizar o firebase localmente basta adicionar no .env as credenciais necessárias.
```
# CONFIGURAÇÕES DO FIREBASE
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# CONFIGURAÇÕES DO SUPABASE
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=


```

1. Copie e cole o arquivo .env-example;

2. Renomeie ele para .env;

3. Peça para outro membro do grupo as credenciais;

### IMPORTANTE
NUNCA COMMITAR A **APIKEY**!