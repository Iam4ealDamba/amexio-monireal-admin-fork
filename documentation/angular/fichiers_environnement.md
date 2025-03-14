# Fichier d'environnement

---
Ici, nous allons expliquer comment créer les fichiers de configuration pour Monireal Admin.
Dans un premier temps , nous voulons verifier que nous avons bien les fichier "environment.ts" et "environment.devlopment.ts" dans le chemin ci-dessous:

```bash
# Chemin local vers le fichier d'environnement
nuxeo-admin-console-web/angular-app/src/environments
```

Si vous avez pas ces deux fichiers, vous pouvez les créer en utilisant la commande suivante:

```bash
# Pour créer le fichier "environment.ts"
ng g environment
```

Une fois le fichier d'environnement créer, nous pourrons le completer avec les informations ci-dessous:

```typescript
export const environment = {
  // todo: This is the only difference between the development and production environments
  // demo url: https://api.realworld.io/api
  apiUrl: "assets",
  production: true,
};
```

Nous allons également créer le deuxième fichier à partir de celui-ci et nous le nommerons "environment.devlopment.ts" 

```typescript
export const environment = {
  // todo: This is the only difference between the development and production environments
  // demo url: https://api.realworld.io/api
  apiUrl: "http://localhost:<VOTRE_PORT_ICI>",
  production: false,
};
```