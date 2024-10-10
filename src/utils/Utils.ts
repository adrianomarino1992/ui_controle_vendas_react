

export default class Utils
{
    public static CastDateToString(date : Date)
    {
        let day = date.getDate().toString().padStart(2, '0');
        let month = date.getMonth().toString().padStart(2, '0');
        let year = date.getFullYear();
        let hour = date.getHours().toString().padStart(2, '0');
        let minuts = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minuts}`;        
    }
}