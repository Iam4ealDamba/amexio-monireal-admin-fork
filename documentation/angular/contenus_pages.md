# Contenus des pages

---

Nous verrons ici une explication du contenue des pages disponibles ajoutés par le package AmeXio Monireal Admin. A noter que cette liste peut se voir changer pour les prochaines modifications du package.

1. <u>**User Activities**</u>

   Cette page va nous permettre de récupérer plusieurs informations sur les utilisateurs. Voici les onglets disponible sur cette page et un détails sur ceux-ci :

   | Nom onglet    | Détails onglet                                               |
   | ------------- | ------------------------------------------------------------ |
   | User Sessions | Cet onglet va nous permettre de voir les utilisateurs connectés en temps réel dans l'application Nuxeo ainsi que certaines informations à propos de cette connexion (nom, temps d'inactivité, nombre de pages consultés, durée de session, dernière activité, dernière visite ) |

   

2. <u>**Monitoring**</u>

   La page "Monitoring" va nous permettre d'avoir des fonctionnalités de monitoring pour notre application. Vous pouvez trouver la liste des onglets présents ci-dessous :

   | Nom onglet | Détails onglet                                               |
   | :--------- | ------------------------------------------------------------ |
   | Workflows  | Cet onglet permets de récupérer toutes les tâches de Workflows de l'application avec plusieurs détails (nom workflow, nom tâche, initiateur, dernière modification, date échéance, statut). Il est également possible de déléguer les tache ainsi que d'en annuler plusieurs. |

   

3. <u>**ElasticSearch**</u>

   Le contenue de cette page est concentré sur spécifiquement sur ElasticSearch et les indexes des documents de l'application stockés dedans. Voici tout les onglets disponible sur cette page:

   | Nom onglet            | Détails onglet                                               |
   | --------------------- | ------------------------------------------------------------ |
   | Desync Infos          | Cet onglet permets de voir la désynchronisation des indexes entre le Repository Search et ElasticSearch. Sur cette page, la différence entre les deux est représenter part un graphique de temps pris pour la requête et un autre graphique pour montrer le nombre d'indexes récupérer. |
   | Repository Indexes    | Cet onglet permet de récupérer les indexes du Repository Search afin de pouvoir les chercher individuellement. Une page de détail est également disponible en cliquant sur l'un des indexes dans la liste de recherche. |
   | ElasticSearch Indexes | Cet onglet permet de récupérer les indexes d'ElasticSearch afin de pouvoir les chercher individuellement. Une page de détail est également disponible en cliquant sur l'un des indexes dans la liste de recherche. (A savoir que la recherche est limité aux 1000 premier indexes recherchés pour ElasticSearch) |
   | Re-Indexation         | Cet onglet permet d'effectuer plusieurs requête de re-indexation coté ElasticSearch (Re-index by NXQL Re-index by Query, Flush Indexes, Optimize Indexes) |