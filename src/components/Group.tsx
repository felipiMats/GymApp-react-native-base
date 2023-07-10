import { Text, Pressable, IPressableProps } from "native-base"

type Props = IPressableProps & {
    name: string;
    isActive: boolean;
}

export function Group({name, isActive, ...rest}: Props) {
    return(
        <Pressable
            mt={2}
            ml={2}
            w={32}
            h={12}
            bg={"colorRp.blueLight"}
            rounded={"md"}
            justifyContent={"center"}
            alignItems={"center"}
            overflow={"hidden"}
            isPressed={isActive}
            _pressed={{
                background: "colorRp.blueDark",
                borderColor: 'colorRp.blueLight',
                borderWidth: 2,
            }}
            {...rest}
        >
            <Text
                color={"white"}
                textTransform={"uppercase"}
                fontSize={"xs"}
                fontWeight={"bold"}
            >
                {name}
            </Text> 
        </Pressable>
        
    )
}