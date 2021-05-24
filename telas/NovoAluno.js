import React, {useEffect, useState} from 'react';
import {View,Button,TextInput,ScrollView,StyleSheet,Image} from 'react-native'
import firebase from '../banco_de_dados/firebase'

/**
 * Gera tela para criar alunos
 * @returns TelaNovoAluno
 */
const NovoAluno = (props) => {

    // Guarda estado da imagem selecionada
    const [imagem, novaImagem] = useState("")

    // Gaurda estado de envio da imagem
    const [envio,novoEnvio] = useState(false)

    /**
     * Função para guardar informações do formulário em uma tupla
     */
    const [estado, novoEstado] = useState({
        nome: '',
        endereco: ''
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
                    endereco: estado.endereco
                })
                props.navigation.navigate('ListaDeAlunos');                
            } catch (error) {
                console.log(error);
            }
        }
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
                 placeholder="Endereço do Aluno" 
                 onChangeText={(valor) => mudancaDeInformacao("endereco", valor)}
                />
            </View>            
            <Image style={estilos.imagem} source={{ uri:imagem }} />
            <View style={estilos.botao}>
                <Button
                 //color="#0a0"                 
                 title="Escolher foto"                 
                 onPress={() => escolherImagem()}
                />
                {!envio?
                <Button
                 title="Enviar foto"
                 onPress={() => enviarImagem()}
                />:<ActivityIndicator size='large' color='#9e9e9e'/>
                }
            </View>
            <View>
                <Button
                 title="Adicionar Aluno"
                 //Ao pressionar botão, mostra estado das informações
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