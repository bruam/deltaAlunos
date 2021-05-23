import React from 'react';
import {View, ScrollView, Button, StyleSheet} from 'react-native'

function TelaInicial(props) {
    return (
        <ScrollView style={estilos.fundo}>
            <View style={estilos.botao}>
                <Button title='Alunos'
                    onPress={() => props.navigation.navigate('ListaDeAlunos')}
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
    botao:{
        flex: 1,
        padding: 0,
        marginBottom: 30,
        marginTop:20
    }
})

export default TelaInicial;