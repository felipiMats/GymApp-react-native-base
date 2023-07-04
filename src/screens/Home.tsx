import { Button } from '@components/Button';
import { HomeHeader } from '@components/HomeHeader';
import { Input } from '@components/Input';
import { Loading } from '@components/Loading';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { HStack, VStack, FlatList, Heading, Text, useToast, Icon} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { EvilIcons } from '@expo/vector-icons';

type StoreDetailsProp = {
    loja: string;
    tokenId: string;
}

export function Home() {

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const [stores, setStores] = useState([{loja:'PB-01', tokenId: 'e3j8gxkHFe4YcCTsQiPrqPcHDQqbvWXl'}])
    const [isLoading, setIsLoading] = useState(true);

    function handleOpenStoreDetails({loja, tokenId}: StoreDetailsProp) {
        navigation.navigate('exercise', {loja,tokenId})
    }

    const [searchText, setSearchText] = useState('');
    const [filteredStores, setFilteredStores] = useState(stores);

    const handleSearchStore = () => {
        const filtered = stores.filter((store) =>
        store.loja.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredStores(filtered);
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

    // async function fetchExercisesByGroup() {
    //     try {
    //         setIsLoading(true);

    //         const response = await api.get(`/exercises/bygroup/${groupSelected}`);
    //         setExercises(response.data);
    //     } catch (error) {
    //         const isAppError = error instanceof AppError;
    //         const title = isAppError ? error.message : 'Não foi possível carregar os exercícios'
        
    //         toast.show({
    //             title,
    //             placement: 'top',
    //             bgColor: 'red.500'
    //         })
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    useEffect(() => {
        fetchStores();
    },[])

    // useFocusEffect(useCallback(() => {
    //     fetchExercisesByGroup();
    // }, [groupSelected]))

    return(
        <VStack flex={1}>
            <HomeHeader />

            
            { 
            isLoading ? <Loading /> :
            <VStack flex={1} px={8}>

                <HStack mt={10} h={16} >
                    <Input placeholder='Buscar loja' bgColor={'black'} width={'90%'} h={14} value={searchText} onChangeText={(text) => setSearchText(text)}/>
                    <Button w={20} ml={-20} h={14} alignItems={'center'} justifyContent={'center'} onPress={handleSearchStore}>
                        <Icon as={EvilIcons} name='search' color={'white'} size={10} mt={2} mb={5}/>
                    </Button>
                </HStack>
                
                <FlatList 
                    data={filteredStores}
                    keyExtractor={(item) => item.tokenId}
                    renderItem={({item}) => (
                        <Button mb={4} title={item.loja} onPress={() => handleOpenStoreDetails(item)}/> 
                    )}
                    showsVerticalScrollIndicator={false}
                />
               
            </VStack>
            }

            
        </VStack>
    )
}