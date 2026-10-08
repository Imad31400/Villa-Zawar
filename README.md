# Villa Zawar — Site officiel (version statique)

Site en français, réalisé à partir du **kit d’identité officiel Villa Zawar 2026**. Ne nécessite ni React, ni npm, ni base de données, ni serveur PHP. Les photos de la villa sont les extraits issus du kit ; aucune photo d’une autre propriété n’a été utilisée.

## 1. Publier le site en quelques minutes

**Netlify (recommandé pour les formulaires)** : décompresser le ZIP, ouvrir le dossier `villa-zawar` et envoyer ce dossier sur votre compte Netlify via *Add new project → Deploy manually* (ou connecter un dépôt Git). Déposer les **fichiers de ce dossier à la racine** du site. Accéder ensuite à la page d’accueil et tester navigation et images. L’hébergement Netlify est compatible avec les fichiers statiques du projet.

**OVH / Hostinger** : envoyer tout le **contenu** du dossier dans `www` ou `public_html` (les dossiers `assets`, `css` et `js` doivent rester au même niveau que `index.html`). Les pages s’affichent normalement, mais les formulaires **ne transmettent aucune donnée** tant qu’un service de traitement compatible n’est pas ajouté.

**GitHub Pages** : déposer les fichiers à la racine de la publication Pages. Les liens internes sont relatifs. Les formulaires ne fonctionnent pas sur Pages seul.

**Avant publication au public** : les mentions légales, la confidentialité, l’identité du responsable et certaines informations doivent être renseignées (voir section « À vérifier »). Ne pas rendre la version de démonstration publique tant que ces informations obligatoires ne sont pas complétées.

## 2. Formulaires et demandes de disponibilité

Deux formulaires sont prévus : `villa-zawar-disponibilite` (accueil et page Réservation) et `villa-zawar-contact` (Contact). Ils disposent d'une validation JS (dates, max. 8 voyageurs, champs obligatoires), d’un champ antispam caché, de statuts d’envoi accessibles et conservent les données en cas d’échec. **Il n’existe pas de moteur de réservation, de paiement ni d’envoi d’e-mail natif dans un site statique.**

Sur un domaine `*.netlify.app`, l’interface d’envoi s’active automatiquement pour **Netlify Forms**, à condition de déployer les pages HTML sur Netlify, d’activer les formulaires dans l’interface de votre compte et de paramétrer les notifications e-mail de l’administrateur. Le navigateur n’annonce un envoi réussi que si Netlify répond par un statut HTTP réussi ; une réservation reste toujours soumise à une réponse humaine.

Pour un **domaine personnalisé relié à Netlify**, ouvrir `js/config.js` et passer `formsEnabled: false` à `formsEnabled: true` **après** avoir vérifié que les formulaires sont détectés et opérationnels sur Netlify. Dans Netlify, vérifier l’onglet Forms, les notifications et faire une soumission réelle depuis le domaine. Pour OVH, Hostinger et GitHub Pages, conserver `formsEnabled: false` tant qu'une intégration serveur ou un prestataire n’a pas été installé. Un script tiers nécessitera un branchement explicite dans `js/main.js` ; ne pas activer `formsEnabled` sur un hôte non Netlify.

Tester réception et notifications avant d’envoyer du trafic sur le site.

## 3. Modifier les contenus

| Ce que vous souhaitez changer | Où intervenir |
|---|---|
| Textes de l’accueil | `index.html` |
| Présentation et équipements | `villa.html` |
| Suites | `suites.html` |
| Expériences | `experiences.html` |
| Images de la galerie | `galerie.html` et sections des autres pages |
| Coordonnées | `contact.html`, puis `mentions-legales.html` et `confidentialite.html` |
| Boutons / menu commun | En-tête HTML de chacune des neuf pages |
| Couleurs, espacements, typographies | Début de `css/style.css` (`:root`) |
| Paramètres de réception et futur suivi | `js/config.js` |
| Comportements JS (menu, galerie, validation) | `js/main.js` |

Les logos officiels sont dans `assets/logos/`. La signature historique `Logo_Principal_Brun.svg` est présente pour les usages de marque ; le header utilise le fichier horizontal officiel `Logo_Horizontal.svg` et le footer le vrai `Logo_Blanc.svg`. Le bloc sur fond brun utilise `Logo_Champagne.svg`. Les fichiers d’origine peuvent être utilisés à la place des variantes sans redessiner le logo.

### Remplacer les photos par les fichiers HD

