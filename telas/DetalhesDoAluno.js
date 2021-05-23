import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, ScrollView, Button, ActivityIndicator, Alert} from 'react-native'
import firebase from '../banco_de_dados/firebase'

function DetalhesDoAluno(props) {

    // Constante com informações iniciais do aluno
    const estadoInicial = {
        id: '',
        nome: '',
        endereco: '',
        foto: ''
    }
    
    // Guarda informações dos alunos em um estado
    const [aluno, novoAluno] = useState(estadoInicial)    

    // Guarda estado de carregando ou carregado
    const [carregando, carregado] = useState(true)
    
    /**
     * Recebe id do aluno da tela de lista e busca informações do aluno no banco
     * @param {*} id Id do aluno
     */
    const recebeIdAluno = async (id) => {
        const infoBanco = firebase.db.collection('alunos').doc(id) //Documento com informação do aluno
        const doc = await infoBanco.get(); //Recebe aluno do documento banco
        const aluno = doc.data(); //Intrepreta documento com informações do aluno
        novoAluno({
            ...aluno,
            id: doc.id,
        })
        carregado(false)
    }

    useEffect(() =>{
        recebeIdAluno(props.route.params.idAluno);
    }, [])    

    const mudancaDeInformacao = (nome, valor) => {
        novoAluno({ ...aluno, [nome]: valor})
    }

    /**
     * Apaga aluno do banco
     */
    const deletarAluno = async () => {
        const infoBanco = firebase.db.collection('alunos').doc(props.route.params.idAluno)
        await infoBanco.delete()
        props.navigation.navigate('ListaDeAlunos')
    }

    /**
     * Atualizar informações de aluno no banco
     */
    const atualizaAluno = async () => {
        const infoBanco = firebase.db.collection('alunos').doc(aluno.id)
        await infoBanco.set({
            nome: aluno.nome,
            endereco: aluno.endereco,
            foto: aluno.foto
        })
        atualizaInfoAluno(estadoInicial)
        props.navigation.navigate('ListaDeAlunos')
    }

    /**
     * Exibe alerta para confirmar remoção do aluno
     */
    const abreAlertaConfirmacao = () => {
        Alert.alert('Deletar Aluno', 'Tem certeza?',[
            {text: 'Sim', onPress: () => deletarAluno()},
            {text: 'Não', onPress: () => console.log('Cancelado')}
        ])
    }

    if(carregando) {
        return (
            <View>
                <ActivityIndicator size='large' color='#9e9e9e'/>
            </View>
        )
    }

    return (
        <ScrollView style={estilos.fundo}>
            <View style={estilos.campoTexto}>
                <TextInput 
                 placeholder="Nome do Aluno" 
                 value={aluno.nome}
                 onChangeText={(valor) => mudancaDeInformacao("nome", valor)}
                />
            </View>
            <View style={estilos.campoTexto}>
                <TextInput 
                 placeholder="Endereço do Aluno" 
                 value={aluno.endereco}
                 onChangeText={(valor) => mudancaDeInformacao("endereco", valor)}
                />
            </View>
            <View style={estilos.campoTexto}>
                <TextInput 
                 placeholder="Foto do Aluno" 
                 value={aluno.foto}
                 onChangeText={(valor) => mudancaDeInformacao("foto", valor)}
                />
            </View>
            <View style={estilos.botao}>
                <Button
                 color="#0a0"                 
                 title="Atualizar Aluno"                 
                 onPress={() => atualizaAluno()}
                />                
            </View>
            <View>
                <Button
                 color="#d00"
                 title="Deletar Aluno"                 
                 onPress={() => abreAlertaConfirmacao()}
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
    },
    botao:{
        flex: 1,
        padding: 0,
        marginBottom: 30,
        marginTop:20
    }
})

export default DetalhesDoAluno;