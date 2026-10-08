/* VILLA ZAWAR — configuration simple à modifier avant publication.
   Pour un domaine personnalisé hébergé sur Netlify, passer formsEnabled à true
   APRÈS avoir activé Netlify Forms sur le site. Ne pas activer ailleurs sans
   mettre en place une solution d'envoi compatible. */
window.VILLA_ZAWAR_CONFIG = {
  formsEnabled: false,
  formsProvider: 'netlify',
  siteUrl: '', // Exemple après achat du domaine : 'https://www.votre-domaine.ma'
  analyticsEnabled: false // Aucun script de suivi n'est chargé par défaut.
};
