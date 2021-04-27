import 'bootstrap/dist/css/bootstrap.css';

// Everytime 'next' returns a component from the pages ypu define, it wraps it up with its own default component.
// That's defines as 'app' in 'next'. Here, we are defining our own custom app component.
// 'Component' prop, here, will be one of the pages (components) being returned.
// 'pageProps' is the set of components we are intending to pass to one of the pages.
export default ({Component, pageProps}) => {
    return <Component {...pageProps} />
};