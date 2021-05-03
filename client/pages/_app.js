import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client.js'
import Header from '../components/headers.js'

// Everytime 'next' returns a components from the pages ypu define, it wraps it up with its own default components.
// That's defines as 'app' in next.js. Here, we are defining our own custom app components.
// 'Component' prop, here, will be one of the pages (components) being returned.
// 'pageProps' is the set of components we are intending to pass to one of the pages.
const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component {...pageProps} />
        </div>
    )
};

// Arguments for 'getInitialProps' is different for custom app components like this than in a page
// Defining ''getInitialProps' here in app components would mean the same function under other pages won't get invoked
// To invoke those functions, we need to use 'Component' object
AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};

    // Verifying if 'getInitialProps' exists on a page level
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {pageProps,
        ...data}

};

export default AppComponent;