Ouvrir `assets/images/`. Les photographies utilisées sont : `arcades-piscine`, `arches-detail`, `piscine`, `salon`, avec variantes WebP et sources JPG. Les sources d’origine sont à basse résolution (699 × 991, 569 × 845, 322 × 307, 322 × 307). Pour des images HD, remplacer les fichiers JPG et WebP **en conservant leurs noms**, ou mettre à jour `src`, `srcset`, `width` et `height` dans les pages concernées. Les dimensions natives doivent être actualisées pour éviter les décalages de mise en page. Les textes `alt` doivent continuer à décrire les vrais lieux. `banniere-officielle.jpg` provient également du kit et sert à la prévisualisation sociale en attendant un domaine confirmé.

Il est important de ne pas présenter une image du salon comme photographie d’une suite. Des prises de vue propres aux chambres peuvent être ajoutées ultérieurement.

## 4. Brancher votre nom de domaine et le SEO

Après avoir obtenu le véritable domaine et activé HTTPS :

```bash
python3 tools/configure_domain.py https://www.votre-domaine-reel.ma
```

Cette commande sans dépendances ajoute les balises canonical, URLs Open Graph absolues, et crée un **sitemap XML réel** et l’entrée Sitemap dans `robots.txt`. La version livrée contient un `sitemap.xml` vide mais valide pour ne pas inventer de domaine. **Ne pas utiliser le domaine d’exemple** : remplacez-le par le vrai domaine contrôlé, sans slash final. Redéployer ensuite les pages.

Le SEO inclut des title et meta descriptions propres à chaque page, une structure de titres, du texte alternatif, du maillage interne et une fiche Schema.org `LodgingBusiness` avec uniquement les caractéristiques confirmées. N’ajoutez ni adresse exacte, ni avis, ni prix tant qu’ils ne sont pas vérifiés. Connecter Google Search Console après vérification de la propriété du domaine, puis soumettre `/sitemap.xml`.

## 5. Google Analytics et Google Tag Manager, ultérieurement

Aucun traceur, pixel publicitaire ou Google Analytics n’est intégré. L’indication `analyticsEnabled` dans `js/config.js` est un **repère de configuration**, et non une installation fonctionnelle de GA4/GTM. Pour les installer, prévoir d'abord une information et un mécanisme de consentement conforme à la réglementation applicable, puis intégrer les scripts dans les pages seulement après activation consentie. Google Fonts nécessite en revanche une requête externe pour charger la typographie ; vérifier les implications de confidentialité selon vos obligations.

## 6. Arborescence

```text
villa-zawar/
  index.html           villa.html           suites.html
  experiences.html     galerie.html         contact.html
  reservation.html     mentions-legales.html  confidentialite.html
  css/style.css        js/config.js        js/main.js
  assets/logos/        assets/images/       assets/icons/
  design-tokens.json   robots.txt          sitemap.xml
  tools/configure_domain.py    README.md
```

## 7. À vérifier avant publication — obligatoire

- [ ] Compléter **tous** les champs entre crochets dans `mentions-legales.html` et `confidentialite.html` ; faire valider ces textes selon l’exploitant et la réglementation applicable.
- [ ] Vérifier les droits d’utilisation en ligne des photos et logos fournis dans le kit.
- [ ] Renseigner l’identité du propriétaire/exploitant, adresse de contact, immatriculation si applicable, responsable de traitement, hébergeur, durées de conservation et droits des personnes.
- [ ] Confirmer et ajouter les coordonnées directes et liens officiels des réseaux sociaux. Ne pas publier de coordonnées fictives.
- [ ] Confirmer tous les détails propres aux suites et intégrer les photos des chambres si elles deviennent disponibles.
- [ ] Confirmer conditions, tarifs, dépôt de garantie, calendrier et prestations optionnelles avant annonce au public.
- [ ] Déployer sur Netlify, vérifier que les deux formulaires sont détectés, puis **tester une vraie réception** (e-mail de notification inclus).
- [ ] Configurer le domaine HTTPS, exécuter `tools/configure_domain.py`, tester tous les liens et soumettre le sitemap à Search Console.
- [ ] Envisager des photographies HD pour améliorer le grand écran ; les extraits de brochure ne peuvent rivaliser avec des fichiers originaux HD.
- [ ] Vérifier juridiquement les mentions sur la confidentialité de Google Fonts et des formulaires.

## 8. Fonctionnalités présentes

Navigation responsive avec fermeture Escape et retour de focus, lien d'évitement, boutons lisibles, menu mobile, galerie avec flèches/clavier et confinement de focus, validations de dates et de capacité, formulaires AJAX conditionnels à la bonne configuration Netlify, animations légères tenant compte de `prefers-reduced-motion`, HTML sémantique, liens relatifs, images locales JPG/WebP, logos SVG officiels, CSS centralisé.

Le site peut être ouvert via `index.html` directement pour inspecter les pages, mais les soumissions se testent uniquement sur un hébergement effectivement configuré et accessible en HTTPS.
