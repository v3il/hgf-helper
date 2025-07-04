import { Request, Response } from 'express';

export const authSuccess = async (_: Request, response: Response) => {
    response.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Auth Success</title>
        </head>
        <body>
            <script>
                const searchParams = new URLSearchParams(window.location.search);
            
                window.opener?.postMessage({
                    type: "hgf-auth",
                    token: searchParams.get('token')
                }, '*'); // todo: replace '*' with the actual origin of the opener window
                
                window.close();
            </script>
        </body>
        </html>
    `);
};
