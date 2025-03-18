# Utilisation des icons

---
Afin de pouvoir utiliser des icons sur l'application Angular pour la partie du module AmeXio Monireal Admin, il sera
necessaire d'utiliser la dépendence ng-icons. Cette dépendance apporte une grande varietés d'icons appartenant à differents librairies d'icons (Bootstrap Icons,
FontAwesome, Material Icnos, HeroIcons, etc...).

Dans un premier temps, il faudra vous assurer que la dépendences ng-icons soit bien installer dans le projet, si ce
n'est pas le cas, il vous suffira d'installer celle-ci via la commande suivante:

```bash
# Installation de la dépendance ng-icons avec npm
npm i @ng-icons/core
```

Une fois cela fait, il vous faudra vous assurer que la librairie que vous souhaitez utilisé soit également installé,
nous prendrons comme exemple la librairie HeroIcons, il vous suffira donc d'installer celle-ci via la commande suivante:

```bash
# Installation du module de configuration de ng-icons avec npm
npm i @ng-icons/heroicons
```

Pour voir toute les icons disponibles sur cette librairie, vous pouvez vous rendre sur le site officiel de la
dépendance: [ng-icons](https://ng-icons.github.io/ng-icons/#/browse-icons).

Finalmement, sur votre page HTML, cela ce présentera de cette facon:

```html
<!-- Exemple de code HTML-->
<hero-icon name="nom_de_icon"></hero-icon>
```

Et du coté Typescript, il vous faudra aller vers le fichier de configuration global des icons dans le projet afin
d'ajouter votre icon à la liste :

```bash
# Chemin vers le fichier de configuration global des icons depuis l'application Angular
src/app/shared/monireal-admin/modules/icons/icons.default.configuration.ts
```