import {Image, HStack, Heading, Icon, Text, VStack, ScrollView, Box, useToast, Input, Badge, FlatList} from 'native-base';
import { TouchableOpacity } from 'react-native';
import {Feather} from '@expo/vector-icons'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from '@components/Loading';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Group } from '@components/Group';

type RoutesParamsProps = {
    tokenId: string;
    name: string;
}



export function Exercise() {
    const [isOnlineServer, setIsOlineServer] = useState<boolean>();
    const [screenOpened, setScreenOpened] = useState(false);

    const [newSoftener, setNewSoftener] = useState<string>();
    const [newSoap, setNewSoap] = useState<string>();

    const [staticSoap, setStaticSoap] = useState<string>()
    const [staticSoftener, setStaticSoftener] = useState<string>()
    
    const [isLoading, setIsLoading] = useState(true);
    const [sendingRegister, setSendingRegister] = useState(false);

    const [machines, setMachines] = useState(['432', '543', '654'])
    const [machineSelected, setMachineSelected] = useState<string>('543');

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleGoBack() {
        navigation.navigate('home');
    }

    

    const route = useRoute();
    const {tokenId, name} = route.params as RoutesParamsProps;

    async function fetchLaundryDetails() {
        try {
            setIsLoading(true);

            let VS, VA;
            switch (machineSelected) {
                case '432':
                    VS = 'V43';
                    VA = 'V44';
                    break;
                case '543':
                    VS = 'V45';
                    VA = 'V46';
                    break;
                case '654':
                    VS = 'V47';
                    VA = 'V48';
                    break;
            }
            const timeSoap = await axios.get(`https://blynk.cloud:443/external/api/get?token=${tokenId}&${VS}`);
            const timeSoftener = await axios.get(`https://blynk.cloud:443/external/api/get?token=${tokenId}&${VA}`);

            setStaticSoap(timeSoap.data);
            setStaticSoftener(timeSoftener.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da lavanderia';
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })

            setStaticSoap('');
            setStaticSoftener('');

        } finally {
            setIsLoading(false);
        }
    }

    async function handleNewTimer() {
        try {
            setSendingRegister(true);

            let VS, VA;

            switch (machineSelected) {
                case '432':
                    VS = 'V37';
                    VA = 'V38';
                    break;
                case '543':
                    VS = 'V39';
                    VA = 'V40';
                    break;
                case '654':
                    VS = 'V41';
                    VA = 'V42';
                    break;
            }

            if (newSoap) {
                await axios.get(`https://blynk.cloud:443/external/api/update?token=${tokenId}&${VS}=${newSoap}`);
                toast.show({
                    title: 'Êxito! temporizador do sabão alterado.',
                    placement: 'top',
                    bgColor: 'green.500'
                    
                })
                setStaticSoap(newSoap);

            }
            
            if (newSoftener) {
                await axios.get(`https://blynk.cloud:443/external/api/update?token=${tokenId}&${VA}=${newSoftener}`);
                toast.show({
                    title: 'Êxito! temporizador do amaciante alterado.',
                    placement: 'top',
                    bgColor: 'green.500'
                })
                setStaticSoftener(newSoftener);
            }
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível alterar o temporizador.';
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
            setStaticSoap('');
            setStaticSoftener('');
        } finally {
            setSendingRegister(false);
            setNewSoap('');
            setNewSoftener('');
        }
    }

    async function handleOnReleSoap() {
        try {
            setSendingRegister(true);

            let VS, VA;

            switch (machineSelected) {
                case '432':
                    VS = 'V61';
                    VA = 'V62';
                    break;
                case '543':
                    VS = 'V63';
                    VA = 'V64';
                    break;
                case '654':
                    VS = 'V65';
                    VA = 'V66';
                    break;
            }

            await axios.get(`https://blynk.cloud:443/external/api/update?token=${tokenId}&${VS}=1`);
            
            toast.show({
                title: 'Êxito! Rele do sabão ligado.',
                placement: 'top',
                bgColor: 'green.500'
            })

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível ligar o rele do sabão.';
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setSendingRegister(false);
        }
    }

    async function handleOnReleSoftener() {
        try {
            setSendingRegister(true);

            let VS, VA;

            switch (machineSelected) {
                case '432':
                    VS = 'V61';
                    VA = 'V62';
                    break;
                case '543':
                    VS = 'V63';
                    VA = 'V64';
                    break;
                case '654':
                    VS = 'V65';
                    VA = 'V66';
                    break;
            }

            await axios.get(`https://blynk.cloud:443/external/api/update?token=${tokenId}&${VA}=1`);
            
            toast.show({
                title: 'Êxito! Rele do amaciante ligado.',
                placement: 'top',
                bgColor: 'green.500'
            })

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível ligar o rele do amaciante.';
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setSendingRegister(false);
        }
    }

    async function onOnlineServer() {
        try {
            const isOnline = await axios.get(`https://blynk.cloud/external/api/isHardwareConnected?token=${tokenId}`);
            setIsOlineServer(isOnline.data as boolean);
        } catch (error) {
            setIsOlineServer(false);
        }
    }


    useFocusEffect(
        useCallback(() => {
          if (screenOpened) {
            fetchLaundryDetails();
            onOnlineServer();
          }
          setScreenOpened(true);
      
          return () => {
            setScreenOpened(false);
          };
        }, [screenOpened, machineSelected])
    );

    return(
        <VStack flex={1}>
            <VStack bg={'gray.600'} px={8} pt={12}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={Feather} name='arrow-left' color={'green.500'} size={6}/>
                </TouchableOpacity>
                
                <HStack justifyContent={'space-between'} mt={4} mb={8} alignItems={'center'} flexShrink={1}>
                    <Heading fontFamily={"heading"} color={'gray.100'} fontSize={'lg'}>Lavanderia</Heading>

                    <HStack alignItems={'center'}>
                        { isOnlineServer ? <Box bg={'green.700'} size={5} rounded={'full'} /> : <Box bg={'red.700'} size={5} rounded={'full'}/>}
                        <Icon as={MaterialIcons} name='local-laundry-service' size={6} ml={4}/>
                        <Text color={'gray.200'} ml={1}>{name}</Text>
                    </HStack>
                </HStack>
            </VStack>

            { isLoading ? <Loading /> :
                <ScrollView>
                    <VStack p={8}>

                    <FlatList 
                        data={machines}
                        keyExtractor={item => item}
                        renderItem={({item}) => (
                            <Group 
                                name={item} 
                                isActive={machineSelected.toLocaleUpperCase() === item.toLocaleUpperCase()} 
                                onPress={() => setMachineSelected(item)}
                            />
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        mb={4}
                        maxH={10}
                        minH={10}
                    />

                        <Box bg={'gray.600'} rounded={'md'} pb={4} px={4} >
                            <HStack alignContent={'center'} justifyContent={'space-between'} mb={6} mt={5}>
                                <HStack>
                                    <Icon as={FontAwesome5} name='pump-soap' size={6} />
                                    <Text color={'gray.200'} ml={2}>Sabão {staticSoap}s</Text>
                                </HStack>
                                
                                <HStack>
                                    <Icon as={FontAwesome5} name='hand-holding-water' size={6} />
                                    <Text color={'gray.200'} ml={2}>Amaciante {staticSoftener}s</Text>
                                </HStack>
                            </HStack>
                            
                            <Heading textAlign={'center'} color={'gray.200'} fontSize={'22'}>Temporizador</Heading>
                            
                            <HStack justifyContent={'space-between'} mt={5}>
                                <VStack mt={5} width={'45%'}>
                                    <Heading textAlign={'center'} color={'gray.200'} fontSize={'16'}>Sabão</Heading>
                                    <Input textAlign={'center'} fontSize={24} color={'white'} keyboardType='numeric' mt={4} value={newSoap} onChangeText={setNewSoap}/>
                                    <Button title='Ligar Rele' isLoading={sendingRegister} mt={4} onPress={handleOnReleSoap}/>
                                </VStack>

                                <VStack mt={5} width={'45%'}>
                                    <Heading textAlign={'center'} color={'gray.200'} fontSize={'16'}>Amaciante</Heading>
                                    <Input textAlign={'center'} fontSize={24} color={'white'} keyboardType='numeric' mt={4} value={newSoftener} onChangeText={setNewSoftener}/>
                                    <Button title='Ligar Rele' isLoading={sendingRegister} mt={4} onPress={handleOnReleSoftener}/>
                                </VStack>

                            </HStack>
                            
                            <Button title='Alterar temporizador' isLoading={sendingRegister} mt={4} onPress={handleNewTimer}/>
                        </Box>
                    
                    </VStack>
                </ScrollView> 
            }
        </VStack>
    )
}