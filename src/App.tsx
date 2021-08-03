import { Center, ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { Tetris } from "./Tetris";

const theme = extendTheme({ config: { initialColorMode: "light" } });
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <Flex direction="column" boxSize="100%">
                    <Center alignSelf="center">
                        <Tetris />
                    </Center>
                </Flex>
            </ChakraProvider>
        </QueryClientProvider>
    );
}

export default App;
