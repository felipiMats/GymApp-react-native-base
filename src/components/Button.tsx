import { Button as ButtonNativeBase, IButtonProps, Text} from 'native-base'
import { ReactNode } from 'react';

type Props = IButtonProps & {
    title?:string;
    variant?: 'solid' | 'outline';
    children?: ReactNode;
}

export function Button({ title, variant = 'solid', children, ...rest}: Props) {
    return(
        <ButtonNativeBase
            w={'full'}
            h={14}
            bg={variant === 'outline' ? 'transparent' : 'colorRp.blueLight'}
            borderWidth={variant === 'outline' ? 1 : 0}
            borderColor={'black'}
            rounded={'sm'}
            _pressed={{
                bg: variant === 'outline' ? 'gray.500' : 'colorRp.blueDark'
            }}
            {...rest}
        >
            <Text 
                color={variant === 'outline' ? 'green.500' : 'white'} 
                fontFamily={'heading'} 
                fontSize={'sm'}>
                {title}
            </Text>
            {children}
        </ButtonNativeBase>
    )
}