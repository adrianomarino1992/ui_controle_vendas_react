export class API 
{
    public static URL = 'http://192.168.15.144:60000';

    public static async RequestAsync(
        resource : string, 
        token: string, 
        verb : 'GET' | 'POST' | 'PUT' | 'DELETE', 
        body? : any)
    {

        let headers : HeadersInit = {
            'api-key' : token
        };

        if(body && !(body instanceof FormData))
            headers['Content-Type'] = 'application/json';

        return await fetch(`${API.URL}${resource}`,
            {
                headers: headers,
                method: verb, 
                body: body && body instanceof FormData ? body : JSON.stringify(body)
            });
    }
}