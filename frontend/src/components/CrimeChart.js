import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CrimeChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={500}>
        <LineChart
            width={500}
            height={300}
            data={data.hits}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_source.Year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="_source.Violent crime total" stroke="#8884d8" name="Violent crime total" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="_source.Property crime total" stroke="#82ca9d" name="Property crime total" />
            <Line type="monotone" dataKey="_source.Murder and nonnegligent Manslaughter" stroke="#ffc658" name="Murder and nonnegligent Manslaughter" />
        </LineChart>
    </ResponsiveContainer>
);

export default CrimeChart;
