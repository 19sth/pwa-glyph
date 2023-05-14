import React, { useEffect, useState } from 'react';
import { ColorScheme, Header, Layout, SizeScheme } from 'react-native-pieces';
import { faPlus, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Note } from '../interfaces';
import { useIsFocused } from '@react-navigation/native';

export default function NoteList({ navigation }) {
    const [notes, setNotes] = useState([] as Note[]);
    const {getItem} = useAsyncStorage('glyph_notes');
    const isFocused = useIsFocused();

    const load = async()=>{
        const notesString = await getItem();
        if (notesString) {
            setNotes(JSON.parse(notesString) as Note[]);
        }
    }

    useEffect(()=>{
        load();
    }, []);

    useEffect(()=> {
        load();
    }, [isFocused]);


    return (
        <Layout>
            <Header
                title={'Glyph'}
                navigation={navigation}
                buttons={[
                    { faIcon: faPlus, handleClick: () => { navigation.push("NoteEdit") } },
                    { faIcon: faCircleQuestion, handleClick: () => { window.location.href="https://mujdecisy.github.io/app/glyph-encrypted-notes"; } },
                ]} />
            <ScrollView style={{minHeight: SizeScheme.get().screen.height.min - 145}}>
                {
                    notes.map(e=>(
                        <Pressable 
                            key={e.createdAt}
                            style={{
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: ColorScheme.get().secondary
                            }}
                            onPress={()=>{navigation.navigate("NoteDetail", {createdAt: e.createdAt})}}>
                            <Text style={{
                                fontSize: SizeScheme.get().font.c
                            }}>{e.title}</Text>
                        </Pressable>
                    ))
                }
            </ScrollView>
        </Layout>
    );
}