# 📘 README – Instructions du projet

Ce document décrit les commandes essentielles pour configurer et lancer les différentes parties du projet en fonction des dossiers : **laravel**, **web**, **mobile**.

---

## Docker – PHP

### Accéder au conteneur PHP dans le dossier
```bash
docker exec -it garage_app bash
```

---

## Backend – Laravel avec Firebase

> Dossier : `laravel`

### Accéder au dossier Laravel
```bash
cd laravel
```

### Installer Laravel (via Composer)
```bash
composer create-project laravel/laravel .
```

### Installer Firebase pour Laravel
```bash
composer require kreait/firebase-php
```

### Configurer Firebase
- Ajouter le fichier **serviceAccountKey.json**
- Définir le chemin dans le fichier `.env`
```env
FIREBASE_CREDENTIALS=storage/app/firebase/serviceAccountKey.json
```

---

## Frontend Web – Vue.js avec Axios

> Dossier : `web`

### Installer les modules
```bash
cd web
npm install
npm install axios
```

### Lancer l'application web
```bash
npm run dev
```

---

## Mobile – React Native avec Expo et Firebase

> Dossier : `mobile`

### Installer Expo CLI (si nécessaire)
```bash
npm install -g expo
```

### Créer le projet Expo
```bash
cd mobile
npx create-expo-app .
```

### Installer Firebase
```bash
npm install firebase
```

### Lancer l'application mobile
```bash
npx expo start -c
```

---


