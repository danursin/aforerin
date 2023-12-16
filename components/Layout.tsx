import { Grid, Header, Menu } from "semantic-ui-react";

import Head from "next/head";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

interface LayoutProps {
    title?: string;
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title = '"A" for Erin', children }) => {
    return (
        <>
            <ToastContainer theme="colored" />
            <Head>
                <title>{title}</title>
            </Head>
            <Menu fluid tabular>
                <Menu.Item content={<Header content={'"A" for Erin'} color="blue" icon="doctor" />} position="left" />
            </Menu>
            <Grid padded="horizontally" centered>
                <Grid.Column largeScreen={8} tablet={12} mobile={16}>
                    {children}
                </Grid.Column>
            </Grid>
        </>
    );
};

export default Layout;
