import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { AppCanvas } from "./components/AppCanvas";

const queryClient = new QueryClient();

const theme = extendTheme({ config: { initialColorMode: "light" } });

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <Flex direction="column" boxSize="100%">
                    <AppCanvas />
                </Flex>
            </ChakraProvider>
        </QueryClientProvider>
    );
}

export default App;
