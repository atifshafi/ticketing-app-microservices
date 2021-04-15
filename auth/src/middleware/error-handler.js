export const errorHandler = (err, req, res, next) => {
    console.log('Error!!', err)
    res.status(400).send(
        {
            message: 'Something went wrong!!!'
        }
    );
};