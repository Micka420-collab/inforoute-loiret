# AGENTS.md : InfoRoute Loiret (Codex et autres agents)

Mêmes règles que CLAUDE.md, qui fait foi. Résumé :

- Monorepo : `app/` (Expo + TS), `api/` (Fastify + Postgres), `infra/`, `docs/`, `design/tokens.json`.
- Contexte produit : docs/SPEC.md. Design : docs/design/DESIGN.md.
- Tâches isolées uniquement, une issue = une PR < 400 lignes, branche `feat/<issue>-titre`.
- Avant de rendre la main : lint + typecheck + tests verts dans le dossier touché.
- Pas de push sur `main`, pas de secrets, pas de valeurs de design en dur (tokens).
- Ne pas modifier un dossier hors du périmètre de l'issue (évite les conflits entre agents en parallèle).
- Répartition suggérée : Claude Code = socle, backend, architecture ; Codex = écrans isolés, tests, petites features.
