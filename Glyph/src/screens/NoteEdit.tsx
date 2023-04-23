import React, { useEffect, useState } from 'react';
import { ButtonText, Header, Input, InputTypes, Layout, Modal, Settings, SizeScheme, Takoz } from 'react-native-pieces';
import { View } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Note } from '../interfaces';
import { decryptText, encryptText } from '../util';

export default function NoteEdit({ navigation, route}) {
    const { getItem, setItem } = useAsyncStorage('glyph_notes');
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [pass, setPass] = useState('');
    const [modVis, setModVis] = useState(false);

    const loadNote = async () => {
        const notesStr = await getItem();
        const notes = JSON.parse(notesStr || '[]') as Note[];
        const note = notes.filter(e=>e.createdAt === route.params.createdAt)[0];
        setTitle(note.title);
        let content = note.content;
        if (note.hasPass) {
            content = decryptText(note.content, route.params.pass);
        }
        setNote(content);
    }

    const saveNote = async () => {
        const notesStr = await getItem();
        const notes = JSON.parse(notesStr || '[]') as Note[];
        let ixToDel = -1;
        notes.forEach((e, ix) => {
            if (e.createdAt === route?.params?.createdAt) {
                ixToDel = ix;
            }
        });

        let content = note;
        if (pass.length > 0) {
            content = encryptText(note, pass);
        }

        notes.push({
            title,
            content,
            createdAt: route?.params?.createdAt || (new Date()).getTime(),
            updatedAt: (new Date()).getTime(),
            hasPass: pass.length > 0
        });

        if (ixToDel > -1) {
            notes.splice(ixToDel, 1);
        }

        await setItem(JSON.stringify(notes));

        navigation.goBack();
    };

    useEffect(()=>{
        if (route?.params?.createdAt) {
            loadNote();
        }
    }, []);

    return (
        <Layout>
            <Header
                title={'Glyph'}
                navigation={navigation} />

            <View style={{
                minHeight: SizeScheme.get().screen.height.min - 145,
                justifyContent: 'space-between'
            }}>
                <View>
                    <Input
                        label='Title'
                        type={InputTypes.TEXT}
                        value={[title]}
                        handleChange={val => { setTitle(val[0]); }} />

                    <Input
                        label='Note'
                        type={InputTypes.TEXT}
                        settings={[Settings.TEXT_MULTILINE]}
                        value={[note]}
                        handleChange={val => { setNote(val[0]); }} />
                </View>


                <ButtonText
                    label='Save'
                    handleClick={() => { setModVis(true); }}
                    style={{ marginBottom: 20 }} />
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
                        label='Save'
                        handleClick={() => {saveNote()}} />
                </View>
            </Modal>
        </Layout>
    );
}