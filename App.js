import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

// Instanciação da pilha de telas
const Stack = createStackNavigator()

//Importando componentes de telas
import ListaDeAlunos from "./telas/ListaDeAlunos"
import NovoAluno from "./telas/NovoAluno"
import DetalhesDoAluno from "./telas/DetalhesDoAluno"

/**
 * Função de componente que contém as tela que 
 * serão exibidas e navegadas pelo usuário
 * @returns Stack
 */
function MinhaPilha() {
  return(
    <Stack.Navigator>
      {/* Telas na ordem que serão navegadas */}
      <Stack.Screen 
       name="ListaDeAlunos" 
       component={ListaDeAlunos} 
       options={{title:'Alunos'}}
      />
      <Stack.Screen 
       name="NovoAluno" 
       component={NovoAluno}
       options={{title:'Cadastro de Aluno'}}
      />      
      <Stack.Screen 
       name="DetalhesDoAluno" 
       component={DetalhesDoAluno}
       options={{title:'Detalhes do Aluno'}}
      />
    </Stack.Navigator>
  )
}

/**
 * Função principal que irá exibir a aplicação
 * @returns Aplicação
 */
export default function App() {
  return (
    <NavigationContainer>
      <MinhaPilha/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
