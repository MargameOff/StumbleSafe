# StumbleSafe
INSA Project for the 3rd year


## Domain

### Modele de donées

<img width="483" alt="image" src="https://github.com/MargameOff/StumbleSafe/assets/135878234/bb5ab83a-0d6d-4bf3-9cdd-b016295ed464">


## DataBase
### Commands
You can start the project for the first time with the following command:
```docker compose up -d```
After that, you can start the project with the following command:
```docker compose start```
For stopping the project:
```docker compose stop```
In case you want to remove the project:
```docker compose down```
### .ENV
You can modify the .env file to change the database configuration.

## Back

### Installation des dépendances
```npm i```
```sudo npm i -g nodemon```

### Start in Dev
```npm run dev```

## Front

### Installation des dépendances
```npm i```

### A jouer a chaque lancement de l'émulateur (pour avoir accès au localhost)
```adb -s emulator-5554 reverse tcp:8080 tcp:8080```

### Start in Dev
```npx expo start```


## Documentation

Pour avoir accès a la documentation de l'API (Swagger)  

```http://stumblesafe.mariusdeleuil.fr:8090/api-docs/```  

Il faut bien penser à lancer le serveur de Back
