import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { HStack, VStack, FlatList, Heading, Text, useToast} from 'native-base';
import { useCallback, useEffect, useState } from 'react';

export function Home() {
    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const [groups, setGroups] = useState<string[]>([])
    const [exercises, setExercises] = useState<ExerciseDTO[]>([])
    const [groupSelected, setGroupSelected] = useState<string>('costas');
    const [isLoading, setIsLoading] = useState(true);

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate('exercise', {exerciseId})
    }

    async function fetchGroup() {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os grupos de exercícios'
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true);

            const response = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercises(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os exercícios'
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroup();
    },[])

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]))

    return(
        <VStack flex={1}>
            <HomeHeader />

            <FlatList 
                data={groups}
                keyExtractor={item => item}
                renderItem={({item}) => (
                    <Group 
                        name={item} 
                        isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()} 
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{px: 8}}
                my={10}
                maxH={10}
                minH={10}
            />
            { 
            isLoading ? <Loading /> :
            <VStack flex={1} px={8}>
                <HStack justifyContent={'space-between'} mb={5}>
                    <Heading fontFamily={"heading"} color={'gray.200'} fontSize={'md'}>Exercício</Heading>
                    <Text color={'gray.200'} fontSize={'sm'}>{exercises.length}</Text>
                </HStack>
                
                <FlatList 
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (<ExerciseCard data={item} onPress={() => handleOpenExerciseDetails(item.id)}/>)}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{paddingBottom: 20}}
                />
            </VStack>
            }

            
        </VStack>
    )
}