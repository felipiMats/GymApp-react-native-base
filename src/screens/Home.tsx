import { Button } from '@components/Button';
import { HomeHeader } from '@components/HomeHeader';
import { Input } from '@components/Input';
import { Loading } from '@components/Loading';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { HStack, VStack, FlatList, Heading, Text, useToast, Icon, Center} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

type StoreDetailsProp = {
    name: string;
    tokenId: string;
}

export function Home() {

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const [isLoading, setIsLoading] = useState(true);
    
    const [searchToken, setSearchToken] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    
    function handleOpenStoreDetails(nameAndToken: StoreDetailsProp) {
        navigation.navigate('exercise', nameAndToken)
        setShowCamera(false);
    }

    const handleBarCodeScanned = ({ data }: {data:string}) => {
        const nameAndToken = JSON.parse(data)
        nameAndToken.name = nameAndToken.name.toUpperCase();
        console.log(nameAndToken.name);
        setSearchToken(nameAndToken.tokenId);
        handleOpenStoreDetails(nameAndToken);
    };

    const handleNameToken = (searchToken : string) => {
        const nameAndToken = {name: "LOJA", tokenId: searchToken}
        setSearchToken(searchToken);
        handleOpenStoreDetails(nameAndToken);
    };

    async function fetchStores() {
        try {
            setIsLoading(true);
                        
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os grupos de exercícios';
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally { 
            setIsLoading(false);
        }
    
    }

    const openCamera = () => {
        try {
            setShowCamera(true);
            
        } catch (error) {
            
        }
        
    };


    useEffect(() => {
        fetchStores();
    },[])

    return(
        <VStack flex={1}>
            <HomeHeader />

            
            { 
            isLoading ? <Loading /> :
            <VStack flex={1} px={8}>

                <Center flex={1}>
                    <HStack mt={10} h={16} >
                        <Input placeholder='Informe o Token da loja' bgColor={'black'} width={'77%'} h={14} onChangeText={(text) => setSearchToken(text)}/>
                        <Button flex={1} ml={-20} h={14} alignItems={'center'} justifyContent={'center'} onPress={() => handleNameToken(searchToken)}>
                            <Icon as={AntDesign} name='arrowright' color={'white'} size={8} mt={1} mb={5}/>
                        </Button>
                    </HStack>

                    <HStack w={'100%'} alignItems={'center'} justifyContent={'space-between'} mt={10}>
                        <Icon as={MaterialIcons} name='qr-code-scanner' color={'white'} size={32} mt={2} mb={5} ml={10}/>
                       
                        <VStack alignItems={'center'} mr={10}>
                            <TouchableOpacity onPress={openCamera}>
                                <Icon as={FontAwesome5} name='camera' color={'white'} size={8} mt={2} mb={5}/>
                            </TouchableOpacity>
                            
                            <Text textAlign={'center'} fontSize={14} color={'gray.200'}>Escaneie o Token{'\n'}na máquina</Text>
                        </VStack>

                    </HStack>

                </Center>

                {showCamera && (
                        <Camera
                            style={{ flex: 1, marginBottom: 20 }}
                            type={CameraType.back}
                            onBarCodeScanned={handleBarCodeScanned}
                        />
                    )
                }
               
            </VStack>
            }

            
        </VStack>
    )
}