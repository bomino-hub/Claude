# Mon Budget

Application mobile de gestion de finances personnelles, construite avec **React Native (Expo)** et **TypeScript**.

## Fonctionnalités

- **Tableau de bord** : solde total, revenus/dépenses du mois, top catégories de dépenses, transactions récentes.
- **Transactions** : ajout, modification, suppression, recherche et filtrage (revenus/dépenses).
- **Budgets** : définition d'un plafond mensuel par catégorie avec suivi de la progression.
- **Statistiques** : navigation mois par mois, répartition des dépenses par catégorie, comparaison revenus/dépenses.
- **Catégories** : catégories par défaut (alimentation, transport, logement, loisirs, santé, etc.) + création de catégories personnalisées (icône et couleur au choix).
- **Réglages** : choix de la devise (EUR, USD, GBP, XOF, XAF, CAD), réinitialisation des données.
- Toutes les données sont stockées **localement sur l'appareil** (AsyncStorage) — aucune donnée n'est envoyée à un serveur.

## Stack technique

- Expo SDK 51 / React Native 0.74 / TypeScript
- React Navigation (bottom tabs + stack)
- Context API + useReducer pour l'état global
- @react-native-async-storage/async-storage pour la persistance locale
- @expo/vector-icons pour les icônes

## Démarrage

```bash
npm install
npm start
```

Puis scannez le QR code avec l'application **Expo Go** (Android/iOS), ou lancez :

```bash
npm run android   # émulateur/appareil Android
npm run ios       # simulateur iOS (macOS uniquement)
npm run web       # version web (aperçu rapide)
```

## Structure du projet

```
App.tsx                     Point d'entrée
src/
  components/                Composants UI réutilisables
  constants/                 Thème, catégories par défaut
  context/                   FinanceContext (état global + persistance)
  navigation/                Navigation (tabs + stack)
  screens/                   Écrans de l'application
  services/                  Accès au stockage local (AsyncStorage)
  types/                     Types TypeScript partagés
  utils/                     Formatage, calculs (soldes, totaux par catégorie...)
```

## Vérification de types

```bash
npm run typecheck
```
