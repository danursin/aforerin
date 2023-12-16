import { Grid, Header, Menu } from "semantic-ui-react";

import Head from "next/head";
import Link from "next/link";
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
                <Menu.Item>
                    <Link href="/exam1">Exam 1</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/exam2">Exam 2</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/exam3">Exam 3</Link>
                </Menu.Item>
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
