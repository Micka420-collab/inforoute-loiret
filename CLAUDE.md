# CLAUDE.md : InfoRoute Loiret

App mobile d'infos routières temps réel du Loiret. Voir docs/SPEC.md et docs/design/DESIGN.md.

## Stack
- app/ : Expo (React Native) + TypeScript strict, NativeWind, @maplibre/maplibre-react-native, @gorhom/bottom-sheet, expo-haptics, Reanimated
- api/ : Node 20 + Fastify + TypeScript, Postgres, tests Vitest
- infra/ : docker-compose (api + postgres)

## Commandes
- api : `cd api && npm ci && npm run lint && npm run typecheck && npm test`
- app : `cd app && npm ci && npm run lint && npm run typecheck && npm test`

## Règles
- Une tâche = une issue = une petite PR (< 400 lignes). Branche `feat/<issue>-court-titre`.
- Jamais de push direct sur `main`. PR avec description : quoi et pourquoi.
- Tests verts (lint, typecheck, tests) avant de demander une review.
- Aucun secret ni `.env` committé. Utiliser `.env.example`.
- Design : couleurs/espacements uniquement via `design/tokens.json`. Jamais de valeur en dur.
- Gravité jamais indiquée par la seule couleur : toujours icône + texte. Cibles tactiles >= 48 px.
- Pas de sur-ingénierie : la solution la plus simple qui résout le problème.
- Lire le code existant avant de le modifier. Ne pas ajouter de dépendance sans la justifier dans la PR.
- Langue de l'UI : français.

## Modèle de données central
`Incident { id, source, type (accident|travaux|bouchon|fermeture|meteo|crue), severity (low|medium|high), road (A10, N20...), lat, lon, title, description, startsAt, endsAt?, verified, updatedAt }`
Toutes les sources sont normalisées vers ce schéma.
