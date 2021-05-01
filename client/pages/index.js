import buildClient from '../api/build-client.js'

const LandingPage = ({currentUser}) => {
    console.log(currentUser);
    return <h1>Home</h1>
}

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data
};

export default LandingPage;
