import React, {useState} from 'react';
import {View,Button,TextInput,ScrollView,StyleSheet} from 'react-native'
import firebase from '../banco_de_dados/firebase'

/**
 * Gera tela para criar alunos
 * @returns TelaNovoAluno
 */
const NovoAluno = (props) => {

    /**
     * Função para guardar informações do formulário em uma tupla
     */
    const [estado, novoEstado] = useState({
        nome: '',
        email: '',
        foto: ''
    })

    /**
     * Função para guardar alterações de informação no formulário
     * @param {*} nome Nome da informação a ser guardada
     * @param {*} valor Informação a ser guardada
     */
    const mudancaDeInformacao = (nome, valor) => {
        novoEstado({ ...estado, [nome]: valor})
    }

    /**
     * Guarda informações de novo aluno no banco
     */
    const GuardaNovoAluno = async () => {
        if(estado.nome === '') {
            alert('Informar nome do aluno')
        } else {
            try {
                await firebase.db.collection('alunos').add({
                    nome: estado.nome,
                    email: estado.email,
                    foto: estado.foto
                })
                props.navigation.navigate('ListaDeAlunos');                
            } catch (error) {
                console.log(error);
            }            
        }
    }

    return (
        <ScrollView style={estilos.fundo}>
            <View style={estilos.campoTexto}>
                <TextInput 
                 placeholder="Nome do Aluno" 
                 //Guarda informação do nome usando função mudancaDeInformacao
                 onChangeText={(valor) => mudancaDeInformacao("nome", valor)}
                />
            </View>
            <View style={estilos.campoTexto}>
                <TextInput 
                 placeholder="Email do Aluno" 
                 onChangeText={(valor) => mudancaDeInformacao("email", valor)}
                />
            </View>
            <View style={estilos.campoTexto}>
                <TextInput 
                 placeholder="Foto do Aluno" 
                 onChangeText={(valor) => mudancaDeInformacao("foto", valor)}
                />
            </View>
            <View>
                <Button
                 title="Adicionar Aluno"
                 //Ao precionar botão, mostra estado das informações
                 onPress={() => GuardaNovoAluno()}
                />
            </View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    fundo:{
        flex: 1,
        padding: 35
    },
    campoTexto:{
        flex:1,
        padding: 0,
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    }
})

export default NovoAluno;