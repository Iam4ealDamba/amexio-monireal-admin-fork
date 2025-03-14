# Configuration TailwindCSS
---

Dans le projet Angular, nous avons mis en place la librairie TailwindCSS afin d'avoir une interface plus moderne et
plus facile d'utilisation.

Pour pouvoir l'installer, si elle n'est plus présente à cause d'une éventuelle mise à jour du projet ou d'une fork depuis le répertoire principal de Nuxeo Admin Console, il vous faudra vous diriger vers le module "nuxeo-admin-console-web", une fois dedans il vous faudra aller à la racine du sous dossier "angular-app", et vous pourrez exécuter la commande d'installation ci-dessous dans un terminal:

```bash
# Voir dans le fichier "dependences_utilisees" pour consulter les versions à mettre en place.
npm i tailwindcss@nb_version postcss@nb_version autoprefixer@nb_version && npx tailwindcss init -p
```

Une fois TailwindCSS remis en place, il va également falloir s'assurer que les bonnes variables sont présente dans le fichier de configuration de celui-ci ("tailwindcss.config.js") et pour ça, vous pouvez vous référer à l'extrait de code ci-dessous pour voir s'il manque certaines choses:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,jsp,ts}"],
    theme: {
        extend: {
            colors: {
                "tw-text-white": "#fff",
                "tw-text-black": "#212121",
                "tw-bg": "#f4f4f4",
                "tw-primary": "#0066ff",
                "tw-success": "#6cf080",
                "tw-danger": "#f06c6c",
                "tw-warning": "#f0DA6c"
            },
            screens: {
                'max-2xl': { 'max': '1410px' },
                'max-xl': { 'max': '1230px' },
            }
        },
    },
    plugins: [],
};
```

Ici, nous définissons nos différentes couleurs ainsi que les média queries qui seront utilisées dans le projet Angular, bien sur pour les couleur, nous reprenons celles proposées par Nuxeo dans le package de base.

En plus de ce fichier, nous aurons une feuille de style qui viendra mettre certaines règles pour nos différentes pages, ce fichier peut être trouver dans le dossier "src/app/shared/monireal-admin/styles".
