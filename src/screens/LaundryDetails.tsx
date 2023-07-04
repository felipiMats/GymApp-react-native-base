import {Image, HStack, Heading, Icon, Text, VStack, ScrollView, Box, useToast, Input} from 'native-base';
import { TouchableOpacity } from 'react-native';
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { useEffect, useState } from 'react';
import { Loading } from '@components/Loading';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

type RoutesParamsProps = {
    tokenId: string;
}


export function Exercise() {
    const [softener, setSoftener] = useState<string>();
    const [soap, setSoap] = useState<string>();
    const [laundryDetails, setLaundryDetails] = useState<RoutesParamsProps>();
    const [isLoading, setIsLoading] = useState(true);
    const [sendingRegister, setSendingRegister] = useState(false);

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleGoBack() {
        navigation.goBack();
    }

    const route = useRoute();
    const {tokenId} = route.params as RoutesParamsProps;

    async function fetchLaundryDetails() {
        try {
            setIsLoading(true);

            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da lavanderia';
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    async function handleNewTimer() {
        try {
            setSendingRegister(true);

            
            toast.show({
                title: 'Êxito! temporizador alterado.',
                placement: 'top',
                bgColor: 'green.500'
            })

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível alterar o temporizador.';
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setSendingRegister(false);
        }
    }

    useEffect(() => {
        fetchLaundryDetails();
    },[laundryDetails])
    return(
        <VStack flex={1}>
            <VStack bg={'gray.600'} px={8} pt={12}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={Feather} name='arrow-left' color={'green.500'} size={6}/>
                </TouchableOpacity>
                
                <HStack justifyContent={'space-between'} mt={4} mb={8} alignItems={'center'} flexShrink={1}>
                    <Heading fontFamily={"heading"} color={'gray.100'} fontSize={'lg'}>{tokenId}</Heading>

                    <HStack alignItems={'center'}>
                        <Icon as={MaterialIcons} name='local-laundry-service' size={6} />
                        <Text color={'gray.200'} ml={1} textTransform={'capitalize'}>Intermares</Text>
                    </HStack>
                </HStack>
            </VStack>

            { isLoading ? <Loading /> :
                <ScrollView>
                    <VStack p={8}>

                        <Box bg={'gray.600'} rounded={'md'} pb={4} px={4} >
                            <HStack alignContent={'center'} justifyContent={'space-between'} mb={6} mt={5}>
                                <HStack>
                                    <Icon as={FontAwesome5} name='pump-soap' size={6} />
                                    <Text color={'gray.200'} ml={2}>Sabão 5s</Text>
                                </HStack>
                                
                                <HStack>
                                    <Icon as={FontAwesome5} name='hand-holding-water' size={6} />
                                    <Text color={'gray.200'} ml={2}>Amaciante 5s</Text>
                                </HStack>
                            </HStack>
                            
                            <Heading textAlign={'center'} color={'gray.200'} fontSize={'22'}>Temporizador</Heading>
                            
                            <HStack justifyContent={'space-between'} mt={5}>
                                <VStack mt={5} width={'45%'}>
                                    <Heading textAlign={'center'} color={'gray.200'} fontSize={'16'}>Sabão</Heading>
                                    <Input textAlign={'center'} fontSize={24} color={'white'} keyboardType='numeric' mt={4} onChangeText={setSoap}/>
                                </VStack>

                                <VStack mt={5} width={'45%'}>
                                    <Heading textAlign={'center'} color={'gray.200'} fontSize={'16'}>Amaciante</Heading>
                                    <Input textAlign={'center'} fontSize={24} color={'white'} keyboardType='numeric' mt={4} onChangeText={setSoftener}/>
                                </VStack>

                            </HStack>
                            
                            <Button title='Realizar alteração' isLoading={sendingRegister} mt={4} onPress={handleNewTimer}/>
                        </Box>
                    
                    </VStack>
                </ScrollView> 
            }
        </VStack>
    )
}