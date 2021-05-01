import buildClient from '../api/build-client.js'

const LandingPage = ({ currentUser }) => {
    if (currentUser) {
        return <h1>Signed in!</h1>
    } else {
        return <h1>Welcome</h1>
    }
}

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data
};

export default LandingPage;
