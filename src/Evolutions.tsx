import { Spinner, Stack } from "@chakra-ui/react";
import { chunk } from "@pastable/core";
import { useQuery } from "react-query";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { api } from "./api";

const getEvolutions = async () => (await api.get("/evolutions")).data;

export const Evolutions = () => {
    const { data: evolutions, isLoading } = useQuery("evolutions", getEvolutions);

    if (isLoading) return <Spinner />;
    const chunks = chunk(evolutions, 4);
    console.log(chunks);
    const sampled = chunks.map((sample) => ({
        bestScore: sample.reduce((acc, current) => acc + current.bestScore, 0) / sample.length,
        generation: sample[0].generation,
    }));

    console.log(sampled);

    return (
        <Stack w="1600px" h="900px">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={sampled}>
                    <XAxis dataKey="generation" />
                    <YAxis />
                    <Legend />
                    <Line type="monotone" dataKey="bestScore" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </Stack>
    );
};

const EvolutionsChart = () => {};
