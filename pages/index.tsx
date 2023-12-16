import { Grid } from "semantic-ui-react";
import Layout from "../components/Layout";

const Home: React.FC = () => {
    return (
        <Layout>
            <Grid textAlign="center" columns={1}>
                <p>I am the app!</p>
            </Grid>
        </Layout>
    );
};

export default Home;
