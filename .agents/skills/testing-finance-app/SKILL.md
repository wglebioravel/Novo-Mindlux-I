# Testing: Controle Financeiro App

## Overview
React Native / Expo financial control app with 3 screens: Dashboard, Add Transaction, History.

## Local Dev Setup

1. Install dependencies: `npm install`
2. For web testing, install web deps: `npx expo install react-dom react-native-web`
3. Start dev server: `npx expo start --web --port 8080`
4. Open `http://localhost:8080` in browser

## Devin Secrets Needed
No secrets are needed - the app is fully local with AsyncStorage persistence.

## Testing Flows

### Navigation
- Bottom tab bar with 3 tabs: "Inicio" (Dashboard), "Adicionar" (Add Transaction), "Historico" (History)
- Month navigation via chevron arrows `<` `>` near the month label on Dashboard and History screens

### Adding Transactions
1. Go to "Adicionar" tab
2. Select type: "Receita" (income, green) or "Despesa" (expense, red)
3. Fill: Descricao, Valor (R$), Data (DD/MM/AAAA auto-formatted)
4. Select a category chip
5. Click "Salvar Transacao"
6. Form resets on success

### Verifying Dashboard
- Summary card shows Saldo Atual, Receitas, Despesas
- Pie chart shows expense breakdown by category
- Recent transactions list (max 5)

### History Filters
- Three filter buttons: Todos / Receitas / Despesas
- Transaction count and filtered total displayed
- Delete via trash icon on each transaction

### Deleting Transactions
- On History screen: trash icon triggers `Alert.alert` confirmation (native only, may not show on web)
- On Dashboard screen: trash icon deletes directly without confirmation
- For web testing, use Dashboard delete since Alert.alert may not render as a dialog on web

## Known Platform Differences (Web vs Native)
- `Alert.alert()` does not render a visible dialog on web in some configurations. On native Android, it shows a proper dialog.
- `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })` works on web but may render differently on Hermes (Android). If currency formatting is broken on Android, a manual formatter may be needed.
- `uuid` v4 uses `crypto.getRandomValues()` which works on web but might need a polyfill on older React Native/Hermes environments.

## Package Version Notes
Expo may warn about package version mismatches (e.g., async-storage, react-native-screens). These warnings are non-blocking but should be resolved for production builds using `npx expo install` to get compatible versions.
