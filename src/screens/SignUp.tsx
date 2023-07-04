import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import {useForm, Controller} from 'react-hook-form'
import { useNavigation } from '@react-navigation/native';

import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import LogoHiGroup from '@assets/GRUPO_HI_LOGO_VETOR_Prancheta_1.png';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { useState } from 'react';
import { useAuth } from '@hooks/AuthContext';


type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
        name: yup.string().required('Informe o nome.'),
        email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
        password: yup.string().required('Informe a senha.').min(6,'A senha deve ter no mínimo 6 dígitos.'),
        password_confirm: yup.string().oneOf([yup.ref('password')], 'As senhas não conferem.').required('Informe a confirmação da senha.'),
});


export function SignUp() {
    const {signIn} = useAuth();
    const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack();
    }

    async function handleSignUp({name, email, password}: FormDataProps) {
        try {
            setIsLoading(true);
            await api.post('/users', {name, email, password});
            await signIn(email, password);

        } catch (error) {
            setIsLoading(false);
            
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })

        }
        
    }

    return(
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10} pb={16} bg={'gray.400'}>
                {/* <Image source={BackgroundImg} defaultSource={BackgroundImg} alt='Pessoas treinando' resizeMode='contain' position='absolute' /> */}
                
                <Center mt={12} mb={12}>
                    <Image source={LogoHiGroup} w={40} h={40} mb={5} alt='Logo HiGroup'/>
                    <Text color='gray.100' fontSize={'sm'}>Lavenderia 60 minutos</Text>
                </Center>

                <Center>
                    <Heading color={'gray.100'} fontSize={'xl'} mb={6} fontFamily={'heading'}>
                        Crie sua conta
                    </Heading>
                </Center>

                <Controller 
                    control={control}
                    name="name"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder='Nome' onChangeText={onChange} value={value} errorMessage={errors.name?.message}/>
                    )}
                />

                <Controller 
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder='E-mail' keyboardType='email-address' autoCapitalize='none' onChangeText={onChange} value={value} errorMessage={errors.email?.message}/>
                    )}
                />

                <Controller 
                    control={control}
                    name="password"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder='Senha' secureTextEntry onChangeText={onChange} value={value} errorMessage={errors.password?.message}/>
                    )}
                />  
                

                <Controller 
                    control={control}
                    name="password_confirm"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder='Confirme sua senha' returnKeyType='send' onSubmitEditing={handleSubmit(handleSignUp)} secureTextEntry onChangeText={onChange} value={value} errorMessage={errors.password_confirm?.message}/>
                    )}
                />  

                <Button title='Criar e acessar' onPress={handleSubmit(handleSignUp)} isLoading={isLoading} />

                <Button title='Voltar para o login' variant={'outline'} mt={24} onPress={handleGoBack}/>
            
            </VStack>
        </ScrollView>
        
    )
}