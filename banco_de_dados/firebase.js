import firebase from 'firebase'

import 'firebase/firestore'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyDKN-wCOdshZin05XMPf02ic6UaxcqUD94",
    authDomain: "crud-alunos-delta-9cf96.firebaseapp.com",
    projectId: "crud-alunos-delta-9cf96",
    storageBucket: "crud-alunos-delta-9cf96.appspot.com",
    messagingSenderId: "313605345924",
    appId: "1:313605345924:web:d29e82094694839374a8d1"
  };
  // Inicializa Firebase
  firebase.initializeApp(firebaseConfig);

  //constante para utilizar o banco
  const db = firebase.firestore()
  const st = firebase.storage()

  //exporta firebase e constante do banco
  export default {
      firebase,
      db,
      st
  }