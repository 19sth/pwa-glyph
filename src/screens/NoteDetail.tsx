import React, { useEffect, useState } from 'react';
import { ButtonText, Header, Input, InputTypes, Layout, Modal, SizeScheme, Takoz } from '@19sth/react-native-pieces';
import { ScrollView, View, Text } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Note } from '../interfaces';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { decryptText } from '../util';
import { useIsFocused } from '@react-navigation/native';


export default function NoteDetail({ navigation, route }) {
    const { getItem, setItem } = useAsyncStorage('glyph_notes');
    const isFocused = useIsFocused();
    const [note, setNote] = useState({
        title: '',
        content: '',
        createdAt: 0,
        updatedAt: 0
    } as Note);
    const [pass, setPass] = useState('');
    const [modVis, setModVis] = useState(false);
    const [delModVis, setDelModVis] = useState(false);
    const [decVis, setDecVis] = useState(true);

    const load = async () => {
        const notesStr = await getItem();
        const notes = JSON.parse(notesStr) as Note[];
        const tNote = notes.filter(e => e.createdAt === route.params.createdAt)[0];
        if (!tNote.hasPass) {
            setDecVis(false);
        }
        if (pass) {
            tNote.content = decryptText(tNote.content, pass);
        }
        setNote(tNote);
    };

    const remove = async () => {
        const notesStr = await getItem();
        const notes = JSON.parse(notesStr) as Note[];
        let ixToDel = -1;
        notes.forEach((e, ix) => {
            if (e.createdAt === route.params.createdAt) {
                ixToDel = ix;
            }
        });
        if (ixToDel > -1) {
            notes.splice(ixToDel, 1);
        }
        setItem(JSON.stringify(notes));
        navigation.goBack();
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        load();
    }, [isFocused]);

    return (
        <Layout>
            <Header
                title={'Glyph'}
                navigation={navigation}
                buttons={decVis ? [] : [
                    {
                        faIcon: faTrashAlt, handleClick: () => {
                            setDelModVis(true);
                        }
                    },
                    {
                        faIcon: faEdit, handleClick: () => {
                            navigation.navigate('NoteEdit', {
                                createdAt: route.params.createdAt,
                                pass: pass
                            });
                        }
                    },
                ]} />

            <ScrollView style={{
                minHeight: SizeScheme.get().screen.height.min - 215
            }}>
                <View style={{ justifyContent: 'space-between' }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                        <Text>{(new Date(note.createdAt)).toDateString()}</Text>
                    </View>
                    <Text style={{
                        fontSize: SizeScheme.get().font.c,
                        fontWeight: 'bold',
                        marginBottom: 10
                    }}>{note.title}</Text>
                    <Text style={{
                        fontSize: SizeScheme.get().font.e
                    }}>{note.content}</Text>
                </View>
            </ScrollView>

            <View style={{ height: 70 }}>
                {
                    decVis && (
                        <ButtonText
                            label='Decrypt'
                            handleClick={() => { setModVis(true); }}
                            style={{ marginBottom: 10 }} />
                    )
                }
            </View>

            <Modal
                visible={modVis}
                handleClose={() => { setModVis(false) }}
                style={{ height: 210 }}>
                <Input
                    label=''
                    type={InputTypes.TEXT}
                    value={[pass]}
                    placeholder='Cypher to encrypt, not required'
                    handleChange={val => { setPass(val[0]) }} />
                <Takoz />
                <View>
                    <ButtonText
                        label='Decrypt'
                        handleClick={() => {
                            const passCheck = decryptText(note.passCheck, pass);
                            if (passCheck.includes(pass)) {
                                const text = decryptText(note.content, pass);
                                setNote({
                                    ...note,
                                    content: text
                                });
                                setDecVis(false);
                                setModVis(false);
                            } else {
                                setPass('');
                                setModVis(false);
                            }
                        }} />
                </View>
            </Modal>

            <Modal
                visible={delModVis}
                handleClose={() => { setDelModVis(false) }}
                style={{ height: 210 }}>
                    <Text style={{
                        fontSize: SizeScheme.get().font.c,
                        marginBottom: 20
                    }}>You will permanantely delete this note. Are you sure?</Text>
                    <ButtonText
                        label='Delete'
                        handleClick={()=>{
                            remove();
                        }}/>
            </Modal>
        </Layout>
    );
}