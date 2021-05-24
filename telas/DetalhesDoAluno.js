import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, ScrollView, Button, 
        ActivityIndicator, Alert, Platform, Image} from 'react-native'
import firebase from '../banco_de_dados/firebase'
import * as ImagePicker from 'expo-image-picker';

function DetalhesDoAluno(props) {

    // Constante com informações iniciais do aluno
    const estadoInicial = {
        id: '',
        nome: '',
        endereco: ''
    }
    
    // Guarda estado da imagem selecionada
    const [imagem, novaImagem] = useState("")

    // Gaurda estado de envio da imagem
    const [envio,novoEnvio] = useState(false)

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

    /**
     * Permite escolher uma imagem na galeria para adicionar de perfil
     */
    const escolherImagem = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          novaImagem(result.uri);
        }
    };

    /**
     * Requisita permissão para acesso ao rolo da câmera    
     */
    useEffect(() =>{
        (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('É necessário permissão de acesso ao rolo da câmera!');
              }
            }
        })();
    }, [])

    /**
     * Envia imagem para o banco
     */
    const enviarImagem = async () => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve[xhr.response];
            };
            xhr.onerror = function() {
                reject(new TypeError['Network request failed']);
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const ref = firebase.st.ref().child(new Date().toISOString())
        const snapshot = ref.put(blob)

        snapshot.on(firebase.st.TaskEvent.STATE_CHANGED,()=>{
            novoEnvio(true)
        },
        (error) => {
            novoEnvio(false)
            console.log(error);
            blob.close()
            return
        },
        () => {
            snapshot.snapshot.ref.getDwnLoadURL().then((url) => {
                novoEnvio(false)
                console.log("download url :", url);
                blob.close();
                return url;
            })
        }
        )
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
            <Image style={estilos.imagem} source={{ uri:imagem }} />
            <View style={estilos.botao}>
                <Button
                 //color="#0a0"                 
                 title="Escolher foto"                 
                 onPress={escolherImagem}
                />
                {!envio?
                <Button
                 title="Enviar foto"
                 onPress={enviarImagem}
                />:<ActivityIndicator size='large' color='#9e9e9e'/>
                }
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
    },
    imagem: { width: 150, height: 150, backgroundColor: 'gray' },
})

export default DetalhesDoAluno;