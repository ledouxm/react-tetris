import { Box, Center, ChakraProvider, extendTheme, Flex, Stack } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { Evolutions } from "./Evolutions";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    NavLink,
    LinkProps,
    useRouteMatch,
} from "react-router-dom";
import { Game } from "./Game";
import { ReactNode } from "react";

const theme = extendTheme({ config: { initialColorMode: "light" } });
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <Flex direction="column" boxSize="100%">
                    <Router>
                        <Navbar />
                        <Switch>
                            <Route path="/evolutions">
                                <Evolutions />
                            </Route>
                            <Route path="/">
                                <Game />
                            </Route>
                        </Switch>
                    </Router>
                </Flex>
            </ChakraProvider>
        </QueryClientProvider>
    );
}

const Navbar = () => {
    return (
        <Box w="100vw" h="80px" maxH="80px" bg="black">
            <Stack direction="row" alignItems="center" h="100%">
                <AppLink to="/">Home</AppLink>
                <AppLink to="/evolutions">Evolutions</AppLink>
            </Stack>
        </Box>
    );
};

const AppLink = ({ children, to, ...props }: { children: ReactNode; to: string } & LinkProps) => {
    const isActive = useRouteMatch({ path: to, exact: true });
    return (
        <NavLink to={to} {...props}>
            <Box fontSize="16px" h="100%" px="20px" fontWeight={isActive ? "bold" : "normal"}>
                {children}
            </Box>
        </NavLink>
    );
};

export default App;
