import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'

type Props = IInputProps & {
    errorMessage?: string;
}

export function Input({errorMessage, isInvalid, ...rest}: Props) {

    const invalid = !!errorMessage || isInvalid;
    return(
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseInput 
                bg={'white'}
                h={14}
                px={4}
                borderWidth={0}
                fontSize={'md'}
                color={'black'}
                fontFamily={'body'}
                mb={4}
                placeholderTextColor={'gray.300'}
                _focus={{
                    bg: 'gray.100',
                    borderWidth: 1,
                    borderColor: 'colorRp.blueDark',
                }}
                isInvalid={invalid}
                _invalid={{
                    borderWidth: 1,
                    borderColor: 'red.500'
                }}
                {...rest}
            />
            <FormControl.ErrorMessage>
                {errorMessage}
            </FormControl.ErrorMessage>

        </FormControl>
        
    )
}