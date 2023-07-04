import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form'

import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {AuthNavigatorRoutesProps} from '@routes/auth.routes'
import LogoHiGroup from '@assets/GRUPO_HI_LOGO_VETOR_Prancheta_1.png';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/AuthContext';
import { useState } from 'react';

type FormDataProps = {
    email: string;
    password: string;
}

const signUpSchema = yup.object({
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha.').min(6,'A senha deve ter no mínimo 6 dígitos.')
});

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const toast = useToast();

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const {signIn} = useAuth()

    async function handleLoginAccount({ email, password}: FormDataProps) {
        try {
            setIsLoading(true)
            await signIn(email, password);
        } catch (error) {
            setIsLoading(false)
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível acessar a conta. Tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    function handleNewAccount() {
        navigation.navigate('signUp');
    }
    return(
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10} pb={16} bg={'gray.400'}>
                {/* <Image source={BackgroundImg} defaultSource={BackgroundImg} alt='Pessoas treinando' resizeMode='contain' position='absolute' /> */}
                
                <Center mt={24} mb={12}>
                    <Image source={LogoHiGroup} w={40} h={40} mb={5} alt='Logo HiGroup'/>
                    <Text color='gray.100' fontSize={'sm'}>Lavanderia 60 minutos</Text>
                </Center>

                <Center>
                    <Heading color={'gray.100'} fontSize={'xl'} mb={6} fontFamily={'heading'}>
                        Acesse sua conta
                    </Heading>
                </Center>

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

                <Button title='Acessar' isLoading={isLoading} onPress={handleSubmit(handleLoginAccount)}/>

                <Center mt={12}>
                    <Text color={'gray.100'} fontSize={'sm'} mb={3} fontFamily={'body'}>
                        Ainda não tenho acesso
                    </Text>
                </Center>
                

                <Button title='Criar conta' variant={'outline'} onPress={handleNewAccount}/>
            
            </VStack>
        </ScrollView>
        
    )
}