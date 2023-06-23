import { Center, Heading } from "native-base";

type Props = {
    title: string;
}

export function ScreenHeader({title}: Props) {
    return(
        <Center bg={"gray.600"} pt={16} pb={6}>
            <Heading fontFamily={"heading"} color={"gray.100"} fontSize={"xl"}>{title}</Heading>
        </Center>
    )
}