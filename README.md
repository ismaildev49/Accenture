# Le But de Cette Application 🎯

Cette application est un défi proposé par _Accenture_ aux élèves de BeCode et constitue un réel projet pour l'un de leurs clients. L'objectif principal est de déterminer si les employés du client ont droit à la **FMB (Federal Mobility Budget)**. La FMB est un avantage financier offert aux employés qui travaillent à moins de  10 km de leur lieu de travail, permettant une aide pour le remboursement de leur crédit hypothécaire ou leurs frais de déplacement.

## Les Stacks Utilisés 🛠️

Pour ce projet, j'ai opté pour une combinaison de **Vite + React** pour le front-end et **Appwrite** pour le back-end.

- **Appwrite** : Une plateforme de développement backend open source offrant des services d'authentification, de base de données, de stockage et bien plus encore pour construire des applications sécurisées et évolutives avec moins de code.
- **React** : Une bibliothèque JavaScript pour construire des interfaces utilisateur, développée par Facebook, qui permet aux développeurs de créer des applications web interactives et performantes en utilisant un modèle de programmation déclaratif.

## Fonctionnalités Actuelles 📋

- **Authentification / Déconnexion** : Permet aux utilisateurs de se connecter et de se déconnecter.
- **Redirection vers Dashboards** : En fonction du rôle de l'utilisateur (admin ou non) dans la base de données.
- **Formulaire de Saisie de Journées de Travail** : Accessible sous forme de calendrier pour les employés.
- **Calcul d'Éligibilité** : Basé sur la distance entre le domicile et le lieu de travail, avec l'utilisation de l'**API Open Cage Data**.
- **Visualisation de la Distance** : Calculée grâce à une formule mathématique.
- **Gestion des Employés** : Pour l'administrateur, permettant de visualiser l'historique d'éligibilité et de créer les adresses des clients.

