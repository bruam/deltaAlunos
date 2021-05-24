import React, {useState, useEffect} from 'react';
import {ScrollView, Button} from 'react-native'
import firebase from '../banco_de_dados/firebase'
import { ListItem, Avatar } from 'react-native-elements'

/**
 * Retorna lista de alunos do banco e mostra na tela
 * @param {*} props 
 * @returns Alunos Lista de alunos
 */
function ListaDeAlunos(props) {

    const [alunos, novoAluno] = useState([])

    /**
     * Lista alunos e suas informações recuperando do banco
     */
    useEffect(() => {
        firebase.db.collection('alunos').onSnapshot((querySnapshot) => {
            const alunos = []; //array de alunos

            //Percorre informações do banco e guarda no array de alunos
            querySnapshot.docs.forEach(doc => {
                const {nome,endereco,foto} = doc.data()
                alunos.push({
                    id: doc.id,
                    nome,
                    endereco
                })
            })
            
            novoAluno(alunos)
        })
    }, [])

    //Retorna lista de alunos formatado com ListItem
    return (
        <ScrollView>
            <Button title='Adicionar Aluno'
                onPress={() => props.navigation.navigate('NovoAluno')}
            />

            {
                alunos.map((aluno) => {
                    return (
                        <ListItem key={aluno.id} 
                         bottomDivider 
                         onPress={() => {
                             props.navigation.navigate('DetalhesDoAluno', {
                                 idAluno: aluno.id
                             })
                         }}
                        >
                            <ListItem.Chevron/>
                            {/* <Avatar 
                             source={{
                                uri:''
                                    }}
                             rounded
                            /> */}
                            <ListItem.Content>
                                <ListItem.Title>{aluno.nome}</ListItem.Title>
                                <ListItem.Subtitle>{aluno.endereco}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    )
                })
            }
        </ScrollView>
    );
}

export default ListaDeAlunos;