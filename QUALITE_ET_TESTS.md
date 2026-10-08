# Contrôles réalisés — Villa Zawar

**Version livrée : octobre 2026**

- 9 pages HTML existantes, chacune avec un titre `<title>`, une description et un seul H1.
- Liens internes et chemins d’assets vérifiés par script ; aucune ressource locale manquante lors de l’audit.
- Vérification du menu responsive au clavier (ouverture, Escape, fermeture) aux largeurs 768 et 390 px.
- Visionneuse testée (ouverture, image suivante, image précédente, Escape et fermeture).
- Formulaires : champs requis, incohérence arrivée/départ, conservation de la saisie lorsque l’envoi n’est pas configuré.
- Réponses simulées d’un service de réception : confirmation après HTTP réussi ; maintien des données après échec réseau. **Ce test n’équivaut pas à une réception Netlify réelle.**
- Contrôle des débordements à 1440, 1024, 768, 390 et 360 px (corrigé à 360 px).
- Aperçus Chrome produits avec intégration locale des mêmes HTML, CSS, JS et assets. Le navigateur de test interdisait la navigation vers les URL locales ; les ressources ont été incorporées uniquement pour le rendu de contrôle. Le site livré conserve ses fichiers statiques séparés.
- Toutes les images du site ont été chargées dans les captures finales desktop et mobile.

## À valider sur le déploiement réel

- Réception et notifications des formulaires Netlify, comportement avec le vrai domaine et HTTPS.
- Scores Lighthouse et performances en conditions de connexion réelles.
- Vérification juridique des mentions légales et de confidentialité, ainsi que droits sur les images.
- Canonical / sitemap / Open Graph avec le domaine confirmé.
- Accessibilité complète WCAG 2.2 AA : les contrôles réalisés sont ciblés, pas un audit certifiant.
