# Design InfoRoute Loiret

Concept (Sophie) : « Sache avant de partir ». Info routière du Loiret en 5 secondes. Ton direct, communautaire, lisible en conduite.

## Identité
- Fond bleu nuit #0B1F3A, accent jaune signalisation #FFC400 (action principale et états actifs uniquement, texte dessus en bleu nuit).
- Rouge #E5322D accident/route coupée, orange #FF8A00 travaux, vert #2BB673 dégagé. Toujours icône + texte, jamais la couleur seule.
- Typo : Inter (texte), Barlow Condensed (titres et axes A10, N20).
- Logo : pin de carte avec tracé de route en L, jaune sur bleu.
- Mode sombre par défaut (suit le système), clair en option.

## Écrans MVP
1. Carte : plein écran, pastilles par gravité (clustering au dézoom), filtres Tout/Accidents/Travaux/Météo, bouton flottant « + Signaler » en bas à droite.
2. Fil d'alertes : cartes par récence, icône + axe + lieu + heure, badge « Vérifié » ou « Communauté ».
3. Détail : bottom sheet (aperçu, mi-écran, plein), mini-carte, description, photo, durée estimée, Partager.
4. Signaler : 3 étapes max (type, photo géolocalisée, envoyer), moins de 10 s.
5. Mes axes : routes/secteurs pour les push, plage horaire (ex. 7h-9h).
6. Réglages : notifications, thème, lien Insta.

## UX
- Gros boutons, une main, cibles >= 48 px. Pas de compte obligatoire.
- Push courts : « A10 sens Paris : accident, +25 min ».
- Visuel Insta auto en 1 tap.
- Haptique léger au tap, « success » à l'envoi. Animations < 250 ms. Skeletons plutôt que spinners.

## Référence : compte Insta @inforouteloiret
Source : capture d'écran fournie par naka (couleurs estimées à l'œil, à valider).

**Ce qu'on voit**
- 28,9 k followers, compte vérifié, site www.irl45.com. Highlights : Events, Site web.
- Logo : rond blanc, forme bleu et vert avec route grise, « INFO ROUTE » en gras, « LOIRET » en vert dessous.
- Palette : bleu marine, blanc, vert (route dégagée), rouge (incident). Communiqués marine/blanc, titres en majuscules condensées grasses.
- Posts : captures de carte trafic façon Google Maps (routes vertes, icône rouge d'incident), photos de panneaux lumineux (ambre), ton parfois humoristique.

**Décisions pour reprendre le design en mieux**
- Garder l'identité marine + vert + rouge pour rester reconnaissable. Le jaune #FFC400 reste réservé à l'action principale.
- Vert « dégagé » ≈ #2BB673 (celui du logo) ; rapprocher notre bleu nuit de leur marine (tokens à ajuster après le squelette API).
- Titres condensés gras (Barlow Condensed), cohérent avec leurs communiqués.
- Visuel Insta auto : carte trafic stylisée + pastille de gravité + axe, mêmes codes.
- Amélioration : carte temps réel et push, là où ils n'ont que des images statiques.

## Choix techniques
NativeWind branché sur design/tokens.json ; composants maison Button, SeverityBadge, AlertCard ; MapLibre style sombre (OpenFreeMap ou MapTiler, licence et quota à vérifier) ; @gorhom/bottom-sheet ; expo-haptics ; Reanimated.
