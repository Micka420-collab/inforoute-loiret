# Spécifications MVP

## Objectif
Donner aux automobilistes du Loiret l'info routière en temps réel (accidents, travaux, bouchons, fermetures, météo, crues), avec push par axe et signalements communautaires.

## Fonctions MVP
- Carte avec incidents live, fil d'alertes filtrable par axe (A10, A71, A19, N20, N60...).
- Push par axe/zone (Expo/FCM/APNs).
- Signalement communautaire (photo + position), modération avant publication.
- Partage vers Insta (visuel auto) : phase 2.
- Français uniquement, sans compte obligatoire.

## Sources de données (à valider : accès et licences)
- Bison Futé / data.gouv.fr (DATEX II), filtré sur le département 45
- Météo-France API (vigilances), Vigicrues
- Open data Conseil départemental / Orléans Métropole
- Phase 2 : Waze for Cities (candidature), TomTom/HERE (quota gratuit limité)

## Architecture
- api : un worker récupère chaque flux toutes les 1 à 2 min, normalise vers `Incident` (voir CLAUDE.md), stocke dans Postgres, expose une API REST (`GET /incidents`, `POST /reports`, `POST /devices`) et envoie les push.
- app : Expo, consomme l'API, cache local, push.

## Plan
1. Squelette + CI. 2. Ingestion Bison Futé. 3. Météo/Vigicrues. 4. Carte et fil. 5. Push. 6. Signalements et modération. 7. Build EAS, TestFlight, Play Console.

## Hors périmètre MVP
Waze, veille X/Facebook, multilingue, comptes utilisateurs.
