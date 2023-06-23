import { Center, Heading, Text, VStack, useToast } from 'native-base';
import { SectionList } from 'native-base';

import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { useCallback, useState } from 'react';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
import { Loading } from '@components/Loading';

export function History() {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

    async function fetchHistory() {
        try {
            setIsLoading(true);
            
            const response = await api.get('/history');
            setExercises(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar o histórico de exercícios'
        
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, []))

    return(
        <VStack flex={1}>
            <ScreenHeader title='Histórico de Exercícios' />
            
            { isLoading ? <Center flex={1}><Loading /></Center> :
                <SectionList 
                    sections={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <HistoryCard data={item}/>
                    )}
                    renderSectionHeader={({section}) => (
                        <Heading fontFamily={"heading"} color={'gray.200'} fontSize={'md'} mt={10} mb={3}>{section.title}</Heading>
                    )}
                    px={8}
                    contentContainerStyle={exercises.length === 0 && { marginTop: 150, justifyContent: 'center'} }
                    ListEmptyComponent={() => (
                        <Text color={'gray.100'} textAlign={'center'}>
                            Não há Exercícios registrados ainda.
                        </Text>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            }
        </VStack>
        
    )
}