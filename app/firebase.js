import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDtX6hC8fxm1MLS3uxvUp6WJVZHzVXG308",
    authDomain: "myfinance-88e2a.firebaseapp.com",
    projectId: "myfinance-88e2a",
    storageBucket: "myfinance-88e2a.appspot.com",
    messagingSenderId: "463500740011",
    appId: "1:463500740011:web:e45c7656f5044cb6ce7eee",
    measurementId: "G-1H0NJWG2MK",
};

if (!firebase.default.apps.length) {
    firebase.default.initializeApp(firebaseConfig);
}

const uploadImagesToFirebase = async (imageUris) => {
    const promises = imageUris.map(async (imageUri, index) => {
        return await uploadImage(imageUri, index);
    });
    return await Promise.all(promises);
};
const uploadImage = async (uri, index) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageName = "images/" + new Date().toString() + index;
    await firebase.default.storage().ref().child(imageName).put(blob);
    return await firebase.default
        .storage()
        .ref()
        .child(imageName)
        .getDownloadURL();
};

export { uploadImagesToFirebase };
