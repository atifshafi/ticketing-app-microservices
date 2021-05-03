import axios from 'axios';

export default ({req}) => {
    // Identify if the components is being rendered on the client side or the server
    if (typeof window === 'undefined') {
        // Seeing issue when there's no cookie in the request (getting 400)
        // We are on the server. Therefore request needs to made to the proxy server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            // This is to add cookies, domain name
            headers: req.headers
        });

    } else {
        // We are on the browser. Therefore, we can use base url ''
        // req to know if the user is logged in
        return axios.create({
            baseURL: '/'
        });
    }
};