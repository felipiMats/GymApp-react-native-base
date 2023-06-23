import {Center, ScrollView, Skeleton, VStack, Text, Heading} from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@hooks/AuthContext';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'

const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe um nome'),
        email: yup.string().email().required(),
        password: yup.string().required(),
        old_password: yup.string().required(),
        confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
})

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/felipimats.png')

    const {user} = useAuth();
    const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    })

    async function handleUsePhotoSelect () {
        setPhotoIsLoading(true)

        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4,4],
                allowsEditing: true
            });
    
            if(photoSelected.canceled) {
                return;
            }
            
            if (photoSelected.assets[0].uri) {
                setUserPhoto(photoSelected.assets[0].uri)
            }
            
        } catch (error) {
            
        } finally {
            setPhotoIsLoading(false)
        }
        
    }

    async function handleUserProfileUpdate(data: FormDataProps) {
        console.log(data)
    }

    return(
        <VStack flex={1}>
            <ScreenHeader title='Perfil'/>
            
            <ScrollView >
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ? 
                        <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE} rounded={'full'} startColor={'gray.500'} endColor={'gray.400'} />
                        :
                        <UserPhoto  source={{uri: userPhoto}} alt='Foto do usuário' size={PHOTO_SIZE}/>
                    }
                    <TouchableOpacity onPress={handleUsePhotoSelect}>
                    <Text color={'green.500'} fontWeight={'bold'} fontSize={'md'} mt={2} mb={8}>Alterar foto</Text>
                    </TouchableOpacity>
                    
                    <Controller 
                        control={control}
                        name='name'
                        render={({field: {value, onChange}}) => (
                            <Input value={value} onChangeText={onChange} bg={'gray.600'} placeholder='Nome' errorMessage={errors.name?.message}/>
                        )}
                    />
                    
                    <Controller 
                        control={control}
                        name='email'
                        render={({field: {value, onChange}}) => (
                            <Input bg={'gray.500'} placeholder='E-mail' isDisabled value={value} onChangeText={onChange}/>
                        )}
                    />
                    
                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading fontFamily={"heading"} color={'gray.200'} fontSize={'md'} mb={2} mt={2}>Alterar senha</Heading>

                    <Controller 
                        control={control}
                        name='old_password'
                        render={({field: {onChange}}) => (
                            <Input bg={'gray.600'} placeholder='Senha antiga' secureTextEntry onChangeText={onChange}/>
                        )}
                    />

                    <Controller 
                        control={control}
                        name='password'
                        render={({field: {onChange}}) => (
                            <Input bg={'gray.600'} placeholder='Nova senha' secureTextEntry onChangeText={onChange}/>
                        )}
                    />

                    <Controller 
                        control={control}
                        name='confirm_password'
                        render={({field: {onChange}}) => (
                            <Input bg={'gray.600'} placeholder='Confirme nova senha' secureTextEntry onChangeText={onChange}/>

                        )}
                    />          
                    
                    <Button title='Atualizar' onPress={handleSubmit(handleUserProfileUpdate)}/>

                
                </VStack>
                
            </ScrollView>
        </VStack>
    )
}